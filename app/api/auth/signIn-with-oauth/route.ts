// import mongoose from "mongoose";
// import { NextResponse } from "next/server";
// import { ValidationError } from "@/lib/http-errors";
// import { SignInWithOAuthSchema } from "@/lib/zod";
// import handleError from "@/lib/handlers/error";
// import connectDB from "@/database/db";
// import User from "@/models/user.model";
// import Account from "@/models/account.model";

// export async function POST(request: Request) {
//   await connectDB();

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const body = await request.json();

//     const validated = SignInWithOAuthSchema.safeParse(body);
//     if (!validated.success) {
//       throw new ValidationError(validated.error.flatten().fieldErrors);
//     }

//     const { provider, providerAccountId, user } = validated.data;
//     const { name, email, image } = user;

//     // 1️⃣ Find or create user
//     let existingUser = await User.findOne({ email }).session(session);

//     if (!existingUser) {
//       existingUser = await User.create(
//         [{
//           fullName: name,
//           email,
//           isVerified: true, // OAuth users are verified
//           profilePictureUrl: image,
//           profileCompleted: false ,   // 👈 FORCE COMPLETION
//           hashedPassword: null, // OAuth
//           orderHistory: [],
//           wishLists: [],
//           addresses: [],
//           interests: [],
//         }],
//         { session }
//       ).then(res => res[0]);
//     } else {
//       await User.updateOne(
//         { _id: existingUser._id },
//         {
//           $set: {
//             fullName: name,
//             profilePictureUrl: image,
//             lastLogin: new Date(),
//           },
//         }
//       ).session(session);
//     }

//     // 2️⃣ Ensure account uniqueness per provider
//     const existingAccount = await Account.findOne({
//       provider,
//       providerAccountId,
//     }).session(session);

//     if (!existingAccount) {
//       await Account.create(
//         [{
//           userId: existingUser._id,
//           provider,
//           providerAccountId,
//           name,
//           image,
//         }],
//         { session }
//       );
//     }

//     await session.commitTransaction();
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     await session.abortTransaction();
//     return handleError(error, "api");
//   } finally {
//     session.endSession();
//   }
// }
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ValidationError } from "@/lib/http-errors";
import { SignInWithOAuthSchema } from "@/lib/zod";
import handleError from "@/lib/handlers/error";
import connectDB from "@/database/db";
import User from "@/models/user.model";
import Account from "@/models/account.model";

export async function POST(request: Request) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await request.json();

    const validated = SignInWithOAuthSchema.safeParse(body);
    if (!validated.success) {
      throw new ValidationError(validated.error.flatten().fieldErrors);
    }

    const { provider, providerAccountId, user } = validated.data;
    const { name, email, image } = user;

    // 1️⃣ Find or create user
    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      existingUser = await User.create(
        [{
          fullName: name,
          email,
          isVerified: true, 
          profilePictureUrl: image,
          profileCompleted: false,   
          hashedPassword: null, 
          orderHistory: [],
          wishLists: [],
          addresses: [],
          interests: [],
        }],
        { session }
      ).then(res => res[0]);
    } else {
      await User.updateOne(
        { _id: existingUser._id },
        {
          $set: {
            fullName: name,
            profilePictureUrl: image,
            lastLogin: new Date(),
          },
        }
      ).session(session);
    }

    // 2️⃣ Ensure account uniqueness per provider
    const existingAccount = await Account.findOne({
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [{
          userId: existingUser._id,
          provider,
          providerAccountId,
          name,
          image,
        }],
        { session }
      );
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    await session.abortTransaction();
    
    // FIX: Ensure the error handler returns a proper NextResponse
    const errorResponse = handleError(error, "api");

    // If handleError returns a plain object, wrap it. 
    // If it's already a Response, return it directly.
    return errorResponse instanceof Response 
      ? errorResponse 
      : NextResponse.json(errorResponse, { status: errorResponse?.status || 500 });

  } finally {
    session.endSession();
  }
}