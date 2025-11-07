import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { api } from "./lib/api";
// TODO: append isAdmin property when user logs in using google,

import { LoginValidationSchema } from "./lib/zod";
import { IUser } from "./types/actionTypes";
import { IAccount } from "./models/account.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
 
  providers: [
    GitHub,
    Google,
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

        

          
           // email verification,
           //if (!existingUser.isVerified) throw new Error("Email is not verified. Please verify your email.");

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
              isAdmin: existingUser.isAdmin, 
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
     session.user.isAdmin = token.isAdmin as boolean; // Attach isAdmin
      
      return session;
    
    
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.sub = user.id;
        token.isAdmin = user.isAdmin; // 👈 Add this
        // token.isVerified = user.isVerified
      }
      if (account) {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAccount>;
       
        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
        
      }

      return token;
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
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});