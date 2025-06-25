import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../shared/context/AuthContext';
import AppProvider from '../shared/context/AppProvider';

// Authentication wrapper component to handle redirects
const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const path = router.pathname;
      const isAuthPage = path.startsWith('/auth/');
      
      // If not authenticated and not on an auth page, redirect to login
      if (!isAuthenticated && !isAuthPage && path !== '/') {
        router.push('/auth/login');
      }
      
      // If authenticated and on an auth page, redirect to dashboard
      if (isAuthenticated && isAuthPage) {
        router.push('/dashboard');
      }

      // Redirect root to login if not authenticated, dashboard if authenticated
      if (path === '/') {
        router.push(isAuthenticated ? '/dashboard' : '/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Add animation keyframes for dropdown
  useEffect(() => {
    // Add animation keyframes to head if they don't exist
    if (typeof window !== 'undefined' && !document.querySelector('#custom-animations')) {
      const style = document.createElement('style');
      style.id = 'custom-animations';
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (isLoading) {
    // Show loading spinner during authentication check
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
};

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <AuthProvider>
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </AuthProvider>
    </AppProvider>
  );
}
