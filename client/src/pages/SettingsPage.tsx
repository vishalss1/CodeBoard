import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="page-container-with-sidebar">
        <div className="settings animate-fade-in">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account preferences</p>

          {/* Profile Section */}
          <section className="settings-section card">
            <h2 className="settings-section-title">Profile</h2>
            <div className="settings-grid">
              <div className="settings-field">
                <span className="settings-label">Username</span>
                <span className="settings-value">{user?.username ?? '—'}</span>
              </div>
              <div className="settings-field">
                <span className="settings-label">User ID</span>
                <span className="settings-value settings-value-mono">{user?.user_id ?? '—'}</span>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="settings-section card">
            <h2 className="settings-section-title">Appearance</h2>
            <div className="settings-field">
              <span className="settings-label">Theme</span>
              <span className="settings-value">
                <span className="badge">Dark</span>
              </span>
            </div>
            <p className="settings-note">
              Additional theme options coming soon.
            </p>
          </section>

          {/* Account Section */}
          <section className="settings-section card">
            <h2 className="settings-section-title">Account</h2>
            <p className="settings-note">
              Account management features (email change, password reset) will be available in a future update.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
