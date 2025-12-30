import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    // Get user info from Valyu platform
    const userInfoUrl = `${process.env.VALYU_APP_URL}/api/oauth/userinfo`;

    const response = await fetch(userInfoUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user info:", await response.text());
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: response.status }
      );
    }

    const userInfo = await response.json();
    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("User info fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
