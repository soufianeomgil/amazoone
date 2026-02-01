// app/api/address/default/route.ts
import { getDefaultUserAddressAction } from "@/actions/address.actions";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Import your server action that we previously created.
// Adjust the path to where your action lives.


export async function GET(_: NextRequest) {
const session = await auth()
  try {
    // Call the server action (it will authorize the session internally).
    const res = await getDefaultUserAddressAction({userId: session?.user.id as string});

    // If the action returned an error-style response, forward it
    if (!res || !("success" in res) || res.success === false) {
      return NextResponse.json(
        { success: false, message: (res as any)?.message || "Could not fetch default address" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: res.data }, { status: 200 });
  } catch (err: any) {
    console.error("API /api/address/default error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
