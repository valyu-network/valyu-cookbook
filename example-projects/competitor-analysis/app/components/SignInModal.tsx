'use client';

import { initiateOAuthFlow } from '@/lib/oauth';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const handleSignIn = () => {
    initiateOAuthFlow();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[var(--card-bg)] rounded-lg shadow-notion max-w-sm w-full p-6 relative border border-[var(--border-color)]">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)] transition-notion p-1 hover:bg-[var(--hover-bg)] rounded"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
              Sign in with Valyu
            </h2>

            <p className="text-sm text-[var(--foreground-secondary)] mb-5 leading-relaxed">
              Valyu powers our competitor analysis app with real-time access to comprehensive business intelligence.
            </p>

            {/* Free Credits Banner */}
            <div className="bg-[var(--accent-green-bg)] border border-[var(--accent-green)]/20 rounded-md p-3 mb-5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">🎁</span>
                <span className="text-sm font-medium text-[var(--accent-green)]">
                  $10 Free Credits
                </span>
              </div>
              <p className="text-xs text-[var(--accent-green)]/80">
                New accounts get $10 in free search credits. No credit card required.
              </p>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-medium py-2.5 px-4 rounded-md transition-notion flex items-center justify-center gap-2 mb-3 text-sm"
            >
              <span>Sign in with Valyu</span>
            </button>

            <p className="text-xs text-[var(--foreground-tertiary)]">
              Don't have an account? You can create one during sign-in.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
