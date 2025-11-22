// app/api/checkout/validate/route.ts
import validateCheckoutAction from "@/actions/checkoutStepsValidation";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const step = typeof body.step === "number" ? body.step : 1;
    const res = await validateCheckoutAction({ step });
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ success: false, error: "ServerError", message: String(err) }, { status: 500 });
  }
}
