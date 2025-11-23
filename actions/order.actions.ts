"use server"
import mongoose from "mongoose";
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import Address from "@/models/address.model";
import { Cart } from "@/models/cart.model";
import Order, { IOrder, IOrderAddress, IOrderDoc, IOrderItem, OrderStatus, PaymentMethod } from "@/models/order.model";
import { IVariant, Product } from "@/models/product.model";
import { Rewind } from "lucide-react";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { clearUserCart } from "./cart.actions";



// --- Types for incoming params ---
// type CreateOrderItem = {
//   productId: string | { _id?: string; id?: string } | any;
//   quantity: number;
//   variantId?: string | null;
//   variant?: IVariant | null; // full variant object from client (optional)
//   meta?: Record<string, any>;
// };

// type CreateOrderParams = {
//   items: CreateOrderItem[];
//   shippingAddress: {
//     name: string;
//     phone?: string | null;
//     addressLine1: string;
//     addressLine2?: string | null;
//     city: string;
//     state?: string | null;
//     postalCode?: string | null;
//     country?: string | null;
//     instructions?: string | null;
//   };
//   billingAddress?: any | null;
//   payment?: {
//     method?: keyof typeof PaymentMethod | string;
//     provider?: string | null;
//     transactionId?: string | null;
//     cardLast4?: string | null;
//     cardBrand?: string | null;
//   } | null;
//   currency?: string;
//   shippingCost?: number;
//   tax?: number;
//   notes?: string | null;
// };

// // --- Action ---
// export async function createOrderAction(
//   params: CreateOrderParams
// ): Promise<ActionResponse<{ order: any }>> {
//   // auth + basic validation
//   const validated = await action({ params, authorize: true });
//   if (validated instanceof Error) return handleError(validated) as any;

//   const session = validated.session;
//   if (!session?.user?.id) return handleError(new UnAuthorizedError("Not authenticated")) as any;

//   const p = validated.params as CreateOrderParams;

//   if (!Array.isArray(p.items) || p.items.length === 0) {
//     return handleError(new Error("Order must contain at least one item")) as any;
//   }
//   if (!p.shippingAddress || !p.shippingAddress.name || !p.shippingAddress.addressLine1 || !p.shippingAddress.city) {
//     return handleError(new Error("Shipping address is required")) as any;
//   }

//   const shippingCost = Number(p.shippingCost ?? 0);
//   const tax = Number(p.tax ?? 0);
//   const currency = p.currency ?? "MAD";

//   try {
//     await connectDB();

//     const mongoSession = await mongoose.startSession();
//     let createdOrder: IOrderDoc | null = null;

//     await mongoSession.withTransaction(async () => {
//       const orderItems: any[] = [];

//       for (const raw of p.items) {
//        // --- resolve product id robustly ---
//         let pid: string | null = null;
//         if (!raw.productId) throw new Error("productId is required on each item");

//         if (typeof raw.productId === "string") {
//           pid = raw.productId;
//         } else if (typeof raw.productId === "object") {
//          // common shapes: { _id: '...', id: '...' } or populated mongoose doc
//           pid = raw.productId._id ?? raw.productId.id ?? raw.productId.productId ?? null;
//         //  if still null try toString() if it's an ObjectId instance
//           if (!pid) {
//             try {
//              // if this is a mongoose ObjectId or has toString producing 24 hex chars
//               const maybe = String((raw.productId as any).toString?.() ?? "");
//               if (maybe && /^[0-9a-fA-F]{24}$/.test(maybe)) pid = maybe;
//             } catch {}
//           }
//         }

//         if (!pid || !String(pid).trim() || !/^[0-9a-fA-F]{24}$/.test(String(pid))) {
//          // final attempt: if client passed an entire product object, try to read its _id value's string
//           if (raw.productId && raw.productId._id) pid = String(raw.productId._id);
//           else throw new Error("Invalid productId provided");
//         }

//         const qty = Math.max(1, Number(raw.quantity ?? 1));
//         if (qty <= 0) throw new Error("Invalid quantity");

