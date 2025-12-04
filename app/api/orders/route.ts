// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserOrdersAction } from "@/actions/order.actions";

/**
 * GET /api/orders?page=1&limit=10
 * - Calls your server-side getUserOrdersAction and returns { orders, hasMore }.
 * - Assumes getUserOrdersAction accepts { page, limit } and returns { data, error } (as in your codebase).
 */

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pageParam = url.searchParams.get("page") ?? "1";
  const limitParam = url.searchParams.get("limit") ?? "10";

  const page = Math.max(1, Number.isFinite(Number(pageParam)) ? parseInt(pageParam, 10) : 1);
  const limit = Math.max(1, Math.min(100, Number.isFinite(Number(limitParam)) ? parseInt(limitParam, 10) : 10));

  try {
    // call your existing server action (it should read session from cookies on the server)
    const { data, error } = await getUserOrdersAction({ page, pageSize: limit });

    if (error) {
      // If your action returns structured error objects adapt as needed
      const message = error?.message ?? "Failed to load orders";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // normalize response shape
    const orders = data?.orders ?? [];
    // best-effort hasMore: true when returned page is full (may need adjustment if your action returns totalPages/totalCount)
    const hasMore = Array.isArray(orders) ? orders.length === limit : false;

    return NextResponse.json({ orders, hasMore }, { status: 200 });
  } catch (err: any) {
    console.error("api/orders error:", err);
    const message = err?.message ?? String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
