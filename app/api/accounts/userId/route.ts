import { NextResponse } from "next/server";


import { NotFoundError, ValidationError } from "@/lib/http-errors";

import handleError from "@/lib/handlers/error";
import connectDB from "@/database/db";
import Account from "@/models/account.model";
import { AccountSchema } from "@/lib/zod";


export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    await connectDB()

    const validatedData = AccountSchema.partial().safeParse({
      userId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const account = await Account.findOne({ userId });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}