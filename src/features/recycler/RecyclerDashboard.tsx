import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecyclerMaterialStock } from '../../types';
import { Factory, ShoppingCart, CheckCircle2, ShieldCheck, MapPin, Package, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecyclerDashboard: React.FC = () => {
  const { recyclerStock, purchaseRecyclerStock, setActiveRole } = useApp();
  const [selectedStock, setSelectedStock] = useState<RecyclerMaterialStock | null>(null);
  const [purchaseAmountKg, setPurchaseAmountKg] = useState<number>(100);
  const [companyName, setCompanyName] = useState('O‘zbekiston EcoPlast MChJ');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenPurchase = (stock: RecyclerMaterialStock) => {
    setSelectedStock(stock);
    setPurchaseAmountKg(stock.minOrderKg);
    setSuccessMsg('');
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) return;

    const ok = purchaseRecyclerStock(selectedStock.id, purchaseAmountKg, companyName);
    if (ok) {
      try {
        confetti({ particleCount: 60, spread: 70 });
      } catch {}
      setSuccessMsg(`Muvaffaqiyatli xarid qilindi! ${purchaseAmountKg} kg ${selectedStock.categoryName} yetkazib berish bo‘limiga yuborildi.`);
      setTimeout(() => {
        setSelectedStock(null);
        setSuccessMsg('');
      }, 2000);
    }
  };

  return (
    <div className="page-container">
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontSize: '13px', fontWeight: '800' }}>
            <Factory size={16} /> QAYTA ISHLASH ZAVODI BIRJASI
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            Xomashyo Bozor / Birjasi 🏭
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Yig‘ilgan va saralangan xomashyolarni to‘g‘ridan-to‘g‘ri ulgurji sotib olish
          </p>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setActiveRole('user')}
          style={{ fontSize: '12px', padding: '6px 14px', minHeight: '36px' }}
        >
          Foydalanuvchi rejimiga qaytish
        </button>
      </div>

      {/* Marketplace Intro Card */}
      <div 
        className="eco-card" 
        style={{ 
          background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)', 
          color: 'white', 
          padding: '22px', 
          marginBottom: '24px',
          boxShadow: '0 12px 30px rgba(30, 64, 175, 0.25)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
            ♻️
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800' }}>
              To‘liq Yopiq Sikl: USER → COLLECTOR → RECYCLER
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>
              Foydalanuvchilar topshirgan va collectorlar yig‘gan toza saralangan xomashyo omborlarda tayyor.
            </div>
          </div>
        </div>
      </div>

      {/* Available Materials Stock List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {recyclerStock.map(stock => (
          <div 
            key={stock.id}
            className="eco-card"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{
                  background: 'rgba(59, 130, 246, 0.12)',
                  color: '#2563EB',
                  fontWeight: '800',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '8px'
                }}>
                  {stock.qualityGrade}
                </span>

                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Min: {stock.minOrderKg} kg
                </span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                {stock.categoryName}
              </h3>

              <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Mavjud hajm:</span>
                  <strong style={{ color: '#10B981', fontSize: '15px' }}>{stock.availableKg} kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ulgurji narx:</span>
                  <strong style={{ color: 'var(--text-main)' }}>{stock.marketPricePerKg.toLocaleString('uz-UZ')} so‘m/kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>
                  <span>📍 {stock.warehouseLocation}</span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-block"
              onClick={() => handleOpenPurchase(stock)}
              disabled={stock.availableKg === 0}
              style={{ fontSize: '13px', minHeight: '42px' }}
            >
              <ShoppingCart size={16} /> {stock.availableKg > 0 ? 'Xarid qilish / Shartnoma' : 'Tugagan'}
            </button>
          </div>
        ))}
      </div>

      {/* Purchase Modal */}
      {selectedStock && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>
              Xomashyo xaridi va shartnoma
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {selectedStock.categoryName} • Ombor: {selectedStock.warehouseLocation}
            </p>

            {successMsg ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>{successMsg}</div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPurchase}>
                <div className="form-group">
                  <label className="form-label">Kompaniya / Korxona nomi:</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sotib olinadigan hajm (kg):</label>
                  <input 
                    type="number"
                    min={selectedStock.minOrderKg}
                    max={selectedStock.availableKg}
                    className="form-input"
                    style={{ fontSize: '20px', fontWeight: '800', textAlign: 'center' }}
                    value={purchaseAmountKg}
                    onChange={(e) => setPurchaseAmountKg(Number(e.target.value) || selectedStock.minOrderKg)}
                    required
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Minimal hajm: {selectedStock.minOrderKg} kg • Maksimal: {selectedStock.availableKg} kg
                  </div>
                </div>

                <div style={{ background: 'var(--primary-light)', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--primary-dark)', fontWeight: '600' }}>
                    Jami shartnoma summasi:
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-dark)' }}>
                    {(purchaseAmountKg * selectedStock.marketPricePerKg).toLocaleString('uz-UZ')} so‘m
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button"
                    className="btn btn-secondary" 
                    style={{ flex: 1 }}
                    onClick={() => setSelectedStock(null)}
                  >
                    Bekor qilish
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ flex: 2 }}
                  >
                    Xaridni tasdiqlash
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
