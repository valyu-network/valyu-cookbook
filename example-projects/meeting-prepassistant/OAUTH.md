# Valyu OAuth Integration

This document explains how the "Sign in with Valyu" OAuth 2.1 flow works in this application.

## Overview

The application uses OAuth 2.1 Authorization Code Flow with PKCE (Proof Key for Code Exchange) to authenticate users with their Valyu account. After authentication, users can generate meeting briefs using the Valyu API.

### What is PKCE?

PKCE is a security extension to OAuth 2.0 designed to prevent authorization code interception attacks. It works by:
1. Generating a random `code_verifier` before the OAuth flow
2. Creating a `code_challenge` from the `code_verifier` using SHA-256
3. Sending the `code_challenge` with the authorization request
4. Sending the original `code_verifier` with the token exchange request
5. The server verifies that `SHA-256(code_verifier)` matches the stored `code_challenge`

## OAuth Flow

### 1. User Initiates Sign-In

When a user tries to generate a meeting brief without being authenticated:

1. User enters a meeting topic and presses Enter
2. The app shows the "Sign in with Valyu" modal ([SignInModal.tsx](app/components/SignInModal.tsx))
3. User clicks "Sign in with VALYU" button

### 2. OAuth Authorization Request with PKCE

The modal redirects to Valyu's OAuth authorization endpoint:

```
https://[AUTH_URL]/auth/v1/oauth/authorize?
  client_id=[CLIENT_ID]&
  redirect_uri=&
  response_type=code&
  state=[RANDOM_STATE]&
  code_challenge=[CODE_CHALLENGE]&
  code_challenge_method=S256
```

Before redirecting, the app:
1. Stores the meeting topic in `sessionStorage` as `pendingMeetingTopic`
2. Generates a random `state` value for CSRF protection
3. Generates a 128-character random `code_verifier` (PKCE)
4. Creates a `code_challenge` by hashing the `code_verifier` with SHA-256
5. Stores the `code_verifier` in `sessionStorage` as `pkceCodeVerifier`
6. Includes the `code_challenge` and `code_challenge_method=S256` in the authorization URL

### 3. User Authorizes on Valyu Platform

The user is redirected to Valyu's platform where they:
- Sign in to their Valyu account (if not already signed in)
- Review the permissions requested by the app
- Authorize the application

### 4. OAuth Callback

After authorization, Valyu redirects back to:

```
?
  code=[AUTHORIZATION_CODE]&
  state=[STATE]
```

The callback is handled by [route.ts](app/auth/valyu/callback/route.ts) which:
1. Validates the `code` and `state` parameters
2. Redirects to `/auth/callback-complete` with the code and state

The callback-complete page ([page.tsx](app/auth/callback-complete/page.tsx)) then:
1. Retrieves the `code_verifier` from `sessionStorage`
2. Calls the `/api/auth/token` endpoint with the code and code_verifier
3. The API endpoint exchanges the code for tokens:

```
POST https://[AUTH_URL]/auth/v1/oauth/token
{
  "grant_type": "authorization_code",
  "code": "[AUTHORIZATION_CODE]",
  "redirect_uri": "https://meeting-prep.valyu.ai/auth/valyu/callback",
  "client_id": "[CLIENT_ID]",
  "client_secret": "[CLIENT_SECRET]",
  "code_verifier": "[CODE_VERIFIER]"
}
```

4. Receives the access token response:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

5. Returns the tokens to the callback-complete page

### 5. Token Storage

The callback completion page ([page.tsx](app/auth/callback-complete/page.tsx)):
1. Validates the state for CSRF protection
2. Stores tokens in `localStorage`:
   - `valyuAccessToken`: Access token for API requests
   - `valyuRefreshToken`: Refresh token (if provided)
   - `valyuTokenExpiresAt`: Token expiration timestamp
3. Redirects back to the home page

### 6. Continue Original Flow

Back on the home page ([MeetingPrepAssistant.tsx](app/components/MeetingPrepAssistant.tsx)):
1. The `useEffect` hook detects the user is now authenticated
2. Retrieves the pending meeting topic from `sessionStorage`
3. Automatically generates the meeting brief using the stored access token
4. Clears the pending topic from `sessionStorage`

## Environment Variables

Configure these in `.env.local`:

### Required Variables

```bash
# Valyu OAuth URL (for OAuth endpoints)
NEXT_PUBLIC_VALYU_AUTH_URL=https://auth.valyu.ai

# OAuth Client ID (safe for client-side)
NEXT_PUBLIC_VALYU_CLIENT_ID=your-client-id

# OAuth Client Secret (SERVER ONLY - never expose client-side)
VALYU_CLIENT_SECRET=your-client-secret

# Valyu Platform URL (for platform endpoints)
VALYU_APP_URL=https://platform.valyu.ai
```

