import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { HomeScreen } from './features/home/HomeScreen';
import { OrdersScreen } from './features/orders/OrdersScreen';
import { MapScreen } from './features/map/MapScreen';
import { WalletScreen } from './features/wallet/WalletScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { CollectorDashboard } from './features/collector/CollectorDashboard';
import { RecyclerDashboard } from './features/recycler/RecyclerDashboard';
import { CreateOrderModal } from './features/waste/CreateOrderModal';
import { OrderDetailsModal } from './features/orders/OrderDetailsModal';
import { NotificationModal } from './features/notifications/NotificationModal';
import { OnboardingModal } from './features/auth/OnboardingModal';
import { AppHeader } from './components/layout/AppHeader';
import { SidebarNav } from './components/layout/SidebarNav';
import { BottomNav } from './components/layout/BottomNav';

export const App: React.FC = () => {
  const { 
    activeRole, 
    orders 
  } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  const handleOpenOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  return (
    <div className="app-viewport-wrapper">
      
      {/* Main Container */}
      <div className="device-container mode-responsive">
        <div className="app-layout">
          
          {/* Tablet/Desktop Navigation Rail */}
          <SidebarNav 
            currentTab={currentTab} 
            onNavigate={(tab) => setCurrentTab(tab)} 
            onOpenCreateOrder={() => setIsCreateOrderOpen(true)} 
          />

          {/* App Core Container */}
          <main className="app-content">
            
            {/* Top Bar */}
            <AppHeader 
              onOpenNotifications={() => setIsNotifOpen(true)}
              onNavigate={(tab) => setCurrentTab(tab)}
            />

            {/* Dynamic Screen View according to Active Role & Tab */}
            {activeRole === 'collector' ? (
              <CollectorDashboard />
            ) : activeRole === 'recycler' ? (
              <RecyclerDashboard />
            ) : (
              <>
                {currentTab === 'home' && (
                  <HomeScreen 
                    onNavigate={(tab) => setCurrentTab(tab)} 
                    onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
                    onOpenOrderDetails={handleOpenOrderDetails}
                  />
                )}

                {currentTab === 'orders' && (
                  <OrdersScreen 
                    onOpenOrderDetails={handleOpenOrderDetails}
                    onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
                  />
                )}

                {currentTab === 'map' && (
                  <MapScreen 
                    onSelectDropoffPoint={() => {
                      setIsCreateOrderOpen(true);
                    }}
                  />
                )}

                {currentTab === 'wallet' && (
                  <WalletScreen />
                )}

                {currentTab === 'profile' && (
                  <ProfileScreen 
                    onOpenOnboarding={() => setIsOnboardingOpen(true)}
                  />
                )}
              </>
            )}

            {/* Mobile Bottom Navigation Bar */}
            <BottomNav 
              currentTab={currentTab}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
            />
          </main>

        </div>
      </div>

      {/* Modals & Overlays */}
      <CreateOrderModal 
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        onOrderCreated={(newId) => {
          setSelectedOrderId(newId);
          setCurrentTab('orders');
        }}
      />

      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
      />

      <NotificationModal 
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onOpenOrderDetails={handleOpenOrderDetails}
      />

      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

    </div>
  );
};
