import { User, WasteOrder, Transaction, EcoPointTransaction, EcoReward, NotificationItem, RecyclerMaterialStock } from '../types';
import { INITIAL_WASTE_CATEGORIES } from './wasteCategories';

export const DEMO_USER: User = {
  id: 'usr_ali_karimov',
  firstName: 'Ali',
  lastName: 'Karimov',
  phone: '+998 90 123-45-67',
  country: 'O‘zbekiston',
  region: 'Xorazm viloyati',
  district: 'Urganch shahri',
  mahalla: 'Al-Xorazmiy mahallasi',
  street: 'Istiqlol ko‘chasi',
  house: '28-uy',
  apartment: '14-xonadon',
  avatarUrl: '',
  createdAt: '2026-01-15T10:00:00Z',
  role: 'user'
};

export const INITIAL_ORDERS: WasteOrder[] = [
  {
    id: '#EC-10284',
    userId: 'usr_ali_karimov',
    userName: 'Ali Karimov',
    userPhone: '+998 90 123-45-67',
    category: INITIAL_WASTE_CATEGORIES[0], // Plastik
    weightKg: 10,
    estimatedValue: 25000,
    finalValue: 25000,
    pickupType: 'pickup',
    address: {
      country: 'O‘zbekiston',
      region: 'Xorazm viloyati',
      district: 'Urganch shahri',
      mahalla: 'Al-Xorazmiy mahallasi',
      street: 'Istiqlol ko‘chasi',
      house: '28-uy',
      apartment: '14-xonadon',
      instructions: 'Dom oldida kuting, qo‘ng‘iroq qiling'
    },
    preferredDate: '2026-10-04',
    preferredTime: '14:00 – 16:00',
    status: 'completed',
    collectorId: 'col_01',
    collectorName: 'Jasur Beknazarov',
    collectorPhone: '+998 93 777-10-20',
    ecoPointsEarned: 100,
    createdAt: '2026-10-04T09:30:00Z',
    updatedAt: '2026-10-04T15:45:00Z',
    statusHistory: [
      { status: 'created', timestamp: '04.10.2026 09:30', note: 'Buyurtma tizimda ro‘yxatdan o‘tdi' },
      { status: 'searching_collector', timestamp: '04.10.2026 09:35', note: 'Hududdagi collectorlarga bildirishnoma yuborildi' },
      { status: 'collector_assigned', timestamp: '04.10.2026 10:10', note: 'Collector Jasur B. buyurtmani qabul qildi' },
      { status: 'on_the_way', timestamp: '04.10.2026 14:15', note: 'Collector manzilingizga yo‘l oldi' },
      { status: 'collected', timestamp: '04.10.2026 14:40', note: 'Chiqindi qabul qilindi, aniq vazn: 10 kg' },
      { status: 'completed', timestamp: '04.10.2026 15:45', note: '25 000 so‘m hisobingizga o‘tkazildi' }
    ]
  },
  {
    id: '#EC-10291',
    userId: 'usr_ali_karimov',
    userName: 'Ali Karimov',
    userPhone: '+998 90 123-45-67',
    category: INITIAL_WASTE_CATEGORIES[1], // Karton
    weightKg: 15,
    estimatedValue: 27000,
    pickupType: 'pickup',
    address: {
      country: 'O‘zbekiston',
      region: 'Xorazm viloyati',
      district: 'Urganch shahri',
      mahalla: 'Al-Xorazmiy mahallasi',
      street: 'Istiqlol ko‘chasi',
      house: '28-uy',
      apartment: '14-xonadon',
      instructions: 'Katta qutilar bog‘lab qo‘yilgan'
    },
    preferredDate: '2026-10-05',
    preferredTime: '10:00 – 12:00',
    status: 'on_the_way',
    collectorId: 'col_01',
    collectorName: 'Jasur Beknazarov',
    collectorPhone: '+998 93 777-10-20',
    createdAt: '2026-10-04T16:00:00Z',
    updatedAt: '2026-10-04T16:45:00Z',
    statusHistory: [
      { status: 'created', timestamp: '04.10.2026 16:00', note: 'Buyurtma yaratildi' },
      { status: 'searching_collector', timestamp: '04.10.2026 16:05', note: 'Yaqin oradagi mashina qidirilmoqda' },
      { status: 'collector_assigned', timestamp: '04.10.2026 16:20', note: 'Collector biriktirildi' },
      { status: 'on_the_way', timestamp: '04.10.2026 16:45', note: 'Collector mashinada yo‘lga chiqdi' }
    ]
  },
  {
    id: '#EC-10305',
    userId: 'usr_ali_karimov',
    userName: 'Ali Karimov',
    userPhone: '+998 90 123-45-67',
    category: INITIAL_WASTE_CATEGORIES[3], // Metall
    weightKg: 5,
    estimatedValue: 21000,
    pickupType: 'dropoff',
    address: {
      country: 'O‘zbekiston',
      region: 'Xorazm viloyati',
      district: 'Urganch shahri',
      mahalla: 'Markaziy bozor',
      street: 'Al-Xorazmiy ko‘chasi',
      house: '42-uy'
    },
    preferredDate: '2026-10-06',
    preferredTime: '09:00 – 18:00',
    status: 'created',
    recyclingPointId: 'rp-urganch-1',
    recyclingPointName: 'EcoCycle Markaziy Qabul Punkti — Urganch',
    createdAt: '2026-10-04T16:50:00Z',
    updatedAt: '2026-10-04T16:50:00Z',
    statusHistory: [
      { status: 'created', timestamp: '04.10.2026 16:50', note: 'Qabul punktiga tashrif buyurtmasi yaratildi' }
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    userId: 'usr_ali_karimov',
    type: 'incoming',
    amount: 25000,
    title: 'Plastik topshirildi',
    subtitle: '#EC-10284 • 10 kg',
    category: 'Plastik',
    status: 'success',
    timestamp: '04.10.2026 15:45'
  },
  {
    id: 'tx-002',
    userId: 'usr_ali_karimov',
    type: 'incoming',
    amount: 19500,
    title: 'Karton topshirildi',
    subtitle: '#EC-10112 • 13 kg',
    category: 'Karton',
    status: 'success',
    timestamp: '01.10.2026 11:20'
  },
  {
    id: 'tx-003',
    userId: 'usr_ali_karimov',
    type: 'withdrawal',
    amount: 20000,
    title: 'Balansdan yechildi',
    subtitle: 'Uzcard / Humo (••4821)',
    paymentMethod: 'Payme / Uzcard',
    status: 'success',
    timestamp: '29.09.2026 18:05'
  },
  {
    id: 'tx-004',
    userId: 'usr_ali_karimov',
    type: 'incoming',
    amount: 21000,
    title: 'Metall topshirildi',
    subtitle: '#EC-09940 • 5 kg',
    category: 'Metall',
    status: 'success',
    timestamp: '25.09.2026 14:10'
  }
];

export const INITIAL_ECOPOINT_TRANSACTIONS: EcoPointTransaction[] = [
  {
    id: 'pt-001',
    userId: 'usr_ali_karimov',
    type: 'earned',
    points: 100,
    title: '10 kg Plastik topshirish uchun',
    date: '04.10.2026'
  },
  {
    id: 'pt-002',
    userId: 'usr_ali_karimov',
    type: 'earned',
    points: 140,
    title: 'Karton va Qog‘oz topshirish bonusi',
    date: '01.10.2026'
  },
  {
    id: 'pt-003',
    userId: 'usr_ali_karimov',
    type: 'earned',
    points: 1000,
    title: 'EcoCycle faol ekologi mukofoti',
    date: '20.09.2026'
  }
];

export const INITIAL_REWARDS: EcoReward[] = [
  {
    id: 'rew-1',
    title: 'Uzum Market 30 000 so‘m vaucher',
    pointsCost: 500,
    category: 'partner_discount',
    discountText: '30 000 so‘m chegirma',
    provider: 'Uzum Market',
    description: 'Har qanday ekologik va maishiy mahsulotlar uchun 30 000 so‘mlik promokod.',
    terms: 'Buyurtma summasi 100 000 so‘mdan oshganda amal qiladi.',
    isAvailable: true
  },
  {
    id: 'rew-2',
    title: 'EcoCycle Maxsus Paxta Xaltasi (Eco-Bag)',
    pointsCost: 800,
    category: 'merchandise',
    discountText: '100% Bepul',
    provider: 'EcoCycle',
    description: '100% tabiiy paxtadan tayyorlangan ko‘p martalik sifatli eko-sumka.',
    terms: 'Keyingi pickup vaqtida collector bepul topshiradi.',
    isAvailable: true
  },
  {
    id: 'rew-3',
    title: '“Yashil Makon” — 1 dona ko‘chat ekish',
    pointsCost: 400,
    category: 'donation',
    discountText: 'Xayriya sertifikati',
    provider: 'Yashil Makon Fondi',
    description: 'Sizning nomingizdan O‘zbekiston hududida 1 tup mevali yoki manzarali daraxt ekiladi.',
    terms: 'Sertifikat profilingizga yuklanadi va geo-lokatsiya yuboriladi.',
    isAvailable: true
  },
  {
    id: 'rew-4',
    title: 'Beeline / Ucell / Mobiuz 20 000 so‘m to‘lov',
    pointsCost: 650,
    category: 'telecom',
    discountText: 'Balansga 20 000 so‘m',
    provider: 'Mobil aloqa',
    description: 'O‘zbekiston uyali aloqa operatorlaridan birining hisobiga to‘g‘ridan-to‘g‘ri to‘lov.',
    terms: 'Raqam 1 daqiqa ichida to‘ldiriladi.',
    isAvailable: true
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr_ali_karimov',
    title: 'Collector buyurtmangizni qabul qildi',
    message: 'Collector Jasur Beknazarov sizning #EC-10291 raqamli buyurtmangizni oldi va yo‘lga chiqdi.',
    timestamp: '15 daqiqa oldin',
    isRead: false,
    type: 'order',
    orderId: '#EC-10291'
  },
  {
    id: 'notif-2',
    userId: 'usr_ali_karimov',
    title: '25 000 so‘m balansingizga qo‘shildi! 🎉',
    message: '#EC-10284 buyurtmangiz muvaffaqiyatli qabul qilindi va hisobingiz to‘ldirildi.',
    timestamp: '2 soat oldin',
    isRead: false,
    type: 'wallet',
    orderId: '#EC-10284'
  },
  {
    id: 'notif-3',
    userId: 'usr_ali_karimov',
    title: 'Ertaga qabul punktlari 08:00 da ochiladi',
    message: 'Urganch shahridagi Markaziy Eko-Punkt barcha chiqindi turlarini qabul qilishga tayyor.',
    timestamp: '1 kun oldin',
    isRead: true,
    type: 'system'
  }
];

export const INITIAL_RECYCLER_STOCK: RecyclerMaterialStock[] = [
  {
    id: 'rec-mat-1',
    categoryId: 'plastic',
    categoryName: 'Plastik (PET & HDPE)',
    availableKg: 500,
    marketPricePerKg: 3200,
    qualityGrade: 'A (Toza saralangan)',
    warehouseLocation: 'Urganch Eko-Omborxona #1',
    minOrderKg: 100
  },
  {
    id: 'rec-mat-2',
    categoryId: 'cardboard',
    categoryName: 'Karton (Gofrokarton)',
    availableKg: 800,
    marketPricePerKg: 2400,
    qualityGrade: 'A (Toza saralangan)',
    warehouseLocation: 'Urganch Eko-Omborxona #1',
    minOrderKg: 200
  },
  {
    id: 'rec-mat-3',
    categoryId: 'metal',
    categoryName: 'Metall (Alyuminiy & Po‘lat)',
    availableKg: 200,
    marketPricePerKg: 5800,
    qualityGrade: 'B (Standart)',
    warehouseLocation: 'Urganch Eko-Omborxona #2',
    minOrderKg: 50
  },
  {
    id: 'rec-mat-4',
    categoryId: 'glass',
    categoryName: 'Shisha (Shaffof va rangli)',
    availableKg: 350,
    marketPricePerKg: 950,
    qualityGrade: 'B (Standart)',
    warehouseLocation: 'Urganch Eko-Omborxona #1',
    minOrderKg: 100
  }
];
