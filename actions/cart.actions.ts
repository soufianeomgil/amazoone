'use server';

import { auth } from '@/auth';
import connectDB from '@/database/db';
import { action } from '@/lib/handlers/action';
import handleError from '@/lib/handlers/error';
import { Cart, ICart, ICartItem } from '@/models/cart.model';
import { revalidatePath } from 'next/cache';
import z from 'zod';

interface AddToCartParams {
  guestId?: string | null;
  item: {
    productId: string;
    quantity: number;
    variantId?: string | null;
    variant?: Record<string, any> | null;
  };
}

export async function addToCart({ guestId, item }: AddToCartParams): Promise<ActionResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;
    await connectDB();

    let cart;

    // Find or create cart for user or guest
    if (userId) {
      cart = await Cart.findOne({ userId });
      if (!cart) cart = new Cart({ userId, items: [] });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
      if (!cart) cart = new Cart({ guestId, items: [] });
    } else {
      throw new Error('Missing guestId or userId.');
    }

    // Normalize variantId (treat undefined as null for consistent matching)
    const variantId = item.variantId ?? null;

    // Find existing item by productId + variantId
    const existingItemIndex = cart.items.findIndex(
      (cartItem: any) =>
        cartItem.productId.toString() === item.productId &&
        (cartItem.variantId ?? null) === variantId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity;
      // Optionally update variant metadata if provided (merge)
      if (item.variant) {
        cart.items[existingItemIndex].variant = {
          ...((cart.items[existingItemIndex].variant as any) || {}),
          ...item.variant,
        };
      }
    } else {
      cart.items.push({
        productId: item.productId,
        quantity: item.quantity,
        variantId,
        variant: item.variant ?? null,
      });
    }

    await cart.save();

    // Optional revalidation
    try {
      revalidatePath('/cart');
    } catch (e) {
      // ignore revalidation errors
    }

    return { success: true, cart: JSON.parse(JSON.stringify(cart)) };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

// export async function removeFromCart({
//   guestId,
//   productId,
//   variantId,
// }: {
//   guestId?: string | null;
//   productId: string;
//   variantId?: string | null;
// }): Promise<ActionResponse> {
//   try {
//     const session = await auth();
//     const userId = session?.user?.id ?? null;
//     await connectDB();

//     let cart;

//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (guestId) {
//       cart = await Cart.findOne({ guestId });
//     }

//     if (!cart) throw new Error('Cart not found');

//     const normalizedVariantId = variantId ?? null;

//     cart.items = cart.items.filter(
//       (item: ICartItem) =>
//         !(
//           item.productId.toString() === productId &&
//           (item.variant._id) === normalizedVariantId
//         )
//     );

//     await cart.save();

//     try {
//       revalidatePath('/cart');
//       revalidatePath('/');
//     } catch (e) {}

//     return { success: true, cart: JSON.parse(JSON.stringify(cart)), message: "product has been removed from your cart" };
//   } catch (error) {
//     return handleError(error) as ErrorResponse;
//   }
// }

// export async function updateCartItemQuantity({
//   guestId,
//   productId,
//   variantId,
//   quantity,
// }: {
//   guestId?: string | null;
//   productId: string;
//   variantId?: string | null;
//   quantity: number;
// }): Promise<ActionResponse<{ cart: ICart }>> {
//   try {
//     const session = await auth();
//     const userId = session?.user?.id ?? null;
//     await connectDB();

//     let cart;

//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (guestId) {
//       cart = await Cart.findOne({ guestId });
//     }

//     if (!cart) throw new Error('Cart not found');

//     const normalizedVariantId = variantId ?? null;

//     const item = cart.items.find(
//       (i: any) =>
//         i.productId.toString() === productId &&
//         (i.variantId ?? null) === normalizedVariantId
//     );

//     if (!item) throw new Error('cart item not found');

//     item.quantity = quantity;

//     await cart.save();

