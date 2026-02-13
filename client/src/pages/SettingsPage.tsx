import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="settings animate-fade-in">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account preferences</p>

        <div className="settings-card card">
          <h2 className="settings-section-title">Profile</h2>

          <div className="settings-field">
            <span className="settings-label">Username</span>
            <span className="settings-value">{user?.username ?? '—'}</span>
          </div>

          <div className="settings-field">
            <span className="settings-label">User ID</span>
            <span className="settings-value settings-value-mono">{user?.user_id ?? '—'}</span>
          </div>
        </div>

        <div className="settings-card card">
          <h2 className="settings-section-title">Preferences</h2>
          <p className="settings-placeholder">
            Theme, editor, and notification preferences will be available soon.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
