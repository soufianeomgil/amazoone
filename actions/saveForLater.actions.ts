"use server"

import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { Cart } from "@/models/cart.model";
import { IVariant } from "@/models/product.model";
import SaveForLaterModel, { ISaveForLaterSnapshot } from "@/models/saveForLater.model";
import { Types } from "mongoose";
interface paramsProps {
    payload: {
    productId: string;
    variantId?: string | null;
    variant: IVariant | null;
    quantity?: number;
    note?: string;
    snapshot?: ISaveForLaterSnapshot;
  },
  userId?: string
}
export async function addToSaveForLater(params: paramsProps): Promise<ActionResponse> {
  try {
    const validatedResult = await action({ params, authorize: true });
    if (validatedResult instanceof Error) {
      return handleError(validatedResult) as ErrorResponse;
    }

    const resolvedUserId = validatedResult.session?.user.id;
    if (!resolvedUserId) throw new Error("Unauthorized: userId required");

    const payload = params.payload;
    if (!payload) throw new Error("Payload is required");

    const { productId, variantId = null, variant = null, quantity = 1, note, snapshot } = payload;

    if (!productId) throw new Error("productId is required");

    const userIdObj = typeof resolvedUserId === "string" ? new Types.ObjectId(resolvedUserId) : resolvedUserId;
    const productIdObj = typeof productId === "string" ? new Types.ObjectId(productId) : productId;
   // const variantIdObj = variantId ? (typeof variantId === "string" ? new Types.ObjectId(variantId) : variantId) : null;

    await connectDB();

    // Add or update in SaveForLater
    // @ts-ignore
    await SaveForLaterModel.addOrUpdate({
      userId: userIdObj,
      productId: productIdObj,
      variant,
      variantId,
      quantity,
      note,
      snapshot,
    });

    // // Remove item from cart if exists
    // const cart = await Cart.findOne({ userId: userIdObj });
    // if (cart) {
    //   const normalizedVariantId = variantIdObj ?? null;
    //   cart.items = cart.items.filter(
    //     (item: any) =>
    //       !(
    //         item.productId.toString() === productIdObj.toString() &&
    //         (item.variantId ?? null)?.toString() === normalizedVariantId?.toString()
    //       )
    //   );
    //   await cart.save();
    // }

    return { success: true };
  } catch (err) {
    console.error("addToSaveForLater error:", err);
    return handleError(err) as ErrorResponse;
  }
}
