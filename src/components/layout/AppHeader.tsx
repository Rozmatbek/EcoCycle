import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';

interface Props {
  onOpenNotifications: () => void;
  onNavigate: (tab: string) => void;
  onOpenLanding?: () => void;
  onOpenRegister?: () => void;
}

export const AppHeader: React.FC<Props> = ({ onNavigate, onOpenLanding, onOpenRegister }) => {
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

      {/* Quick Navigation to Landing and Register */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {onOpenLanding && (
          <button 
            onClick={onOpenLanding}
            className="btn btn-secondary"
            style={{ fontSize: '11px', padding: '6px 10px', minHeight: '32px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}
          >
            🌐 Landing
          </button>
        )}
        {onOpenRegister && (
          <button 
            onClick={onOpenRegister}
            className="btn btn-primary"
            style={{ fontSize: '11px', padding: '6px 12px', minHeight: '32px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800' }}
          >
            📝 Ro‘yxatdan o‘tish
          </button>
        )}
      </div>

    </header>
  );
};
