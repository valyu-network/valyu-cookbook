import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, code_verifier } = body;

    if (!code || !code_verifier) {
      return NextResponse.json(
        { error: "Missing code or code_verifier" },
        { status: 400 }
      );
    }

    // Exchange authorization code for access token
    const tokenUrl = `${process.env.NEXT_PUBLIC_VALYU_AUTH_URL}/auth/v1/oauth/token`;

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        client_id: process.env.NEXT_PUBLIC_VALYU_CLIENT_ID,
        client_secret: process.env.VALYU_CLIENT_SECRET,
        code_verifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange failed:", errorData);
      return NextResponse.json(
        { error: "Token exchange failed", details: errorData },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    return NextResponse.json(tokenData);
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
