import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';

interface Props {
  onOpenNotifications: () => void;
  onNavigate: (tab: string) => void;
}

export const AppHeader: React.FC<Props> = ({ onOpenNotifications, onNavigate }) => {
  const { notificationsEnabled, unreadNotifsCount } = useApp();

  return (
    <header className="app-header">
      
      {/* Brand */}
      <div className="mobile-header-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
        <div className="mobile-header-logo">
          ♻️
        </div>
        <div className="mobile-header-text">
          <h2>EcoCycle</h2>
          <span>O‘zbekiston</span>
        </div>
      </div>

      {/* Notifications Button */}
      {notificationsEnabled && (
        <button 
          onClick={onOpenNotifications}
          style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            color: 'var(--text-main)'
          }}
          aria-label="Xabarnomalar"
        >
          <Bell size={18} />
          {unreadNotifsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: 'var(--danger)',
              borderRadius: '50%'
            }} />
          )}
        </button>
      )}

    </header>
  );
};
