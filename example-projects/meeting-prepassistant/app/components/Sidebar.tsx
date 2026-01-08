"use client";

import { useState } from "react";
import Image from 'next/image';


interface SidebarProps {
  isSignedIn: boolean;
  userEmail?: string;
  userAvatarUrl?: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function Sidebar({ isSignedIn, userEmail, userAvatarUrl, onLoginClick, onLogoutClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get initials from email for avatar
  const getInitials = (email: string) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-1 bg-[var(--card)] border border-[var(--border)] rounded-lg p-2 shadow-notion-sm">
        {/* User Avatar (if logged in) or Lock Icon (if not logged in) */}
        <div className="relative">
          <button
            onClick={() => isSignedIn ? setIsOpen(!isOpen) : onLoginClick()}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[var(--muted)] transition-notion"
            aria-label={isSignedIn ? 'User menu' : 'Sign in with Valyu'}
          >
            {isSignedIn ? (
              userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  alt="User avatar"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-medium text-sm">
                  {getInitials(userEmail || "")}
                </div>
              )
            ) : (
              <svg
                className="w-5 h-5 text-[var(--muted-foreground)]"
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
          {isSignedIn && isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsOpen(false)}
              ></div>

              {/* Menu */}
              <div className="absolute left-full ml-2 top-0 w-56 bg-[var(--card)] rounded-lg shadow-notion border border-[var(--border)] overflow-hidden z-40">
                <div className="p-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    {userAvatarUrl ? (
                      <img
                        src={userAvatarUrl}
                        alt="User avatar"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] font-medium text-sm">
                        {getInitials(userEmail || "")}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--foreground)] truncate">
                        {userEmail?.split('@')[0]}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)] truncate">
                        {userEmail}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-[var(--accent-red)] hover:bg-[var(--muted)] transition-notion flex items-center gap-2"
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
        <div className="w-full h-px bg-[var(--border)] my-1"></div>

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
