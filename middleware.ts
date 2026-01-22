import { auth } from "@/auth";
import { NextResponse } from "next/server";
// TODO: PROTECT ROUTES LIKE ORDERS PAGE [DONE]
// TODO:  FIX RENDERING CART ITEMS;
// TODO: THANKYOU PAGE [DONE];
// TODO: SHOULDERS DAY;
// TODO: PAY DART [DONE];
// TODO: FB ADS;
// PUT MONEY IN BANK TO GET CRDET CARD;
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
  if(!user && pathname.startsWith("/account") || pathname.startsWith("/profile") || pathname.startsWith("/security-settings")) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
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
