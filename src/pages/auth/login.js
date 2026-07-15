import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useTheme } from '../../shared/hooks/useTheme';
import { useAuth } from '../../shared/context/AuthContext';
import { initializeGoogleSignIn, renderGoogleButton } from '../../shared/utils/googleAuth';

export default function Login() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { login, loginWithGoogle, error } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const googleButtonRef = useRef(null);

  // Initialize Google Sign-In
  useEffect(() => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (googleClientId && googleButtonRef.current) {
      const handleGoogleResponse = async (response) => {
        try {
          setIsLoading(true);
          setLoginError('');
          
          const result = await loginWithGoogle(response);
          
          if (result.success) {
            console.log('Google authentication successful');
          } else {
            setLoginError(result.error || 'Google authentication failed');
          }
        } catch (error) {
          console.error('Google login error:', error);
          setLoginError(error.message || 'Google authentication failed');
        } finally {
          setIsLoading(false);
        }
      };

      initializeGoogleSignIn(handleGoogleResponse).then(() => {
        renderGoogleButton('google-signin-button');
      });
    }
  }, [loginWithGoogle]);

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await login({ email, password });
      
      if (!result.success) {
        setLoginError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | ApplyLoop</title>
        <meta name="description" content="Login to your ApplyLoop account" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300" 
           style={{ background: 'radial-gradient(100% 100% at 50% 0%, #EBF4FF 0%, #F9FAFB 100%)' }}>
        <div className="w-[494px] min-h-[612px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[18px] shadow-2xl p-10 flex flex-col justify-between transition-all">
          {/* Header & Logo */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/logo.svg"
                alt="ApplyLoop Logo"
                className="w-10 h-10 rounded-full object-cover select-none"
              />
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                ApplyLoop
              </span>
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
              Welcome back!
            </h2>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 my-auto pt-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full px-4 py-3.5 border ${
                  formErrors.email 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-700 focus:ring-[#1E50C3] focus:border-transparent'
                } rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                placeholder="banjidhevid216@gmail.com"
              />
              {formErrors.email && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-4 pr-11 py-3.5 border ${
                    (formErrors.password || loginError || error)
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 dark:border-gray-700 focus:ring-[#1E50C3] focus:border-transparent'
                  } rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all`}
                  placeholder="*********"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                >
                  {isPasswordVisible ? (
                    <FiEyeOff className="h-5 w-5" />
                  ) : (
                    <FiEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {(formErrors.password || loginError || error) && (
                <div className="flex items-center gap-1.5 mt-2 text-red-600 dark:text-red-400 text-xs">
                  <FiAlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.password || loginError || error}</span>
                </div>
              )}
            </div>

            {/* Login Button or Spinner */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold bg-[#1E50C3] hover:bg-[#1A45A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E50C3] shadow-lg shadow-blue-500/10 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
          
          {/* Footer Link */}
          <div className="text-center pt-4">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm font-medium text-gray-500 hover:text-[#1E50C3] dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}