import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiBell, 
  FiMessageSquare, 
  FiGift, 
  FiGrid, 
  FiImage, 
  FiBarChart2, 
  FiStar, 
  FiSettings, 
  FiGlobe, 
  FiFileText, 
  FiShoppingBag,
  FiShoppingCart,
  FiList,
  FiUsers,
  FiPackage,
  FiUser,
  FiWifi,
  FiWifiOff
} from 'react-icons/fi';

import NotificationDropdown from './NotificationDropdown';
import ChatDropdown from './ChatDropdown';
import GiftNotificationDropdown from './GiftNotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import CartMini from './CartMini';
import VendorStatusBadge from './VendorStatusBadge';
import { useVendorProfile } from '../hooks/useVendorProfile';
import { useTheme } from '../hooks/useTheme';
import { useVendorStatus } from '../hooks/useVendorStatus';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, logout: logoutProp }) => {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { profileData } = useVendorProfile();
  const { isDarkMode } = useTheme();
  const { isOnline } = useVendorStatus();
  const { logout: authLogout } = useAuth();
  
  // Use the logout from props if available, otherwise use from AuthContext
  const handleLogout = () => {
    console.log("Logout called from DashboardLayout");
    if (typeof logoutProp === 'function') {
      logoutProp();
    } else if (typeof authLogout === 'function') {
      authLogout();
    } else {
      console.error("Logout function not available");
      // Fallback if logout prop is not available
      if (typeof window !== 'undefined') {
        localStorage.removeItem('orderlyAuthToken');
        router.push('/auth/login');
      }
    }
  };
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Navigation items
  const navItems = [
    { icon: FiGrid, label: 'Dashboard', href: '/dashboard' },
    { icon: FiImage, label: 'Menu Items', href: '/menu-items' },
    { icon: FiShoppingCart, label: 'Orders', href: '/orders' },
    { icon: FiList, label: 'Order List', href: '/order-list' },
    { icon: FiUsers, label: 'Customer List', href: '/customer-list' },
    { icon: FiPackage, label: 'Inventory', href: '/inventory' },
    { icon: FiBarChart2, label: 'Analytics', href: '/analytics' },
    { icon: FiStar, label: 'Reviews', href: '/reviews' },
    { icon: FiUser, label: 'My Profile', href: '/my-profile' },
    { icon: FiSettings, label: 'Settings', href: '/settings' },
    { icon: FiGlobe, label: 'Regions', href: '/regions' },
    { icon: FiFileText, label: 'Reports', href: '/reports' },
  ];
  
  // Mock notification data
  const notifications = [
    {
      type: 'order',
      message: 'New order received from John Doe',
      time: '2 minutes ago'
    },
    {
      type: 'customer',
      message: 'New customer registration',
      time: '5 minutes ago'
    },
    {
      type: 'message',
      message: 'New message from Sarah',
      time: '10 minutes ago'
    },
    {
      type: 'order',
      message: 'Order #1234 has been delivered',
      time: '15 minutes ago'
    }
  ];
  
  // Mock chat list data
  const chatList = [
    {
      id: 1,
      name: 'Archie Parker',
      isOnline: true,
      lastSeen: null,
      avatar: '/avatars/archie.jpg'
    },
    {
      id: 2,
      name: 'Alfie Mason',
      isOnline: false,
      lastSeen: '7 mins ago',
      avatar: '/avatars/alfie.jpg'
    },
    {
      id: 3,
      name: 'AharlieKane',
      isOnline: true,
      lastSeen: null,
      avatar: '/avatars/aharlie.jpg'
    },
    {
      id: 4,
      name: 'Athan Jacoby',
      isOnline: false,
      lastSeen: '30 mins ago',
      avatar: '/avatars/athan.jpg'
    }
  ];
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-[58px] bg-blue-600 dark:bg-blue-800 flex flex-col items-center py-4 text-white transition-all duration-300 hover:w-[180px] group">
        {/* Logo */}
        <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-8 transition-all">
          <FiShoppingBag className="text-blue-600 dark:text-blue-400 text-xl" />
        </div>
        
        {/* Navigation Icons */}
        <nav className="flex flex-col items-center space-y-6 w-full">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            
            return (
              <Link 
                key={index}
                href={item.href}
                className={`p-2 ${isActive ? 'bg-blue-700 dark:bg-blue-900' : 'hover:bg-blue-700 dark:hover:bg-blue-900'} rounded-lg transition-colors flex items-center w-full justify-center group-hover:justify-start group-hover:px-4`}
              >
                <Icon className="text-xl" />
                <span className="ml-3 hidden group-hover:block whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            {/* Page Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{router.pathname === '/' ? 'Dashboard' : router.pathname.substring(1).charAt(0).toUpperCase() + router.pathname.substring(1).slice(1).replace(/-/g, ' ')}</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Notification Icons */}
              <div className="flex items-center space-x-4">
                {/* Cart Mini Component */}
                <CartMini />
                
                {/* Notification Button */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen);
                      if (isChatOpen) setIsChatOpen(false);
                      if (isGiftOpen) setIsGiftOpen(false);
                    }}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-full transition-transform hover:scale-110"
                    aria-label="Notifications"
                  >
                    <FiBell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      12
                    </span>
                  </button>
                  <NotificationDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                    notifications={notifications}
                  />
                </div>
                
                {/* Chat Button */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsChatOpen(!isChatOpen);
                      if (isNotificationOpen) setIsNotificationOpen(false);
                      if (isGiftOpen) setIsGiftOpen(false);
                    }}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-full transition-transform hover:scale-110"
                    aria-label="Messages"
                  >
                    <FiMessageSquare className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      5
                    </span>
                  </button>
                  <ChatDropdown
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    chatList={chatList}
                  />
                </div>
                
                {/* Gift Button */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setIsGiftOpen(!isGiftOpen);
                      if (isNotificationOpen) setIsNotificationOpen(false);
                      if (isChatOpen) setIsChatOpen(false);
                    }}
                    className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-full transition-transform hover:scale-110"
                    aria-label="Gifts"
                  >
                    <FiGift className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      2
                    </span>
                  </button>
                  <GiftNotificationDropdown
                    isOpen={isGiftOpen}
                    onClose={() => setIsGiftOpen(false)}
                  />
                </div>
              </div>

              {/* User Profile */}
              <div className="relative">
                <div 
                  className="flex items-center cursor-pointer group"
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    if (isNotificationOpen) setIsNotificationOpen(false);
                    if (isChatOpen) setIsChatOpen(false);
                    if (isGiftOpen) setIsGiftOpen(false);
                  }}
                >
                  <span className="mr-4 text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {getGreeting()}
                      <span className="ml-2 inline-flex items-center">
                        <VendorStatusBadge isOnline={isOnline} />
                      </span>
                    </div>
                    <div className="text-md font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profileData.name || 'Setup Profile'}
                    </div>
                  </span>
                  <div className="h-12 w-12 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors overflow-hidden">
                    <img 
                      src={profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=random`} 
                      alt={profileData.name || 'User'}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        if (typeof window !== 'undefined') {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=random`;
                        }
                      }}
                    />
                  </div>
                </div>
                <ProfileDropdown
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onLogout={handleLogout}
                  userData={{
                    name: profileData.name || 'Setup Your Profile',
                    role: profileData.vendorName ? 'Manager at ' + profileData.vendorName : 'Restaurant Manager',
                    email: profileData.email || 'Add your email',
                    phone: profileData.phone || 'Add your phone',
                    avatar: profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=random`,
                    rating: profileData.averageRating || 0,
                    accountStatus: profileData.verificationStatus || 'Pending',
                    memberSince: profileData.memberSince || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto text-center text-gray-500 dark:text-gray-400 text-sm py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <p>Copyright © Designed & Developed by ignatius 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout; 