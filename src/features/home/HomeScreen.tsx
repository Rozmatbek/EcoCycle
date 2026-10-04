import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Recycle, 
  ChevronRight,
  Wallet,
  Clock,
  PackageCheck
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
  onOpenCreateOrder: () => void;
  onOpenOrderDetails: (orderId: string) => void;
}

export const HomeScreen: React.FC<Props> = ({ 
  onNavigate, 
  onOpenCreateOrder,
  onOpenOrderDetails 
}) => {
  const { user, balance, orders } = useApp();

  // Calculate dynamic statistics totals from completed orders + demo base
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  const plasticKg = 21 + completedOrders
    .filter(o => o.category.id === 'plastic')
    .reduce((sum, o) => sum + (o.weightKg || 0), 0);

  const paperKg = 12 + completedOrders
    .filter(o => o.category.id === 'paper' || o.category.id === 'cardboard')
    .reduce((sum, o) => sum + (o.weightKg || 0), 0);

  const metalKg = 5 + completedOrders
    .filter(o => o.category.id === 'metal')
    .reduce((sum, o) => sum + (o.weightKg || 0), 0);

  const totalKg = plasticKg + paperKg + metalKg;

  // Active ongoing orders
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="page-container">
      
      {/* Top Greeting Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>
          Salom, {user?.firstName || 'Ali'} 👋
        </h1>
      </div>

      {/* EcoBalance Card */}
      <div 
        className="eco-card" 
        style={{ 
          background: 'linear-gradient(135deg, #0F766E 0%, #064E3B 100%)',
          color: 'white',
          boxShadow: '0 12px 30px rgba(15, 118, 110, 0.25)',
          marginBottom: '28px',
          padding: '24px'
        }}
      >
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            EcoBalance
          </div>
          <div style={{ fontSize: '34px', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '4px' }}>
            {balance.toLocaleString('uz-UZ')} <span style={{ fontSize: '20px', fontWeight: '600' }}>so‘m</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button 
            onClick={() => onNavigate('wallet')}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Wallet size={18} /> Pul yechish
          </button>
          <button 
            onClick={onOpenCreateOrder}
            style={{
              flex: 1,
              background: '#10B981',
              border: 'none',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Recycle size={18} /> Topshirish
          </button>
        </div>
      </div>

      {/* Faol buyurtmalar Section */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            Faol buyurtmalar
          </div>
        </div>

        {activeOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => onOpenOrderDetails(order.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--text-subtle)' }}>
                    •
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                    {order.category.name}: {order.weightKg} kg
                  </span>
                  <span className="animate-pulse-slow" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>
                    Jarayonda
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontWeight: '600', fontSize: '13px' }}>
                  Kuzatish <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="eco-card" 
            style={{ 
              padding: '24px', 
              textAlign: 'center', 
              background: 'var(--bg-card-subtle)',
              border: '1px dashed var(--border-color)',
              borderRadius: '16px'
            }}
          >
            <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto 8px', display: 'block' }} />
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
              Hozircha faol buyurtmalar yo‘q
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Yig‘ilgan chiqindilarni topshirish uchun quyidagi tugmani bosing
            </div>
            <button 
              onClick={onOpenCreateOrder}
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px', margin: '0 auto' }}
            >
              <Recycle size={15} /> Chiqindi topshirish
            </button>
          </div>
        )}
      </div>

      {/* Topshirilganlar statistikasi (Qancha va nima topshirilgani) */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            Topshirilganlar statistikasi 📊
          </div>
        </div>

        <div className="eco-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '18px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
              ♻️
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>
                {totalKg} kg
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                jami chiqindi qayta ishlashga muvaffaqiyatli topshirilgan
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-card-subtle)', padding: '16px 10px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>📦</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{plasticKg} kg</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>Plastik</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '16px 10px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>📄</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{paperKg} kg</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>Karton & Qog‘oz</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '16px 10px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '26px', marginBottom: '6px' }}>🔩</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{metalKg} kg</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>Metall</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
