import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCircle2, DollarSign, Truck, Info, CheckCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderDetails?: (orderId: string) => void;
}

export const NotificationModal: React.FC<Props> = ({ isOpen, onClose, onOpenOrderDetails }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  if (!isOpen) return null;

  const handleNotifClick = (notifId: string, orderId?: string) => {
    markNotificationAsRead(notifId);
    if (orderId && onOpenOrderDetails) {
      onClose();
      onOpenOrderDetails(orderId);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              Bildirishnomalar
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notifications.some(n => !n.isRead) && (
              <button 
                onClick={markAllNotificationsAsRead}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <CheckCheck size={14} /> Barchasini o‘qilgan qilish
              </button>
            )}

            <button 
              onClick={onClose}
              style={{ background: 'var(--bg-card-subtle)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotifClick(n.id, n.orderId)}
                style={{
                  background: n.isRead ? 'var(--bg-card)' : 'var(--primary-light)',
                  border: n.isRead ? '1px solid var(--border-color)' : '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '14px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {!n.isRead && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }} />
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: n.type === 'order' ? 'rgba(59, 130, 246, 0.15)' : n.type === 'wallet' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: n.type === 'order' ? '#3B82F6' : n.type === 'wallet' ? '#10B981' : '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {n.type === 'order' ? '🚚' : n.type === 'wallet' ? '💰' : '🔔'}
                  </div>

                  <div style={{ flex: 1, paddingRight: '14px' }}>
                    <div style={{ fontWeight: n.isRead ? '700' : '800', fontSize: '14px', color: 'var(--text-main)', marginBottom: '3px' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '6px' }}>
                      {n.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
              Bildirishnomalar mavjud emas
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
