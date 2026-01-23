'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, clearTokens, isAuthenticated, getRefreshToken } from '@/lib/auth';
import { authAPI } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Function to update username
    const updateUsername = () => {
      const user = getUser();
      setUsername(user?.username || null);
    };
    
    // Initial load
    updateUsername();
    
    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      updateUsername();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens(); // This will trigger authChange event
      setUsername(null); // Update local state immediately
      router.push('/login');
      router.refresh(); // Force refresh the page
    }
  };

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-base-100/95">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl gap-2">
          <span className="text-2xl">📋</span>
          <span className="font-bold">Task Manager</span>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {isAuthenticated() ? (
            <>
              <li>
                <Link href="/dashboard" className="btn btn-ghost gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tasks/new" className="btn btn-ghost gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Task
                </Link>
              </li>
              <li>
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-sm font-bold">{username?.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <span className="hidden sm:inline">{username}</span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300"
                  >
                    <li className="menu-title">
                      <span>Account</span>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-error gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="btn btn-ghost">Login</Link>
              </li>
              <li>
                <Link href="/register" className="btn btn-primary">Get Started</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

