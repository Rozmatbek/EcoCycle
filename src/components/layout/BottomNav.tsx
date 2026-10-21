import React from 'react';
import { Home, Recycle, MapPin, History, User } from 'lucide-react';

interface Props {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCreateOrder: () => void;
}

export const BottomNav: React.FC<Props> = ({ currentTab, onNavigate, onOpenCreateOrder }) => {
  return (
    <nav className="bottom-nav">
      
      {/* 1. Bosh sahifa */}
      <button 
        className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <Home size={20} />
        <span>Bosh sahifa</span>
      </button>

      {/* 2. Xarita */}
      <button 
        className={`bottom-nav-item ${currentTab === 'map' ? 'active' : ''}`}
        onClick={() => onNavigate('map')}
      >
        <MapPin size={20} />
        <span>Punktlar</span>
      </button>

      {/* 3. Chiqindi topshirish (Prominent Center Button) */}
      <button 
        className="bottom-nav-item bottom-nav-topshirish"
        onClick={onOpenCreateOrder}
        aria-label="Chiqindi topshirish"
      >
        <Recycle size={26} color="#FFFFFF" />
      </button>

      {/* 4. Tarix */}
      <button 
        className={`bottom-nav-item ${currentTab === 'orders' ? 'active' : ''}`}
        onClick={() => onNavigate('orders')}
      >
        <History size={20} />
        <span>Tarix</span>
      </button>

      {/* 5. Profil */}
      <button 
        className={`bottom-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => onNavigate('profile')}
      >
        <User size={20} />
        <span>Profil</span>
      </button>

    </nav>
  );
};