### Getting OAuth Credentials

1. Go to [Valyu Platform](https://platform.valyu.ai)
2. Navigate to Settings → OAuth Apps
3. Create a new OAuth application
4. Configure the redirect URI: `https://meeting-prep.valyu.ai/auth/valyu/callback`
5. Copy the Client ID and Client Secret

## API Request Authentication

Once authenticated, all API requests to `/api/meeting-prep` include the access token:

```javascript
const response = await fetch("/api/meeting-prep", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  },
  body: JSON.stringify({ topic: topic.trim() }),
});
```

## Security Features

### PKCE (Proof Key for Code Exchange)
- Prevents authorization code interception attacks
- Random 128-character `code_verifier` generated for each OAuth flow
- `code_challenge` derived from `code_verifier` using SHA-256
- Server validates that the `code_verifier` matches the original `code_challenge`
- Stored in `sessionStorage` and cleared after use

### CSRF Protection
- Random `state` parameter is generated and validated
- Prevents cross-site request forgery attacks
- State is verified on callback to ensure the request originated from this app

### Token Security
- Client secret is only used server-side in the token exchange API route
- `code_verifier` is only sent during token exchange, never in URLs
- Access tokens are stored in `localStorage` (client-side only)
- Tokens are never exposed in URLs

### State Management
- Meeting topic stored in `sessionStorage` (cleared after use)
- OAuth state stored in `sessionStorage` (cleared after validation)
- PKCE `code_verifier` stored in `sessionStorage` (cleared after token exchange)
- Access tokens stored in `localStorage` (persists across sessions)

## Error Handling

The OAuth flow handles various error scenarios:

1. **User Denies Access**: Shows error message and redirects home
2. **Missing Parameters**: Validates code and state presence
3. **Token Exchange Failure**: Logs error and shows user-friendly message
4. **Invalid State**: Detects CSRF attempts and rejects the request
5. **Network Errors**: Catches and displays connection issues

## Development vs Production

### Local Development

For local development, you may need to update the redirect URI in:
- [SignInModal.tsx](app/components/SignInModal.tsx) (line 33)
- [route.ts](app/auth/valyu/callback/route.ts) (line 36)

Change from:
```typescript
const redirectUri = encodeURIComponent("https://meeting-prep.valyu.ai/auth/valyu/callback");
```

To:
```typescript
const redirectUri = encodeURIComponent("http://localhost:3000/auth/valyu/callback");
```

And add `http://localhost:3000/auth/valyu/callback` to your OAuth app's allowed redirect URIs.

### Production

Ensure all environment variables are set in your production environment and the production redirect URI is configured in your Valyu OAuth app settings.

## File Structure

```
app/
├── components/
│   ├── SignInModal.tsx           # OAuth initiation with PKCE
│   └── MeetingPrepAssistant.tsx  # Main component with auth logic
├── auth/
│   ├── valyu/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler (validates and redirects)
│   └── callback-complete/
│       └── page.tsx              # Token exchange and storage
└── api/
    ├── auth/
    │   └── token/
    │       └── route.ts          # Token exchange endpoint (with PKCE)
    └── meeting-prep/
        └── route.ts              # Meeting prep API (uses Bearer token)
```

## Troubleshooting

### "OAuth is not configured" Error
- Check that `NEXT_PUBLIC_VALYU_AUTH_URL` and `NEXT_PUBLIC_VALYU_CLIENT_ID` are set
- Ensure the variable names have the `NEXT_PUBLIC_` prefix for client-side access
- Restart the Next.js dev server after changing environment variables

### "Token exchange failed" Error
- Verify `VALYU_CLIENT_SECRET` is correct
- Check that the redirect URI matches exactly what's configured in OAuth app settings
- Review server logs for detailed error messages

### Infinite Redirect Loop
- Clear `sessionStorage` and `localStorage`
- Check that the state validation is working correctly
- Ensure the callback page is properly handling token storage

### "PKCE flow requires code_challenge" Error
- This means PKCE is required by the OAuth provider
- Ensure you're using the updated SignInModal that generates code_challenge
- Check browser console for any errors during PKCE generation
- Verify that crypto.subtle.digest is available (requires HTTPS or localhost)

### "PKCE code verifier not found" Error
- The code_verifier was not stored or was cleared from sessionStorage
- Don't clear browser data between authorization and callback
- Check if sessionStorage is working correctly in your browser

## Additional Resources

- [OAuth 2.1 Specification](https://oauth.net/2.1/)
- [Valyu Platform Documentation](https://platform.valyu.ai/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
