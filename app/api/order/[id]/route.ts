import connectDB from "@/database/db";
import handleError from "@/lib/handlers/error";
import Order from "@/models/order.model";
import { NextResponse } from "next/server";

export async function GET(_:Request, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    if(!id) throw new Error("Order ID is required")
    try {
        await connectDB()
        const order = await Order.findById(id)
        .populate("items.productId")
        if(!order) throw new Error("Order not found")
        return NextResponse.json({success: true,data: order}, {status: 200})
    } catch (error) {
        return handleError(error) as APIErrorResponse
    }
}