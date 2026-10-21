import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WasteCategory, PickupType } from '../../types';
import { UZBEKISTAN_REGIONS } from '../../data/uzbekistanLocations';
import { X, Check, Truck, MapPin, Calendar, Clock, AlertCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedCategory?: WasteCategory;
  onOrderCreated?: (orderId: string) => void;
}

export const CreateOrderModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  preselectedCategory,
  onOrderCreated 
}) => {
  const { user, wasteCategories, recyclingPoints, createOrder } = useApp();
  
  const [step, setStep] = useState<number>(1);
  const [selectedCat, setSelectedCat] = useState<WasteCategory>(preselectedCategory || wasteCategories[0]);
  const [weightKg, setWeightKg] = useState<number>(10);
  const [pickupType, setPickupType] = useState<PickupType>('pickup');
  
  // Address & Time State
  const [region, setRegion] = useState(user?.region || 'Xorazm viloyati');
  const [district, setDistrict] = useState(user?.district || 'Urganch shahri');
  const [mahalla, setMahalla] = useState(user?.mahalla || 'Al-Xorazmiy mahallasi');
  const [street, setStreet] = useState(user?.street || 'Istiqlol ko‘chasi, 28-uy');
  const [apartment, setApartment] = useState(user?.apartment || '14-xonadon');
  const [instructions, setInstructions] = useState('Eshik qo‘ng‘irog‘ini chaling yoki telefon qiling');
  const [preferredDate, setPreferredDate] = useState('2026-10-05');
  const [preferredTime, setPreferredTime] = useState('14:00 – 16:00');
  const [selectedPointId, setSelectedPointId] = useState(recyclingPoints[0]?.id || '');

  if (!isOpen) return null;

  const currentRegionObj = UZBEKISTAN_REGIONS.find(r => r.name === region) || UZBEKISTAN_REGIONS[0];

  const estimatedValue = Math.round(weightKg * selectedCat.ratePerKg);
  const estimatedPoints = Math.round(weightKg * selectedCat.ecoPointsPerKg);

  const handleRegionChange = (newRegionName: string) => {
    setRegion(newRegionName);
    const regObj = UZBEKISTAN_REGIONS.find(r => r.name === newRegionName);
    if (regObj && regObj.districts.length > 0) {
      setDistrict(regObj.districts[0]);
    }
  };

  const handleConfirmOrder = () => {
    const selectedPoint = recyclingPoints.find(p => p.id === selectedPointId);

    const newOrder = createOrder({
      userId: user?.id || 'usr_ali_karimov',
      userName: `${user?.firstName || 'Ali'} ${user?.lastName || 'Karimov'}`,
      userPhone: user?.phone || '+998 90 123-45-67',
      category: selectedCat,
      weightKg: weightKg,
      estimatedValue: estimatedValue,
      pickupType: pickupType,
      address: {
        country: 'O‘zbekiston',
        region: region,
        district: district,
        mahalla: mahalla,
        street: street,
        house: '28-uy',
        apartment: apartment,
        instructions: instructions
      },
      preferredDate: preferredDate,
      preferredTime: preferredTime,
      status: 'created',
      recyclingPointId: pickupType === 'dropoff' ? selectedPointId : undefined,
      recyclingPointName: pickupType === 'dropoff' ? selectedPoint?.name : undefined,
      ecoPointsEarned: estimatedPoints
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onClose();
    if (onOrderCreated) {
      onOrderCreated(newOrder.id);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
              {step === 1 && 'Chiqindi turini tanlang'}
              {step === 2 && 'Miqdor va qiymat'}
              {step === 3 && 'Topshirish usuli va manzil'}
              {step === 4 && 'Buyurtmani tekshiring'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'var(--bg-card-subtle)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: Select Waste Category */}
        {step === 1 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {wasteCategories.map(cat => {
                const isSelected = selectedCat.id === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCat(cat)}
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                      borderRadius: '16px',
                      padding: '14px 10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                        ✓
                      </div>
                    )}
                    <div style={{ fontSize: '32px', marginBottom: '6px' }}>{cat.icon}</div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{cat.name}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <strong>Qabul qilinadigan turlari:</strong> {selectedCat.acceptedSubtypes.join(', ')}
            </div>

            <button 
              className="btn btn-primary btn-block"
              onClick={() => setStep(2)}
            >
              Davom etish <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Weight Input & Value Estimation */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '30px' }}>{selectedCat.icon}</span>
              <div>
                <div style={{ fontWeight: '800', fontSize: '16px' }}>{selectedCat.name}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '15px' }}>
                Og‘irlik:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <input 
                  type="number" 
                  min="1"
                  max="1000"
                  className="form-input"
                  style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center', padding: '10px' }}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value) || 1))}
                />
                <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-muted)' }}>kg</span>
              </div>
            </div>

            {/* Calculated Value Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              border: '1.5px solid #10B981',
              borderRadius: '16px',
              padding: '18px',
              marginBottom: '16px',
              color: '#064E3B'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.85 }}>
                Qiymati:
              </div>
              <div style={{ fontSize: '28px', fontWeight: '800', marginTop: '2px', color: '#047857' }}>
                {estimatedValue.toLocaleString('uz-UZ')} so‘m
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                Hisoblash: {weightKg} kg × {selectedCat.ratePerKg.toLocaleString('uz-UZ')} so‘m
              </div>
            </div>

            {/* Crucial Section 8 & 37 Notice */}
            <div style={{ display: 'flex', gap: '10px', background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '12px', marginBottom: '24px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <ShieldAlert size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Eslatma:</strong> Yakuniy summa chiqindi qabul qilinganda og‘irlik va sifat tekshirilgandan keyin aniqlanadi.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setStep(1)}
              >
                Orqaga
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                onClick={() => setStep(3)}
              >
                Topshirish usuli <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pickup Type & Address */}
        {step === 3 && (
          <div>
            {/* Choose Pickup vs Dropoff */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div
                onClick={() => setPickupType('pickup')}
                style={{
                  border: pickupType === 'pickup' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: pickupType === 'pickup' ? 'var(--primary-light)' : 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <Truck size={28} color={pickupType === 'pickup' ? '#10B981' : '#64748B'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>Uyimdan olib keting</div>
              </div>

              <div
                onClick={() => setPickupType('dropoff')}
                style={{
                  border: pickupType === 'dropoff' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: pickupType === 'dropoff' ? 'var(--primary-light)' : 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}
              >
                <MapPin size={28} color={pickupType === 'dropoff' ? '#10B981' : '#64748B'} style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>O‘zim olib boraman</div>
              </div>
            </div>

            {pickupType === 'pickup' ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Viloyat</label>
                    <select 
                      className="form-select"
                      value={region}
                      onChange={(e) => handleRegionChange(e.target.value)}
                    >
                      {UZBEKISTAN_REGIONS.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tuman / Shahar</label>
                    <select 
                      className="form-select"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      {currentRegionObj.districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Mahalla / Ko‘cha / Uy</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Al-Xorazmiy ko‘chasi, 28-uy"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Qulay sana</label>
                    <input 
                      type="date"
                      className="form-input"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Qulay vaqt</label>
                    <select 
                      className="form-select"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                    >
                      <option value="09:00 – 11:00">09:00 – 11:00</option>
                      <option value="11:00 – 14:00">11:00 – 14:00</option>
                      <option value="14:00 – 16:00">14:00 – 16:00</option>
                      <option value="16:00 – 18:00">16:00 – 18:00</option>
                      <option value="18:00 – 20:00">18:00 – 20:00</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">Qabul punktini tanlang:</label>
                  <select 
                    className="form-select"
                    value={selectedPointId}
                    onChange={(e) => setSelectedPointId(e.target.value)}
                  >
                    {recyclingPoints.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.district}) — {p.openingHours}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
                    Tanlangan punkt: {recyclingPoints.find(p => p.id === selectedPointId)?.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    📍 {recyclingPoints.find(p => p.id === selectedPointId)?.address}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '6px', fontWeight: '600' }}>
                    🕒 {recyclingPoints.find(p => p.id === selectedPointId)?.openingHours}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setStep(2)}
              >
                Orqaga
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                onClick={() => setStep(4)}
              >
                Tekshirish <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Order Review & Confirmation (Section 36 & 9) */}
        {step === 4 && (
          <div>
            <div style={{ background: 'var(--bg-card-subtle)', borderRadius: '18px', padding: '18px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Buyurtmani tekshiring
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Chiqindi turi:</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{selectedCat.icon} {selectedCat.name}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Og‘irlik:</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{weightKg} kg</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Xizmat turi:</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                  {pickupType === 'pickup' ? '🚚 Uyimdan olib ketish (Pickup)' : '📍 Qabul punktiga olib borish'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manzil:</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)', textAlign: 'right' }}>
                  {pickupType === 'pickup' ? `${region}, ${district}, ${street}` : `${recyclingPoints.find(p => p.id === selectedPointId)?.name}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Vaqt:</span>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{preferredDate} ({preferredTime})</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0', marginTop: '6px' }}>
                <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>Qiymati:</span>
                <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--primary)' }}>
                  {estimatedValue.toLocaleString('uz-UZ')} so‘m
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setStep(3)}
              >
                Orqaga
              </button>
              <button 
                className="btn btn-primary" 
                style={{ flex: 2 }}
                onClick={handleConfirmOrder}
              >
                <Check size={18} /> Buyurtmani tasdiqlash
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
