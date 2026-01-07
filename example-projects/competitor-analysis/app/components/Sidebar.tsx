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

// Avatar component with error handling
function UserAvatar({ user, size = 'sm' }: { user: User; size?: 'sm' | 'md' }) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = size === 'sm'
    ? 'w-7 h-7 text-sm'
    : 'w-9 h-9 text-sm';

  if (user.picture && !imgError) {
    return (
      <img
        src={user.picture}
        alt={user.name || user.email}
        className={`${sizeClasses} rounded-full object-cover`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${sizeClasses} rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-medium`}>
      {user.email[0].toUpperCase()}
    </div>
  );
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
    <div className="fixed left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <div className="flex flex-col gap-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-2 shadow-notion-sm">
        {/* User Avatar (if logged in) or Lock Icon (if not logged in) */}
        <div className="relative">
          <button
            onClick={() => user ? setShowUserMenu(!showUserMenu) : onSignInClick()}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[var(--hover-bg)] transition-notion"
            aria-label={user ? 'User menu' : 'Sign in with Valyu'}
          >
            {user ? (
              <UserAvatar user={user} size="sm" />
            ) : (
              <svg
                className="w-5 h-5 text-[var(--foreground-secondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
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
              <div className="absolute left-full ml-2 top-0 w-56 bg-[var(--card-bg)] rounded-lg shadow-notion border border-[var(--border-color)] overflow-hidden z-40">
                <div className="p-3 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--foreground)] truncate">
                        {user.name || user.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-[var(--foreground-tertiary)] truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full px-3 py-2 text-left text-sm text-[#EB5757] hover:bg-[var(--hover-bg)] transition-notion flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[var(--border-color)] my-1"></div>

        {/* Valyu Logo - Home */}
        <a
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-md bg-black hover:bg-black/90 transition-notion"
          aria-label="Home"
        >
          <Image
              src="/nabla.png"
              alt="Home"
              width={22}
              height={22}
              className="rounded"
          />
        </a>
      </div>
    </div>
  );
}
