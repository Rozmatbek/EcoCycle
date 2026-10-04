import React from 'react';
import { UZBEKISTAN_COUNTRY } from '../../data/uzbekistanLocations';
import { ShieldCheck } from 'lucide-react';

export const UzbekistanLockBadge: React.FC<{ subtitle?: string }> = ({ subtitle }) => {
  return (
    <div className="uzbekistan-lock-banner">
      <span style={{ fontSize: '24px' }}>{UZBEKISTAN_COUNTRY.flag}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <strong>Davlat: {UZBEKISTAN_COUNTRY.name}</strong>
          <ShieldCheck size={16} color="#059669" />
        </div>
        <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>
          {subtitle || UZBEKISTAN_COUNTRY.notice}
        </div>
      </div>
    </div>
  );
};
