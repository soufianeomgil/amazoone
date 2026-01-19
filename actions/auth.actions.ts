"use server"
import connectDB from "@/database/db"
import User, { IUser } from "@/models/user.model"
import bcrypt from "bcryptjs"

import handleError from "@/lib/handlers/error"
import mongoose from "mongoose"
import { ForbiddenError, NotFoundError, UnAuthorizedError } from "@/lib/http-errors"
import { revalidatePath } from "next/cache"
import { auth, signIn } from "@/auth"
import { action } from "@/lib/handlers/action"
import { AuthCredentials } from "@/types/actionTypes"
import { completeProfileSchema, ForgotPasswordSchema, LoginValidationSchema, ResetPasswordSchema, SignUpValidationSchema } from "@/lib/zod"
import Account, { IAccount } from "@/models/account.model"
import Token from "@/models/token.model"
import { sendPasswordChangedEmail, sendResetEmail } from "@/lib/nodemailer"
import z from "zod"
import { generateOTP, generateResetToken } from "@/lib/security/tokens"

import ResetCode from "@/models/resetCode.model"
import { cookies, headers } from "next/headers"
import { sendSMS } from "@/lib/sms/twilio"
import { maskPhoneE164, normalizeMoroccanPhone } from "@/lib/phone/normalizeMA"
function maskDestination(type: "email" | "phone", value: string) {
  if (type === "email") {
    const [name, domain] = value.split("@");
    return `${name?.slice(0, 2)}*****@${domain}`;
  }
  // phone: +2126******12
  return value.replace(/^(\+\d{3}\d)(\d+)(\d{2})$/, "$1******$3");
}





export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse<{ step: string,
        destination: string,
        phone: string,
        email: string}>> {
  const validationResult = await action({ params, schema: SignUpValidationSchema });
  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse

  const { fullName, email, password, gender, phoneNumber } = validationResult.params!;
  const normalizedEmail = email.toLowerCase().trim();

  let phoneE164: string
  try {
    phoneE164  = normalizeMoroccanPhone(phoneNumber) as string;
  } catch (e) {
    return handleError(e) as any;
  }

  await connectDB();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ForbiddenError(`An account already exists with the email address ${normalizedEmail}.`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create(
      [
        {
          fullName,
          email: normalizedEmail,
          gender,
          phoneNumber: phoneE164,          // store normalized
          phoneVerified: false,            // ✅ add this boolean in your user schema
          profileCompleted: true,
        },
      ],
      { session }
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          name: newUser.fullName,
          provider: "credentials",
          providerAccountId: normalizedEmail,
          password: hashedPassword, // (or remove this later if you refactor to 1 source)
        },
      ],
      { session }
    );
  const rawCode = generateOTP();
   // const hashedCode = await bcrypt.hash(rawCode, 10);
    await session.commitTransaction();
    session.endSession();

    // ✅ Send WhatsApp OTP after DB commit
    await sendSMS(phoneE164, `your verification code is ${rawCode}`);

    revalidatePath("/admin/usersList");

    return {
      success: true,
      data: {
        step: "VERIFY_PHONE",
        destination: maskPhoneE164(phoneE164),
        phone: phoneE164,
        email: normalizedEmail,
      },
      message: "We sent a verification code via SMS.",
    };
  } catch (error) {
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}


// const VerifyPhoneSchema = z.object({
//   phone: z.string(),
//   code: z.string().min(4).max(10),
// });

// export async function verifySignupPhoneAction(params: z.infer<typeof VerifyPhoneSchema>) {
//   const validated = await action({ params, schema: VerifyPhoneSchema });
//   if (validated instanceof Error) return handleError(validated) as any;

//   const { phone, code } = validated.params!;

//   try {
//     await connectDB();

//     const result = await checkVerification(phone, code);

//     // Twilio returns statuses like "approved"
//     if (result.status !== "approved") {
//       return { success: false, error: { message: "Invalid code" } };
//     }

