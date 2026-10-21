import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { RecyclingPoint } from '../../types';
import { UZBEKISTAN_REGIONS } from '../../data/uzbekistanLocations';
import { getAccurateDropoffPoints, cleanLocationStr } from '../../data/recyclingPoints';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Compass, 
  Building2,
  ExternalLink
} from 'lucide-react';
import L from 'leaflet';

interface Props {
  onSelectDropoffPoint?: (point: RecyclingPoint) => void;
}

export const MapScreen: React.FC<Props> = ({ onSelectDropoffPoint }) => {
  const { recyclingPoints, wasteCategories, user } = useApp();
  
  // User's registered location (from registration or profile)
  const registeredRegion = user?.region || 'Qashqadaryo viloyati';
  const registeredDistrict = user?.district || 'G‘uzor tumani';

  const [selectedRegion, setSelectedRegion] = useState<string>(registeredRegion);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(registeredDistrict);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep in sync with user's registration/profile changes
  useEffect(() => {
    if (user?.region) {
      setSelectedRegion(user.region);
    }
    if (user?.district) {
      setSelectedDistrict(user.district);
    }
  }, [user?.region, user?.district]);

  // Filter points: strict match on district when specified, with accurate fallback
  const filteredPoints = React.useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return recyclingPoints.filter(pt => 
        pt.name.toLowerCase().includes(q) ||
        pt.address.toLowerCase().includes(q) ||
        pt.district.toLowerCase().includes(q) ||
        pt.region.toLowerCase().includes(q) ||
        pt.phone.includes(q)
      );
    }

    return getAccurateDropoffPoints(recyclingPoints, selectedRegion, selectedDistrict);
  }, [recyclingPoints, selectedRegion, selectedDistrict, searchQuery]);

  const [selectedPoint, setSelectedPoint] = useState<RecyclingPoint>(() => {
    const direct = getAccurateDropoffPoints(recyclingPoints, registeredRegion, registeredDistrict);
    return direct[0] || recyclingPoints[0];
  });

  // Whenever filtered points change, ensure selectedPoint is the first accurate match
  useEffect(() => {
    if (filteredPoints.length > 0) {
      const currentStillInList = filteredPoints.find(p => p.id === selectedPoint?.id);
      if (!currentStillInList) {
        setSelectedPoint(filteredPoints[0]);
      }
    }
  }, [filteredPoints]);

  const sortedPoints = filteredPoints;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Get current region object from locations list
  const currentRegionObj = UZBEKISTAN_REGIONS.find(r => 
    cleanLocationStr(r.name) === cleanLocationStr(selectedRegion) ||
    cleanLocationStr(r.name).includes(cleanLocationStr(selectedRegion)) ||
    cleanLocationStr(selectedRegion).includes(cleanLocationStr(r.name))
  );

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = selectedPoint?.lat || 41.5543;
      const initialLng = selectedPoint?.lng || 60.6315;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Custom Icon helper
    const createCustomIcon = (isSelected: boolean) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: ${isSelected ? '#047857' : '#10B981'};
            color: white;
            width: ${isSelected ? '40px' : '32px'};
            height: ${isSelected ? '40px' : '32px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            border: 2.5px solid white;
            font-size: ${isSelected ? '18px' : '15px'};
            font-weight: bold;
            transition: all 0.2s ease;
          ">
            ♻️
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
    };

    // Add Recycling Points Markers
    sortedPoints.forEach(point => {
      const isSelected = selectedPoint?.id === point.id;
      const marker = L.marker([point.lat, point.lng], { icon: createCustomIcon(isSelected) })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <strong style="font-size: 13px; color: #047857;">${point.name}</strong><br/>
            <span style="font-size: 12px; color: #4B5563;">📍 ${point.address}</span><br/>
            <span style="font-size: 12px; font-weight: bold; color: #10B981;">📞 ${point.phone}</span>
          </div>
        `)
        .on('click', () => {
          setSelectedPoint(point);
          map.setView([point.lat, point.lng], 14, { animate: true });
        });

      markersRef.current.push(marker);
    });

    // If point selected, center on it
    if (selectedPoint && map) {
      map.setView([selectedPoint.lat, selectedPoint.lng], 13, { animate: true });
    }
  }, [sortedPoints.length, selectedRegion, selectedDistrict]);

  const handleFocusPoint = (point: RecyclingPoint) => {
    setSelectedPoint(point);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([point.lat, point.lng], 15, { animate: true });
      // Find marker and open popup
      const marker = markersRef.current.find(m => {
        const pos = m.getLatLng();
        return Math.abs(pos.lat - point.lat) < 0.0001 && Math.abs(pos.lng - point.lng) < 0.0001;
      });
      if (marker) {
        marker.openPopup();
      }
    }
  };



  const handleRegionChange = (newRegName: string) => {
    setSelectedRegion(newRegName);
    const regObj = UZBEKISTAN_REGIONS.find(r => r.name === newRegName);
    if (regObj && regObj.districts.length > 0) {
      setSelectedDistrict(regObj.districts[0]);
    } else {
      setSelectedDistrict('all');
    }
    // Set first point in new region
    const firstPointInRegion = recyclingPoints.find(p => 
      p.region.toLowerCase().includes(newRegName.toLowerCase().replace(' viloyati', '').replace(' shahri', ''))
    );
    if (firstPointInRegion) {
      setSelectedPoint(firstPointInRegion);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([firstPointInRegion.lat, firstPointInRegion.lng], 13, { animate: true });
      }
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '30px' }}>
      
      {/* Page Title */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          Qabul punktlari va lokatsiyalar 📍
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          O‘zbekiston bo‘ylab chiqindi topshirish punktlari, ularning aniq manzillari va telefon raqamlari
        </p>
      </div>



      {/* Filter by Region & City + Search Bar */}
      <div className="eco-card" style={{ padding: '16px', marginBottom: '18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          
          {/* Viloyat tanlash */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Viloyat / Hudud:</label>
            <select 
              className="form-select"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
            >
              {UZBEKISTAN_REGIONS.map(reg => (
                <option key={reg.id} value={reg.name}>{reg.name}</option>
              ))}
            </select>
          </div>

          {/* Shahar / Tuman tanlash */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Shahar yoki Tuman:</label>
            <select 
              className="form-select"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="all">Barcha tumanlar</option>
              {currentRegionObj?.districts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Tezkor qidiruv */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', minHeight: '40px', fontSize: '13px' }}
            placeholder="Punkt nomi, ko‘cha, telefon yoki mo‘ljal bo‘yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Split Map & Detail Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Interactive Map Canvas Container */}
        <div style={{ 
          height: '380px', 
          borderRadius: '20px', 
          overflow: 'hidden', 
          border: '1.5px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
        </div>

        {/* Selected Point Details Card */}
        {selectedPoint && (
          <div className="eco-card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.25 }}>
                {selectedPoint.name}
              </h2>
            </div>

            {/* Aniq manzili */}
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={16} color="var(--primary)" />
                <span>Aniq manzili:</span>
              </div>
              <div style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>
                {selectedPoint.region}, {selectedPoint.district}, {selectedPoint.address}
              </div>
            </div>

            {/* Lokatsiyasi va Telefon raqami */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color="var(--primary)" /> Ish vaqti:
                </div>
                <strong>{selectedPoint.openingHours}</strong>
              </div>

              <div style={{ background: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} color="var(--primary)" /> Telefon raqami:
                </div>
                <a href={`tel:${selectedPoint.phone.replace(/\s+/g, '')}`} style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>
                  {selectedPoint.phone}
                </a>
              </div>
            </div>

            {/* Qabul qilinadigan chiqindilar */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Qabul qilinadigan turlar:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedPoint.acceptedCategories.map(catId => {
                  const cat = wasteCategories.find(c => c.id === catId);
                  if (!cat) return null;
                  return (
                    <span key={catId} style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> {cat.icon} {cat.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Harakatlar: Lokatsiya va Qo'ng'iroq */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={`https://yandex.uz/maps/?rtext=~${selectedPoint.lat},${selectedPoint.lng}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Navigation size={16} /> Yo‘nalish (Xaritada)
              </a>

              <a 
                href={`tel:${selectedPoint.phone.replace(/\s+/g, '')}`}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Phone size={16} /> Qo‘ng‘iroq qilish
              </a>
            </div>

            {onSelectDropoffPoint && (
              <button 
                onClick={() => onSelectDropoffPoint(selectedPoint)}
                className="btn btn-primary btn-block"
                style={{ marginTop: '10px', fontSize: '13px' }}
              >
                Ushbu punktga topshirish
              </button>
            )}
          </div>
        )}

      </div>

      {/* Tanlangan hududdagi barcha topshirish punktlari ro'yxati */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
              Topshirish punktlari ro‘yxati
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {selectedRegion} ({sortedPoints.length} ta shahobcha)
            </div>
          </div>
        </div>

        {sortedPoints.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {sortedPoints.map(p => {
              const isSelected = selectedPoint?.id === p.id;
              return (
                <div 
                  key={p.id}
                  onClick={() => handleFocusPoint(p)}
                  style={{
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-main)' }}>
                        🏢 {p.name}
                      </div>
                      {selectedDistrict && selectedDistrict !== 'all' && cleanLocationStr(p.district).includes(cleanLocationStr(selectedDistrict)) && (
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                          Yaqin punkt ({p.distanceKm || 0.8} km)
                        </span>
                      )}
                    </div>

                    {/* Aniq manzili */}
                    <div style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.4 }}>
                      📍 <strong>Aniq manzili:</strong> {p.address}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      🏛️ <strong>Hudud:</strong> {p.region}, {p.district}
                    </div>

                    {/* Telefon raqami */}
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} />
                      <a 
                        href={`tel:${p.phone.replace(/\s+/g, '')}`} 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        {p.phone}
                      </a>
                    </div>

                    {/* Ish vaqti */}
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={13} /> {p.openingHours}
                    </div>
                  </div>

                  {/* Lokatsiya tugmalari */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFocusPoint(p);
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1, fontSize: '12px', padding: '6px 10px', minHeight: '34px' }}
                    >
                      Xaritada belgilash
                    </button>
                    
                    <a 
                      href={`https://yandex.uz/maps/?rtext=~${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-primary"
                      style={{ flex: 1, fontSize: '12px', padding: '6px 10px', minHeight: '34px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Navigation size={13} /> Lokatsiya <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="eco-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MapPin size={36} style={{ margin: '0 auto 10px', display: 'block', color: 'var(--text-muted)' }} />
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
              Ushbu qidiruv bo‘yicha punktlar topilmadi
            </div>
            <div style={{ fontSize: '13px' }}>
              Iltimos, boshqa tuman yoki viloyatni tanlang yoki qidiruv so‘zini o‘zgartiring.
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
