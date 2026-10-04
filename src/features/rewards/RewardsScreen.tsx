import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EcoReward } from '../../types';
import { Gift, Star, Award, CheckCircle2, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RewardsScreen: React.FC = () => {
  const { ecoPoints, rewards, redeemReward, ecoPointTransactions } = useApp();
  const [selectedReward, setSelectedReward] = useState<EcoReward | null>(null);
  const [redeemStatus, setRedeemStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleRedeem = (reward: EcoReward) => {
    setSelectedReward(reward);
    const res = redeemReward(reward.id);
    setRedeemStatus(res);

    if (res.success) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  };

  return (
    <div className="page-container">
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          EcoPoints & Mukofotlar 🎁
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Topshirilgan chiqindilar uchun yig‘ilgan ballarni qimmatbaho sovg‘alarga almashtiring
        </p>
      </div>

      {/* EcoPoints Balance Card */}
      <div 
        className="eco-card"
        style={{
          background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
          color: 'white',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(120, 53, 15, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>
              Mavjud EcoPoints
            </div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: '#FDE68A', marginTop: '4px' }}>
              ⭐️ {ecoPoints.toLocaleString('uz-UZ')} <span style={{ fontSize: '18px', color: 'white', fontWeight: '600' }}>ball</span>
            </div>
          </div>

          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
            🏆
          </div>
        </div>

        <div style={{ marginTop: '16px', background: 'rgba(255, 255, 255, 0.1)', padding: '10px 14px', borderRadius: '12px', fontSize: '12px' }}>
          💡 <strong>Qanday yig‘iladi?</strong> Har 10 kg plastik topshirganingizda +100 EcoPoints beriladi!
        </div>
      </div>

      {/* Rewards Catalog */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px' }}>
          Mukofotlar katalogi
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {rewards.map(reward => {
            const canAfford = ecoPoints >= reward.pointsCost;
            return (
              <div 
                key={reward.id}
                className="eco-card"
                style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#D97706',
                      fontWeight: '800',
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '10px'
                    }}>
                      ⭐️ {reward.pointsCost} EcoPoints
                    </span>

                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {reward.provider}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                    {reward.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {reward.description}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '16px' }}>
                    <strong>Shartlar:</strong> {reward.terms}
                  </div>
                </div>

                <button 
                  className={`btn ${canAfford ? 'btn-accent' : 'btn-secondary'} btn-block`}
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  style={{ fontSize: '13px', minHeight: '42px' }}
                >
                  {canAfford ? (
                    <>Almashtirish (⭐️ {reward.pointsCost})</>
                  ) : (
                    <>Yetarli emas (⭐️ {reward.pointsCost - ecoPoints} ball kerak)</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points History */}
      <div>
        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
          Ballar tarixi
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ecoPointTransactions.map(pt => (
            <div 
              key={pt.id}
              className="eco-card"
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>
                  {pt.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {pt.date}
                </div>
              </div>

              <div style={{
                fontWeight: '800',
                fontSize: '15px',
                color: pt.type === 'earned' ? '#10B981' : '#F59E0B'
              }}>
                {pt.type === 'earned' ? '+' : '-'}{pt.points} ball
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Result Modal Notification */}
      {redeemStatus && (
        <div className="modal-overlay" style={{ alignItems: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: '28px' }}>
            {redeemStatus.success ? (
              <CheckCircle2 size={56} color="#10B981" style={{ margin: '0 auto 14px' }} />
            ) : (
              <AlertCircle size={56} color="#EF4444" style={{ margin: '0 auto 14px' }} />
            )}

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              {redeemStatus.success ? 'Mukofot qabul qilindi!' : 'Xatolik'}
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              {redeemStatus.message}
            </p>

            <button 
              className="btn btn-primary btn-block"
              onClick={() => setRedeemStatus(null)}
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
