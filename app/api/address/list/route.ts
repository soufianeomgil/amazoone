// app/api/address/default/route.ts
import { getDefaultUserAddressAction, getUserAddresses } from "@/actions/address.actions";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import your server action that we previously created.
// Adjust the path to where your action lives.


export async function GET(req: NextRequest) {
  try {
    // Call the server action (it will authorize the session internally).
    const res = await getUserAddresses();

    // If the action returned an error-style response, forward it
    if (!res || !("success" in res) || res.success === false) {
      return NextResponse.json(
        { success: false, message: (res as any)?.message || "Could not fetch user addresses" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: res.data }, { status: 200 });
  } catch (err: any) {
    console.error("API /api/address/ist error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