//     await User.updateOne(
//       { phoneNumber: phone },
//       { $set: { phoneVerified: true } }
//     );

//     return { success: true };
//   } catch (error) {
//     return handleError(error) as any;
//   }
// }


export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: LoginValidationSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail }) as IUser;
    if (!existingUser) {
      throw new ForbiddenError("The email/password you entered is incorrect.");
    }

    /**
     * 🔐 OAUTH-ONLY ACCOUNT CHECK (FIRST)
     */
     // we have a gotta here;
     // use twilio for sending SMS;
    // const oauthAccount = await Account.findOne({
    //   userId: existingUser._id,
    //   provider: "google",
    // }) as IAccount;
    
    // if (oauthAccount && !oauthAccount.password) {
    //   throw new ForbiddenError(
    //     "This account was created using Google. Please sign in with Google or set a password."
    //   );
    // }
    const account = await Account.findOne({
  userId: existingUser._id,
  provider: "credentials",
});

    /**
     * 🔑 PASSWORD CHECK
     */
    // if (!existingUser.hashedPassword) {
    //   throw new ForbiddenError(
    //     "Please set a password before signing in with email."
    //   );
    // }
if (!account || !account.password) {
  throw new ForbiddenError(
    "This account was created using Google. Please sign in with Google or set a password."
  );
}
    const passwordMatches = await bcrypt.compare(
      password,
      account.password
    );

    if (!passwordMatches) {
      throw new ForbiddenError("The email/password you entered is incorrect.");
    }

    /**
     * ✅ Delegate session creation to NextAuth
     */
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });

    return { success: true };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

interface CompleteProfileParams {
  fullName:string;
  phoneNumber: number | string;
  gender: "male" | "female"
}
export async function completeProfile(params:CompleteProfileParams): Promise<ActionResponse> {
  const validatedResult = await action({params,schema:completeProfileSchema})
  if(validatedResult instanceof Error) {
     return handleError(validatedResult) as ErrorResponse
  }
  const session = await auth();
  if (!session) throw new UnAuthorizedError();
  try {
    await connectDB();

  await User.updateOne(
    { _id: session.user.id },
    {
      $set: {
        fullName: params.fullName,
        phoneNumber: params.phoneNumber,
        gender: params.gender,
        profileCompleted: true,
      },
    }
  );

  return { success: true };
  } catch (error) {
     return handleError(error) as ErrorResponse
  }
  
}




interface ForgotPasswordPayload {
  type: "email" | "phone";
  value: string;
}

export async function forgotPasswordAction(
  payload: ForgotPasswordPayload
): Promise<ActionResponse> {
  try {
    await connectDB();

    const { type, value } = payload;

    const identifier =
      type === "email"
        ? value.toLowerCase().trim()
        : normalizeMoroccanPhone(value);

    // 🔒 SECURITY: always return success (also covers invalid phone formats)
    if (!identifier) return { success: true };

    const user: IUser | null =
      type === "email"
        ? await User.findOne({ email: identifier })
        : await User.findOne({ phoneNumber: identifier });

    if (!user) return { success: true };

    // 🧠 Invalidate previous unused codes (scoped)
    await ResetCode.updateMany(
      { identifier, type, used: false },
      { used: true }
    );

    const rawCode = generateOTP();
    const hashedCode = await bcrypt.hash(rawCode, 10);

    await ResetCode.create({
      identifier,
      type,
      code: hashedCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0,
      used: false,
    });

    // 🔔 SEND
    if (type === "email") {
      await sendResetEmail({ to: identifier, code: rawCode });
    } else {
      await sendSMS(identifier, `Your reset code is: ${rawCode}`);
    }

    return { success: true };
  } catch (error) {
    console.error("forgotPasswordAction error:", error);
    return handleError(error) as ErrorResponse;
  }
}




 const VerifyResetCodeSchema = z.object({
  identifier: z.string().min(1),
  type: z.enum(["email", "phone"]),
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Invalid code"),
});

