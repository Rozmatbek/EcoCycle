import React, { useState } from 'react';
import { 
  Recycle, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Clock, 
  Sparkles, 
  Coins, 
  TrendingUp, 
  Truck, 
  Factory, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Leaf, 
  Navigation,
  Calculator,
  ExternalLink,
  Award,
  Zap,
  Globe
} from 'lucide-react';
import { UZBEKISTAN_REGIONS } from '../../data/uzbekistanLocations';
import { INITIAL_WASTE_CATEGORIES } from '../../data/wasteCategories';
import { INITIAL_RECYCLING_POINTS, getAccurateDropoffPoints } from '../../data/recyclingPoints';

interface Props {
  onNavigateToRegister: () => void;
  onNavigateToApp: (tab?: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigateToRegister, onNavigateToApp }) => {
  // Calculator state
  const [calcCategoryId, setCalcCategoryId] = useState('plastic');
  const [calcWeight, setCalcWeight] = useState<number>(20);

  // Point Finder state
  const [finderRegionId, setFinderRegionId] = useState('qashqadaryo');
  const [finderDistrict, setFinderDistrict] = useState('G‘uzor tumani');

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const selectedCategory = INITIAL_WASTE_CATEGORIES.find(c => c.id === calcCategoryId) || INITIAL_WASTE_CATEGORIES[0];
  const calculatedEarnings = calcWeight * selectedCategory.pricePerKg;
  const calculatedEcoPoints = calcWeight * selectedCategory.ecoPointsPerKg;

  const currentFinderRegion = UZBEKISTAN_REGIONS.find(r => r.id === finderRegionId) || UZBEKISTAN_REGIONS[0];

  const handleFinderRegionChange = (regId: string) => {
    setFinderRegionId(regId);
    const reg = UZBEKISTAN_REGIONS.find(r => r.id === regId);
    if (reg && reg.districts.length > 0) {
      setFinderDistrict(reg.districts[0]);
    } else {
      setFinderDistrict('');
    }
  };

  const resolvedDropoffPoints = React.useMemo(() => {
    return getAccurateDropoffPoints(INITIAL_RECYCLING_POINTS, currentFinderRegion.name, finderDistrict);
  }, [currentFinderRegion, finderDistrict]);

  const faqs = [
    {
      q: "EcoCycle orqali qanday chiqindilarni topshirish mumkin?",
      a: "Biz plastik (baklajkalar, kanistrlar), karton va qog'oz, shisha butilkalar, metall hamda eski elektronika va tekstil chiqindilarini qabul qilamiz. Har bir tur uchun alohida narx va EcoBall belgilanadi."
    },
    {
      q: "Chiqindilarni uydan olib ketish xizmati qanday ishlaydi?",
      a: "Ilovada buyurtma yaratasiz: chiqindi turini va taxminiy vaznini kiritasiz, qulay sana va vaqtni tanlaysiz. Eng yaqin rasmiy Collector haydovchimiz manzilingizga kelib, chiqindini elektron tarozida tortadi va pulingizni Uzcard/Humo kartangizga darhol o‘tkazib beradi."
    },
    {
      q: "Topshirish punktlariga o‘zim olib borsam bo‘ladimi?",
      a: "Ha, albatta! Xaritada o‘zingizga eng yaqin qabul punktini topib, chiqindilarni to‘g‘ridan-to‘g‘ri topshirishingiz mumkin. Manzillar, ish vaqti va telefon raqamlar doimiy yangilanib turadi."
    },
    {
      q: "EcoPoints (EcoBallar) nima va undan qanday foydalaniladi?",
      a: "Har bir topshirilgan kilogramm uchun naqd puldan tashqari sizga EcoBallar taqdim etiladi. Yig'ilgan ballarni ilova ichidagi Eko-Do'konda chegirmalar, sovg'alar va yashil aksiyalarga almashtirishingiz mumkin."
    },
    {
      q: "Xizmat butun O‘zbekiston bo‘ylab ishlaydimi?",
      a: "Ha! EcoCycle O‘zbekistonning barcha 14 ta hududida (Toshkent shahri, barcha viloyatlar va Qoraqalpog‘iston Respublikasi) rasmiy punktlar va mobil collectorlar tarmog‘iga ega."
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      overflowX: 'hidden'
    }}>
      
      {/* 1. STICKY MODERN NAVBAR */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 24px'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}>
              <Recycle size={24} strokeWidth={2.4} />
            </div>
            <div>
              <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Eco<span style={{ color: 'var(--primary)' }}>Cycle</span>
              </span>
              <span style={{ fontSize: '10px', display: 'block', color: 'var(--primary)', fontWeight: '800', letterSpacing: '0.05em' }}>
                O‘ZBEKISTON
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }} className="landing-desktop-nav">
            <a href="#features" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '600', transition: 'color 0.2s' }}>
              Imkoniyatlar
            </a>
            <a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              Qanday ishlaydi?
            </a>
            <a href="#calculator" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              Tariflar & Hisoblagich
            </a>
            <a href="#points-map" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              Qabul punktlari
            </a>
            <a href="#faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              FAQ
            </a>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={onNavigateToRegister}
              className="btn btn-primary"
              style={{ fontSize: '13px', padding: '9px 18px', minHeight: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={15} /> Ro‘yxatdan o‘tish
            </button>
            <button 
              onClick={() => onNavigateToApp()}
              className="btn btn-secondary"
              style={{ fontSize: '13px', padding: '9px 16px', minHeight: '40px' }}
            >
              Ilovaga kirish
            </button>
          </div>

        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '70px 24px 80px',
        maxWidth: '1240px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Glow ambient background circles */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          
          {/* National Platform Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '6px 18px',
            borderRadius: '30px',
            fontSize: '13px',
            fontWeight: '800',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
          }}>
            <span>🇺🇿</span>
            <span>O‘ZBEKISTON MILLIY EKO-PLATFORMASI</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: '900',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            maxWidth: '920px',
            margin: '0 auto 20px'
          }}>
            Chiqindini qiymatga aylantiring. <br />
            <span style={{
              background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Tabiatni birgalikda asraylik!
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '740px',
            margin: '0 auto 36px'
          }}>
            Plastik, karton, metall, shisha va elektronika chiqindilarini uyingizdan topshiring yoki eng yaqin qabul punktiga olib boring. Har bir kilogramm uchun naqd daromad va qimmatbaho bonuslar oling.
          </p>

          {/* Primary CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '50px' }}>
            <button 
              onClick={onNavigateToRegister}
              className="btn btn-primary"
              style={{
                fontSize: '16px',
                padding: '14px 32px',
                minHeight: '52px',
                borderRadius: '14px',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Hoziroq Ro‘yxatdan O‘tish <ArrowRight size={18} />
            </button>

            <a 
              href="#points-map"
              className="btn btn-secondary"
              style={{
                fontSize: '15px',
                padding: '14px 26px',
                minHeight: '52px',
                borderRadius: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MapPin size={18} color="var(--primary)" /> Qabul punktlarini ko‘rish
            </a>

            <button 
              onClick={() => onNavigateToApp('map')}
              className="btn btn-secondary"
              style={{
                fontSize: '15px',
                padding: '14px 24px',
                minHeight: '52px',
                borderRadius: '14px'
              }}
            >
              Xaritaga o‘tish
            </button>
          </div>

          {/* Live Metrics Ticker Banner */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '20px',
            padding: '24px 20px',
            maxWidth: '980px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '20px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--primary)', marginBottom: '4px' }}>
                15,400+ kg
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                Qayta ishlangan chiqindi
              </div>
            </div>

            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981', marginBottom: '4px' }}>
                48,500,000+ so‘m
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                Aholiga to‘langan mablag‘
              </div>
            </div>

            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#3B82F6', marginBottom: '4px' }}>
                60+ Shahobcha
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                Rasmiy qabul punktlari
              </div>
            </div>

            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B', marginBottom: '4px' }}>
                14 ta Hudud
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                O‘zbekiston bo‘ylab to‘liq qamrov
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE LIVE PRICE & EARNINGS CALCULATOR */}
      <section id="calculator" style={{
        padding: '70px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Calculator size={15} /> Daromad Kalkulyatori
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Chiqindilaringiz qiymatini hisoblang
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0' }}>
            Chiqindi turini va taxminiy og‘irligini tanlang. Qancha daromad va bonus olishingizni bir zumda bilib oling.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-color)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '920px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-card)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          alignItems: 'center'
        }}>
          {/* Controls */}
          <div>
            <label className="form-label" style={{ fontSize: '13px', marginBottom: '12px', display: 'block' }}>
              Chiqindi turini tanlang:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {INITIAL_WASTE_CATEGORIES.map(cat => {
                const isSelected = cat.id === calcCategoryId;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setCalcCategoryId(cat.id)}
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-card-subtle)',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{cat.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {cat.pricePerKg.toLocaleString()} so‘m/kg
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '13px' }}>
                  Taxminiy vazn (kg):
                </label>
                <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--primary)' }}>
                  {calcWeight} kg
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="200"
                step="1"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>1 kg</span>
                <span>50 kg</span>
                <span>100 kg</span>
                <span>200 kg</span>
              </div>
            </div>
          </div>

          {/* Live Calculated Output Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(4, 120, 87, 0.06) 100%)',
            border: '2px solid var(--primary)',
            borderRadius: '20px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Siz oladigan daromad:
            </div>

            <div style={{ fontSize: '38px', fontWeight: '900', color: 'var(--primary)', lineHeight: 1.1, marginBottom: '6px' }}>
              {calculatedEarnings.toLocaleString()} <span style={{ fontSize: '20px' }}>so‘m</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '14px', fontSize: '13px', fontWeight: '800', marginBottom: '20px' }}>
              <Sparkles size={14} /> +{calculatedEcoPoints} EcoPoints
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Mablag‘ chiqindi qabul qilingan zahotiyoq sizning Humo yoki Uzcard hisobingizga o‘tkaziladi.
            </p>

            <button 
              onClick={onNavigateToRegister}
              className="btn btn-primary btn-block"
              style={{ fontSize: '14px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Topshirish uchun ro‘yxatdan o‘ting <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. REAL-TIME NEAREST POINT FINDER (Exact district matches) */}
      <section id="points-map" style={{
        padding: '70px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        background: 'var(--bg-card-subtle)',
        borderRadius: '32px',
        border: '1.5px solid var(--border-color)',
        marginBottom: '60px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <MapPin size={15} /> Lokatsiyalar va punktlar
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Eng yaqin chiqindi qabul punktini toping
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '640px', margin: '8px auto 0' }}>
            O‘z viloyatingiz va tumaningizni tanlang. Rasmiy shahobchalarning aniq manzillari va telefonlarini darhol ko‘ring.
          </p>
        </div>

        {/* Cascading Location Selectors */}
        <div style={{ maxWidth: '680px', margin: '0 auto 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          <div>
            <label className="form-label" style={{ fontSize: '12px' }}>Viloyatni tanlang:</label>
            <select 
              className="form-select"
              value={finderRegionId}
              onChange={(e) => handleFinderRegionChange(e.target.value)}
              style={{ fontSize: '14px', padding: '10px 14px' }}
            >
              {UZBEKISTAN_REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>{reg.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px' }}>Tuman yoki shaharni tanlang:</label>
            <select 
              className="form-select"
              value={finderDistrict}
              onChange={(e) => setFinderDistrict(e.target.value)}
              style={{ fontSize: '14px', padding: '10px 14px' }}
            >
              {currentFinderRegion.districts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resolved Drop-off Points Grid */}
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
              📍 {currentFinderRegion.name}, <strong>{finderDistrict}</strong> bo‘yicha aniqlangan punktlar:
            </div>
            <span style={{ fontSize: '12px', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '3px 10px', borderRadius: '8px', fontWeight: '800' }}>
              {resolvedDropoffPoints.length} ta shahobcha
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {resolvedDropoffPoints.map(point => (
              <div 
                key={point.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
                      🏢 {point.name}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '800', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px' }}>
                      {point.distanceKm || 0.8} km yaqinlikda
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '10px', lineHeight: 1.4 }}>
                    📍 <strong>Aniq manzili:</strong> {point.address}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--primary)" /> {point.openingHours}
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} />
                    <a href={`tel:${point.phone.replace(/\s+/g, '')}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                      {point.phone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <a 
                    href={`https://yandex.uz/maps/?rtext=~${point.lat},${point.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '12px', padding: '8px 12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <Navigation size={13} /> Yo‘nalish (Xarita)
                  </a>
                  <button 
                    onClick={() => onNavigateToApp('map')}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
                  >
                    Ilovada ko‘rish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" style={{
        padding: '70px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Zap size={15} /> Oddiy jarayon
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            EcoCycle qanday ishlaydi?
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0' }}>
            Atigi 3 oddiy qadamda chiqindilaringizni topshirib, darhol daromadga ega bo‘ling.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="eco-card" style={{ padding: '30px', textAlign: 'center', borderRadius: '22px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              fontSize: '26px'
            }}>
              📦
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              1-Qadam
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              Chiqindini saralang
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Uyingizdagi plastik idishlar, qog‘oz, karton, shisha yoki metall chiqindilarni alohida to‘plang.
            </p>
          </div>

          <div className="eco-card" style={{ padding: '30px', textAlign: 'center', borderRadius: '22px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              fontSize: '26px'
            }}>
              🚚
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              2-Qadam
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              Kuryer chaqiring yoki olib boring
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Ilova orqali manzil kiritib bepul eko-haydovchini chaqiring yoki eng yaqin qabul punktiga topshiring.
            </p>
          </div>

          <div className="eco-card" style={{ padding: '30px', textAlign: 'center', borderRadius: '22px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              fontSize: '26px'
            }}>
              💳
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              3-Qadam
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              Darhol to‘lov va bonuslar
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Chiqindi tortilgach, pulingiz shu zahoti bank kartangizga tushadi va hisobingizga EcoBallar qo‘shiladi.
            </p>
          </div>

        </div>
      </section>

      {/* 6. WHO WE SERVE SECTION */}
      <section id="features" style={{
        padding: '70px 24px',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Har bir ishtirokchi uchun imkoniyatlar
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0' }}>
            EcoCycle ekotizimi O‘zbekistondagi har bir fuqaro, haydovchi va qayta ishlovchi korxona uchun o‘zaro manfaatli.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          <div className="eco-card" style={{ padding: '28px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Aholi va Xonadonlar
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Muntazam daromad manbai</span>
              </div>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              <li>Uyda to‘plangan chiqindini ortiqcha ovoragarchiliksiz topshirish</li>
              <li>Har bir kg uchun bozorning eng yaxshi narxlari</li>
              <li>Humo va Uzcard orqali 1 daqiqada pul yechish</li>
              <li>EcoBallar orqali keshbeklar va sovg‘alar</li>
            </ul>
          </div>

          <div className="eco-card" style={{ padding: '28px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Collector Haydovchilar
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Barqaror yuqori daromad</span>
              </div>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              <li>O‘z hududingizdagi tayyor buyurtmalar oqimi</li>
              <li>Marshrutni optimallashtirish va tezkor navigatsiya</li>
              <li>Har bir topshirilgan reys uchun darhol to‘lov</li>
              <li>Bonus tizimi va rasmiy hamkorlik imtiyozlari</li>
            </ul>
          </div>

          <div className="eco-card" style={{ padding: '28px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Factory size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                  Qayta Ishlovchi Korxonalar
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toza va uzluksiz xomashyo</span>
              </div>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              <li>Saralangan va toza xomashyo partiyalari</li>
              <li>Bojxona va davlat ekologik standartlariga to‘liq muvofiqlik</li>
              <li>Hajmlar bo‘yicha to‘g‘ridan-to‘g‘ri shartnomalar</li>
              <li>B2B logistika va omborxona nazorati</li>
            </ul>
          </div>

        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" style={{
        padding: '70px 24px',
        maxWidth: '860px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Ko‘p beriladigan savollar
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>
            EcoCycle xizmatlari haqida barcha muhim savollarga javoblar.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  background: 'var(--bg-card)',
                  overflow: 'hidden'
                }}
              >
                <div 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '15px',
                    color: 'var(--text-main)'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <div style={{ padding: '0 20px 18px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #047857 0%, #065F46 100%)',
          borderRadius: '28px',
          padding: '50px 30px',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 20px 40px rgba(4, 120, 87, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ fontSize: '34px', fontWeight: '900', marginBottom: '14px', letterSpacing: '-0.02em' }}>
            Bugunoq o‘z hissangizni qo‘shing va daromad oling!
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '640px', margin: '0 auto 30px', lineHeight: 1.6 }}>
            EcoCycle platformasida 1 daqiqada ro‘yxatdan o‘ting, o‘z tumaningizdagi eng yaqin punktlardan foydalaning va O‘zbekistonni toza saqlashda bizga qo‘shiling.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              onClick={onNavigateToRegister}
              style={{
                background: 'white',
                color: '#047857',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 34px',
                fontSize: '16px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Ro‘yxatdan o‘tish <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => onNavigateToApp()}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderRadius: '14px',
                padding: '14px 28px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)'
              }}
            >
              Ilovaga kirish
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '40px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Recycle size={18} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>
            EcoCycle Uzbekistan
          </span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          © 2026 EcoCycle. Barcha huquqlar himoyalangan. O‘zbekiston Respublikasi bo‘yicha milliy ekotizim.
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
          <button 
            onClick={onNavigateToRegister}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
          >
            Ro‘yxatdan o‘tish
          </button>
          <button 
            onClick={() => onNavigateToApp()}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
          >
            Ilova
          </button>
        </div>
      </footer>

    </div>
  );
};
