import React from 'react';
import { useApp } from '../../context/AppContext';
import { WasteOrder, OrderStatus } from '../../types';
import { X, CheckCircle2, Clock, Truck, MapPin, Phone, User, AlertTriangle } from 'lucide-react';

interface Props {
  order: WasteOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const ORDER_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'created', label: 'Buyurtma yaratildi', icon: '🟢' },
  { status: 'searching_collector', label: 'Collector qidirilmoqda', icon: '🟡' },
  { status: 'collector_assigned', label: 'Collector tayinlandi', icon: '⚪' },
  { status: 'on_the_way', label: 'Yo‘lda', icon: '⚪' },
  { status: 'collected', label: 'Chiqindi qabul qilindi', icon: '⚪' },
  { status: 'completed', label: 'To‘lov amalga oshirildi', icon: '⚪' }
];

export const OrderDetailsModal: React.FC<Props> = ({ order, isOpen, onClose }) => {
  const { cancelOrder } = useApp();

  if (!isOpen || !order) return null;

  const currentStepIndex = ORDER_STEPS.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'cancelled';
  const isCompleted = order.status === 'completed';

  const handleCancel = () => {
    if (window.confirm('Haqiqatan ham ushbu buyurtmani bekor qilmoqchimisiz?')) {
      cancelOrder(order.id, 'Foydalanuvchi tomonidan bekor qilindi');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{order.id}</span>
              <span style={{
                background: isCancelled ? 'var(--danger-light)' : isCompleted ? 'var(--primary-light)' : 'var(--accent-light)',
                color: isCancelled ? 'var(--danger)' : isCompleted ? 'var(--primary-dark)' : 'var(--accent)',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {isCancelled ? 'Bekor qilingan' : isCompleted ? 'Yakunlandi' : 'Jarayonda'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Yaratilgan vaqt: {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'var(--bg-card-subtle)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Tracker Visualizer (Section 10) */}
        {!isCancelled ? (
          <div style={{ background: 'var(--bg-card-subtle)', borderRadius: '18px', padding: '18px', marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '14px' }}>
              Buyurtma holati
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ORDER_STEPS.map((step, idx) => {
                const isStepPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div 
                    key={step.status} 
                    className={`tracker-step ${isStepPassed ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                  >
                    <div className="step-icon-container">
                      {isStepPassed ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div style={{ flex: 1, paddingTop: '4px' }}>
                      <div style={{ 
                        fontWeight: isCurrent ? '800' : isStepPassed ? '700' : '500', 
                        fontSize: '14px',
                        color: isCurrent ? 'var(--accent)' : isStepPassed ? 'var(--text-main)' : 'var(--text-muted)'
                      }}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '16px', borderRadius: '16px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <AlertTriangle size={24} />
            <div>
              <strong>Ushbu buyurtma bekor qilingan</strong>
              <div style={{ fontSize: '12px', marginTop: '2px' }}>Bekor qilish sababi: {order.statusHistory[order.statusHistory.length - 1]?.note}</div>
            </div>
          </div>
        )}

        {/* Order Details Breakdown */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '18px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '32px' }}>{order.category.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '800', fontSize: '16px' }}>{order.category.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Miqdori: <strong>{order.weightKg} kg</strong></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary)' }}>
                {(order.finalValue || order.estimatedValue).toLocaleString('uz-UZ')} so‘m
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Truck size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Topshirish turi:</strong> {order.pickupType === 'pickup' ? 'Uyimdan olib ketish' : 'Qabul punktiga olib borish'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Manzil:</strong> {order.address.region}, {order.address.district}, {order.address.street}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Clock size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Rejalashtirilgan vaqt:</strong> {order.preferredDate} ({order.preferredTime})
              </div>
            </div>

            {order.collectorName && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', padding: '8px 12px', background: 'var(--bg-card-subtle)', borderRadius: '10px' }}>
                <User size={16} color="#0D9488" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Collector:</strong> {order.collectorName} ({order.collectorPhone})
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isCompleted && !isCancelled && (
            <button 
              className="btn btn-danger" 
              style={{ flex: 1 }}
              onClick={handleCancel}
            >
              Bekor qilish
            </button>
          )}
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