interface VerifyResetCodeParams {
  type: "email" | "phone";
  code: string;
  identifier: string;
}

export async function verifyResetCodeAction(
  params: VerifyResetCodeParams
): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: VerifyResetCodeSchema,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  const { identifier, type, code } = validated.params!;

  try {
    await connectDB();

    const record = await ResetCode.findOne({
      identifier,
      type,
      used: false,
    }).sort({ createdAt: -1 });

    if (!record) throw new NotFoundError("Verification code");

    if (record.expiresAt < new Date()) {
      throw new Error("Verification code has expired");
    }

    if (record.attempts >= 5) {
      throw new Error("Too many failed attempts");
    }

    const isValid = await bcrypt.compare(code, record.code);

    if (!isValid) {
      record.attempts += 1;
      await record.save();
      throw new Error("Invalid verification code");
    }

    const user: IUser | null =
      type === "email"
        ? await User.findOne({ email: identifier })
        : await User.findOne({ phoneNumber: identifier });

    if (!user) throw new NotFoundError("User");

    // 🔒 Safety binding
    if (
      (type === "email" && user.email !== identifier) ||
      (type === "phone" && user.phoneNumber !== identifier)
    ) {
      throw new Error("Verification mismatch");
    }

    // 🍪 VERIFIED RESET SESSION
    const cookieStore = await cookies();

    cookieStore.set("reset_verified", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: "/",
    });

    cookieStore.set("reset_user", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: "/",
    });

    record.used = true;
    await record.save();

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}



// actions/auth.actions.ts

interface ResetPasswordParams {
  password: string;
  passwordCheck: string;
}





export async function resetPasswordAction(
  params: ResetPasswordParams
): Promise<ActionResponse<{autoLogin:boolean,identifier:string}>> {
  const validated = await action({
    params,
    schema: ResetPasswordSchema,
  });

  if (validated instanceof Error) {
    return handleError(validated) as ErrorResponse;
  }

  try {
    await connectDB();

    const { password } = validated.params!;

    const cookieStore = cookies();
    const verified = (await cookieStore).get("reset_verified")?.value;
    const userId =   (await cookieStore).get("reset_user")?.value;

    if (verified !== "true" || !userId) {
      throw new Error("Reset session expired. Please restart the process.");
    }
   
    const user = await User.findById(userId) as IUser

    if (!user) {
      throw new Error("Invalid reset session.");
    }
      const userAccount = await Account.findOne({
  userId: user._id,
  provider: "credentials"}) 

  if(!userAccount) throw new Error('No credential account exists')
    // 🔐 Update password
    userAccount.password = await bcrypt.hash(password, 12);
    await userAccount.save();
   

    // 🧹 Invalidate ALL remaining reset codes for this user
    if (user.email) {
      await ResetCode.updateMany(
        { identifier: user.email, used: false },
        { used: true }
      );
    }

    if (user.phoneNumber) {
      await ResetCode.updateMany(
        { identifier: user.phoneNumber, used: false },
        { used: true }
      );
    }

    // 🔔 Security alert email
    const headersList = headers();
    const userAgent = (await headersList).get("user-agent") || undefined;
    const ip =
      (await headersList).get("x-forwarded-for") ||
      (await headersList).get("x-real-ip") ||
      undefined;

    if (user.email) {
      await sendPasswordChangedEmail({
        to: user.email,
        fullName: user.fullName,
        device: userAgent,
        ip,
      });
    }

    // 🍪 Clear reset cookies
    (await cookieStore).delete("reset_verified");
    (await cookieStore).delete("reset_user");
   await signIn("credentials", {
      email: user.email,
      password,
      redirect: false,
    });

    return {
  success: true,
  data: { autoLogin: true,identifier: user.email}};
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
