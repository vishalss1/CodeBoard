import { Link } from 'react-router-dom';
import type { Post } from './posts.types';
import CodeBlock from '../../components/ui/CodeBlock';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  showActions?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, showActions = false, onEdit, onDelete }: PostCardProps) {
  const codePreview = post.code.length > 300 ? post.code.slice(0, 300) + '...' : post.code;

  return (
    <article className="post-card card animate-fade-in">
      <div className="post-card-header">
        <Link to={`/posts/${post.post_id}`} className="post-card-title">
          {post.title}
        </Link>
        <div className="post-card-meta">
          {post.username && <span className="post-card-author">@{post.username}</span>}
          <span className="badge">{post.language}</span>
        </div>
      </div>

      <div className="post-card-code-wrap">
        <CodeBlock
          code={codePreview}
          language={post.language}
          maxHeight={160}
          showHeader={false}
        />
      </div>

      <div className="post-card-footer">
        <Link to={`/posts/${post.post_id}`} className="post-card-link">
          View Details →
        </Link>
        {showActions && (
          <div className="post-card-actions">
            {onEdit && (
              <button className="post-card-action" onClick={() => onEdit(post)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="post-card-action post-card-action-danger" onClick={() => onDelete(post.post_id)}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
