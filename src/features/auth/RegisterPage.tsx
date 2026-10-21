import React, { useState } from 'react';
import { UZBEKISTAN_REGIONS } from '../../data/uzbekistanLocations';
import { UzbekistanLockBadge } from '../../components/common/UzbekistanLockBadge';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { 
  Recycle, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Sparkles, 
  User as UserIcon, 
  Truck, 
  Factory, 
  Bell, 
  MapPin, 
  Navigation,
  Clock,
  ArrowLeft,
  Building2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatUzbekPhone, getPhoneDigitsCount } from '../../utils/phoneFormatter';
import { INITIAL_RECYCLING_POINTS, getAccurateDropoffPoints } from '../../data/recyclingPoints';
import { saveUserToSupabase, trackVisitor } from '../../services/supabase';

interface Props {
  onNavigateToApp: () => void;
  onNavigateToLanding: () => void;
}

export const RegisterPage: React.FC<Props> = ({ onNavigateToApp, onNavigateToLanding }) => {
  const { login, setActiveRole, setNotificationsEnabled } = useApp();

  // Registration Form State
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [selectedRegionId, setSelectedRegionId] = useState('qashqadaryo');
  const [selectedDistrict, setSelectedDistrict] = useState('G‘uzor tumani');
  const [mahalla, setMahalla] = useState('');
  const [street, setStreet] = useState('');
  const [wantNotifications, setWantNotifications] = useState<boolean>(true);
  
  // Verification State
  const [step, setStep] = useState<'form' | 'otp' | 'success'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentRegion = UZBEKISTAN_REGIONS.find(r => r.id === selectedRegionId) || UZBEKISTAN_REGIONS[0];

  const handleRegionChange = (regId: string) => {
    setSelectedRegionId(regId);
    const reg = UZBEKISTAN_REGIONS.find(r => r.id === regId);
    if (reg && reg.districts.length > 0) {
      setSelectedDistrict(reg.districts[0]);
    } else {
      setSelectedDistrict('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatUzbekPhone(e.target.value));
  };

  // Real-time resolved drop-off points for the chosen region & district
  const nearbyPoints = React.useMemo(() => {
    if (!currentRegion) return [];
    return getAccurateDropoffPoints(INITIAL_RECYCLING_POINTS, currentRegion.name, selectedDistrict);
  }, [currentRegion, selectedDistrict]);

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
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4 && otpCode !== '1234') {
      setErrorMsg('Iltimos, 4 xonali SMS kodini kiriting (Test uchun: 1234)');
      return;
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const newUser: User = {
      id: `usr_${Date.now()}`,
      firstName,
      lastName,
      phone,
      country: 'O‘zbekiston',
      region: currentRegion.name,
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

    // Save user to Supabase backend & record visitor
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

    setStep('success');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(4, 120, 87, 0.08) 0%, transparent 40%), var(--bg-main)',
      color: 'var(--text-main)',
      paddingBottom: '60px'
    }}>
      {/* Top Navigation Bar */}
      <header style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '14px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div 
            onClick={onNavigateToLanding}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <Recycle size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Eco<span style={{ color: 'var(--primary)' }}>Cycle</span>
              </span>
              <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)', fontWeight: '600' }}>
                O‘zbekiston Milliy Eko-Tizimi
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={onNavigateToLanding}
              className="btn btn-secondary"
              style={{ fontSize: '13px', padding: '8px 16px', minHeight: '38px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} /> Bosh sahifa (Landing)
            </button>
            <button 
              onClick={onNavigateToApp}
              className="btn btn-primary"
              style={{ fontSize: '13px', padding: '8px 18px', minHeight: '38px' }}
            >
              Ilovaga kirish
            </button>
          </div>
        </div>
      </header>

      {/* Main Registration Layout */}
      <div style={{ maxWidth: '1100px', margin: '36px auto 0', padding: '0 20px' }}>
        
        {step === 'form' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', alignItems: 'start' }}>
            
            {/* Left Column: Brand Info & Location Benefits */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
                <Sparkles size={14} /> 1 daqiqada ro‘yxatdan o‘ting
              </div>

              <h1 style={{ fontSize: '32px', fontWeight: '900', lineHeight: 1.2, color: 'var(--text-main)', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                EcoCycle hamjamiyatiga qo‘shiling
              </h1>

              <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                Chiqindilaringizni qayta ishlatib, har bir kilogramm uchun real daromad oling va o‘z tumaningizdagi eng yaqin topshirish punktlaridan foydalaning.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <UzbekistanLockBadge subtitle="EcoCycle xizmatlari butun O‘zbekiston bo‘ylab barcha 14 ta hududda amal qiladi." />
              </div>

              {/* Dynamic Live Nearest Dropoff Point Preview */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(4, 120, 87, 0.04) 100%)',
                border: '1.5px solid var(--primary)',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>
                    <MapPin size={18} />
                    <span>Tanlangan hudud bo‘yicha topshirish punktlari:</span>
                  </div>
                  <span style={{ fontSize: '11px', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                    {nearbyPoints.length} ta shahobcha
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '14px', fontWeight: '600' }}>
                  📍 {currentRegion.name}, <strong>{selectedDistrict || 'Tuman tanlanmagan'}</strong>
                </div>

                {nearbyPoints.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
                    {nearbyPoints.map((pt) => (
                      <div 
                        key={pt.id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '14px',
                          padding: '12px 14px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '800', fontSize: '13px', color: 'var(--text-main)' }}>
                            🏢 {pt.name}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                            {pt.distanceKm || 0.8} km yaqin
                          </span>
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', lineHeight: 1.4 }}>
                          📍 <strong>Aniq manzili:</strong> {pt.address}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} color="var(--primary)" /> {pt.openingHours}
                          </span>
                          <a 
                            href={`tel:${pt.phone.replace(/\s+/g, '')}`} 
                            style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Phone size={12} /> {pt.phone}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '10px', background: 'var(--bg-card)', borderRadius: '10px', textAlign: 'center' }}>
                    Ushbu tumanda mobil collector haydovchilar buyurtma asosida uyingizdan olib ketadi.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Interactive Registration Form */}
            <div className="eco-card" style={{ padding: '28px', borderRadius: '22px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '18px', color: 'var(--text-main)' }}>
                Ma’lumotlaringizni to‘ldiring
              </h2>

              {errorMsg && (
                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', marginBottom: '18px' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Role Switcher */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Foydalanuvchi toifasi *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    
                    <div
                      onClick={() => setSelectedRole('user')}
                      style={{
                        border: selectedRole === 'user' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        background: selectedRole === 'user' ? 'var(--primary-light)' : 'var(--bg-card-subtle)',
                        borderRadius: '12px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '22px', marginBottom: '4px' }}>👤</div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: selectedRole === 'user' ? 'var(--primary)' : 'var(--text-main)' }}>
                        Aholi
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Topshiruvchi</div>
                    </div>

                    <div
                      onClick={() => setSelectedRole('collector')}
                      style={{
                        border: selectedRole === 'collector' ? '2px solid #F59E0B' : '1px solid var(--border-color)',
                        background: selectedRole === 'collector' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-card-subtle)',
                        borderRadius: '12px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '22px', marginBottom: '4px' }}>🚚</div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: selectedRole === 'collector' ? '#D97706' : 'var(--text-main)' }}>
                        Collector
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Haydovchi</div>
                    </div>

                    <div
                      onClick={() => setSelectedRole('recycler')}
                      style={{
                        border: selectedRole === 'recycler' ? '2px solid #3B82F6' : '1px solid var(--border-color)',
                        background: selectedRole === 'recycler' ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-card-subtle)',
                        borderRadius: '12px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '22px', marginBottom: '4px' }}>🏭</div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: selectedRole === 'recycler' ? '#2563EB' : 'var(--text-main)' }}>
                        Zavod
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Qayta ishlovchi</div>
                    </div>

                  </div>
                </div>

                {/* Name fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Ismingiz *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ali" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Familiyangiz *</label>
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

                {/* Phone */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Telefon raqamingiz *</label>
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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    SMS orqali tasdiqlash kodi yuboriladi
                  </span>
                </div>

                {/* Region & District Cascading Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Viloyat / Hudud *</label>
                    <select 
                      className="form-select"
                      value={selectedRegionId}
                      onChange={(e) => handleRegionChange(e.target.value)}
                      required
                    >
                      {UZBEKISTAN_REGIONS.map(reg => (
                        <option key={reg.id} value={reg.id}>{reg.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Shahar yoki Tuman *</label>
                    <select 
                      className="form-select"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      required
                    >
                      {currentRegion.districts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mahalla & Street */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Mahalla (ixtiyoriy)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Mustaqillik MFY" 
                      value={mahalla}
                      onChange={(e) => setMahalla(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Ko‘cha va uy (ixtiyoriy)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Bog‘bonlar ko‘chasi, 12-uy" 
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                </div>

                {/* Notification consent */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', margin: '4px 0' }}>
                  <input 
                    type="checkbox" 
                    checked={wantNotifications}
                    onChange={(e) => setWantNotifications(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span>Chiqindi topshirish va keshbeklar haqida bildirishnomalar olishni xohlayman</span>
                </label>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  style={{ fontSize: '15px', padding: '14px', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  Davom etish <ArrowRight size={18} />
                </button>
              </form>
            </div>

          </div>
        )}

        {/* STEP 2: OTP SMS VERIFICATION */}
        {step === 'otp' && (
          <div style={{ maxWidth: '460px', margin: '40px auto' }}>
            <div className="eco-card" style={{ padding: '32px', textAlign: 'center', borderRadius: '22px' }}>
              
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

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                SMS kodini tasdiqlang
              </h2>
              
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '22px' }}>
                <strong>{phone}</strong> raqamiga 4 xonali tasdiqlash kodi yuborildi. <br />
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>(Test uchun kod: 1234)</span>
              </p>

              {errorMsg && (
                <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <input 
                  type="text"
                  maxLength={4}
                  className="form-input"
                  style={{
                    fontSize: '28px',
                    letterSpacing: '12px',
                    textAlign: 'center',
                    fontWeight: '800',
                    maxWidth: '220px',
                    margin: '0 auto',
                    padding: '12px'
                  }}
                  placeholder="••••"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setStep('form')}
                >
                  Orqaga
                </button>
                <button 
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  onClick={handleVerifyOtp}
                >
                  Tasdiqlash va Kirish
                </button>
              </div>

              <div style={{ marginTop: '16px' }}>
                <button 
                  onClick={() => setOtpCode('1234')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Avtomatik to‘ldirish (1234)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div style={{ maxWidth: '520px', margin: '40px auto' }}>
            <div className="eco-card" style={{ padding: '36px', textAlign: 'center', borderRadius: '24px' }}>
              
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #047857)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
              }}>
                <CheckCircle2 size={42} />
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '10px' }}>
                Tabriklaymiz, {firstName}!
              </h2>

              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '22px' }}>
                EcoCycle tizimida muvaffaqiyatli ro‘yxatdan o‘tdingiz. Hududingiz: <strong>{currentRegion.name}, {selectedDistrict}</strong>. 
                Endi chiqindilarni topshirishingiz va eng yaqin qabul punktlaridan foydalanishingiz mumkin!
              </p>

              <div style={{ background: 'var(--bg-card-subtle)', borderRadius: '14px', padding: '14px', marginBottom: '24px', textAlign: 'left', fontSize: '13px' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                  📍 Sizga yaqin asosiy topshirish punkti:
                </div>
                {nearbyPoints[0] ? (
                  <div style={{ color: 'var(--text-muted)' }}>
                    <strong>{nearbyPoints[0].name}</strong> — {nearbyPoints[0].address} ({nearbyPoints[0].distanceKm || 0.8} km)
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)' }}>
                    {selectedDistrict} bo‘yicha mobil qabul xizmati faollashtirildi.
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button 
                  className="btn btn-primary btn-block"
                  style={{ fontSize: '15px', padding: '12px' }}
                  onClick={onNavigateToApp}
                >
                  EcoCycle Ilovasiga o‘tish
                </button>
                <button 
                  className="btn btn-secondary btn-block"
                  style={{ fontSize: '13px' }}
                  onClick={onNavigateToLanding}
                >
                  Bosh sahifani ko‘rish
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
