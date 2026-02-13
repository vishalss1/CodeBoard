import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthPages.css';

/**
 * OAuth Callback Page — mounted at /auth/github/callback
 *
 * Flow:
 * 1. User clicks "Continue with GitHub" → navigates to /auth/github (proxied to backend)
 * 2. Backend sets oauth_state cookie, redirects to GitHub
 * 3. GitHub redirects back to http://localhost:5173/auth/github/callback?code=...&state=...
 * 4. Vite proxy bypass serves this React page (not proxied to backend)
 * 5. This page calls /api/auth/github/callback (proxied to backend, cookies included)
 * 6. Backend verifies state cookie, exchanges code, returns { accessToken }
 * 7. We store token, update auth context, redirect home
 */
export default function AuthCallbackPage() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  // Guard against React 18 StrictMode double-firing useEffect in dev mode.
  // GitHub OAuth codes are single-use; a second exchange attempt would fail.
  const exchangedRef = useRef(false);

  useEffect(() => {
    if (exchangedRef.current) return;
    exchangedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      setError('Missing OAuth parameters. Please try logging in again.');
      return;
    }

    const exchangeToken = async () => {
      try {
        // Call via /api/auth proxy (rewrites to /auth on backend)
        // This goes through Vite proxy → same origin → cookies are sent
        const res = await fetch(
          `/api/auth/github/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
          { credentials: 'include' }
        );

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message ?? `OAuth failed (${res.status})`);
        }

        const data = await res.json();

        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          setToken(data.accessToken);
          navigate('/', { replace: true });
        } else {
          setError('No access token received. Please try again.');
        }
      } catch (err: unknown) {
        console.error('OAuth token exchange failed:', err);
        setError(err instanceof Error ? err.message : 'OAuth login failed. Please try again.');
      }
    };

    exchangeToken();
  }, [setToken, navigate]);

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-card animate-fade-in-up" style={{ textAlign: 'center' }}>
          <div className="auth-header">
            <h1 className="auth-title">Login Failed</h1>
          </div>
          <div className="auth-error">{error}</div>
          <a href="/login" className="btn btn-primary btn-md" style={{ marginTop: 'var(--space-lg)' }}>
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in-up" style={{ textAlign: 'center' }}>
        <div className="spinner spinner-lg" style={{ margin: '0 auto var(--space-lg)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