//       //  Load product document under session using resolved pid
//         const prod = await Product.findById(pid).session(mongoSession);
//         if (!prod) throw new NotFoundError("Product");
 


//        // Find variant either by raw.variantId (string) or raw.variant object (with _id or sku)
//         let variant: any = null;
//         const candidateVariantId = raw.variantId ?? (raw.variant && (raw.variant.sku ?? raw.variant.sku ?? raw.variant.sku)) ?? null;

//         if (candidateVariantId && Array.isArray(prod.variants) && prod.variants.length) {
//           variant =
//             prod.variants.find((v: any) => String(v._id) === String(candidateVariantId)) ||
//             prod.variants.find((v: any) => String(v.sku) === String(candidateVariantId));
//         }

//         // If client passed a full variant object (and we didn't find one by id/sku), try to match by attributes or SKU
//         if (!variant && raw.variant && Array.isArray(prod.variants)) {
//           // try match by SKU if present
//           if (raw.variant.sku) {
//             variant = prod.variants.find((v: any) => String(v.sku) === String(raw?.variant?.sku));
//           }
//         }

//         // Determine unitPrice
//         let unitPrice = Number(prod.basePrice ?? 0);
//         if (variant) {
//           if (typeof variant.priceModifier === "number") unitPrice = unitPrice + Number(variant.priceModifier);
//           else if (typeof variant.price === "number") unitPrice = Number(variant.price);
//         }

//         // Stock checks & decrement
//         if (variant) {
//           const vstock = Number(variant.stock ?? 0);
//           if (vstock < qty) {
//             throw new Error(`Not enough stock for variant ${candidateVariantId} of product ${prod._id}`);
//           }
//           const idx = prod.variants.findIndex((v: any) => String(v._id) === String(variant._id) || String(v.sku) === String(candidateVariantId));
//           if (idx === -1) throw new Error("Variant not found when updating stock");
//           prod.variants[idx].stock = vstock - qty;
//         } else {
//           const pstock = Number(prod.stock ?? 0);
//           if (pstock < qty) {
//             throw new Error(`Not enough stock for product ${prod._id}`);
//           }
//           prod.stock = pstock - qty;
//         }

//         // Save product changes (stock update)
//         await prod.save({ session: mongoSession });

//         // thumbnail resolution (variant image priority)
//         const thumbnail =
//           (variant && (variant.images && variant.images[0] && (variant.images[0].url || variant.images[0]))) ||
//           prod.thumbnail?.url ||
//           (Array.isArray(prod.images) && prod.images[0] && (prod.images[0].url || prod.images[0])) ||
//           null;

//         const linePrice = Math.round((unitPrice * qty + Number.EPSILON) * 100) / 100;

//         orderItems.push({
//           productId: prod._id,
//           name: prod.name ?? prod.name ?? "Product",
//           variantId: candidateVariantId ?? null,
//           variant: raw.variant ?? null,
//           quantity: qty,
//           unitPrice,
//           linePrice,
//           thumbnail,
//           meta: raw.meta ?? {},
//         });
//       } // end items loop

//       // compute totals
//       const subtotal = orderItems.reduce((s, it) => s + Number(it.linePrice || 0), 0);
//       const discount = 0;
//       const total = Math.round((subtotal + shippingCost + tax - discount + Number.EPSILON) * 100) / 100;

//       // payment snapshot
//       const paymentSnapshot: any = p.payment
//         ? {
//             method: p.payment.method ?? PaymentMethod.STRIPE,
//             provider: p.payment.provider ?? null,
//             transactionId: p.payment.transactionId ?? null,
//             paidAt: p.payment.transactionId ? new Date() : null,
//             amount: p.payment ? total : null,
//             cardLast4: p.payment.cardLast4 ?? null,
//             cardBrand: p.payment.cardBrand ?? null,
//           }
//         : null;

