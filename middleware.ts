// import { auth } from "@/auth";
// import { NextResponse } from "next/server";

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const user = req.auth?.user;

//   // Public routes
//   if (
//     pathname.startsWith("/login") ||  pathname.startsWith("/sign-up") ||
//     pathname.startsWith("/complete-profile") ||
//     pathname.startsWith("/api")
//   ) {
//     return NextResponse.next();
//   }

//   // Logged in but profile incomplete
//   if (user && !user.profileCompleted) {
//     return NextResponse.redirect(
//       new URL("/complete-profile", req.url)
//     );
//   }

//   // Admin-only routes
//   if (pathname.startsWith("/admin") && !user?.isAdmin) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     "/((?!_next|favicon.ico|assets).*)",
//   ],
// };
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const user = req.auth?.user;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/login", "/sign-up"].includes(nextUrl.pathname);
  const isProfileRoute = nextUrl.pathname === "/complete-profile";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // 1. Always allow API Auth routes (Essential for Google login handshake)
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // 2. Profile completion logic
  // If logged in but profile is incomplete, force them to /complete-profile
  if (isLoggedIn && !user?.profileCompleted && !isProfileRoute && !isPublicRoute) {
    return NextResponse.redirect(new URL("/complete-profile", nextUrl));
  }

  // 3. Prevent logged-in users from accessing /login or /sign-up
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 4. Admin protection
  if (isAdminRoute && !user?.isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

// The matcher is key: it tells Next.js exactly which paths to run this file on.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (your public assets folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
