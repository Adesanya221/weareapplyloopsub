import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home(props) {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect handled in _app.js
    // This is just a fallback in case the redirection in _app.js doesn't work
    const timeout = setTimeout(() => {
      router.push(props.isAuthenticated ? '/dashboard' : '/auth/login');
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [props.isAuthenticated, router]);
  
  return (
    <>
      <Head>
        <title>ApplyLoop - Application Tracking Platform</title>
        <meta name="description" content="ApplyLoop helps job seekers track their applications, monitor progress, and stay in control." />
      </Head>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 rounded-full p-5 mb-8">
            <img
              src="/logo.svg"
              alt="ApplyLoop Logo"
              className="w-14 h-14 rounded-full object-cover select-none shadow-lg"
            />
          </div>
          
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome to ApplyLoop</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">The ultimate job application tracker</p>
          
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    </>
  );
}
