import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../features/posts/posts.api';
import type { Post } from '../features/posts/posts.types';
import PostCard from '../features/posts/PostCard';
import Navbar from '../components/layout/Navbar';
import './HomePage.css';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch {
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-container">
        {/* Hero */}
        <section className="hero animate-fade-in-up">
          <div className="hero-badge badge">Open Source</div>
          <h1 className="hero-title">
            Share Your Code
            <span className="hero-accent"> with the World</span>
          </h1>
          <p className="hero-description">
            CodeBoard is a modern code sharing platform. Create, share, and discuss code snippets with an amazing community of developers.
          </p>
          <div className="hero-actions">
            <Link to="/posts/create" className="btn btn-primary btn-lg">
              Create a Post
            </Link>
            <a href="#posts" className="btn btn-secondary btn-lg">
              Browse Posts
            </a>
          </div>
        </section>

        {/* Posts Grid */}
        <section id="posts" className="posts-section">
          <div className="section-header">
            <h2 className="section-title">Recent Posts</h2>
            <p className="section-subtitle">Explore code from the community</p>
          </div>

          {isLoading ? (
            <div className="posts-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 260, borderRadius: 'var(--radius-lg)' }} />
              ))}
            </div>
          ) : error ? (
            <div className="auth-error" style={{ maxWidth: 500, margin: '0 auto' }}>{error}</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <h3>No posts yet</h3>
              <p>Be the first to share a code snippet!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
