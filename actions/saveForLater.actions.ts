"use server"


import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import mongoose from "mongoose";
import handleError from "@/lib/handlers/error";
import { UnAuthorizedError } from "@/lib/http-errors";
import { Cart, ICart, ICartItem } from "@/models/cart.model";
import { IVariant } from "@/models/product.model";
import SaveForLaterModel, { ISaveForLaterDoc, ISaveForLaterSnapshot } from "@/models/saveForLater.model";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";
import {  AddToSaveForLaterSchema, MoveToCartSchema, RemoveFromSaveSchema } from "@/lib/zod";
import z from "zod";

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
 const ParamsPropsSchema = z.object({
  payload: z.object({
    productId: z.string(),
    variantId: z.string().nullable().optional(),
    variant: z.any().nullable(),   // <---- FIX for now
    quantity: z.number().optional(),
    note: z.string().optional(),
    snapshot: z.any().optional(),  // <---- FIX for now
  }),
  userId: z.string().optional(),
});


export async function addToSaveForLater(params: paramsProps): Promise<ActionResponse> {
  try {
    const validatedResult = await action({ params, schema: ParamsPropsSchema, authorize: true });
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
     const filter = {
        userId: userIdObj,
        productId: productIdObj,
        variantId: variant ? variant._id : null,
        // variantId,
        active: true,
      };
    
      // Upsert: if exists, increment quantity (or set to provided), else create new
      const update: any = {
        $set: { active: true, snapshot: snapshot ?? {}, addedAt: new Date() },
        $inc: { quantity: quantity ?? 1 },
      };
    
      if (note) update.$set.note = note;
      if (variant) update.$set.variant = variant; // <-- store variant object when provided
    
      // Use findOneAndUpdate with upsert for atomic behaviour
      const doc = await SaveForLaterModel.findOneAndUpdate(filter, update, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      })
   
   

   

    return { success: true };
  } catch (err) {
    console.error("addToSaveForLater error:", err);
    return handleError(err) as ErrorResponse;
  }
}
interface props  {
    page?: number, perPage?: number
}
export async function getUserSaveForLaterItems(params: props): Promise<ActionResponse<{items:ISaveForLaterDoc[]}>> {
  const validatedResult = await action({params,authorize: true})
  if(validatedResult instanceof Error) {
     return handleError(validatedResult) as ErrorResponse
  }
  const userSession = validatedResult.session;
  if(!userSession?.user.id) throw new UnAuthorizedError("")
    const { page = 1, perPage = 2 } = validatedResult.params!
   try {
     await connectDB()
   const skip = Math.max(0, page) * Math.max(1, perPage);
  const docs = await SaveForLaterModel.find({userId:userSession.user.id,active:true})
  //  .sort({ addedAt: -1 })
    // .skip(skip)
    // .limit(perPage)
    .populate([
      { path: "productId", select: "name basePrice brand thumbnail images status" },
    ])
    // .exec();
 
    return {
      success: true,
      data: {items: JSON.parse(JSON.stringify(docs))}
    }
   } catch (error) {
     return handleError(error) as ErrorResponse
   }
}




interface Params {
  id: string; // save-for-later document id
}

/**
 * Move a SaveForLater item into the user's cart.
 * - Merges with existing cart item if productId + variantId matches.
 * - Soft-deactivates the SaveForLater record on success.
 */
export async function moveSavedItemToCart(params: Params): Promise<ActionResponse<{ cart: ICart }>> {
  try {
    // authorize + validate
    const validated = await action({ params, schema: MoveToCartSchema, authorize: true });
    if (validated instanceof Error) return handleError(validated) as ErrorResponse;

    const session = validated.session;
    const userId = session?.user?.id;
    if (!userId) throw new UnAuthorizedError("User must be authenticated");

    // validated.params is the canonical, validated input (use it)
    const { id } = validated.params!;
    if (!id) throw new Error("Saved item id is required");

    await connectDB();

    // normalize ids to ObjectId
    const saveId = typeof id === "string" ? new Types.ObjectId(id) : id;
    const uid = typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    // Find saved item that belongs to user and is active
    const savedItem = await SaveForLaterModel.findOne({_id: id, userId:uid,active:true})

    if (!savedItem) {
      throw new Error("Saved item not found");
    }

    // Normalize variantId (may be null)
    const normalizedVariantId = savedItem.variantId ? String(savedItem.variantId) : null;

    // Find or create cart for user
    let cart = await Cart.findOne({ userId: uid }).exec();
    if (!cart) {
      cart = new Cart({
        userId: uid,
        items: [],
      });
    }

    // Find matching cart item by productId + variantId (normalized)
    const existingIndex = cart.items.findIndex((it: ICartItem) => {
      const itemProductId = String(it.productId);
      const itemVariantId =
        it.variantId != null
          ? String(it.variantId)
          : it.variant && (it.variant as any)?._id
          ? String((it.variant as any)._id)
          : null;
      return itemProductId === String(savedItem.productId) && (itemVariantId ?? null) === (normalizedVariantId ?? null);
    });

    if (existingIndex !== -1) {
      // merge quantities
      const existing = cart.items[existingIndex];
      const toAdd = Number(savedItem.quantity ?? 1);
      existing.quantity = Number(existing.quantity ?? 0) + toAdd;
      cart.items[existingIndex] = existing;
    } else {
      // push new item (keep variant object & variantId if present)
      cart.items.push({
        productId: savedItem.productId,
        variantId: savedItem.variantId ?? null,
        variant: savedItem.variant ?? null,
        quantity: savedItem.quantity ?? 1,
        snapshot: savedItem.snapshot ?? undefined,
        addedAt: new Date(),
      } as any);
    }

    // save cart
    await cart.save();

    // soft-remove saved item (mark inactive) — ensure we match same user & id
    await SaveForLaterModel.updateOne(
      { _id: saveId, userId: uid, active: true },
      { $set: { active: false } }
    ).exec();

    // best-effort revalidate
    try {
      revalidatePath("/cart");
      revalidatePath("/");
    } catch (e) {
      // ignore
    }

    return {
      success: true,
      data: { cart: JSON.parse(JSON.stringify(cart)) },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

interface RemoveFromSaveParams {
  id:string
}
export async function removeFromSaveForLater(params:RemoveFromSaveParams): Promise<ActionResponse> {
   const validatedResult = await action({params,schema:RemoveFromSaveSchema,authorize: true})
   if(validatedResult instanceof Error) return handleError(validatedResult) as ErrorResponse
   const session = validatedResult.session;
   if(!session?.user.id) throw new UnAuthorizedError('')
    const { id } = validatedResult.params!
  const userId = session.user.id
   try {
     const res = await SaveForLaterModel.findOneAndUpdate(
        {
          _id: typeof id === "string" ? new Types.ObjectId(id) : id,
          userId: typeof session.user.id === "string" ? new Types.ObjectId(userId) : userId,
          active: true,
        },
        { $set: { active: false } },
        { new: true }
      )
      revalidatePath("/cart")
      return {
        success: true
      }
   } catch (error) {
     return handleError(error) as ErrorResponse
   }
}
