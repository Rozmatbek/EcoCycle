import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteOrder, OrderStatus } from '../../types';
import { Truck, Package, CheckCircle2, DollarSign, MapPin, Phone, Clock, ArrowRight, Play, Navigation, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CollectorDashboard: React.FC = () => {
  const { orders, updateOrderStatus, setActiveRole } = useApp();
  const [selectedOrderForWeighing, setSelectedOrderForWeighing] = useState<WasteOrder | null>(null);
  const [actualWeightKg, setActualWeightKg] = useState<number>(10);
  const [filterTab, setFilterTab] = useState<'available' | 'active' | 'completed'>('active');

  const availableOrders = orders.filter(o => o.status === 'created' || o.status === 'searching_collector');
  const activeOrders = orders.filter(o => o.status === 'collector_assigned' || o.status === 'on_the_way' || o.status === 'collected');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const totalEarnings = completedOrders.reduce((sum, o) => sum + Math.round((o.finalValue || o.estimatedValue) * 0.15), 0); // 15% collector commission

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'collector_assigned', undefined, undefined, 'Collector Jasur Beknazarov buyurtmani qabul qildi');
  };

  const handleStartRoute = (orderId: string) => {
    updateOrderStatus(orderId, 'on_the_way', undefined, undefined, 'Collector mashinada mijoz manzili tomon yo‘lga chiqdi');
  };

  const handleOpenWeighModal = (order: WasteOrder) => {
    setSelectedOrderForWeighing(order);
    setActualWeightKg(order.weightKg);
  };

  const handleConfirmWeighing = () => {
    if (!selectedOrderForWeighing) return;
    const finalSum = Math.round(actualWeightKg * selectedOrderForWeighing.category.ratePerKg);
    
    updateOrderStatus(
      selectedOrderForWeighing.id, 
      'collected', 
      actualWeightKg, 
      finalSum, 
      `Chiqindi qabul qilindi. Aniq o‘lchangan vazn: ${actualWeightKg} kg, Summa: ${finalSum.toLocaleString('uz-UZ')} so‘m`
    );
    setSelectedOrderForWeighing(null);
  };

  const handleCompletePayout = (order: WasteOrder) => {
    updateOrderStatus(
      order.id, 
      'completed', 
      order.weightKg, 
      order.finalValue || order.estimatedValue, 
      'To‘lov muvaffaqiyatli foydalanuvchi hisobiga o‘tkazildi'
    );
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}
  };

  return (
    <div className="page-container">
      
      {/* Collector Role Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontSize: '13px', fontWeight: '800' }}>
            <span>🚚 COLLECTOR PANELI</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            Jasur Beknazarov 👋
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Hudud: Urganch shahri va Xorazm viloyati
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

      {/* Collector Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        
        <div className="eco-card" style={{ padding: '16px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white' }}>
          <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: '700' }}>Jami Collector Daromadi</div>
          <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '4px' }}>
            {totalEarnings.toLocaleString('uz-UZ')} so‘m
          </div>
          <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>15% xizmat haqi</div>
        </div>

        <div className="eco-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Faol buyurtmalar</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#F59E0B', marginTop: '4px' }}>
            {activeOrders.length} ta
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Jarayonda bo‘lgan</div>
        </div>

        <div className="eco-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>Yangi e’lonlar</div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>
            {availableOrders.length} ta
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Qabul qilishga tayyor</div>
        </div>

      </div>

      {/* Collector Filter Tabs (Section 21) */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        {[
          { id: 'active', label: '🚚 Faol buyurtmalar', count: activeOrders.length },
          { id: 'available', label: '📦 Yangi buyurtmalar', count: availableOrders.length },
          { id: 'completed', label: '✅ Yakunlangan', count: completedOrders.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filterTab === tab.id ? '#F59E0B' : 'var(--bg-card)',
              color: filterTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
              fontWeight: filterTab === tab.id ? '800' : '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: filterTab === tab.id ? '#F59E0B' : 'var(--border-color)'
            }}
          >
            {tab.label}
            <span style={{
              background: filterTab === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--bg-card-subtle)',
              color: filterTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '10px'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List according to Tab */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filterTab === 'active' && activeOrders.map(order => (
          <div key={order.id} className="eco-card" style={{ padding: '20px', border: '1.5px solid #F59E0B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: '800' }}>{order.id}</span>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Mijoz: <strong>{order.userName}</strong> ({order.userPhone})
                </div>
              </div>
              <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
                {order.status === 'collector_assigned' && 'Qabul qilingan'}
                {order.status === 'on_the_way' && 'Yo‘lda'}
                {order.status === 'collected' && 'Chiqindi qabul qilingan'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📦 <strong>Chiqindi:</strong> {order.category.name} — {order.weightKg} kg (Taxmin: {order.estimatedValue.toLocaleString('uz-UZ')} so‘m)</div>
              <div>📍 <strong>Manzil:</strong> {order.address.district}, {order.address.street}</div>
              <div>🕒 <strong>Vaqt:</strong> {order.preferredDate} ({order.preferredTime})</div>
              {order.address.instructions && (
                <div>📝 <strong>Izoh:</strong> {order.address.instructions}</div>
              )}
            </div>

            {/* Step Progression Buttons for Collector */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {order.status === 'collector_assigned' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStartRoute(order.id)}
                  style={{ flex: 1, fontSize: '13px' }}
                >
                  <Navigation size={16} /> Yo‘lga chiqdim
                </button>
              )}

              {order.status === 'on_the_way' && (
                <button 
                  className="btn btn-accent"
                  onClick={() => handleOpenWeighModal(order)}
                  style={{ flex: 1, fontSize: '13px' }}
                >
                  ⚖️ Tortish & Qabul qilish (Vazn kiritish)
                </button>
              )}

              {order.status === 'collected' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleCompletePayout(order)}
                  style={{ flex: 1, fontSize: '13px' }}
                >
                  <Check size={16} /> To‘lovni mijozga tushirish (Yakunlash)
                </button>
              )}

              <a 
                href={`tel:${order.userPhone.replace(/\s+/g, '')}`}
                className="btn btn-secondary"
                style={{ fontSize: '13px', textDecoration: 'none' }}
              >
                <Phone size={15} /> Qo‘ng‘iroq
              </a>
            </div>
          </div>
        ))}

        {filterTab === 'available' && availableOrders.map(order => (
          <div key={order.id} className="eco-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '17px', fontWeight: '800' }}>{order.id}</span>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{order.address.district}, {order.address.street}</div>
              </div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
                {order.estimatedValue.toLocaleString('uz-UZ')} so‘m
              </span>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px' }}>
              {order.category.icon} {order.category.name} • {order.weightKg} kg • Vaqt: {order.preferredDate} ({order.preferredTime})
            </div>

            <button 
              className="btn btn-primary btn-block"
              onClick={() => handleAcceptOrder(order.id)}
              style={{ fontSize: '13px' }}
            >
              <Check size={16} /> Buyurtmani qabul qilish
            </button>
          </div>
        ))}

        {filterTab === 'completed' && completedOrders.map(order => (
          <div key={order.id} className="eco-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px' }}>{order.id} • {order.category.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mijoz: {order.userName} • {order.weightKg} kg</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--primary)' }}>
                {(order.finalValue || order.estimatedValue).toLocaleString('uz-UZ')} so‘m
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>To‘langan ✅</div>
            </div>
          </div>
        ))}
      </div>

      {/* Weighing & Quality Verification Modal (Section 8, 21, 37) */}
      {selectedOrderForWeighing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
              Chiqindini tortish va tekshirish ⚖️
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {selectedOrderForWeighing.id} — {selectedOrderForWeighing.category.name}
            </p>

            <div className="form-group">
              <label className="form-label">Tarozi bo‘yicha haqiqiy vazn (kg):</label>
              <input 
                type="number"
                min="0.5"
                step="0.5"
                className="form-input"
                style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center' }}
                value={actualWeightKg}
                onChange={(e) => setActualWeightKg(Number(e.target.value) || 1)}
              />
            </div>

            <div style={{ background: 'var(--primary-light)', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--primary-dark)', fontWeight: '600' }}>
                Haqiqiy to‘lov summasi:
              </div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary-dark)' }}>
                {(actualWeightKg * selectedOrderForWeighing.category.ratePerKg).toLocaleString('uz-UZ')} so‘m
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setSelectedOrderForWeighing(null)}
              >
                Bekor qilish
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                onClick={handleConfirmWeighing}
              >
                <Check size={16} /> Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
