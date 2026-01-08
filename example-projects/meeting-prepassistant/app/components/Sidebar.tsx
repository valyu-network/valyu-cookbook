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
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40">
      <div className="bg-[var(--card)] rounded-full shadow-notion border border-[var(--border)] py-4 px-3 flex flex-col items-center gap-4">
        {/* Login/Avatar Section */}
        {!isSignedIn ? (
          <button
            onClick={onLoginClick}
            className="w-12 h-12 rounded-full bg-[var(--muted)] hover:bg-[var(--accent)] transition-notion flex items-center justify-center"
            aria-label="Sign in"
          >
            <svg
              className="w-6 h-6 text-[var(--muted-foreground)]"
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
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 rounded-full bg-[var(--primary)] hover:opacity-90 transition-notion flex items-center justify-center text-[var(--primary-foreground)] font-semibold overflow-hidden"
              aria-label="User menu"
            >
              {userAvatarUrl ? (
                <Image
                  src={userAvatarUrl}
                  alt="User avatar"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(userEmail || "")
              )}
            </button>

            {/* User menu dropdown */}
            {isOpen && (
              <div className="absolute left-16 top-0 bg-[var(--card)] rounded-lg shadow-notion border border-[var(--border)] py-2 min-w-[200px]">
                <div className="px-4 py-2 border-b border-[var(--border)]">
                  <p className="text-sm text-[var(--muted-foreground)]">Signed in as</p>
                  <p className="text-sm font-semibold text-[var(--foreground)] truncate">{userEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-[var(--accent-red)] hover:bg-[var(--accent-red-bg)] transition-notion flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="w-8 h-px bg-[var(--border)]" />

        {/* Valyu Logo */}
        <div className="w-12 h-12 rounded-lg bg-[var(--foreground)] flex items-center justify-center">
          <Image
              src="/nabla.png"
              alt="Home"
              width={28}
              height={28}
              className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
