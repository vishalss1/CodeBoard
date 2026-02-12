import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-section">
          <span className="sidebar-heading">Navigation</span>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <span className="sidebar-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/posts/create"
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <span className="sidebar-icon">✏️</span>
            New Post
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <span className="sidebar-icon">⚙️</span>
            Settings
          </NavLink>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-heading">Browse</span>
          <NavLink
            to="/"
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <span className="sidebar-icon">🏠</span>
            Home
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
