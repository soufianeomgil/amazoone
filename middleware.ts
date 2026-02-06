import { auth } from "@/auth";
import { NextResponse } from "next/server";


// // TODO: MAKE A CARD THAT CONTAINS OMGIL'S FB PAGE instagram page tiktok page website ect.. and give it to clients;
// // CLOUDFLARE REPATCHA
// // PUT MONEY IN BANK TO GET CRDET CARD;
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
//   if(!user && pathname.startsWith("/account")  || pathname.startsWith("/security-settings")) {
//     return NextResponse.redirect(
//       new URL("/", req.url)
//     );
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
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const isLoggedIn = !!user;

  // 1. Define Route Constants
  const isPublicRoute = pathname.startsWith("/login") || pathname.startsWith("/sign-up") || pathname.startsWith("/api");
  const isProfileCompleteRoute = pathname.startsWith("/complete-profile");
  const isProtectedRoute = pathname.startsWith("/account") || pathname.startsWith("/security-settings") || pathname.startsWith("/admin");

  // 2. Allow API and Public Auth routes to pass through immediately
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 3. Handle Unauthorized access to Protected Routes
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. Handle Incomplete Profile (The Logic Loop Fix)
  // Only redirect if they aren't ALREADY on the complete-profile page
  if (isLoggedIn && !user.profileCompleted && !isProfileCompleteRoute) {
    return NextResponse.redirect(new URL("/complete-profile", req.url));
  }

  // 5. Prevent access to complete-profile if it's already done
  if (isLoggedIn && user.profileCompleted && isProfileCompleteRoute) {
    return NextResponse.redirect(new URL("/account", req.url));
  }

  // 6. Admin-only protection
  if (pathname.startsWith("/admin") && !user?.isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};