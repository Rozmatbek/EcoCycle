import { WasteCategory } from '../types';

export const INITIAL_WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 'plastic',
    name: 'Plastik',
    icon: '♻️',
    description: 'Bakalashkalar, idishlar, polietilen, HDPE qattiq idishlar',
    ratePerKg: 2500, // 2,500 so'm / kg
    ecoPointsPerKg: 10,
    pickupAvailable: true,
    acceptedSubtypes: ['PET (ichimlik idishlari)', 'HDPE (shampun/idishlar)', 'Polietilen plyonkalar', 'Plastik qopqoqlar'],
    unit: 'kg',
    color: '#10B981' // emerald green
  },
  {
    id: 'cardboard',
    name: 'Karton',
    icon: '📦',
    description: 'Gofrokarton, maishiy texnika qutilari, presslangan karton',
    ratePerKg: 1800, // 1,800 so'm / kg
    ecoPointsPerKg: 8,
    pickupAvailable: true,
    acceptedSubtypes: ['Gofrokarton', 'Katta qutilar', 'Tuxum kataklari (presslangan)'],
    unit: 'kg',
    color: '#F59E0B' // amber
  },
  {
    id: 'paper',
    name: 'Qog‘oz',
    icon: '📄',
    description: 'A4 ofis qog‘ozi, kitoblar, jurnallar, gazetalar, daftarlar',
    ratePerKg: 1400, // 1,400 so'm / kg
    ecoPointsPerKg: 6,
    pickupAvailable: true,
    acceptedSubtypes: ['Oq A4 qog‘oz', 'Gazeta va jurnallar', 'Eski kitob va daftarlar', 'Arxiv hujjatlari'],
    unit: 'kg',
    color: '#3B82F6' // blue
  },
  {
    id: 'metal',
    name: 'Metall',
    icon: '🔩',
    description: 'Alyuminiy bankalar, mis, latun, temir va quyma metall chiqindilari',
    ratePerKg: 4200, // 4,200 so'm / kg (average base)
    ecoPointsPerKg: 15,
    pickupAvailable: true,
    acceptedSubtypes: ['Alyuminiy bankalar', 'Mis va simlar', 'Temir profillar', 'Latun va bronza'],
    unit: 'kg',
    color: '#6366F1' // indigo
  },
  {
    id: 'glass',
    name: 'Shisha',
    icon: '🍾',
    description: 'Shisha butilkalar, bankalar, singan shisha idishlar',
    ratePerKg: 600, // 600 so'm / kg
    ecoPointsPerKg: 4,
    pickupAvailable: true,
    acceptedSubtypes: ['Shaffof shisha', 'Yashil va jigarrang butilkalar', 'Konserva bankalari'],
    unit: 'kg',
    color: '#14B8A6' // teal
  },
  {
    id: 'battery',
    name: 'Batareya',
    icon: '🔋',
    description: 'Akkumulyatorlar, barmoq batareyalar (xavfsiz utilizatsiya va qayta ishlash)',
    ratePerKg: 15000, // 15,000 so'm / kg
    ecoPointsPerKg: 30,
    pickupAvailable: true,
    acceptedSubtypes: ['Avto akkumulyatorlari', 'AA/AAA batareyalar', 'Lityum-ion batareyalar'],
    unit: 'kg',
    color: '#EF4444' // red
  },
  {
    id: 'electronics',
    name: 'Elektron chiqindi',
    icon: '📱',
    description: 'Eski telefonlar, kompyuter platalari, maishiy texnika qismlari',
    ratePerKg: 8500, // 8,500 so'm / kg
    ecoPointsPerKg: 25,
    pickupAvailable: true,
    acceptedSubtypes: ['Mobil telefonlar', 'Elektron platalar', 'Kompyuter bloklari', 'Kichik maishiy texnika'],
    unit: 'kg',
    color: '#8B5CF6' // purple
  },
  {
    id: 'textile',
    name: 'Tekstil',
    icon: '👕',
    description: 'Eski kiyim-kechak, paxta matolari, sanoat qiyqimlari',
    ratePerKg: 1200, // 1,200 so'm / kg
    ecoPointsPerKg: 5,
    pickupAvailable: true,
    acceptedSubtypes: ['Paxtali kiyimlar', 'To‘qimachilik qoldiqlari', 'Jinsi matolar'],
    unit: 'kg',
    color: '#EC4899' // pink
  }
];
