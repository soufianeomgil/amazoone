import { NextResponse } from "next/server";


import { NotFoundError, ValidationError } from "@/lib/http-errors";


import handleError from "@/lib/handlers/error";
import { AccountSchema } from "@/lib/zod";
import Account from "@/models/account.model";
import connectDB from "@/database/db";

// GET /api/users/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
       await connectDB()

    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await connectDB()

    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await connectDB()

    const body = await request.json();
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAccount) throw new NotFoundError("Account");

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}