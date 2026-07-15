import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../shared/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthenticated ? '/dashboard' : '/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  return (
    <>
      <Head>
        <title>ApplyLoop - Application Tracking Platform</title>
      </Head>
      <div className="min-h-screen bg-white dark:bg-gray-900" />
    </>
  );
}
