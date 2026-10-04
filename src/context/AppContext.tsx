import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  UserRole, 
  WasteOrder, 
  WasteCategory, 
  RecyclingPoint, 
  Transaction, 
  EcoPointTransaction, 
  EcoReward, 
  NotificationItem, 
  RecyclerMaterialStock,
  OrderStatus 
} from '../types';
import { DEMO_USER, INITIAL_ORDERS, INITIAL_TRANSACTIONS, INITIAL_ECOPOINT_TRANSACTIONS, INITIAL_REWARDS, INITIAL_NOTIFICATIONS, INITIAL_RECYCLER_STOCK } from '../data/mockData';
import { INITIAL_WASTE_CATEGORIES } from '../data/wasteCategories';
import { INITIAL_RECYCLING_POINTS } from '../data/recyclingPoints';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  orders: WasteOrder[];
  wasteCategories: WasteCategory[];
  recyclingPoints: RecyclingPoint[];
  transactions: Transaction[];
  ecoPoints: number;
  balance: number;
  ecoPointTransactions: EcoPointTransaction[];
  rewards: EcoReward[];
  notifications: NotificationItem[];
  recyclerStock: RecyclerMaterialStock[];
  darkMode: boolean;
  devicePreview: 'responsive' | 'mobile' | 'tablet';
  unreadNotifsCount: number;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  setActiveRole: (role: UserRole) => void;
  createOrder: (orderData: Omit<WasteOrder, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => WasteOrder;
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus, finalWeight?: number, finalSumma?: number, note?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  withdrawFunds: (amount: number, paymentMethod: string, cardNumber: string) => boolean;
  redeemReward: (rewardId: string) => { success: boolean; message: string };
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  purchaseRecyclerStock: (stockId: string, quantityKg: number, companyName: string) => boolean;
  toggleDarkMode: () => void;
  setDevicePreview: (mode: 'responsive' | 'mobile' | 'tablet') => void;
  updateCategoryRate: (categoryId: string, newRate: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from LocalStorage or Fallback to Initial Data
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ecocycle_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ecocycle_auth') === 'true' || true; // default logged in with demo for instant access, but onboarding can be reset
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ecocycle_role') as UserRole) || 'user';
  });

  const [orders, setOrders] = useState<WasteOrder[]>(() => {
    const saved = localStorage.getItem('ecocycle_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>(() => {
    const saved = localStorage.getItem('ecocycle_categories');
    return saved ? JSON.parse(saved) : INITIAL_WASTE_CATEGORIES;
  });

  const [recyclingPoints, setRecyclingPoints] = useState<RecyclingPoint[]>(() => {
    const saved = localStorage.getItem('ecocycle_points');
    return saved ? JSON.parse(saved) : INITIAL_RECYCLING_POINTS;
  });

  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('ecocycle_balance');
    return saved ? Number(saved) : 24500;
  });

  const [ecoPoints, setEcoPoints] = useState<number>(() => {
    const saved = localStorage.getItem('ecocycle_points_total');
    return saved ? Number(saved) : 1240;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ecocycle_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [ecoPointTransactions, setEcoPointTransactions] = useState<EcoPointTransaction[]>(() => {
    const saved = localStorage.getItem('ecocycle_pt_transactions');
    return saved ? JSON.parse(saved) : INITIAL_ECOPOINT_TRANSACTIONS;
  });

  const [rewards, setRewards] = useState<EcoReward[]>(() => {
    const saved = localStorage.getItem('ecocycle_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ecocycle_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [recyclerStock, setRecyclerStock] = useState<RecyclerMaterialStock[]>(() => {
    const saved = localStorage.getItem('ecocycle_recycler_stock');
    return saved ? JSON.parse(saved) : INITIAL_RECYCLER_STOCK;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('ecocycle_dark_mode') === 'true';
  });

  const [devicePreview, setDevicePreview] = useState<'responsive' | 'mobile' | 'tablet'>('responsive');

  // Sync to local storage
  useEffect(() => {
    if (user) localStorage.setItem('ecocycle_user', JSON.stringify(user));
    localStorage.setItem('ecocycle_auth', String(isAuthenticated));
    localStorage.setItem('ecocycle_role', activeRole);
    localStorage.setItem('ecocycle_orders', JSON.stringify(orders));
    localStorage.setItem('ecocycle_balance', String(balance));
    localStorage.setItem('ecocycle_points_total', String(ecoPoints));
    localStorage.setItem('ecocycle_transactions', JSON.stringify(transactions));
    localStorage.setItem('ecocycle_notifications', JSON.stringify(notifications));
    localStorage.setItem('ecocycle_dark_mode', String(darkMode));
    localStorage.setItem('ecocycle_recycler_stock', JSON.stringify(recyclerStock));

    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user, isAuthenticated, activeRole, orders, balance, ecoPoints, transactions, notifications, darkMode, recyclerStock]);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const login = (newUser: User) => {
    const lockedUser: User = {
      ...newUser,
      country: 'O‘zbekiston'
    };
    setUser(lockedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const safeUpdate: User = {
      ...user,
      ...updatedData,
      country: 'O‘zbekiston' // Guarantee country cannot change
    };
    setUser(safeUpdate);
  };

  const createOrder = (orderData: Omit<WasteOrder, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): WasteOrder => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `#EC-${randomNum}`;
    const nowStr = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('uz-UZ') + ' ' + new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    const newOrder: WasteOrder = {
      ...orderData,
      id: newId,
      status: 'created',
      createdAt: nowStr,
      updatedAt: nowStr,
      statusHistory: [
        {
          status: 'created',
          timestamp: formattedDate,
          note: 'Buyurtma muvaffaqiyatli yaratildi'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Create system notification
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: user?.id || 'usr_ali_karimov',
      title: 'Yangi buyurtma qabul qilindi',
      message: `${newId} raqamli ${orderData.category.name} (${orderData.weightKg} kg) buyurtmangiz navbatga qo‘yildi.`,
      timestamp: 'Hozirgina',
      isRead: false,
      type: 'order',
      orderId: newId
    };
    setNotifications(prev => [newNotification, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    nextStatus: OrderStatus, 
    finalWeight?: number, 
    finalSumma?: number,
    note?: string
  ) => {
    const formattedDate = new Date().toLocaleDateString('uz-UZ') + ' ' + new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedHistory = [
        ...order.statusHistory,
        {
          status: nextStatus,
          timestamp: formattedDate,
          note: note || getStatusDefaultNote(nextStatus)
        }
      ];

      const updatedOrder: WasteOrder = {
        ...order,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        statusHistory: updatedHistory
      };

      if (finalWeight) updatedOrder.weightKg = finalWeight;
      if (finalSumma) updatedOrder.finalValue = finalSumma;

      // If status reaches completed, reward user with Balance & EcoPoints!
      if (nextStatus === 'completed') {
        const rewardAmount = finalSumma || order.estimatedValue;
        const pts = Math.round(order.weightKg * (order.category.ecoPointsPerKg || 10));
        
        setBalance(b => b + rewardAmount);
        setEcoPoints(p => p + pts);

        // Record Transaction
        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          userId: order.userId,
          type: 'incoming',
          amount: rewardAmount,
          title: `${order.category.name} topshirildi`,
          subtitle: `${order.id} • ${order.weightKg} kg`,
          category: order.category.name,
          status: 'success',
          timestamp: formattedDate
        };
        setTransactions(t => [newTx, ...t]);

        // Record Points Transaction
        const newPtTx: EcoPointTransaction = {
          id: `pt-${Date.now()}`,
          userId: order.userId,
          type: 'earned',
          points: pts,
          title: `${order.weightKg} kg ${order.category.name} uchun EcoPoints`,
          date: new Date().toLocaleDateString('uz-UZ')
        };
        setEcoPointTransactions(p => [newPtTx, ...p]);

        // Notification
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: order.userId,
          title: `${rewardAmount.toLocaleString('uz-UZ')} so‘m balansingizga qo‘shildi! 🎉`,
          message: `${order.id} buyurtmasi yakunlandi. Shuningdek, +${pts} EcoPoints berildi!`,
          timestamp: 'Hozirgina',
          isRead: false,
          type: 'wallet',
          orderId: order.id
        };
        setNotifications(n => [notif, ...n]);

        // Increase available stock for Recyclers
        setRecyclerStock(stocks => stocks.map(st => {
          if (st.categoryId === order.category.id) {
            return { ...st, availableKg: st.availableKg + order.weightKg };
          }
          return st;
        }));
      }

      return updatedOrder;
    }));
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'cancelled', undefined, undefined, reason || 'Buyurtma bekor qilindi');
  };

  const withdrawFunds = (amount: number, paymentMethod: string, cardNumber: string): boolean => {
    if (amount > balance || amount <= 0) return false;
    
    setBalance(b => b - amount);
    
    const formattedDate = new Date().toLocaleDateString('uz-UZ') + ' ' + new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    const maskedCard = cardNumber.length > 4 ? `(••${cardNumber.slice(-4)})` : '';

    const newTx: Transaction = {
      id: `tx-out-${Date.now()}`,
      userId: user?.id || 'usr_ali_karimov',
      type: 'withdrawal',
      amount: amount,
      title: 'Balansdan yechildi',
      subtitle: `${paymentMethod} ${maskedCard}`,
      paymentMethod: paymentMethod,
      status: 'success',
      timestamp: formattedDate
    };
    setTransactions(t => [newTx, ...t]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: user?.id || 'usr_ali_karimov',
      title: 'Pul yechish amalga oshirildi',
      message: `${amount.toLocaleString('uz-UZ')} so‘m ${paymentMethod} kartasiga muvaffaqiyatli o‘tkazildi.`,
      timestamp: 'Hozirgina',
      isRead: false,
      type: 'wallet'
    };
    setNotifications(n => [notif, ...n]);

    return true;
  };

  const redeemReward = (rewardId: string): { success: boolean; message: string } => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, message: 'Mukofot topilmadi' };
    if (ecoPoints < reward.pointsCost) {
      return { success: false, message: `EcoPoints yetarli emas. Sizda ${ecoPoints} ball bor, kerak: ${reward.pointsCost} ball.` };
    }

    setEcoPoints(p => p - reward.pointsCost);

    const ptTx: EcoPointTransaction = {
      id: `pt-spend-${Date.now()}`,
      userId: user?.id || 'usr_ali_karimov',
      type: 'spent',
      points: reward.pointsCost,
      title: `${reward.title} xarid qilindi`,
      date: new Date().toLocaleDateString('uz-UZ')
    };
    setEcoPointTransactions(p => [ptTx, ...p]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: user?.id || 'usr_ali_karimov',
      title: 'Mukofot faollashtirildi! 🎁',
      message: `${reward.title} muvaffaqiyatli olindi. Promokod / vaucher profilingizda saqlandi.`,
      timestamp: 'Hozirgina',
      isRead: false,
      type: 'point'
    };
    setNotifications(n => [notif, ...n]);

    return { success: true, message: `Tabriklaymiz! "${reward.title}" mukofoti hisobingizga biriktirildi.` };
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const purchaseRecyclerStock = (stockId: string, quantityKg: number, companyName: string): boolean => {
    const stock = recyclerStock.find(s => s.id === stockId);
    if (!stock || stock.availableKg < quantityKg) return false;

    setRecyclerStock(stocks => stocks.map(st => {
      if (st.id === stockId) {
        return { ...st, availableKg: st.availableKg - quantityKg };
      }
      return st;
    }));

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: user?.id || 'usr_ali_karimov',
      title: 'Qayta ishlash xaridi tasdiqlandi 🏭',
      message: `${companyName} tomonidan ${quantityKg} kg ${stock.categoryName} omborxonadan xarid qilindi.`,
      timestamp: 'Hozirgina',
      isRead: false,
      type: 'system'
    };
    setNotifications(n => [notif, ...n]);
    return true;
  };

  const toggleDarkMode = () => {
    setDarkMode(d => !d);
  };

  const updateCategoryRate = (categoryId: string, newRate: number) => {
    setWasteCategories(cats => cats.map(c => c.id === categoryId ? { ...c, ratePerKg: newRate } : c));
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      activeRole,
      orders,
      wasteCategories,
      recyclingPoints,
      transactions,
      ecoPoints,
      balance,
      ecoPointTransactions,
      rewards,
      notifications,
      recyclerStock,
      darkMode,
      devicePreview,
      unreadNotifsCount,
      login,
      logout,
      updateProfile,
      setActiveRole,
      createOrder,
      updateOrderStatus,
      cancelOrder,
      withdrawFunds,
      redeemReward,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      purchaseRecyclerStock,
      toggleDarkMode,
      setDevicePreview,
      updateCategoryRate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function getStatusDefaultNote(status: OrderStatus): string {
  switch (status) {
    case 'created': return 'Buyurtma yaratildi';
    case 'searching_collector': return 'Yaqin hududdagi collector qidirilmoqda';
    case 'collector_assigned': return 'Collector buyurtmani qabul qildi va biriktirildi';
    case 'on_the_way': return 'Collector belgilangan manzilga yo‘l oldi';
    case 'collected': return 'Chiqindi tekshirildi va qabul qilindi';
    case 'completed': return 'To‘lov amalga oshirildi va buyurtma yakunlandi';
    case 'cancelled': return 'Buyurtma bekor qilindi';
  }
}
