'use client';

import { useState } from 'react';
import Image from 'next/image';


interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}

interface SidebarProps {
  onSignInClick: () => void;
  user: User | null;
}

export default function Sidebar({ onSignInClick, user }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('valyu_user');
    localStorage.removeItem('valyu_access_token');
    setShowUserMenu(false);
    window.location.href = '/';
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full p-4 shadow-lg">
        {/* User Avatar (if logged in) or Lock Icon (if not logged in) */}
        <div className="relative">
          <button
            onClick={() => user ? setShowUserMenu(!showUserMenu) : onSignInClick()}
            className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
            aria-label={user ? 'User menu' : 'Sign in with Valyu'}
          >
            {user ? (
              user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || user.email}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-600 dark:group-hover:ring-blue-400 transition-all"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-transparent group-hover:ring-blue-600 dark:group-hover:ring-blue-400 transition-all">
                  {user.email[0].toUpperCase()}
                </div>
              )
            ) : (
              <svg
                className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
          </button>

          {/* User dropdown menu */}
          {user && showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowUserMenu(false)}
              ></div>

              {/* Menu */}
              <div className="absolute left-full ml-4 top-0 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-40">
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

        {/* Divider */}
        <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

        {/* Valyu Logo - Home */}
        <a
          href="/"
          className="w-14 h-14 flex items-center justify-center rounded-xl bg-black dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors group"
          aria-label="Home"
        >
          <Image
              src="/nabla.png"
              alt="Home"
              width={28}
              height={28}
              className="rounded-lg"
          />
        </a>
      </div>
    </div>
  );
}
