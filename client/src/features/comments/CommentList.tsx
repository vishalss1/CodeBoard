import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getAllComments, createComment, deleteComment, updateComment } from './comments.api';
import type { Comment } from './comments.types';
import Button from '../../components/ui/Button';
import './CommentList.css';

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { isAuthenticated, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllComments(postId);
        setComments(data);
      } catch {
        setError('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createComment(postId, { text: newText.trim() });
      setComments((prev) => [
        ...prev,
        {
          comment_id: result.comment_id,
          post_id: postId,
          user_id: user!.user_id,
          text: result.text,
        },
      ]);
      setNewText('');
    } catch {
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
    } catch {
      setError('Failed to delete comment');
    }
  };

  const handleUpdate = async (commentId: string) => {
    if (!editText.trim()) return;
    try {
      const result = await updateComment(postId, commentId, { text: editText.trim() });
      setComments((prev) =>
        prev.map((c) => (c.comment_id === commentId ? { ...c, text: result.text } : c))
      );
      setEditingId(null);
      setEditText('');
    } catch {
      setError('Failed to update comment');
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.comment_id);
    setEditText(comment.text);
  };

  if (isLoading) {
    return (
      <div className="comments-section">
        <h3 className="comments-title">Comments</h3>
        <div className="flex-center" style={{ padding: 'var(--space-xl) 0' }}>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Comments <span className="comments-count">{comments.length}</span>
      </h3>

      {error && <div className="comments-error">{error}</div>}

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Write a comment..."
            className="comment-textarea"
            rows={3}
          />
          <Button type="submit" size="sm" isLoading={submitting} disabled={!newText.trim()}>
            Post Comment
          </Button>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-xl) 0' }}>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.comment_id} className="comment-item animate-fade-in">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.user_id === user?.user_id ? 'You' : 'User'}
                </span>
                {comment.user_id === user?.user_id && (
                  <div className="comment-actions">
                    <button className="comment-action" onClick={() => startEdit(comment)}>
                      Edit
                    </button>
                    <button
                      className="comment-action comment-action-danger"
                      onClick={() => handleDelete(comment.comment_id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {editingId === comment.comment_id ? (
                <div className="comment-edit">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="comment-textarea"
                    rows={2}
                  />
                  <div className="comment-edit-actions">
                    <Button size="sm" onClick={() => handleUpdate(comment.comment_id)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
