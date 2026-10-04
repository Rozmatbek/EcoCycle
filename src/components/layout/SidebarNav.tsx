import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Recycle, 
  MapPin, 
  History, 
  User, 
  Wallet, 
  Truck, 
  Factory 
} from 'lucide-react';

interface Props {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenCreateOrder: () => void;
}

export const SidebarNav: React.FC<Props> = ({ currentTab, onNavigate, onOpenCreateOrder }) => {
  const { activeRole } = useApp();

  return (
    <aside className="sidebar-nav">
      
      {/* Brand logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          ♻️
        </div>
        <div className="sidebar-logo-text">
          <h1 style={{ fontSize: '20px', fontWeight: '800' }}>EcoCycle</h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.04em' }}>O‘zbekiston</p>
        </div>
      </div>

      {/* Navigation items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <button 
          className={`sidebar-item ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          <Home size={19} />
          <span>Bosh sahifa</span>
        </button>

        <button 
          className="sidebar-item"
          onClick={onOpenCreateOrder}
          style={{ color: 'var(--primary)', fontWeight: '700' }}
        >
          <Recycle size={19} />
          <span>Chiqindi topshirish</span>
        </button>

        <button 
          className={`sidebar-item ${currentTab === 'map' ? 'active' : ''}`}
          onClick={() => onNavigate('map')}
        >
          <MapPin size={19} />
          <span>Punktlar</span>
        </button>

        <button 
          className={`sidebar-item ${currentTab === 'orders' ? 'active' : ''}`}
          onClick={() => onNavigate('orders')}
        >
          <History size={19} />
          <span>Buyurtmalarim</span>
        </button>

        <button 
          className={`sidebar-item ${currentTab === 'wallet' ? 'active' : ''}`}
          onClick={() => onNavigate('wallet')}
        >
          <Wallet size={19} />
          <span>Eco Hamyon</span>
        </button>

        {/* Collector Role Specific Item */}
        {activeRole === 'collector' && (
          <button 
            className={`sidebar-item ${currentTab === 'collector' ? 'active' : ''}`}
            onClick={() => onNavigate('collector')}
            style={{ color: '#F59E0B' }}
          >
            <Truck size={19} />
            <span>Collector Paneli</span>
          </button>
        )}

        {/* Recycler Role Specific Item */}
        {activeRole === 'recycler' && (
          <button 
            className={`sidebar-item ${currentTab === 'recycler' ? 'active' : ''}`}
            onClick={() => onNavigate('recycler')}
            style={{ color: '#3B82F6' }}
          >
            <Factory size={19} />
            <span>Zavod Birjasi</span>
          </button>
        )}

        <button 
          className={`sidebar-item ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => onNavigate('profile')}
        >
          <User size={19} />
          <span>Profil</span>
        </button>
      </div>

    </aside>
  );
};
