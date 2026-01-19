"use server"
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { Cart, ICart } from "@/models/cart.model";
import { IProduct, Product } from "@/models/product.model";
import User, { IUser } from "@/models/user.model";

// server/actions/validateCheckoutAction.ts
import { z } from "zod";


const ValidateSchema = z.object({
  step: z.number().min(1).max(5).optional().default(1),
});

export type ValidateParams = z.infer<typeof ValidateSchema>;

/**
 * Returns { allowed, reason, details } where details has helpful booleans
 */
export default async function validateCheckoutAction(params: ValidateParams): Promise<ActionResponse<{ allowed: boolean; reason?: string; details?: {
cartHasItems?: boolean, outOfStock?: boolean, hasAddresses?: boolean, signedIn?: boolean , outOfStockItems?: any
} }>> {
  const validated = await action({ params, schema: ValidateSchema, authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) {
    return { success: true, data: { allowed: false, reason: "NOT_AUTHENTICATED", details: {} } };
  }

  const { step } = validated.params as ValidateParams;

  try {
    await connectDB();

    // load user
    const user = await User.findById(session.user.id) as IUser
    if (!user) throw new NotFoundError("User");

    // basic checks
    const hasAddresses = Array.isArray(user.addresses) && user.addresses.length > 0;

    // load cart for user
    const cart = await Cart.findOne({ userId: user._id }) as ICart
    const cartHasItems = !!(cart && Array.isArray(cart.items) && cart.items.length > 0);

    // optional: check stock for cart items (cheap check: compare qty to product totalStock or variant stock)
    let outOfStock = false;
    const outOfStockItems: Array<{ productId: string; available: number; requested: number }> = [];

    if (cartHasItems) {
      for (const it of cart!.items) {
        const p = await Product.findById(it.productId) as IProduct
        if (!p) {
          outOfStock = true;
          outOfStockItems.push({ productId: String(it.productId), available: 0, requested: it.quantity });
          continue;
        }
        let available = 0;
        if (it.variantId) {
          const variant = (p.variants || []).find((v: any) => String(v.sku) === String(it.variantId));
          available = variant ? (variant.stock ?? 0) : 0;
        } else {
          available = p.totalStock ?? (p.stock ?? 0);
        }
        if (available < it.quantity) {
          outOfStock = true;
          outOfStockItems.push({ productId: String(it.productId), available, requested: it.quantity });
        }
      }
    }

    // Decision logic based on 'step'
    // Step mapping: 1: SignIn, 2: Shipping (requires auth + address), 3: Payment (requires shipping + cart), 4+: Review/Place (requires everything)
    if (step === 1) {
      // sign-in step: only need to ensure auth (we reach here only when signed in because authorize:true in action)
      return { success: true, data: { allowed: true, details: { signedIn: true } } };
    }

    if (step === 2) {
      if (!hasAddresses) return { success: true, data: { allowed: false, reason: "NO_ADDRESS", details: { hasAddresses } } };
      return { success: true, data: { allowed: true, details: { hasAddresses } } };
    }

    if (step === 3) {
      if (!cartHasItems) return { success: true, data: { allowed: false, reason: "CART_EMPTY", details: { cartHasItems } } };
      if (outOfStock) return { success: true, data: { allowed: false, reason: "OUT_OF_STOCK", details: { outOfStockItems } } };
      if (!hasAddresses) return { success: true, data: { allowed: false, reason: "NO_ADDRESS", details: { hasAddresses } } };
      return { success: true, data: { allowed: true, details: { cartHasItems, outOfStock: false, hasAddresses } } };
    }

    // step >=4 (review/place)
    if (!cartHasItems) return { success: true, data: { allowed: false, reason: "CART_EMPTY", details: { cartHasItems } } };
    if (outOfStock) return { success: true, data: { allowed: false, reason: "OUT_OF_STOCK", details: { outOfStockItems } } };
    if (!hasAddresses) return { success: true, data: { allowed: false, reason: "NO_ADDRESS", details: { hasAddresses } } };

    return { success: true, data: { allowed: true, details: { cartHasItems, outOfStock: false, hasAddresses } } };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}
