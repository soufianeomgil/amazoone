import { getOrderDetails } from "@/actions/order.actions";
import connectDB from "@/database/db";
import handleError from "@/lib/handlers/error"

import { NextResponse } from "next/server";

export const GET = async( _: Request,
    { params }: { params: Promise<{ orderId: string }> })=>  {
        const {orderId} = await params;
    try {
        await connectDB()

      const {data} =  await getOrderDetails({orderId})
        return NextResponse.json({success: true, data: data?.order})
    } catch (error) {
        return handleError(error,"api") as APIErrorResponse
    }
}