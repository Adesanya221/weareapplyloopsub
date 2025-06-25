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
        <title>Orderly - Restaurant Management Platform</title>
        <meta name="description" content="Orderly helps restaurants manage orders, menus, and customers efficiently." />
      </Head>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-blue-700 text-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full p-5 mb-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-12 h-12"
            >
              <path d="M17 8.5H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2Z" />
              <path d="M8 8.5V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v5.5" />
              <path d="M12 19v-7" />
              <path d="M8 15.5h8" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Welcome to Orderly</h1>
          <p className="text-xl text-white/80 mb-8">The all-in-one restaurant management platform</p>
          
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* Visual elements for design */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-blue-400 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-blue-800 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
    </>
  );
}
