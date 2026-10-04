import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, ArrowDownRight, ArrowUpRight, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WalletScreen: React.FC = () => {
  const { balance, transactions, withdrawFunds } = useApp();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(20000);
  const [paymentMethod, setPaymentMethod] = useState<'Payme' | 'Click' | 'Uzum Bank' | 'Humo / Uzcard'>('Payme');
  const [cardNumber, setCardNumber] = useState('8600 1234 5678 4821');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'withdrawal'>('all');

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      setErrorMsg('Summa 0 dan katta bo‘lishi kerak');
      return;
    }
    if (withdrawAmount > balance) {
      setErrorMsg('Hisobingizda mablag‘ yetarli emas');
      return;
    }
    if (cardNumber.replace(/\s+/g, '').length < 16) {
      setErrorMsg('Karta raqamini to‘liq kiriting (16 xona)');
      return;
    }

    const success = withdrawFunds(withdrawAmount, paymentMethod, cardNumber);
    if (success) {
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setIsWithdrawModalOpen(false);
        setErrorMsg('');
      }, 1500);
    }
  };

  return (
    <div className="page-container">
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          Eco Hamyon 💰
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Chiqindilardan olingan daromadlaringiz va to‘lovlar tarixi
        </p>
      </div>

      {/* Main Balance Hero Card */}
      <div 
        className="eco-card"
        style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #064E3B 100%)',
          color: 'white',
          padding: '28px 24px',
          marginBottom: '24px',
          boxShadow: '0 14px 32px rgba(15, 118, 110, 0.3)'
        }}
      >
        <div style={{ marginBottom: '6px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', opacity: 0.9 }}>
            Joriy EcoBalance
          </div>
          <div style={{ fontSize: '38px', fontWeight: '800', letterSpacing: '-0.02em', marginTop: '6px' }}>
            {balance.toLocaleString('uz-UZ')} <span style={{ fontSize: '22px', fontWeight: '600' }}>so‘m</span>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <button 
            className="btn btn-block"
            onClick={() => setIsWithdrawModalOpen(true)}
            style={{
              background: '#FFFFFF',
              color: '#064E3B',
              fontWeight: '800',
              fontSize: '15px',
              borderRadius: '14px'
            }}
          >
            <ArrowUpRight size={18} /> Pul yechish
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            Tranzaksiyalar tarixi
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'incoming', label: 'Kirimlar' },
              { id: 'withdrawal', label: 'Yechilganlar' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: filterType === tab.id ? 'var(--primary)' : 'var(--bg-card-subtle)',
                  color: filterType === tab.id ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTransactions.map(tx => {
            const isIncoming = tx.type === 'incoming';
            return (
              <div 
                key={tx.id}
                className="eco-card"
                style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: isIncoming ? 'var(--primary-light)' : 'var(--danger-light)',
                    color: isIncoming ? 'var(--primary)' : 'var(--danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isIncoming ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                      {tx.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {isIncoming ? (tx.subtitle ? `${tx.subtitle} • ` : '') : ''}{tx.timestamp}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontWeight: '800',
                    fontSize: '16px',
                    color: isIncoming ? 'var(--primary)' : 'var(--danger)'
                  }}>
                    {isIncoming ? '+' : '-'}{tx.amount.toLocaleString('uz-UZ')} so‘m
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
                    Muvaffaqiyatli
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pul Yechish Modal (Withdraw Modal) */}
      {isWithdrawModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                Mablag‘ni yechish 💳
              </h2>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                style={{ background: 'var(--bg-card-subtle)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {withdrawSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={54} color="#10B981" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Muvaffaqiyatli yechildi!
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {withdrawAmount.toLocaleString('uz-UZ')} so‘m siz ko‘rsatgan kartaga o‘tkazildi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit}>
                {errorMsg && (
                  <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '14px' }}>
                    {errorMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">To‘lov provayderi:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {(['Payme', 'Click', 'Uzum Bank', 'Humo / Uzcard'] as const).map(method => (
                      <div
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        style={{
                          border: paymentMethod === method ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          background: paymentMethod === method ? 'var(--primary-light)' : 'var(--bg-card)',
                          padding: '10px',
                          borderRadius: '12px',
                          textAlign: 'center',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          color: paymentMethod === method ? 'var(--primary-dark)' : 'var(--text-main)'
                        }}
                      >
                        {method}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Karta raqami (Uzcard / Humo):</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="8600 •••• •••• ••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Yechish summasi (so‘m):</label>
                  <input 
                    type="number" 
                    min="1000"
                    max={balance}
                    className="form-input"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Mavjud balans: {balance.toLocaleString('uz-UZ')} so‘m</span>
                    <span 
                      style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
                      onClick={() => setWithdrawAmount(balance)}
                    >
                      Barchasini yechish
                    </span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '16px' }}
                >
                  Tasdiqlash va Yechish
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
