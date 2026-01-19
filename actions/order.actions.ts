"use server"
import mongoose from "mongoose";
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";

import { Cart } from "@/models/cart.model";
import Order, { IOrder, IOrderDoc, IOrderItem, OrderStatus, PaymentMethod } from "@/models/order.model";
import { IVariant, Product } from "@/models/product.model";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { clearUserCart } from "./cart.actions";
import { CancelOrderSchema, GetOrderDetailsSchema } from "@/lib/zod";
import { cache } from "@/lib/cache";
import { CreateOrderParams } from "@/types/actionTypes";


/* -----------------------------
   Action
   -----------------------------*/
export async function createOrderAction(
  params: CreateOrderParams
): Promise<ActionResponse<{order: IOrder}>> {
  // 1) auth + basic validation using your action helper
  const validated = await action({ params, authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("Not authenticated")

  const p = validated.params as CreateOrderParams;

  if (!Array.isArray(p.items) || p.items.length === 0)  throw new Error("Order must contain at least one item")
  
  if (!p.shippingAddress || !p.shippingAddress.name || !p.shippingAddress.addressLine1 || !p.shippingAddress.city) throw new Error("shipping address is required")

  const shippingCost = Number(p.shippingCost ?? 0);
  const tax = Number(p.tax ?? 0);
  const currency = p.currency ?? "MAD";

  try {
    await connectDB();

    const mongoSession = await mongoose.startSession();
    let createdOrder: IOrderDoc | null = null;

    await mongoSession.withTransaction(async () => {
      const orderItems: any[] = [];

      for (const raw of p.items) {
        // --- Resolve product id robustly ---
        let pid: string | null = null;
        if (!raw.productId) throw new Error("productId is required on each item");

        if (typeof raw.productId === "string") {
          pid = raw.productId;
        } else if (typeof raw.productId === "object") {
          // @ts-ignore
          pid = (raw.productId._id ?? raw.productId.id ?? raw.productId.productId) as string | undefined;
          if (!pid) {
            try {
              const maybe = String((raw.productId as any).toString?.() ?? "");
              if (maybe && /^[0-9a-fA-F]{24}$/.test(maybe)) pid = maybe;
            } catch {}
          }
        }

        if (!pid || !String(pid).trim() || !/^[0-9a-fA-F]{24}$/.test(String(pid))) {
          if (raw.productId && raw.productId._id) pid = String(raw.productId._id);
          else throw new Error("Invalid productId provided");
        }

        const qty = Math.max(1, Number(raw.quantity ?? 1));
        if (qty <= 0) throw new Error("Invalid quantity");

        // Load product document under session using resolved pid
        const prod = await (Product as any).findById(pid).session(mongoSession);
        if (!prod) throw new NotFoundError("Product");

        // --- Determine candidateVariantId and locate server-side variant ---
        const candidateVariantId =
          raw.variantId ??
          (raw.variant && (raw.variant.sku ?? raw.variant.sku ?? raw.variant.sku)) ??
          null;

        let variant: any = null;
        if (candidateVariantId && Array.isArray(prod.variants) && prod.variants.length) {
          variant =
            prod.variants.find((v: any) => String(v._id) === String(candidateVariantId)) ||
            prod.variants.find((v: any) => String(v.sku) === String(candidateVariantId));
        }

        // If still not found, try matching by variant.sku from client
        if (!variant && raw.variant && Array.isArray(prod.variants)) {
          if (raw.variant.sku) {
            variant = prod.variants.find((v: any) => String(v.sku) === String(raw?.variant?.sku));
          } else {
            // optional: implement attribute matching if needed
          }
        }

        // Determine unitPrice (basePrice + variant modifiers or variant price)
        let unitPrice = Number(prod.basePrice ?? 0);
        if (variant) {
          if (typeof variant.priceModifier === "number") unitPrice = unitPrice + Number(variant.priceModifier);
          else if (typeof variant.price === "number") unitPrice = Number(variant.price);
        }

        // Stock checks & decrement
        if (variant) {
          const vstock = Number(variant.stock ?? 0);
          if (vstock < qty) {
            throw new Error(`Not enough stock for variant ${candidateVariantId} of product ${prod._id}`);
          }
          const idx = prod.variants.findIndex(
            (v: any) => String(v._id) === String(variant._id) || String(v.sku) === String(candidateVariantId)
          );
          if (idx === -1) throw new Error("Variant not found when updating stock");
          prod.variants[idx].stock = vstock - qty;
        } else {
          const pstock = Number(prod.stock ?? 0);
          if (pstock < qty) {
            throw new Error(`Not enough stock for product ${prod._id}`);
          }
          prod.stock = pstock - qty;
        }

        // Save product changes (stock update) within transaction/session
        await prod.save({ session: mongoSession });

        // thumbnail resolution (variant image priority)
        const thumbnail =
          (variant && (variant.images && variant.images[0] && (variant.images[0].url || variant.images[0]))) ||
          prod.thumbnail?.url ||
          (Array.isArray(prod.images) && prod.images[0] && (prod.images[0].url || prod.images[0])) ||
          null;

        const linePrice = Math.round((unitPrice * qty + Number.EPSILON) * 100) / 100;

        // create a compact variant snapshot (prefer server variant)
        const variantSnapshot = variant
          ? {
             
              sku: variant.sku,
              priceModifier: variant.priceModifier,
              
              stock: variant.stock,
              attributes: variant.attributes ?? [],
              images: variant.images ?? [],
            }
          : raw.variant
          ? {
              sku: raw.variant.sku,
              priceModifier: raw.variant.priceModifier,
               stock: variant.stock,
              attributes: raw.variant.attributes ?? [],
              images: raw.variant.images ?? [],
            }
          : null;
        console.log(variantSnapshot, "variant from server")
        orderItems.push({
          productId: prod._id,
          name: prod.name,
          variantId: candidateVariantId ?? (variantSnapshot?.sku ?? null),
          variant: variantSnapshot,
          quantity: qty,
          unitPrice,
          linePrice,
          thumbnail,
          meta: raw.meta ?? {},
        });
      } // end items loop

      // compute totals
      const subtotal = orderItems.reduce((s, it) => s + Number(it.linePrice || 0), 0);
      const discount = 0;
      const total = Math.round((subtotal + shippingCost + tax - discount + Number.EPSILON) * 100) / 100;
  
      // payment snapshot
      const paymentSnapshot: any = p.payment
        ? {
            method: p.payment.method ?? PaymentMethod.STRIPE,
            provider: p.payment.provider ?? null,
            transactionId: p.payment.transactionId ?? null,
            paidAt: p.payment.transactionId ? new Date() : null,
            amount: p.payment ? total : null,
            cardLast4: p.payment.cardLast4 ?? null,
            cardBrand: p.payment.cardBrand ?? null,
          }
        : null;

      const orderPayload: Partial<any> = {
        userId: session.user.id,
        items: orderItems,
        shippingAddress: {
          name: p.shippingAddress.name,
          phone: p.shippingAddress.phone ?? null,
          addressLine1: p.shippingAddress.addressLine1,
          addressLine2: p.shippingAddress.addressLine2 ?? null,
          city: p.shippingAddress.city,
          state: p.shippingAddress.state ?? null,
          postalCode: p.shippingAddress.postalCode ?? null,
        
          instructions: p.shippingAddress.instructions ?? null,
        },
        billingAddress: p.billingAddress ?? null,
        subtotal,
        shippingCost,
        tax,
        discount,
        total,
        currency,
        status: paymentSnapshot && paymentSnapshot.paidAt ? "PAID" : "PENDING",
        payment: paymentSnapshot,
        notes: p.notes ?? null,
      };
      console.log(orderItems, "orderItems")

      // Create order (inside the same transaction)
      createdOrder  = await Order.create(
  [
    {
      ...orderPayload,
      checkoutId: p.checkoutId,
    },
  ],
  { session: mongoSession }
).then(res => res[0]);

      if (!createdOrder) throw new Error("Order creation failed");

      // Clear user's cart atomically inside same transaction (if using Cart collection)
      try {
        await Cart.updateOne({ userId: session.user.id }, { $set: { items: [] } }, { session: mongoSession });
      } catch (e) {
        // if Cart model isn't present or update fails, do not fail the whole order — just log
        console.error("Failed to clear cart in transaction:", e);
      }

      // optional revalidate orders page
      try {
        revalidatePath(ROUTES.myorders);
      } catch (e) {
        // ignore revalidation failures
      }
    }); // end transaction
    if(createdOrder) {
await Product.updateMany(

  // @ts-ignore
  { _id: { $in:  createdOrder.items.map((i: IOrderItem) => i.productId) }},
  { $inc: { weeklySales: 1 } })
    }
      


    mongoSession.endSession();

    if (!createdOrder) throw new Error("Failed to create order")
      revalidatePath(ROUTES.myorders)
      revalidatePath(ROUTES.admin.orders)
         
    return {
      success: true,
      data: { order: JSON.parse(JSON.stringify(createdOrder)) },
    };
  } catch (err) {
    console.error("createOrderAction error:", err);
    return handleError(err) as ErrorResponse
  }
}
type GetOrdersParams = {
  page?: number;
  pageSize?: number;
};
// TODO: FINISH FETCHING USER ORDERS WITH PAGINATION

export const getUserOrdersAction: (params?: GetOrdersParams) =>
   Promise<ActionResponse<{ orders: IOrderDoc[]; isNext: boolean; ordersLength: number }>> = cache(async (params?: GetOrdersParams) => {
  // 1) validate session / auth
  const validated = await action({ params, authorize: true });
  if (validated instanceof Error) throw validated;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("User not logged in");

  const { page = 1, pageSize = 20,} = validated.params as GetOrdersParams;
 
  try {
    await connectDB();
   const skip = pageSize * (page - 1)
    const ordersCount = await Order.countDocuments({userId: session.user.id})
    const orders = await Order.find({userId: session.user.id})
    .populate({path: "items.productId"})
    .skip(skip)
    .limit(pageSize)
    .sort({createdAt: -1})
 const isNext = ordersCount > skip + orders.length;
      return {
     success: true,
      data: {orders: JSON.parse(JSON.stringify(orders)), isNext, ordersLength:ordersCount}
  }
  } catch (err) {
     return handleError(err) as ErrorResponse
  }
}, [ROUTES.myorders, "getUserOrdersAction"], {revalidate: 60 * 60 * 24})
interface GetOrderDetailsParams {
  orderId: string
}
export async function getOrderDetails(
  params: GetOrderDetailsParams
): Promise<ActionResponse<{ order: IOrder }>> {

  const validatedResult = await action({
    params,
    schema: GetOrderDetailsSchema,
    authorize: true
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { orderId } = validatedResult.params!;
  const session = validatedResult.session;

  try {
    await connectDB();

    const order = await Order.findById(orderId)
      .populate({
        path: "items.productId",
        select: "name images basePrice _id"
      })

    if (!order) throw new NotFoundError("Order");

    if (order.userId.toString() !== session?.user.id) {
      throw new UnAuthorizedError("Unauthorized action!");
    }

    return {
      success: true,
      data: { order: JSON.parse(JSON.stringify(order))}
    };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

/**
 * Cancel an order
 * - Only the owning authenticated user may cancel their order
 * - Only cancellable statuses are allowed (e.g. PENDING, PAID — not SHIPPED/DELIVERED/CANCELLED)
 * - If order was paid, we flag refundRequested (actual refund handling is outside scope)
 * - Restores stock for product / variant when cancelled (inside transaction)
 */
export async function cancelOrderAction(params: { orderId?: string; reason?: string }): Promise<ActionResponse<{ order: IOrderDoc }>> {
  try {
    // auth + basic validation
    const validated = await action({ params, schema:CancelOrderSchema, authorize: true });
    if (validated instanceof Error) return handleError(validated) as ErrorResponse;

    const session = validated.session;
    const userId = session?.user?.id;
    if (!userId) throw new UnAuthorizedError("User must be authenticated");

    const { orderId, reason } = (validated.params ?? {}) as { orderId?: string; reason?: string };
    if (!orderId || !String(orderId).trim()) throw new Error("orderId is required");

    await connectDB();

    const mongoSession = await mongoose.startSession();
    let updatedOrder: IOrderDoc | null = null;

    await mongoSession.withTransaction(async () => {
      // normalize ids
      const oid = typeof orderId === "string" && /^[0-9a-fA-F]{24}$/.test(orderId) ? new mongoose.Types.ObjectId(orderId) : orderId;
      const uid = typeof userId === "string" && /^[0-9a-fA-F]{24}$/.test(String(userId)) ? new mongoose.Types.ObjectId(userId) : userId;

      // fetch order and ensure ownership
      const order = await Order.findOne({ _id: oid, userId: uid }).session(mongoSession);
      if (!order) throw new NotFoundError("Order not found");

      // disallow cancelling already cancelled or completed orders
      const forbidden = [OrderStatus.CANCELLED?.toString?.() ?? "CANCELLED", OrderStatus.DELIVERED?.toString?.() ?? "DELIVERED"];
      if (forbidden.includes(String(order.status))) {
        throw new Error("Order cannot be cancelled at this stage");
      }

      // Allowed to cancel if still PENDING / PAID / PROCESSING (adjust to your business rules)
      // If paid, we flag refundRequested; actual refund flow should be implemented separately
      const wasPaid = !!(order.payment && (order.payment).paidAt);

      // Restore stock for each order item
      for (const it of order.items as IOrderItem[]) {
        try {
          const pid = String(it.productId);
          const prod = await Product.findById(pid).session(mongoSession);
          if (!prod) continue;

          const qty = Number(it.quantity ?? 0);
          if (it?.variant?._id || (it.variant && (it.variant).sku)) {
            // try to find variant by _id or sku
            const vid = it.variant._id ? String(it.variant._id) : (it.variant && (it.variant).sku ? String((it.variant).sku) : null);
            if (vid) {
              const idx = prod.variants.findIndex(
                (v:IVariant) => String(v._id) === String(vid) || String(v.sku) === String(vid)
              );
              if (idx !== -1) {
                prod.variants[idx].stock = Number(prod.variants[idx].stock ?? 0) + qty;
              } else {
                // fallback: if variant not found, restore top-level stock
                prod.stock = Number(prod.stock ?? 0) + qty;
              }
            } else {
              prod.stock = Number(prod.stock ?? 0) + qty;
            }
          } else {
            // no variant: restore product-level stock
            prod.stock = Number(prod.stock ?? 0) + qty;
          }

          await prod.save({ session: mongoSession });
        } catch (e) {
          // log and continue restoring other items
          console.error("Failed restoring stock for item", it, e);
        }
      }

      // update order meta
      order.status = OrderStatus.CANCELLED ?? ("CANCELLED" as any);
      (order).cancelledAt = new Date();
      (order).cancelReason = reason;
      // @ts-ignore
      (order).canceledBy = uid;

      // flag refund requested when paid (actual refund must be handled by payments flow)
      // if (wasPaid) {
      //   order.payment = order.payment ?? {};
      //   (order.payment as any).refundRequested = true;
      //   (order.payment as any).refundRequestedAt = new Date();
      // }

      await order.save({ session: mongoSession });
      updatedOrder = order;
    });

    mongoSession.endSession();

    if (!updatedOrder) return handleError(new Error("Failed to cancel order")) as ErrorResponse;

    // best-effort revalidation
    
      revalidatePath(ROUTES.myorders);
   

    return {
      success: true,
      data: { order: JSON.parse(JSON.stringify(updatedOrder)) },
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}
