//  export { auth as middleware } from "@/auth"
// import { auth } from "@/auth";
// import { NextResponse } from "next/server";

// export async function middleware(req: Request) {
//   const session = await auth();

//   if (!session && req.url.includes("/account")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   if (req.url.includes("/admin") && !session?.user.isAdmin) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }
// }
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

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|assets).*)",
  ],
};

