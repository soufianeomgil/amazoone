import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Public routes
  if (
    pathname.startsWith("/login") ||  pathname.startsWith("/sign-up") ||
    pathname.startsWith("/complete-profile") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Logged in but profile incomplete
  if (user && !user.profileCompleted) {
    return NextResponse.redirect(
      new URL("/complete-profile", req.url)
    );
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && !user?.isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|assets).*)",
  ],
};

