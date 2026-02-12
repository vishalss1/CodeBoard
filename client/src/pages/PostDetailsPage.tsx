import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '../features/posts/posts.api';
import type { Post } from '../features/posts/posts.types';
import CommentList from '../features/comments/CommentList';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import './PostDetailsPage.css';

export default function PostDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch {
        setError('Post not found');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!post) return;
    try {
      await deletePost(post.post_id);
      navigate('/dashboard');
    } catch {
      setError('Failed to delete post');
    }
    setShowDeleteModal(false);
  };

  const isOwner = isAuthenticated && user && post && user.user_id === post.owner_id;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="flex-center" style={{ minHeight: '60vh' }}>
            <div className="spinner spinner-lg" />
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="empty-state">
            <h3>{error ?? 'Post not found'}</h3>
            <p style={{ marginBottom: 'var(--space-lg)' }}>The post you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary btn-md">
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <article className="post-detail animate-fade-in">
          <div className="post-detail-header">
            <div>
              <h1 className="post-detail-title">{post.title}</h1>
              <span className="badge">{post.language}</span>
            </div>
            {isOwner && (
              <div className="post-detail-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/posts/create?edit=${post.post_id}`)}
                >
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="post-detail-code">
            <div className="code-block-header">
              <span>{post.language}</span>
            </div>
            <pre className="code-block"><code>{post.code}</code></pre>
          </div>

          <CommentList postId={post.post_id} />
        </article>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Post"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Are you sure you want to delete "<strong>{post.title}</strong>"? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
