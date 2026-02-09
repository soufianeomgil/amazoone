import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import Google from "next-auth/providers/google";

import { api } from "./lib/api";

// NSWR -- CART PAGE --
import { LoginValidationSchema } from "./lib/zod";

import { IAccount } from "./models/account.model";
import { IUser } from "./models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
 
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginValidationSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const { data: existingUser } = (await api.users.getByEmail(
            email
          )) as ActionResponse<IUser>;
          if (!existingUser) return null;
          
          const { data: existingAccount } = (await api.accounts.getByUserId(
            existingUser._id
          )) as ActionResponse<IAccount>;
         
          if (!existingAccount) return null;

        

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if(isValidPassword) {
            return {
              id: existingUser._id,
              name: existingUser.fullName,
              email: existingUser.email,
              image: existingUser.profilePictureUrl,
              isVerified: existingUser.isVerified,
              isAdmin: existingUser.isAdmin, 
              profileCompleted: existingUser.profileCompleted
            };
          }
           
          
        }
        return null;
      },
    }),
  ],
  callbacks: {
   
    async session({ session,token }) {
    
    session.user.id = token.sub as string;
session.user.isAdmin = token.isAdmin as boolean;
session.user.profileCompleted = token.profileCompleted as boolean;
session.user.isVerified = token.isVerified as boolean
      
      return session;
    
    
    },

    async jwt({ token, user, account }) {
  // 1️⃣ Initial sign in (credentials OR oauth)
  if (user) {
    token.sub = user.id
    token.isAdmin = user.isAdmin
    token.isVerified = user.isVerified
    token.profileCompleted = user.profileCompleted
  }

  // 2️⃣ OAuth sign-in → sync from DB
  if (account && account.type !== "credentials") {
    const { data: dbAccount } =
      (await api.accounts.getByProvider(
        account.providerAccountId
      )) as ActionResponse<IAccount>

    if (dbAccount?.userId) {
      const { data: dbUser } =
        (await api.users.getById(
          dbAccount.userId.toString()
        )) as ActionResponse<IUser>

      if (dbUser) {
        token.sub = dbUser._id
        token.isAdmin = dbUser.isAdmin
        token.name = dbUser.fullName
        token.isVerified = dbUser.isVerified
        token.profileCompleted = dbUser.profileCompleted
      }
    }
  }

  return token
},

    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;
     
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        lastName:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as  "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});