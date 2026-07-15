import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../shared/context/AuthContext';

const AUTH_BG = {
  background: 'radial-gradient(ellipse at 50% 0%, #e4ecf9 0%, #f0f4fb 40%, #f8f9fd 100%)',
};

const LOGO = (
  <div className="flex items-center justify-center gap-3 mb-2">
    <img
      src="/logo.svg"
      alt="ApplyLoop Logo"
      className="w-10 h-10 rounded-full object-cover select-none"
    />
    <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">ApplyLoop</span>
  </div>
);

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();

  // Steps: 1 = email, 2 = recovery code, 3 = new password
  const [step, setStep] = useState(1);

  // Step 1
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  // Step 2
  const [recoveryCode, setRecoveryCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isLoadingCode, setIsLoadingCode] = useState(false);

  // Step 3
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isLoadingReset, setIsLoadingReset] = useState(false);

  // ──────────── Step 1: Submit email ────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setEmailError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Email is invalid'); return; }
    setEmailError('');
    setIsLoadingEmail(true);
    try {
      await requestPasswordReset(email);
    } catch (_) {}
    setIsLoadingEmail(false);
    setStep(2);
  };

  // ──────────── Step 2: Verify code ────────────
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!recoveryCode) { setCodeError('Recovery code is required'); return; }
    setCodeError('');
    setIsLoadingCode(true);
    // Simulate code verification
    await new Promise((r) => setTimeout(r, 800));
    setIsLoadingCode(false);
    setStep(3);
  };

  // ──────────── Step 3: Update password ────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    setIsLoadingReset(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoadingReset(false);
    // Redirect to login after success
    window.location.href = '/auth/login';
  };

  return (
    <>
      <Head>
        <title>Forgot Password | ApplyLoop</title>
        <meta name="description" content="Reset your ApplyLoop password" />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
        style={{ background: 'radial-gradient(100% 100% at 50% 0%, #EBF4FF 0%, #F9FAFB 100%)' }}
      >
        {/* ─── STEP 1: Enter Email ─── */}
        {step === 1 && (
          <div className="w-[494px] min-h-[612px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[18px] shadow-2xl p-10 flex flex-col justify-between transition-all">
            <div className="text-center space-y-6">
              {LOGO}
              <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                Please provide your email address below so we can send you a recovery code.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6 my-auto pt-6">
              <div>
                <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full px-4 py-3.5 border ${emailError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-[#1E50C3]'} rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="banjidhevid216@gmail.com"
                />
                {emailError && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{emailError}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoadingEmail}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold bg-[#1E50C3] hover:bg-[#1A45A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E50C3] shadow-lg shadow-blue-500/10 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoadingEmail ? 'Sending...' : 'Confirm'}
                </button>
              </div>
            </form>

            <div className="text-center pt-4">
              <Link href="/auth/login" className="text-sm font-medium text-gray-500 hover:text-[#1E50C3] dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Enter Recovery Code ─── */}
        {step === 2 && (
          <div className="w-[494px] min-h-[612px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[18px] shadow-2xl p-10 flex flex-col justify-between transition-all">
            <div className="text-center space-y-6">
              {LOGO}
              <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A code has been sent to{' '}
                <span className="font-bold text-gray-800 dark:text-gray-200">{email}</span>
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-6 my-auto pt-6">
              <div>
                <label htmlFor="recovery-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recovery Code
                </label>
                <input
                  id="recovery-code"
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  className={`block w-full px-4 py-3.5 border ${codeError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-[#1E50C3]'} rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Enter 6-digit code"
                />
                {codeError && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{codeError}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoadingCode}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold bg-[#1E50C3] hover:bg-[#1A45A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E50C3] shadow-lg shadow-blue-500/10 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoadingCode ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
            </form>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[#1E50C3] hover:text-[#1A45A7] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Change Email Address
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Update Password ─── */}
        {step === 3 && (
          <div className="w-[494px] min-h-[612px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[18px] shadow-2xl p-10 flex flex-col justify-between transition-all">
            <div className="text-center space-y-6">
              {LOGO}
              <h2 className="text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                Update password
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6 my-auto pt-6">
              {/* New Password */}
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`block w-full pl-4 pr-11 py-3.5 border ${passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-[#1E50C3]'} rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="***********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                  >
                    {showNew ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-4 pr-11 py-3.5 border ${passwordError ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-[#1E50C3]'} rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="***********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                  >
                    {showConfirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordError && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{passwordError}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoadingReset}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white font-semibold bg-[#1E50C3] hover:bg-[#1A45A7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E50C3] shadow-lg shadow-blue-500/10 dark:shadow-none hover:shadow-xl hover:shadow-blue-500/25 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoadingReset ? 'Updating...' : 'Confirm'}
                </button>
              </div>
            </form>
            
            <div className="text-center pt-4">
              <Link href="/auth/login" className="text-sm font-medium text-gray-500 hover:text-[#1E50C3] dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