//       const orderPayload: Partial<any> = {
//         userId: session.user.id,
//         items: orderItems,
//         shippingAddress: {
//           name: p.shippingAddress.name,
//           phone: p.shippingAddress.phone ?? null,
//           addressLine1: p.shippingAddress.addressLine1,
//           addressLine2: p.shippingAddress.addressLine2 ?? null,
//           city: p.shippingAddress.city,
//           state: p.shippingAddress.state ?? null,
//           postalCode: p.shippingAddress.postalCode ?? null,
//           country: p.shippingAddress.country ?? null,
//           instructions: p.shippingAddress.instructions ?? null,
//         },
//         billingAddress: p.billingAddress ?? null,
//         subtotal,
//         shippingCost,
//         tax,
//         discount,
//         total,
//         currency,
//         status: paymentSnapshot && paymentSnapshot.paidAt ? "PAID" : "PENDING",
//         payment: paymentSnapshot,
//         notes: p.notes ?? null,
//       };

//       // Create order
//       createdOrder = await (Order as any).createForUser(session.user.id, orderPayload);
//       if (!createdOrder) throw new Error("Order creation failed");

//       // optional revalidate
//       try {
//         revalidatePath?.(ROUTES?.myorders ?? "/orders");
//       } catch (e) {}
//     }); // end transaction

//     mongoSession.endSession();

//     if (!createdOrder) throw new Error("Failed to create order")
//       await clearUserCart({userId:session.user.id})
//     // return plain JS object (safe to send to client)
//     return {
//       success: true,
//       data: { order: JSON.parse(JSON.stringify(createdOrder)) },
//     };
//   } catch (err: any) {
//     console.error("createOrderAction error:", err);
//     return handleError(err) as any;
//   }
// }

type CreateOrderItem = {
  productId: string | { _id?: string; id?: string } | any;
  quantity: number;
  variantId?: string | null;
  variant?: IVariant | null;
  meta?: Record<string, any>;
};

type CreateOrderParams = {
  items: CreateOrderItem[];
  shippingAddress: {
    name: string;
    phone?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
    instructions?: string | null;
  };
  billingAddress?: any | null;
  payment?: {
    method?: keyof typeof PaymentMethod | string;
    provider?: string | null;
    transactionId?: string | null;
    cardLast4?: string | null;
    cardBrand?: string | null;
  } | null;
  currency?: string;
  shippingCost?: number;
  tax?: number;
  notes?: string | null;
};

/* -----------------------------
   Action
   -----------------------------*/
export async function createOrderAction(
  params: CreateOrderParams
): Promise<{ success: boolean; data?: { order: any }; error?: any }> {
  // 1) auth + basic validation using your action helper
  const validated = await action({ params, authorize: true });
  if (validated instanceof Error) return handleError(validated) as any;

  const session = validated.session;
  if (!session?.user?.id) return handleError(new UnAuthorizedError("Not authenticated")) as any;

  const p = validated.params as CreateOrderParams;

  if (!Array.isArray(p.items) || p.items.length === 0) {
    return handleError(new Error("Order must contain at least one item")) as any;
  }
  if (!p.shippingAddress || !p.shippingAddress.name || !p.shippingAddress.addressLine1 || !p.shippingAddress.city) {
    return handleError(new Error("Shipping address is required")) as ErrorResponse
  }

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
          name: prod.name ?? "Product",
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
          country: p.shippingAddress.country ?? null,
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

      // Create order (inside the same transaction)
      createdOrder = await (Order as any).createForUser(session.user.id, orderPayload);
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
        revalidatePath?.(ROUTES?.myorders ?? "/orders");
      } catch (e) {
        // ignore revalidation failures
      }
    }); // end transaction

    mongoSession.endSession();

    if (!createdOrder) return handleError(new Error("Failed to create order")) as any;

    return {
      success: true,
      data: { order: JSON.parse(JSON.stringify(createdOrder)) },
    };
  } catch (err: any) {
    console.error("createOrderAction error:", err);
    return handleError(err) as any;
  }
}
type GetOrdersParams = {
  page?: number;
  pageSize?: number;
};
// TODO: FINISH FETCHING USER ORDERS WITH PAGINATION
// TODO: that page design [Ai] ;
export async function getUserOrdersAction(
  params: GetOrdersParams
): Promise<ActionResponse<{ orders: IOrderDoc[]; isNext: boolean; ordersLength: number }>> {
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
}
