import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';

interface Props {
  onOpenNotifications: () => void;
  onNavigate: (tab: string) => void;
}

export const AppHeader: React.FC<Props> = ({ onNavigate }) => {
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

    </header>
  );
};
