import { NextResponse } from "next/server";


import { NotFoundError, ValidationError } from "@/lib/http-errors";

import { UsersSchema } from "@/lib/zod";

import handleError from "@/lib/handlers/error";
import connectDB from "@/database/db";
import User from "@/models/user.model";



export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    await connectDB();

    const validatedData = UsersSchema.partial().safeParse({ email });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}