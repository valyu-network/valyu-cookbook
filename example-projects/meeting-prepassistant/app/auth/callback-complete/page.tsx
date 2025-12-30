"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackComplete() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      // Handle error from OAuth provider
      if (error) {
        setStatus("error");
        setErrorMessage(getErrorMessage(error));
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      // Validate state for CSRF protection
      const storedState = sessionStorage.getItem("oauthState");
      if (state && storedState && state !== storedState) {
        setStatus("error");
        setErrorMessage("Invalid state parameter. Please try again.");
        sessionStorage.removeItem("oauthState");
        sessionStorage.removeItem("pkceCodeVerifier");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      if (!code) {
        setStatus("error");
        setErrorMessage("No authorization code received. Please try again.");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      // Get the code_verifier from sessionStorage
      const codeVerifier = sessionStorage.getItem("pkceCodeVerifier");
      if (!codeVerifier) {
        setStatus("error");
        setErrorMessage("PKCE code verifier not found. Please try again.");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      try {
        // Exchange code for tokens via our API route
        const response = await fetch("/api/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Token exchange failed:", errorData);
          throw new Error(errorData.error || "Token exchange failed");
        }

        const tokenData = await response.json();
        const { access_token, refresh_token, expires_in } = tokenData;

        // Store tokens in localStorage
        localStorage.setItem("valyuAccessToken", access_token);
        if (refresh_token) {
          localStorage.setItem("valyuRefreshToken", refresh_token);
        }
        if (expires_in) {
          const expiresAt = Date.now() + parseInt(expires_in) * 1000;
          localStorage.setItem("valyuTokenExpiresAt", expiresAt.toString());
        }

        // Clean up sessionStorage
        sessionStorage.removeItem("oauthState");
        sessionStorage.removeItem("pkceCodeVerifier");

        setStatus("success");

        // Redirect back to home page
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } catch (err) {
        console.error("Callback error:", err);
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Authentication failed");
        sessionStorage.removeItem("oauthState");
        sessionStorage.removeItem("pkceCodeVerifier");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case "access_denied":
        return "Access denied. You cancelled the authorization.";
      case "missing_parameters":
        return "Missing required parameters.";
      case "token_exchange_failed":
        return "Failed to exchange authorization code for token.";
      case "authentication_failed":
        return "Authentication failed. Please try again.";
      default:
        return `An error occurred: ${error}`;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md mx-auto px-4">
        {status === "processing" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-12 w-12 text-[#de5833]"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Completing sign in...
            </h2>
            <p className="text-gray-600">
              Please wait while we authenticate your account.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Successfully signed in!
            </h2>
            <p className="text-gray-600">Redirecting you back...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="h-12 w-12 text-red-500"
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
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Authentication Failed
            </h2>
            <p className="text-gray-600">{errorMessage}</p>
            <p className="text-sm text-gray-500">Redirecting you back...</p>
          </div>
        )}
      </div>
    </div>
  );
}
