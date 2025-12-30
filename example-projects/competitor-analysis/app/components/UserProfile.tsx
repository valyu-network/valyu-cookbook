'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('valyu_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('valyu_user');
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('valyu_user');
    localStorage.removeItem('valyu_access_token');
    setUser(null);
    setShowMenu(false);
    window.location.href = '/';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || user.email}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {user.email[0].toUpperCase()}
            </div>
          )}
          <div className="text-left hidden sm:block">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {user.name || user.email.split('@')[0]}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {user.email}
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${showMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            ></div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || user.email}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                      {user.email[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user.name || user.email.split('@')[0]}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                    {user.email_verified && (
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
