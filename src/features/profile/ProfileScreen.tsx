import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UZBEKISTAN_REGIONS } from '../../data/uzbekistanLocations';
import { UzbekistanLockBadge } from '../../components/common/UzbekistanLockBadge';
import { UserRole } from '../../types';
import { 
  Moon, 
  Sun, 
  Globe, 
  Bell, 
  Download,
  FileText, 
  HelpCircle, 
  LogOut, 
  Edit3, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X 
} from 'lucide-react';
import { downloadEcoCycleGuidePdf } from '../../utils/generateGuidePdf';
import { formatUzbekPhone } from '../../utils/phoneFormatter';

interface Props {
  onOpenOnboarding: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onOpenOnboarding }) => {
  const { user, updateProfile, darkMode, toggleDarkMode, logout, activeRole } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeFaqId, setActiveFaqId] = useState<number | null>(null);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState(user?.firstName || 'Ali');
  const [editLastName, setEditLastName] = useState(user?.lastName || 'Karimov');
  const [editPhone, setEditPhone] = useState(user?.phone || '+998 90 123-45-67');
  const [editRegion, setEditRegion] = useState(user?.region || 'Xorazm viloyati');
  const [editDistrict, setEditDistrict] = useState(user?.district || 'Urganch shahri');
  const [editMahalla, setEditMahalla] = useState(user?.mahalla || 'Al-Xorazmiy mahallasi');
  const [editStreet, setEditStreet] = useState(user?.street || 'Istiqlol ko‘chasi, 28-uy');

  const currentRegionObj = UZBEKISTAN_REGIONS.find(r => r.name === editRegion) || UZBEKISTAN_REGIONS[0];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: editFirstName,
      lastName: editLastName,
      role: user?.role || activeRole || 'user',
      phone: editPhone,
      region: editRegion,
      district: editDistrict,
      mahalla: editMahalla,
      street: editStreet
    });
    setIsEditModalOpen(false);
  };

  const handleRegionChange = (newRegionName: string) => {
    setEditRegion(newRegionName);
    const reg = UZBEKISTAN_REGIONS.find(r => r.name === newRegionName);
    if (reg && reg.districts.length > 0) {
      setEditDistrict(reg.districts[0]);
    }
  };

  const faqs = [
    {
      id: 1,
      q: 'Qanday qilib chiqindi topshiraman?',
      a: 'Bosh sahifada "Chiqindi topshirish" tugmasini bosing. Chiqindi turini tanlang, taxminiy vaznini kiriting va uyingizdan olib ketish (Pickup) yoki yaqin atrofdagi qabul punktiga olib borish usulini tanlang.'
    },
    {
      id: 2,
      q: 'Pickup qanday ishlaydi?',
      a: 'Siz buyurtma berganingizdan so‘ng tizim hududingizdagi eng yaqin rasmiy collector (yig‘uvchi haydovchi)ni biriktiradi. U belgilangan vaqtda keladi, chiqindini elektron tarozida tortadi, sifatini tekshiradi va to‘lovni hisobingizga tushiradi.'
    },
    {
      id: 3,
      q: 'Pul qachon balansimga tushadi?',
      a: 'Chiqindi collector yoki qabul punkti xodimi tomonidan qabul qilinishi bilan bir necha soniyada EcoBalance hisobingizga tushadi. Uni darhol Uzcard/Humo, Payme, Click yoki Uzum orqali kartangizga yechib olishingiz mumkin.'
    },
    {
      id: 4,
      q: 'EcoPoints nima va undan qanday foydalaniladi?',
      a: 'EcoPoints — bu har bir topshirilgan kilogramm chiqindi uchun beriladigan ekologik rag‘batlantirish ballari. Yig‘ilgan ballarni vaucherlar, sovg‘alar va daraxt ekish xayriyalariga almashtirishingiz mumkin.'
    },
    {
      id: 5,
      q: 'Qaysi chiqindilar qabul qilinadi?',
      a: 'EcoCycle platformasida Plastik (PET, HDPE), Karton, Qog‘oz, Metall (alyuminiy, temir, mis), Shisha, Batareyalar, Elektron chiqindilar va Tekstil matolari qabul qilinadi.'
    },
    {
      id: 6,
      q: 'Qabul punktlari qayerda joylashgan?',
      a: 'Ilovaning "Xarita" bo‘limida O‘zbekiston bo‘ylab barcha rasmiy va hamkor qabul punktlarining aniq manzili, ish vaqti, telefon raqamlari va qabul qilinadigan materiallar ro‘yxati mavjud.'
    }
  ];

  const getRoleTitle = (role: UserRole) => {
    switch (role) {
      case 'user': return 'Foydalanuvchi (Chiqindi topshiruvchi)';
      case 'collector': return 'Chiqindi yig‘uvchi (Collector)';
      case 'recycler': return 'Qayta ishlash korxonasi (Zavod)';
    }
  };

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  return (
    <div className="page-container">

      {/* Profile Card */}
      <div className="eco-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              {user?.firstName || 'Ali'} {user?.lastName || 'Karimov'}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {user?.phone || '+998 90 123-45-67'}
            </div>
          </div>

          <button 
            className="btn btn-secondary"
            onClick={() => setIsEditModalOpen(true)}
            style={{ padding: '8px 14px', fontSize: '13px', minHeight: '38px', flexShrink: 0 }}
          >
            <Edit3 size={15} /> Tahrirlash
          </button>
        </div>

        {/* User Details */}
        <div style={{ background: 'var(--bg-card-subtle)', borderRadius: '14px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Foydalanuvchi turi:</span>
            <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{getRoleTitle(user?.role || activeRole || 'user')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Davlat:</span>
            <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>O‘zbekiston</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Viloyat / Shahar:</span>
            <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{user?.region || 'Xorazm viloyati'}, {user?.district || 'Urganch shahri'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Manzil:</span>
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user?.mahalla}, {user?.street}</span>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="eco-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', paddingLeft: '8px' }}>
          Sozlamalar
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          {/* Notifications Toggle */}
          <div 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', background: 'var(--bg-card-subtle)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bell size={18} color="var(--primary)" />
              <span style={{ fontSize: '14px', fontWeight: '700' }}>Bildirishnomalar</span>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: notificationsEnabled ? 'var(--primary)' : '#CBD5E1',
              borderRadius: '20px',
              position: 'relative',
              transition: 'all 0.2s'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: notificationsEnabled ? '22px' : '4px',
                transition: 'all 0.2s'
              }} />
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div 
            onClick={toggleDarkMode}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {darkMode ? <Moon size={18} color="#F59E0B" /> : <Sun size={18} color="#F59E0B" />}
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Qorong‘i rejim</span>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: darkMode ? 'var(--primary)' : '#CBD5E1',
              borderRadius: '20px',
              position: 'relative',
              transition: 'all 0.2s'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                background: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: darkMode ? '22px' : '4px',
                transition: 'all 0.2s'
              }} />
            </div>
          </div>

          {/* Language Item */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={18} color="var(--primary)" />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Ilova tili</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
              O‘zbek tili
            </span>
          </div>

          {/* PDF User Guide Download */}
          <div 
            onClick={downloadEcoCycleGuidePdf}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '12px 14px', 
              borderRadius: '12px', 
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={18} color="var(--primary)" />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>To‘liq yo‘riqnoma</span>
            </div>
            <Download size={18} color="var(--primary)" />
          </div>

          {/* Logout */}
          <div 
            onClick={() => {
              if (window.confirm('Hisobdan chiqishni tasdiqlaysizmi?')) {
                logout();
                onOpenOnboarding();
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', color: 'var(--danger)' }}
          >
            <LogOut size={18} />
            <span style={{ fontSize: '14px', fontWeight: '700' }}>Chiqish</span>
          </div>

        </div>
      </div>

      {/* Help Center / FAQ */}
      <div className="eco-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <HelpCircle size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            Ko‘p beriladigan savollar
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map(faq => {
            const isOpen = activeFaqId === faq.id;
            return (
              <div 
                key={faq.id}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: 'var(--bg-card-subtle)'
                }}
              >
                <div
                  onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                  style={{
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    color: 'var(--text-main)'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <div style={{ padding: '0 16px 14px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Operator Call Button */}
        <div style={{ marginTop: '20px', background: 'var(--primary-light)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--primary-dark)' }}>
              Savolingiz qoldimi?
            </div>
            <div style={{ fontSize: '12px', color: 'var(--primary-dark)', opacity: 0.85 }}>
              Operatorimiz 24/7 yordam berishga tayyor
            </div>
          </div>

          <a 
            href="tel:+998712000088" 
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px', minHeight: '38px', textDecoration: 'none' }}
          >
            <Phone size={15} /> Bog‘lanish
          </a>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                Profilni tahrirlash
              </h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'var(--bg-card-subtle)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <UzbekistanLockBadge subtitle="Davlat nomi har doim O‘zbekiston bo‘lib qoladi." />
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group">
                  <label className="form-label">Ism</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Familiya</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input 
                  type="tel"
                  className="form-input"
                  value={editPhone}
                  onChange={(e) => setEditPhone(formatUzbekPhone(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Viloyat</label>
                <select 
                  className="form-select"
                  value={editRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  {UZBEKISTAN_REGIONS.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tuman yoki shahar</label>
                <select 
                  className="form-select"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                >
                  {currentRegionObj.districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mahalla / Ko‘cha</label>
                <input 
                  type="text"
                  className="form-input"
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
                <Check size={18} /> Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
