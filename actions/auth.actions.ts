"use server"
import connectDB from "@/database/db"
import User, { IUser } from "@/models/user.model"
import bcrypt from "bcryptjs"

import handleError from "@/lib/handlers/error"
import mongoose from "mongoose"
import { ForbiddenError } from "@/lib/http-errors"
import { revalidatePath } from "next/cache"
import { signIn } from "@/auth"
import { action } from "@/lib/handlers/action"
import { AuthCredentials } from "@/types/actionTypes"
import { LoginValidationSchema, SignUpValidationSchema } from "@/lib/zod"
import Account from "@/models/account.model"
import Token from "@/models/token.model"
import { sendVerificationEmail } from "@/lib/nodemailer"
export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpValidationSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { fullName, email, password, gender } = validationResult.params!;
  const normalizedEmail = email.toLowerCase().trim();

 

  await connectDB()
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Pre-generate expensive values
    const [hashedPassword, verificationCode] = await Promise.all([
      bcrypt.hash(password, 12),
      Promise.resolve(Math.floor(100000 + Math.random() * 900000).toString()),
    ]);

    // Parallel user lookup
    const existingUser = await  User.findOne({ email: normalizedEmail })
     
   

    if (existingUser) {
      throw new ForbiddenError(`An account already exists with the email address ${normalizedEmail}.`);
    }

   

    // Create user and account in transaction
    const [newUser] = await User.create(
      [{ fullName, email: normalizedEmail, hashedPassword, gender }],
      { session }
    );

    await Account.create(
      [{
        userId: newUser._id,
        name: newUser.fullName,
        provider: 'credentials',
        providerAccountId: normalizedEmail,
        password: hashedPassword,
      }],
      { session }
    );

    // Clean previous tokens and create new one
    await Token.deleteMany({ userId: newUser._id }, { session });
    await Token.create([{
      token: verificationCode,
      userId: newUser._id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    }], { session });

    await session.commitTransaction();
    session.endSession();

    // Send email after transaction (non-blocking)
    //sendVerificationEmail(normalizedEmail, verificationCode).catch(console.error);
 await signIn("credentials", { email: normalizedEmail, password, redirect: false });
    // Optional: revalidate admin user list page
    revalidatePath("/admin/usersList");

    return {
      success: true,
      message: 'Please check your email to verify your account.',
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}
export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: LoginValidationSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    await connectDB()
    const existingUser = await User.findOne({ email: normalizedEmail }) as IUser;

    if (!existingUser) {
      throw new ForbiddenError("The email/password you entered is incorrect.");
    }

    const passwordMatches = await bcrypt.compare(password, existingUser.hashedPassword);
    if (!passwordMatches) {
      throw new ForbiddenError("The email/password you entered is incorrect.");
    }

    //if (!existingUser.isVerified) throw new ForbiddenError("Please check your inbox and verify your email before logging in.")


    await signIn("credentials", { email: normalizedEmail, password, redirect: false });
   
    return { success: true };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}