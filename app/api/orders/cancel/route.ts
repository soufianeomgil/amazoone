import { cancelOrderAction } from "@/actions/order.actions"
import connectDB from "@/database/db"
import handleError from "@/lib/handlers/error"
import { NextResponse } from "next/server"

export async function POST(req:Request) {
    const {orderId,reason} = await req.json()
    try {
        await connectDB()
      const {error,success, data} =  await cancelOrderAction({orderId,reason})
      if(error) throw new Error(error.message)
        return NextResponse.json({data:data,success}, {status: 200})
    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status: 500})
    }
}