 export { auth as middleware } from "@/auth"
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
