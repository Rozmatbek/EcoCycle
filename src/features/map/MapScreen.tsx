import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { RecyclingPoint } from '../../types';
import { MapPin, Phone, Clock, Navigation, CheckCircle2, XCircle, Search, Filter, Layers } from 'lucide-react';
import L from 'leaflet';

interface Props {
  onSelectDropoffPoint?: (point: RecyclingPoint) => void;
}

export const MapScreen: React.FC<Props> = ({ onSelectDropoffPoint }) => {
  const { recyclingPoints, wasteCategories } = useApp();
  const [selectedPoint, setSelectedPoint] = useState<RecyclingPoint>(recyclingPoints[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const filteredPoints = recyclingPoints.filter(pt => {
    const matchesSearch = pt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pt.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pt.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || pt.acceptedCategories.includes(selectedCategoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center initially around Urganch, Xorazm (41.55, 60.63)
      const map = L.map(mapContainerRef.current, {
        center: [41.5543, 60.6315],
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
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            border: 2.5px solid white;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.2s ease;
          ">
            ♻️
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
    };

    // User Location Marker (Blue pulse)
    const userIcon = L.divIcon({
      className: 'user-map-pin',
      html: `
        <div style="
          background: #3B82F6;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.35);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    L.marker([41.5500, 60.6280], { icon: userIcon }).addTo(map).bindPopup("📍 Sizning joylashuvingiz (Urganch)");

    // Add Recycling Points Markers
    filteredPoints.forEach(point => {
      const isSelected = selectedPoint?.id === point.id;
      const marker = L.marker([point.lat, point.lng], { icon: createCustomIcon(isSelected) })
        .addTo(map)
        .on('click', () => {
          setSelectedPoint(point);
          map.setView([point.lat, point.lng], 14, { animate: true });
        });

      markersRef.current.push(marker);
    });

    return () => {
      // Map stays preserved
    };
  }, [filteredPoints, selectedPoint]);

  const handleFocusPoint = (point: RecyclingPoint) => {
    setSelectedPoint(point);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([point.lat, point.lng], 14, { animate: true });
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '30px' }}>
      
      {/* Title & Search */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          Qabul punktlari va xarita 📍
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
          O‘zbekiston bo‘ylab eng yaqin qayta ishlash shahobchalari
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px', position: 'relative' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
        <input 
          type="text"
          className="form-input"
          style={{ paddingLeft: '40px', minHeight: '46px' }}
          placeholder="Shahar, tuman yoki manzil bo‘yicha qidiruv..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Split Map & Detail Layout (Dual Column on Tablet/Desktop) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
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

        {/* Selected Point Details Card (Section 12) */}
        {selectedPoint && (
          <div className="eco-card" style={{ padding: '20px' }}>
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>
                {selectedPoint.name}
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                📍 {selectedPoint.district}, {selectedPoint.address}
              </div>
            </div>

            {/* Accepted & Unaccepted Materials */}
            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '14px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Qabul qilinadigan chiqindilar:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {selectedPoint.acceptedCategories.map(catId => {
                  const cat = wasteCategories.find(c => c.id === catId);
                  return (
                    <span key={catId} style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> {cat?.icon} {cat?.name}
                    </span>
                  );
                })}
              </div>

              {selectedPoint.unacceptedCategories.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--danger)', marginBottom: '4px' }}>
                    Qabul qilinmaydi:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedPoint.unacceptedCategories.map(catId => {
                      const cat = wasteCategories.find(c => c.id === catId);
                      return (
                        <span key={catId} style={{ background: 'var(--danger-light)', color: 'var(--danger)', fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <XCircle size={12} /> {cat?.icon} {cat?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Hours and Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ish vaqti:</div>
                  <strong>{selectedPoint.openingHours}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Telefon:</div>
                  <strong>{selectedPoint.phone}</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons (Section 12: Yo'nalish, Qo'ng'iroq qilish) */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={`https://yandex.uz/maps/?rtext=~${selectedPoint.lat},${selectedPoint.lng}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '13px', textDecoration: 'none' }}
              >
                <Navigation size={16} /> Yo‘nalish
              </a>

              <a 
                href={`tel:${selectedPoint.phone.replace(/\s+/g, '')}`}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '13px', textDecoration: 'none' }}
              >
                <Phone size={16} /> Qo‘ng‘iroq
              </a>
            </div>
          </div>
        )}

      </div>

      {/* List of Nearby Points */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
          Yaqin atrofdagi barcha punktlar
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {filteredPoints.map(p => (
            <div 
              key={p.id}
              onClick={() => handleFocusPoint(p)}
              style={{
                background: selectedPoint?.id === p.id ? 'var(--primary-light)' : 'var(--bg-card)',
                border: selectedPoint?.id === p.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                📍 {p.address}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