//     return {
//       success: true,
//       data: { cart: JSON.parse(JSON.stringify(cart)) },
//     };
//   } catch (error) {
//     return handleError(error) as ErrorResponse;
//   }
// }
// Replace the existing `updateCartItemQuantity` with this improved version
export async function updateCartItemQuantity({
  guestId,
  productId,
  variantId,
  quantity,
}: {
  guestId?: string | null;
  productId: string;
  variantId?: string | null;
  quantity: number;
}): Promise<ActionResponse<{ cart: ICart }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;
    await connectDB();

    let cart: any;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) throw new Error("Cart not found");

    // Normalize variantId: treat '', undefined, null the same way (no variant)
    const normalizedVariantId = variantId && String(variantId).trim() !== "" ? String(variantId) : null;

    // find item robustly — productId / variantId may be stored as ObjectId or string
    const item = cart.items.find((i: ICartItem) => {
      const storedProductId = String(i.productId);
      // stored variant may be undefined/null/ObjectId/string
      const storedVariant = i.variant._id === undefined || i.variant._id === null ? null : String(i.variant._id);
      return storedProductId === String(productId) && storedVariant === normalizedVariantId;
    });

    if (!item) throw new Error("cart item not found");

    // clamp quantity (optional) — keep as you had, but prevent negative
    if (quantity < 0) throw new Error("Quantity must be >= 0");

    item.quantity = quantity;

    await cart.save();

    return {
      success: true,
      data: { cart: JSON.parse(JSON.stringify(cart)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function removeFromCart({
  guestId,
  productId,
  variantId,
}: {
  guestId?: string | null;
  productId: string;
  variantId?: string | null;
}): Promise<ActionResponse> {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;
    await connectDB();

    let cart;

    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (guestId) {
      cart = await Cart.findOne({ guestId });
    }

    if (!cart) throw new Error('Cart not found');

    const normalizedVariantId = variantId ?? null;

    cart.items = cart.items.filter((item: ICartItem) => {
      const itemVariantId = String(item.variant?._id) ?? null; // safely handle missing variant
      return !(item.productId.toString() === productId && itemVariantId === normalizedVariantId);
    });

    await cart.save();

    // Revalidate Next.js paths if needed
    try {
      revalidatePath('/cart');
      revalidatePath('/');
    } catch (e) {}

    return {
      success: true,
      cart: JSON.parse(JSON.stringify(cart)),
      message: "Product has been removed from your cart",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const syncCarts = async (guestId: string | null): Promise<ActionResponse<{ mergedCart: any }>> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('No userId provided. Skipping sync.');

  try {
    await connectDB();

    const guestCart = guestId ? await Cart.findOne({ guestId }) : null;
    let userCart = await Cart.findOne({ userId });

    let mergedItems: any[] = [];

    if (userCart && userCart.items) {
      mergedItems = [...userCart.items.map((it: any) => ({ ...it, variantId: it.variantId ?? null }))];
    }

    if (guestCart && guestCart.items && guestCart.items.length > 0) {
      guestCart.items.forEach((guestItem: any) => {
        const guestVariantId = guestItem.variantId ?? null;
        const index = mergedItems.findIndex(
          (item: any) =>
            item?.productId?.toString() === guestItem?.productId?.toString() &&
            (item.variantId ?? null) === guestVariantId
        );

        if (index > -1) {
          // merge quantities
          mergedItems[index].quantity += guestItem.quantity;
        } else {
          // push new item, keep variant metadata
          mergedItems.push({
            productId: guestItem.productId,
            quantity: guestItem.quantity,
            variantId: guestVariantId,
            variant: guestItem.variant ?? null,
          });
        }
      });
    }

    const updatedUserCart = await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          guestId: null,
          items: mergedItems,
        },
      },
      { new: true, upsert: true }
    );

    if (guestCart) {
      await Cart.deleteOne({ guestId: guestCart.guestId });
    }

    // populate product data
    const populatedCart = await Cart.findById(updatedUserCart._id).populate({
      path: "items.productId",
    });

    if (!populatedCart) {
      return { success: false, message: "Failed to populate user cart." };
    }

    const formattedItems = populatedCart.items.map((item: any) => ({
      _id: item.productId._id,
      name: item.productId.name,
      imageUrl: item.productId.thumbnail,
      // && item.productId.images.length ? item.productId.images[0].url : ""
      basePrice: item.productId.price,
      quantity: item.quantity,
      variantId: item.variantId ?? null,
      variant: item.variant ?? null,
    }));

    return {
      success: true,
      data: { mergedCart: JSON.parse(JSON.stringify(formattedItems)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
interface GetUserCartParams {
  userId: string;
}
// getAuthenticatedUserCart (returns user cart + qty) - updated to include variant info in items
export const getAuthenticatedUserCart = async (params: GetUserCartParams): Promise<ActionResponse<{ userCart: ICart; qty: number }>> => {
  const { userId } = params;
  if (!userId) return { success: false };

  try {
    await connectDB();
    const userCart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
    });

    if (!userCart) throw new Error('USER CART NOT FOUND');

    const qty: number = userCart.items.reduce((current: number, item: any) => current + item.quantity, 0);

    // Return cart as-is (contains variantId & variant)
    return {
      success: true,
      data: { userCart: JSON.parse(JSON.stringify(userCart)), qty }
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
interface ClearUserCartParams  {
   userId: string
}
const ClearCartSchema = z.object({
  userId: z.string().min(1, {message: "user ID is required"})
})
export async function clearUserCart(params: ClearUserCartParams, options: { authorize?: boolean } = {}): Promise<ActionResponse> {
  const validatedResult = await action({ params, schema: ClearCartSchema, authorize: options.authorize ?? false })
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId } = validatedResult.params ?? {}
  if (!userId) throw new Error('User ID is missing to clear cart')
  try {
    await connectDB()
    const cart = await Cart.findOne({ userId })
    if (!cart) throw new Error('no cart found to clear')
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    )
    return {
      success: true,
      message: "user cart has been cleared successfully"
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
