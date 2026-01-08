"use client";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
}

// Helper function to generate a random string for PKCE
function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(x => charset[x % charset.length])
    .join('');
}

// Helper function to create SHA-256 hash and encode as base64url
async function sha256(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(hash);
}

// Helper function to base64url encode
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default function SignInModal({ isOpen, onClose, topic }: SignInModalProps) {
  if (!isOpen) return null;

  const handleSignIn = async () => {
    // Store the topic in sessionStorage so we can continue after OAuth
    if (topic) {
      sessionStorage.setItem("pendingMeetingTopic", topic);
    }

    // Generate a random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("oauthState", state);

    // Generate PKCE code_verifier and code_challenge
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await sha256(codeVerifier);

    // Store code_verifier for later use in token exchange
    sessionStorage.setItem("pkceCodeVerifier", codeVerifier);

    // Build the OAuth URL
    const authUrl = process.env.NEXT_PUBLIC_VALYU_AUTH_URL;
    const clientId = process.env.NEXT_PUBLIC_VALYU_CLIENT_ID;
    const redirectUriEnv = process.env.NEXT_PUBLIC_REDIRECT_URI;

    // Check if environment variables are configured
    if (!authUrl || !clientId || !redirectUriEnv) {
      console.error("OAuth environment variables not configured");
      alert("OAuth is not configured. Please contact support.");
      return;
    }

    const redirectUri = encodeURIComponent(redirectUriEnv);

    // Construct OAuth URL with PKCE parameters
    const oauthUrl = `${authUrl}/auth/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Redirect to Valyu OAuth
    window.location.href = oauthUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--card)] rounded-lg shadow-notion max-w-sm w-full p-6 animate-modal-scale border border-[var(--border)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-notion p-1 hover:bg-[var(--muted)] rounded"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Title */}
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-3">
            Sign in with Valyu
          </h2>

          {/* Description */}
          <p className="text-sm text-[var(--muted-foreground)] mb-5 leading-relaxed">
            Valyu powers our Meeting prep, giving our app real-time access to comprehensive web data, and research from proprietary data sources.
          </p>

          {/* Promotional Banner */}
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
            className="w-full bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] font-medium py-2.5 px-4 rounded-md transition-notion flex items-center justify-center gap-2 mb-3 text-sm"
          >
            <span>Sign in with Valyu</span>
          </button>

          {/* Footer Text */}
          <p className="text-xs text-[var(--muted-foreground)]">
            Don't have an account? You can create one during sign-in.
          </p>
        </div>
      </div>
    </div>
  );
}
