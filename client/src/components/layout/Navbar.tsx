import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

interface NavbarProps {
  /** When true, hides nav links (used when LeftSidebar provides navigation) */
  minimal?: boolean;
}

export default function Navbar({ minimal = false }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">⟨/⟩</span>
          <span className="navbar-title">CodeBoard</span>
        </Link>

        {minimal ? (
          /* Minimal mode: just show small user info on the right */
          <div className="navbar-links">
            {isAuthenticated ? (
              <div className="navbar-user">
                <span className="navbar-username">{user?.username ?? 'User'}</span>
              </div>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/register" className="navbar-link navbar-link-cta">
                  Register
                </Link>
              </>
            )}
          </div>
        ) : (
          /* Full mode: all nav links */
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                <Link to="/posts/create" className="navbar-link">New Post</Link>
                <div className="navbar-user">
                  <span className="navbar-username">{user?.username ?? 'User'}</span>
                  <button onClick={handleLogout} className="navbar-logout">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Login</Link>
                <Link to="/register" className="navbar-link navbar-link-cta">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
