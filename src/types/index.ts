export type UserRole = 'user' | 'collector' | 'recycler';

export type OrderStatus = 
  | 'created'              // 🟢 Buyurtma yaratildi
  | 'searching_collector'  // 🟡 Collector qidirilmoqda
  | 'collector_assigned'   // ⚪ Collector tayinlandi
  | 'on_the_way'           // ⚪ Yo‘lda
  | 'collected'            // ⚪ Chiqindi qabul qilindi
  | 'completed'            // ⚪ To‘lov amalga oshirildi
  | 'cancelled';           // 🔴 Bekor qilingan

export type PickupType = 'pickup' | 'dropoff'; // 'Uyimdan olib keting' | 'Qabul punktiga o‘zim olib boraman'

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: 'O‘zbekiston';
  region: string;
  district: string;
  mahalla?: string;
  street?: string;
  house?: string;
  apartment?: string;
  avatarUrl?: string;
  createdAt: string;
  role: UserRole;
  notificationsEnabled?: boolean;
}

export interface WasteCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  ratePerKg: number; // in UZS (so'm)
  ecoPointsPerKg: number;
  pickupAvailable: boolean;
  acceptedSubtypes: string[];
  unit: string;
  color: string;
}

export interface WasteOrderItem {
  categoryId: string;
  categoryName: string;
  weightKg: number;
  ratePerKg: number;
  estimatedTotal: number;
}

export interface WasteOrder {
  id: string; // e.g. "#EC-10284"
  userId: string;
  userName: string;
  userPhone: string;
  category: WasteCategory;
  weightKg: number;
  estimatedValue: number;
  finalValue?: number;
  pickupType: PickupType;
  address: {
    country: 'O‘zbekiston';
    region: string;
    district: string;
    mahalla?: string;
    street?: string;
    house?: string;
    apartment?: string;
    instructions?: string;
  };
  preferredDate: string;
  preferredTime: string;
  status: OrderStatus;
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  recyclingPointId?: string;
  recyclingPointName?: string;
  ecoPointsEarned?: number;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface RecyclingPoint {
  id: string;
  name: string;
  region: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  acceptedCategories: string[]; // category IDs
  unacceptedCategories: string[]; // category IDs
  openingHours: string;
  phone: string;
  distanceKm?: number;
  isPartner: boolean;
  rating: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'incoming' | 'withdrawal';
  amount: number;
  title: string;
  subtitle: string;
  category?: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod?: string;
  timestamp: string;
}

export interface EcoPointTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent';
  points: number;
  title: string;
  date: string;
}

export interface EcoReward {
  id: string;
  title: string;
  pointsCost: number;
  category: 'partner_discount' | 'telecom' | 'donation' | 'merchandise';
  discountText: string;
  provider: string;
  imageUrl?: string;
  description: string;
  terms: string;
  isAvailable: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'order' | 'wallet' | 'system' | 'point';
  orderId?: string;
}

export interface RecyclerMaterialStock {
  id: string;
  categoryId: string;
  categoryName: string;
  availableKg: number;
  marketPricePerKg: number;
  qualityGrade: 'A (Toza saralangan)' | 'B (Standart)' | 'C (Aralash)';
  warehouseLocation: string;
  minOrderKg: number;
}
