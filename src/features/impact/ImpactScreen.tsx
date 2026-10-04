import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trees, Droplets, Wind, Sparkles, TrendingUp, Award, CheckCircle } from 'lucide-react';

export const ImpactScreen: React.FC = () => {
  const { orders } = useApp();

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

  // Monthly stats (Section 15: Yanvar 12 kg, Fevral 18 kg, Mart 25 kg...)
  const monthlyStats = [
    { month: 'Yan', weight: 12, height: '40%' },
    { month: 'Fev', weight: 18, height: '60%' },
    { month: 'Mar', weight: 25, height: '80%' },
    { month: 'Apr', weight: 19, height: '62%' },
    { month: 'May', weight: 28, height: '90%' },
    { month: 'Iyun', weight: 22, height: '70%' },
    { month: 'Iyul', weight: 31, height: '100%' }
  ];

  // Calculated clear metrics
  const co2SavedKg = Math.round(totalKg * 1.6);
  const waterSavedLiters = Math.round(totalKg * 24);
  const treesSaved = (paperKg / 15).toFixed(1);

  return (
    <div className="page-container">
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          Mening ekologik hissam 🌱
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          O‘zbekiston tabiatini asrashga qo‘shgan shaxsiy hissangiz statistikasi
        </p>
      </div>

      {/* Main Impact Banner */}
      <div 
        className="eco-card"
        style={{
          background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)',
          color: 'white',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(6, 95, 70, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>
            🌍
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.85 }}>
              Jami qayta ishlangan chiqindi:
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '2px' }}>
              {totalKg} <span style={{ fontSize: '22px', fontWeight: '600' }}>kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Impact Environmental Factors Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        
        <div className="eco-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Wind size={22} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            ~{co2SavedKg} kg
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            CO2 chiqindisi kamaytirildi
          </div>
        </div>

        <div className="eco-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Droplets size={22} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            ~{waterSavedLiters} L
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Toza suv tejaldi
          </div>
        </div>

        <div className="eco-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Trees size={22} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' }}>
            ~{treesSaved} ta
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Daraxt saqlab qolindi
          </div>
        </div>

      </div>

      {/* Materials Breakdown */}
      <div className="eco-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px' }}>
          Materiallar kesimida taqsimot
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              <span>♻️ Plastik</span>
              <span>{plasticKg} kg ({Math.round((plasticKg / totalKg) * 100)}%)</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-card-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${(plasticKg / totalKg) * 100}%`, height: '100%', background: '#10B981', borderRadius: '8px' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              <span>📦 Karton va Qog‘oz</span>
              <span>{paperKg} kg ({Math.round((paperKg / totalKg) * 100)}%)</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-card-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${(paperKg / totalKg) * 100}%`, height: '100%', background: '#F59E0B', borderRadius: '8px' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
              <span>🔩 Metall</span>
              <span>{metalKg} kg ({Math.round((metalKg / totalKg) * 100)}%)</span>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-card-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${(metalKg / totalKg) * 100}%`, height: '100%', background: '#6366F1', borderRadius: '8px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Statistics Chart (Section 15) */}
      <div className="eco-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
            Oylik topshirilgan hajm (kg)
          </div>
          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700' }}>
            2026-yil
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', paddingTop: '20px', paddingBottom: '10px' }}>
          {monthlyStats.map(item => (
            <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {item.weight}
              </span>
              <div 
                style={{ 
                  width: '28px', 
                  height: item.height, 
                  background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.2)'
                }} 
              />
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '8px' }}>
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
