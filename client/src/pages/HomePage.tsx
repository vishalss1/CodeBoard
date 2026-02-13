import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../features/posts/posts.api';
import type { Post } from '../features/posts/posts.types';
import PostCard from '../features/posts/PostCard';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import Navbar from '../components/layout/Navbar';
import {
  Terminal,
  AnimatedSpan,
  TypingAnimation,
} from '../components/ui/TerminalAnimation';
import './HomePage.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const feed = (
    <section id="posts" className="feed-section">
      {/* Search bar for authenticated users */}
      {isAuthenticated && (
        <div className="feed-search-wrap">
          <svg className="feed-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="feed-search-input"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="feed-header">
        <h2 className="feed-title">{isAuthenticated ? 'Feed' : 'Recent Posts'}</h2>
        <p className="feed-subtitle">
          {isAuthenticated ? 'Latest from the community' : 'Explore code from the community'}
        </p>
      </div>

      {isLoading ? (
        <div className="feed-list">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 220, borderRadius: 'var(--radius-lg)' }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="auth-error" style={{ maxWidth: 500, margin: '0 auto' }}>
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>{searchQuery ? 'No matching posts' : 'No posts yet'}</h3>
          <p>
            {searchQuery
              ? 'Try a different search term.'
              : 'Be the first to share a code snippet!'}
          </p>
        </div>
      ) : (
        <div className="feed-list">
          {filtered.map((post) => (
            <PostCard key={post.post_id} post={post} />
          ))}
        </div>
      )}
    </section>
  );

  // Authenticated: 2-column layout (sidebar + centered feed)
  if (isAuthenticated) {
    return <AppLayout>{feed}</AppLayout>;
  }

  // Unauthenticated: full-width hero + feed
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
            CodeBoard is a modern code sharing platform. Create, share, and
            discuss code snippets with an amazing community of developers.
          </p>

          <div className="hero-terminal">
            <Terminal>
              <TypingAnimation>&gt; npx codeboard init my-project</TypingAnimation>
              <AnimatedSpan className="text-green">
                ✔ Project scaffolded successfully.
              </AnimatedSpan>
              <AnimatedSpan className="text-green">
                ✔ Dependencies installed.
              </AnimatedSpan>
              <AnimatedSpan className="text-green">
                ✔ Git repository initialized.
              </AnimatedSpan>
              <AnimatedSpan className="text-blue">
                ℹ Ready to share your snippets!
              </AnimatedSpan>
              <TypingAnimation className="text-muted-fg">
                Happy coding! 🚀
              </TypingAnimation>
            </Terminal>
          </div>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <a href="#posts" className="btn btn-secondary btn-lg">
              Browse Posts
            </a>
          </div>
        </section>

        {feed}
      </div>
    </>
  );
}
