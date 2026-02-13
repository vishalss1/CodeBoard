import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, deletePost } from '../features/posts/posts.api';
import type { Post } from '../features/posts/posts.types';
import PostCard from '../features/posts/PostCard';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const allPosts = await getAllPosts();
        const myPosts = allPosts.filter((p) => p.owner_id === user?.user_id);
        setPosts(myPosts);
      } catch {
        setError('Failed to load your posts');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const handleEdit = (post: Post) => {
    navigate(`/posts/create?edit=${post.post_id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deletePost(deleteTarget.post_id);
      setPosts((prev) => prev.filter((p) => p.post_id !== deleteTarget.post_id));
    } catch {
      setError('Failed to delete post');
    }
    setDeleteTarget(null);
  };

  return (
    <AppLayout>
      <div className="dashboard animate-fade-in">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back, <strong>{user?.username ?? 'User'}</strong>
            </p>
          </div>
          <Button onClick={() => navigate('/posts/create')}>
            + New Post
          </Button>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card card">
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Total Posts</span>
          </div>
          <div className="stat-card card">
            <span className="stat-value">{new Set(posts.map((p) => p.language)).size}</span>
            <span className="stat-label">Languages</span>
          </div>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 'var(--space-lg)' }}>{error}</div>}

        <h2 className="dashboard-section-title">Your Posts</h2>

        {isLoading ? (
          <div className="feed-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Create your first code snippet to get started!</p>
          </div>
        ) : (
          <div className="feed-list">
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
                showActions
                onEdit={handleEdit}
                onDelete={() => setDeleteTarget(post)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Post"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Are you sure you want to delete "<strong>{deleteTarget?.title}</strong>"?
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </div>
      </Modal>
    </AppLayout>
  );
}
