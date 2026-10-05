import React from 'react';
import { UZBEKISTAN_COUNTRY } from '../../data/uzbekistanLocations';
import { ShieldCheck } from 'lucide-react';

interface UzbekistanLockBadgeProps {
  subtitle?: string;
  hideTitle?: boolean;
}

export const UzbekistanLockBadge: React.FC<UzbekistanLockBadgeProps> = ({ subtitle, hideTitle = false }) => {
  return (
    <div className="uzbekistan-lock-banner">
      <span style={{ fontSize: '24px' }}>{UZBEKISTAN_COUNTRY.flag}</span>
      <div style={{ flex: 1 }}>
        {!hideTitle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <strong>Davlat: {UZBEKISTAN_COUNTRY.name}</strong>
            <ShieldCheck size={16} color="#059669" />
          </div>
        )}
        <div style={{ fontSize: '12px', opacity: 0.85, marginTop: hideTitle ? '0' : '2px' }}>
          {subtitle || UZBEKISTAN_COUNTRY.notice}
        </div>
      </div>
    </div>
  );
};
