// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean; // 👈 Add isAdmin here;
      profileCompleted: boolean
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    profileCompleted: boolean;
    isAdmin: boolean; // 👈 Add isAdmin here too
    
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isAdmin: boolean; // 👈 Also add isAdmin to JWT
    
  }
}
