import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create the response object
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // 1. Clear the session/auth cookie by setting maxAge to 0
    // Replace "session" with whatever your cookie name is (e.g., "token", "next-auth.session-token")
    response.cookies.set("session", "", {
      httpOnly: true,
      secure: process.env.NODE_NODE === "production",
      sameSite: "strict",
      expires: new Date(0), // Sets expiration to 1970 (immediate delete)
      path: "/",            // Ensure it clears for the whole domain
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to logout" },
      { status: 500 }
    );
  }
}