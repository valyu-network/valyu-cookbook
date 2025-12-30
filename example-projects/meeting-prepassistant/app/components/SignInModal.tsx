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

    // Build the OAuth URL using Supabase OAuth endpoints
    const supabaseUrl = process.env.NEXT_PUBLIC_VALYU_SUPABASE_URL;
    const clientId = process.env.NEXT_PUBLIC_VALYU_CLIENT_ID;

    // Check if environment variables are configured
    if (!supabaseUrl || !clientId) {
      console.error("OAuth environment variables not configured");
      alert("OAuth is not configured. Please contact support.");
      return;
    }

    const redirectUri = encodeURIComponent("https://meeting-prep.valyu.ai/auth/valyu/callback");

    // Construct OAuth URL with PKCE parameters
    const oauthUrl = `${supabaseUrl}/auth/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Redirect to Valyu OAuth
    window.location.href = oauthUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-modal-scale">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Sign in with Valyu
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 leading-relaxed">
            Valyu is the information backbone of Finance, giving our AI engine access to real-time financial data across markets, SEC filings, and research.
          </p>

          {/* Promotional Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-2xl">🎁</div>
              <div>
                <p className="font-semibold text-green-800 text-base mb-1">
                  $10 Free Credits
                </p>
                <p className="text-sm text-green-700">
                  New accounts get $10 in free search credits. No credit card required.
                </p>
              </div>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="w-full bg-black text-white rounded-lg py-3.5 px-6 font-semibold text-base hover:bg-gray-900 transition-colors flex items-center justify-center gap-3"
          >
            <span>Sign in with</span>
            <svg
              className="h-5"
              viewBox="0 0 71 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0.5H6.5L11.5 19.5L16.5 0.5H23L14.5 19.5H8.5L0 0.5Z"
                fill="white"
              />
              <path
                d="M31 0.5H37.5L42 19.5H36L35 15H29L28 19.5H22L31 0.5ZM34 11L32 4L30 11H34Z"
                fill="white"
              />
              <path
                d="M44 0.5H50V15H58V19.5H44V0.5Z"
                fill="white"
              />
              <path
                d="M60 0.5H66.5L71 10.5V0.5H66.5V19.5H60L55.5 9.5V19.5H60V0.5Z"
                fill="white"
              />
            </svg>
          </button>

          {/* Footer Text */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account? You can create one during sign-in.
          </p>
        </div>
      </div>
    </div>
  );
}
