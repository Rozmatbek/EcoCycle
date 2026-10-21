import React, { useState } from 'react';
import { UZBEKISTAN_REGIONS } from '../../data/uzbekistanLocations';
import { UzbekistanLockBadge } from '../../components/common/UzbekistanLockBadge';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { Recycle, ArrowRight, CheckCircle2, Phone, Sparkles, User as UserIcon, Truck, Factory, Bell, MapPin, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatUzbekPhone, getPhoneDigitsCount } from '../../utils/phoneFormatter';
import { INITIAL_RECYCLING_POINTS, getAccurateDropoffPoints } from '../../data/recyclingPoints';
import { saveUserToSupabase, trackVisitor } from '../../services/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { login, setActiveRole, setNotificationsEnabled } = useApp();
  const [slide, setSlide] = useState<number>(0); // 0, 1, 2 for onboarding slides; 3 for registration form; 4 for OTP
  
  // Registration Form State
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [mahalla, setMahalla] = useState('');
  const [street, setStreet] = useState('');
  const [wantNotifications, setWantNotifications] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentRegion = UZBEKISTAN_REGIONS.find(r => r.id === selectedRegionId);

  const handleRegionChange = (regId: string) => {
    setSelectedRegionId(regId);
    setSelectedDistrict('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatUzbekPhone(e.target.value));
  };

  const handleStartRegistration = () => {
    setSlide(3); // Go to registration form
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !selectedRegionId || !selectedDistrict) {
      setErrorMsg('Iltimos, barcha majburiy maydonlarni to‘ldiring.');
      return;
    }
    if (getPhoneDigitsCount(phone) < 9) {
      setErrorMsg('Iltimos, telefon raqamni to‘liq kiriting (+998 dan keyin 9 ta raqam).');
      return;
    }
    setErrorMsg('');
    setSlide(4); // Go to OTP verification
  };

  const handleVerifyOtp = () => {
    // Mock OTP verification (accept any 4 digit or '1234')
    if (otpCode.length < 4 && otpCode !== '1234') {
      setErrorMsg('Iltimos, 4 xonali SMS kodini kiriting (Test uchun: 1234)');
      return;
    }

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    const newUser: User = {
      id: `usr_${Date.now()}`,
      firstName,
      lastName,
      phone,
      country: 'O‘zbekiston',
      region: currentRegion?.name || 'O‘zbekiston',
      district: selectedDistrict,
      mahalla,
      street,
      role: selectedRole,
      notificationsEnabled: wantNotifications,
      createdAt: new Date().toISOString()
    };

    login(newUser);
    setActiveRole(selectedRole);
    setNotificationsEnabled(wantNotifications);

    // Save user to Supabase and track visitor
    saveUserToSupabase({
      id: newUser.id,
      first_name: newUser.firstName,
      last_name: newUser.lastName,
      phone: newUser.phone,
      region: newUser.region,
      district: newUser.district,
      mahalla: newUser.mahalla,
      street: newUser.street,
      role: newUser.role,
      created_at: newUser.createdAt
    });
    trackVisitor(newUser);

    onClose();
  };

  return (
    <div className="modal-overlay" style={{ alignItems: 'center' }}>
      <div className="modal-content" style={{ maxWidth: '520px', padding: '26px' }}>
        
        {/* SLIDE 0: Intro 1 */}
        {slide === 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #10B981, #047857)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 28px rgba(16, 185, 129, 0.35)',
              color: 'white'
            }}>
              <Recycle size={48} strokeWidth={2.2} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '14px' }}>
              <Sparkles size={14} /> O‘zbekiston Milliy Eko-Platformasi
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: '800', lineHeight: 1.2, marginBottom: '12px', color: 'var(--text-main)' }}>
              EcoCycle
            </h2>
            <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)', marginBottom: '12px' }}>
              “Chiqindini qiymatga aylantiring.”
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Qayta ishlanadigan barcha chiqindilaringizni uyingizdan topshiring va darhol daromad oling.
            </p>

            <button 
              className="btn btn-primary btn-block"
              onClick={() => setSlide(1)}
            >
              Davom etish <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* SLIDE 1: Intro 2 */}
        {slide === 1 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 28px rgba(245, 158, 11, 0.3)',
              color: 'white',
              fontSize: '40px'
            }}>
              💰
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', lineHeight: 1.3, marginBottom: '14px', color: 'var(--text-main)' }}>
              “Keraksiz chiqindilarni topshiring va undan foyda oling.”
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Plastik, karton, metall va shisha chiqindilarining har bir kilogrammi uchun real pul va EcoPoints yig‘ing.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setSlide(0)}
              >
                Orqaga
              </button>
              <button 
                className="btn btn-primary"
                style={{ flex: 2 }}
                onClick={() => setSlide(2)}
              >
                Keyingisi <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* SLIDE 2: Intro 3 */}
        {slide === 2 && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #0D9488, #115E59)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 28px rgba(13, 148, 136, 0.3)',
              color: 'white',
              fontSize: '40px'
            }}>
              🌱
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '800', lineHeight: 1.3, marginBottom: '14px', color: 'var(--text-main)' }}>
              “Chiqindilar qayta ishlanishiga hissa qo‘shing.”
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
              Tabiatimizni asrash va O‘zbekistonni toza saqlashda bizning ekologik hamjamiyatimizga qo‘shiling.
            </p>

            <button 
              className="btn btn-primary btn-block"
              onClick={handleStartRegistration}
              style={{ fontSize: '16px' }}
            >
              Boshlash <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* SLIDE 3: O‘zbekiston Bo‘yicha Ro‘yxatdan O‘tish */}
        {slide === 3 && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                Ro‘yxatdan o‘tish
              </h2>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <UzbekistanLockBadge hideTitle subtitle="EcoCycle hozircha faqat O‘zbekistonda ishlaydi." />
            </div>

            {errorMsg && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm}>
              {/* Foydalanuvchi turi (Role Selection) */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Foydalanuvchi turi *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  
                  <div
                    onClick={() => setSelectedRole('user')}
                    style={{
                      border: selectedRole === 'user' ? '2px solid #10B981' : '1px solid var(--border-color)',
                      background: selectedRole === 'user' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                      borderRadius: '12px',
                      padding: '10px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '22px', marginBottom: '2px' }}>👤</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: selectedRole === 'user' ? '#10B981' : 'var(--text-main)' }}>
                      Foydalanuvchi
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Chiqindi topshiruvchi
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedRole('collector')}
                    style={{
                      border: selectedRole === 'collector' ? '2px solid #F59E0B' : '1px solid var(--border-color)',
                      background: selectedRole === 'collector' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-card)',
                      borderRadius: '12px',
                      padding: '10px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '22px', marginBottom: '2px' }}>🚚</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: selectedRole === 'collector' ? '#D97706' : 'var(--text-main)' }}>
                      Collector
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Yig‘uvchi haydovchi
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedRole('recycler')}
                    style={{
                      border: selectedRole === 'recycler' ? '2px solid #3B82F6' : '1px solid var(--border-color)',
                      background: selectedRole === 'recycler' ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-card)',
                      borderRadius: '12px',
                      padding: '10px 6px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '22px', marginBottom: '2px' }}>🏭</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: selectedRole === 'recycler' ? '#2563EB' : 'var(--text-main)' }}>
                      Zavod
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Qayta ishlovchi
                    </div>
                  </div>

                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Ism *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ali" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Familiya *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Karimov" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Telefon raqam *</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+998 90 123-45-67" 
                  value={phone}
                  onChange={handlePhoneChange}
                  onFocus={() => {
                    if (!phone || phone.trim() === '+998') {
                      setPhone('+998 ');
                    }
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Viloyat / Hudud *</label>
                  <select 
                    className="form-select"
                    value={selectedRegionId}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    required
                  >
                    <option value="" disabled>Viloyatni tanlang</option>
                    {UZBEKISTAN_REGIONS.map(reg => (
                      <option key={reg.id} value={reg.id}>{reg.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tuman yoki shahar *</label>
                  <select 
                    className="form-select"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    required
                    disabled={!selectedRegionId}
                  >
                    <option value="" disabled>{selectedRegionId ? "Tumanni tanlang" : "Avval viloyatni tanlang"}</option>
                    {currentRegion?.districts.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tanlangan viloyat va shahardagi topshirish punktlari preview */}
              {currentRegion && (
                <div style={{
                  background: 'var(--bg-card-subtle)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: 'var(--text-main)' }}>
                      <MapPin size={15} color="var(--primary)" />
                      <span>{currentRegion.name} {selectedDistrict ? `(${selectedDistrict})` : ''} topshirish punktlari:</span>
                    </div>
                  </div>

                  {(() => {
                    const displayPoints = getAccurateDropoffPoints(INITIAL_RECYCLING_POINTS, currentRegion.name, selectedDistrict);

                    if (displayPoints.length === 0) {
                      return (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '4px 0' }}>
                          Ushbu hududda yangi mobil collector xizmati ishga tushirilgan.
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
                        {displayPoints.map(p => (
                          <div 
                            key={p.id}
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '10px',
                              padding: '8px 10px'
                            }}
                          >
                            <div style={{ fontWeight: '800', fontSize: '12px', color: 'var(--text-main)', marginBottom: '2px' }}>
                              🏢 {p.name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                              📍 <strong>Aniq manzili:</strong> {p.address}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', fontSize: '11px' }}>
                              <a 
                                href={`tel:${p.phone.replace(/\s+/g, '')}`}
                                style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Phone size={11} /> {p.phone}
                              </a>
                              <a 
                                href={`https://yandex.uz/maps/?rtext=~${p.lat},${p.lng}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#3B82F6', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Navigation size={11} /> Lokatsiyasi
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Mahalla / Ko‘cha / Uy</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Istiqlol ko‘chasi, 28-uy" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              {/* Bildirishnomalar sozlamasi - foydalanuvchining o'z tanloviga bog'liq */}
              <div 
                onClick={() => setWantNotifications(!wantNotifications)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: 'var(--bg-card-subtle)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <input 
                  type="checkbox" 
                  id="notifPref"
                  checked={wantNotifications}
                  onChange={(e) => setWantNotifications(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
                <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '600', cursor: 'pointer' }}>
                  Bildirishnomalarni yoqish
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>
                    Buyurtma holati va to‘lovlar bo‘yicha xabarlarni olish
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '4px' }}>
                Davom etish <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* SLIDE 4: OTP Verification */}
        {slide === 4 && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <Phone size={32} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>
              SMS Tasdiqlash
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              <strong>{phone}</strong> raqamiga 4 xonali tasdiqlash kodi yuborildi.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <input 
                type="text"
                maxLength={4}
                placeholder="1 2 3 4"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  letterSpacing: '12px',
                  textAlign: 'center',
                  padding: '12px',
                  width: '200px',
                  borderRadius: '14px',
                  border: '2px solid var(--primary)',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-main)',
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '8px' }}>
                Test kodi: <strong>1234</strong>
              </div>
            </div>

            {errorMsg && (
              <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '8px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}

            <button 
              className="btn btn-primary btn-block"
              onClick={handleVerifyOtp}
              style={{ marginBottom: '12px' }}
            >
              <CheckCircle2 size={18} /> Tasdiqlash va Kirish
            </button>

            <button 
              className="btn btn-secondary btn-block"
              onClick={() => setSlide(3)}
            >
              Raqamni o‘zgartirish
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
