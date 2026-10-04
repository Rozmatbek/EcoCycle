import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteOrder, OrderStatus } from '../../types';
import { Package, Truck, Clock, CheckCircle2, ChevronRight, Plus, Filter } from 'lucide-react';

interface Props {
  onOpenOrderDetails: (orderId: string) => void;
  onOpenCreateOrder: () => void;
}

type TabType = 'all' | 'in_progress' | 'completed' | 'cancelled';

export const OrdersScreen: React.FC<Props> = ({ onOpenOrderDetails, onOpenCreateOrder }) => {
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_progress') return order.status !== 'completed' && order.status !== 'cancelled';
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'created':
        return { label: '🟢 Buyurtma yaratildi', color: '#10B981', bg: 'var(--primary-light)' };
      case 'searching_collector':
        return { label: '🟡 Collector qidirilmoqda', color: '#D97706', bg: '#FEF3C7' };
      case 'collector_assigned':
        return { label: '🚚 Collector biriktirildi', color: '#0D9488', bg: '#CCFBF1' };
      case 'on_the_way':
        return { label: '🚗 Collector yo‘lda', color: '#2563EB', bg: '#DBEAFE' };
      case 'collected':
        return { label: '📦 Qabul qilindi', color: '#7C3AED', bg: '#EDE9FE' };
      case 'completed':
        return { label: '✅ Yakunlandi', color: '#059669', bg: 'var(--primary-light)' };
      case 'cancelled':
        return { label: '❌ Bekor qilingan', color: '#DC2626', bg: '#FEE2E2' };
    }
  };

  return (
    <div className="page-container">
      
      {/* Header with Title */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          Buyurtmalarim
        </h1>
      </div>

      {/* Filter Tabs (Section 16: Barchasi, Jarayonda, Yakunlangan, Bekor qilingan) */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
        {[
          { id: 'all', label: 'Barchasi', count: orders.length },
          { id: 'in_progress', label: 'Jarayonda', count: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length },
          { id: 'completed', label: 'Yakunlangan', count: orders.filter(o => o.status === 'completed').length },
          { id: 'cancelled', label: 'Bekor qilingan', count: orders.filter(o => o.status === 'cancelled').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary)' : 'var(--bg-card)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? '700' : '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeTab === tab.id ? '0 4px 12px var(--primary-glow)' : 'none',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: activeTab === tab.id ? 'var(--primary)' : 'var(--border-color)',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
            <span style={{
              background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-card-subtle)',
              color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '10px',
              fontWeight: '700'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredOrders.map(order => {
            const badge = getStatusBadge(order.status);
            return (
              <div 
                key={order.id}
                className="eco-card eco-card-interactive"
                onClick={() => onOpenOrderDetails(order.id)}
                style={{ padding: '18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>{order.id}</span>
                      <span style={{
                        background: badge.bg,
                        color: badge.color,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(order.createdAt).toLocaleDateString('uz-UZ')} • {order.pickupType === 'pickup' ? '🚚 Pickup' : '📍 Qabul punkti'}
                    </div>
                  </div>

                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '26px' }}>{order.category.icon}</span>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                        {order.category.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Og‘irlik: <strong>{order.weightKg} kg</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {order.status === 'completed' ? 'To‘langan summa' : 'Taxminiy qiymat'}
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--primary)' }}>
                      {(order.finalValue || order.estimatedValue).toLocaleString('uz-UZ')} so‘m
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State (Section 28) */
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          marginTop: '12px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--bg-card-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px'
          }}>
            📦
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
            Hozircha buyurtmalar yo‘q
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto 20px', lineHeight: 1.5 }}>
            Chiqindilaringizni qayta ishlashga topshiring, uyingizdan olib ketish buyurtmasini bering va pul ishlang!
          </p>
          <button 
            className="btn btn-primary"
            onClick={onOpenCreateOrder}
          >
            Chiqindi topshirishni boshlash
          </button>
        </div>
      )}

    </div>
  );
};
