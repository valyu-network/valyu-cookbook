import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth error
  if (error) {
    const errorParam = errorDescription
      ? `${error}: ${errorDescription}`
      : error;
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(errorParam)}`, request.url)
    );
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/?error=missing_parameters", request.url)
    );
  }

  // Pass the code and state to the callback-complete page
  // The client-side page will retrieve the code_verifier from sessionStorage
  // and complete the token exchange
  const callbackUrl = new URL("/auth/callback-complete", request.url);
  callbackUrl.searchParams.set("code", code);
  callbackUrl.searchParams.set("state", state);

  return NextResponse.redirect(callbackUrl);
}
