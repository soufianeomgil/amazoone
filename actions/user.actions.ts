"use server"

import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error"
import { NotFoundError } from "@/lib/http-errors";
import { ToggleWishlistSchema } from "@/lib/zod";
import { auth } from "@/auth"
import { Product } from "@/models/product.model";
import User from "@/models/user.model";
import { IUser, ToggleWishlistParams } from "@/types/actionTypes";
export async function getCurrentUser(): Promise<ActionResponse<{user: IUser | null}>>{
  const currentUser = await auth()
 if(!currentUser?.user)  return {
   success: false,
   data: {user: null}
 }
     try {
        await connectDB()
        const user = await User.findById(currentUser?.user.id)
        .populate("wishLists")
        if(!user) throw new NotFoundError('User')
          return {
            success: true,
            data:  {user: JSON.parse(JSON.stringify(user))}
          }
     } catch (error) {
        return handleError(error) as ErrorResponse
     }
}
export async function toggleAddToWishlist(params: ToggleWishlistParams): Promise<ActionResponse> {
  const validatedResult = await action({ params, schema: ToggleWishlistSchema, authorize: true });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const userId = validatedResult.session?.user.id;
  const { productId } = validatedResult.params!;

  try {
    await connectDB();

    // find product & user
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product");

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User");

    // normalize IDs to string for comparison
    const pidStr = String(product._id);
    const wishListIds = (user.wishLists || []).map((id: any) => String(id));

    let wishlisted = false;
    if (wishListIds.includes(pidStr)) {
      // remove from wishlist
      user.wishLists = (user.wishLists || []).filter((id: any) => String(id) !== pidStr);
      wishlisted = false;
    } else {
      // add to wishlist
      user.wishLists = [...(user.wishLists || []), product._id];
      wishlisted = true;
    }

    await user.save();

    return {
      success: true,
      message: wishlisted ? "Product added to wishlist." : "Product removed from wishlist.",
    //   data: {
    //     productId: pidStr,
    //     wishlisted,
    //     wishlistsCount: user.wishLists.length,
    //   },
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
