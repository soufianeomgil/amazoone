// import mongoose from "mongoose";
// import { NextResponse } from "next/server";
// import slugify from "slugify";
// import { ValidationError } from "@/lib/http-errors";
// import { SignInWithOAuthSchema } from "@/lib/zod";
// import handleError from "@/lib/handlers/error";
// import connectDB from "@/database/db";
// import User, { IUser } from "@/models/user.model";
// import Account from "@/models/account.model";


// export async function POST(request: Request) {
//   const { provider, providerAccountId, user } = await request.json();

//   await connectDB()

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const validatedData = SignInWithOAuthSchema.safeParse({
//       provider,
//       providerAccountId,
//       user,
//     });

//     if (!validatedData.success)
//       throw new ValidationError(validatedData.error.flatten().fieldErrors);

//     const { name, lastName, email, image } = validatedData.data.user;

//     const slugifiedUsername = slugify(lastName, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });

//     let existingUser = await User.findOne({ email }).session(session) as IUser

//     if (!existingUser) {
//       [existingUser] = await User.create(
//         [{ fullName: name + slugifiedUsername, email,  profilePictureUrl: image }],
//         { session }
//       );
//     } else {
//       const updatedData: { fullName?: string; profilePictureUrl?: string } = {};

//       if (existingUser.fullName !== name) updatedData.fullName = name;
//       if (existingUser.profilePictureUrl !== image) updatedData.profilePictureUrl = image;

//       if (Object.keys(updatedData).length > 0) {
//         await User.updateOne(
//           { _id: existingUser._id },
//           { $set: updatedData }
//         ).session(session);
//       }
//     }

//     const existingAccount = await Account.findOne({
//       userId: existingUser._id,
//       provider,
//       providerAccountId,
//     }).session(session);

//     if (!existingAccount) {
//       await Account.create(
//         [
//           {
//             userId: existingUser._id,
//             name,
//             image,
//             provider,
//             providerAccountId,
//           },
//         ],
//         { session }
//       );
//     }

//     await session.commitTransaction();

//     return NextResponse.json({ success: true });
//   } catch (error: unknown) {
//     await session.abortTransaction();
//     return handleError(error, "api") as APIErrorResponse;
//   } finally {
//     session.endSession();
//   }
// }

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";
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
          isVerified: true, // OAuth users are verified
          profilePictureUrl: image,
          profileCompleted: false ,   // 👈 FORCE COMPLETION
          hashedPassword: null, // OAuth
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
    return NextResponse.json({ success: true });
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "api");
  } finally {
    session.endSession();
  }
}
