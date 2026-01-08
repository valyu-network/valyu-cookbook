"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CallbackCompleteContent() {
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-notion p-8 text-center">
        {status === "processing" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="w-16 h-16 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Signing you in...
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Please wait while we complete your authentication.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--accent-green-bg)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Success!
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Redirecting you to the app...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-[var(--accent-red-bg)] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--accent-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Authentication Failed
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {errorMessage}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function CallbackComplete() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
          <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-notion p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="w-16 h-16 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <CallbackCompleteContent />
    </Suspense>
  );
}
