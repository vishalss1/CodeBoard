import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LeftSidebar.css';

export default function LeftSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="left-sidebar glass-subtle">
      <nav className="left-sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `left-sidebar-link ${isActive ? 'left-sidebar-link-active' : ''}`
          }
        >
          <svg className="left-sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `left-sidebar-link ${isActive ? 'left-sidebar-link-active' : ''}`
          }
        >
          <svg className="left-sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/posts/create"
          className={({ isActive }) =>
            `left-sidebar-link ${isActive ? 'left-sidebar-link-active' : ''}`
          }
        >
          <svg className="left-sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>New Post</span>
        </NavLink>
      </nav>

      <div className="left-sidebar-footer">
        {user && (
          <div className="left-sidebar-user">
            <div className="left-sidebar-avatar">
              {user.username?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="left-sidebar-user-info">
              <span className="left-sidebar-username">{user.username ?? 'User'}</span>
            </div>
          </div>
        )}
        <button className="left-sidebar-link left-sidebar-logout" onClick={handleLogout}>
          <svg className="left-sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
