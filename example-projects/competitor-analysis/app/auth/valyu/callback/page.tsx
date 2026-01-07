'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Handle OAuth errors
      if (error) {
        setStatus('error');
        setErrorMessage('Authorization failed. Please try again.');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        setErrorMessage('Invalid callback parameters.');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      // Validate state (CSRF protection)
      const storedState = sessionStorage.getItem('oauth_state');
      if (state !== storedState) {
        setStatus('error');
        setErrorMessage('Invalid state parameter. Possible CSRF attack.');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      // Get code verifier from storage
      const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
      if (!codeVerifier) {
        setStatus('error');
        setErrorMessage('Code verifier not found. Please try again.');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      try {
        // Exchange authorization code for access token
        const tokenResponse = await fetch('/api/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            codeVerifier,
          }),
        });

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          throw new Error(errorData.error || 'Token exchange failed');
        }

        const { access_token, user } = await tokenResponse.json();

        // Store user info in localStorage
        localStorage.setItem('valyu_user', JSON.stringify(user));
        localStorage.setItem('valyu_access_token', access_token);

        // Clean up session storage
        sessionStorage.removeItem('oauth_code_verifier');
        sessionStorage.removeItem('oauth_state');

        setStatus('success');

        // Redirect to home page
        setTimeout(() => {
          router.push('/?auth=success');
        }, 1000);
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
        setTimeout(() => router.push('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-notion p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="w-16 h-16 border-4 border-[var(--border-color)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Signing you in...
            </h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Please wait while we complete your authentication.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--accent-green-bg)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Success!
            </h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              Redirecting you to the app...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--accent-red-bg)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Authentication Failed
            </h2>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {errorMessage}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-notion p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-[var(--border-color)] border-t-[var(--primary)] rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <OAuthCallbackContent />
    </Suspense>
  );
}
