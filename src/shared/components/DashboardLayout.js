import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FiBell, 
  FiHome,
  FiCpu,
  FiCreditCard,
  FiTrendingUp,
  FiSettings,
  FiHelpCircle,
  FiSearch,
  FiUser,
  FiLogOut
} from 'react-icons/fi';

import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, logout: logoutProp }) => {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const { isDarkMode } = useTheme();
  const { user, logout: authLogout } = useAuth();
  
  // Use the logout from props if available, otherwise use from AuthContext
  const handleLogout = () => {
    console.log("Logout called from DashboardLayout");
    if (typeof logoutProp === 'function') {
      logoutProp();
    } else if (typeof authLogout === 'function') {
      authLogout();
    } else {
      console.error("Logout function not available");
      if (typeof window !== 'undefined') {
        localStorage.removeItem('orderlyAuthToken');
        router.push('/auth/login');
      }
    }
  };

  // Navigation items for ApplyLoop
  const navItems = [
    { icon: FiHome, label: 'Home', href: '/dashboard' },
    { icon: FiCpu, label: 'Loop Lab', href: '/loop-lab' },
    { icon: FiCreditCard, label: 'Billing and Subscription', href: '/billing' },
    { icon: FiTrendingUp, label: 'Growth', href: '/growth' },
    { icon: FiSettings, label: 'Settings', href: '/settings' },
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
      <div className="w-[280px] bg-white dark:bg-gray-800 flex flex-col justify-between py-6 border-r border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div>
          {/* Logo */}
          <div className="flex items-center px-6 mb-8 gap-3">
            <img
              src="/logo.svg"
              alt="ApplyLoop Logo"
              className="w-9 h-9 rounded-full object-cover select-none"
            />
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              ApplyLoop
            </span>
          </div>
          
          {/* Navigation links */}
          <nav className="flex flex-col space-y-1.5 px-3">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.href;
              
              return (
                <Link 
                  key={index}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm gap-3 ${
                    isActive 
                      ? 'bg-blue-50 text-primary dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom: Profile + Support */}
        <div className="px-3 space-y-4">
          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            {/* Profile with Sign Out dropdown */}
            <div className="relative">
              <div
                onClick={() => setShowSignOut(!showSignOut)}
                className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors gap-3"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256" 
                  alt="Olabanji David T." 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    Olabanji David T.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    banjidhevid216@gmail.com
                  </p>
                </div>
              </div>

              {/* Sign Out dropdown */}
              {showSignOut && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">banjidhevid216@gmail.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <Link 
              href="/support"
              className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-500 dark:text-gray-400 transition-colors gap-3 text-sm font-medium mt-1"
            >
              <FiHelpCircle className="text-lg" />
              <span>Support</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            {/* Page Title & Subtitle */}
            {(() => {
              const pageMeta = {
                '/dashboard': { title: 'Dashboard', sub: 'Track your applications, monitor progress, and stay in control of your job search.' },
                '/growth': { title: 'Career Growth', sub: 'Upskill with personalized course recommendations and track your progress.' },
                '/loop-lab': { title: 'Loop Lab', sub: 'Your personal interview preparation workspace.' },
                '/billing': { title: 'Billing & Subscription', sub: 'Manage your plan, billing, and application volume with ease.' },
                '/settings': { title: 'Settings', sub: 'Update your profile, preferences, and account details.' },
                '/notifications': { title: 'Notification', sub: 'Track your applications, monitor progress, and stay in control of your job search.' },
                '/applications/[id]': { title: 'Job Application', sub: 'Track your applications, monitor progress, and stay in control of your job search.' },
              };
              const meta = pageMeta[router.pathname] || {
                title: router.pathname.substring(1).replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
                sub: '',
              };
              return (
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{meta.title}</h1>
                  {meta.sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{meta.sub}</p>}
                </div>
              );
            })()}
            
            {/* Search and Notifications */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative w-80">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiSearch className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search Applications"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Notification Button */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2.5 text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl transition-all border border-gray-200 dark:border-gray-600 relative"
                  aria-label="Notifications"
                >
                  <FiBell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 bg-primary w-2 h-2 rounded-full"></span>
                </button>
                <NotificationDropdown
                  isOpen={isNotificationOpen}
                  onClose={() => setIsNotificationOpen(false)}
                  notifications={notifications}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-8 py-8 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 