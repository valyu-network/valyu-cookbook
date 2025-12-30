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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Sign in with Valyu
            </h2>

            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Valyu powers our competitor analysis app with real-time access to comprehensive business intelligence, from market trends and SEC filings to competitive research and industry insights.
            </p>

            {/* Free Credits Banner */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🎁</span>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                  $10 Free Credits
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500">
                New accounts get $10 in free search credits. No credit card required.
              </p>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full bg-black dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-3 mb-4"
            >
              <span>Sign in with Valyu</span>
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account? You can create one during sign-in.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
