import { createSavedListAction } from "@/actions/savedList.actions";
import { NextResponse } from "next/server";

// 1. Change to Named Export (POST)
export async function POST(req: Request) {
  try {
    // 2. Parse the body from the request
    const body = await req.json();
    const { name, isPrivate, isDefault } = body;

    // 3. Call your action
    const { success, data, error } = await createSavedListAction({ 
      name, 
      isPrivate, 
      isDefault 
    });

    if (!success) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // 4. Return using NextResponse
    return NextResponse.json({ list: data?.list }, { status: 201 });

  } catch (err) {
    console.error("Saved Lists API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}