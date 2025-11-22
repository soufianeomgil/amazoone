"use server"
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import Order from "@/models/order.model";
import { IReview, Product } from "@/models/product.model";
// server/actions/createProductReviewAction.ts
import mongoose from "mongoose";
import { z } from "zod";

const CreateReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(2000).optional().default(""),
  // optional: if client passes orderId to help verification
  orderId: z.string().optional(),
});

export type CreateReviewParams = z.infer<typeof CreateReviewSchema>;

export default async function createProductReviewAction(
  params: CreateReviewParams
): Promise<ActionResponse<{ review: IReview; verifiedPurchase: boolean }>> {
  const validated = await action({ params, schema: CreateReviewSchema, authorize: true });
  if (validated instanceof Error) return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("")

  const { productId, rating, comment, orderId } = validated.params as CreateReviewParams;

  try {
    await connectDB();

    const mongoSession = await mongoose.startSession();
    let createdReview: IReview | null = null;
    let verifiedPurchase = false;

    await mongoSession.withTransaction(async () => {
      // 1) load product
      const product = await Product.findById(productId).session(mongoSession);
      if (!product) throw new NotFoundError("Product");

      // 2) prevent duplicate reviews by same user
      const already = (product.reviews || []).some((r: IReview) => String(r.user) === String(session.user.id));
      if (already) {
        throw new Error("You have already submitted a review for this product");
      }

      // 3) check verified purchase (best-effort)
      try {
        // If Order model exists, try to find an order by this user that contains the product
        if (typeof Order !== "undefined" && Order) {
          const statusAccepted = ["DELIVERED", "COMPLETED", "PAID", "SHIPPED", "FULFILLED"];
          const orderQuery: any = {
            userId: session.user.id,
            "items.productId": product._id,
            status: { $in: statusAccepted },
          };

          // if client provided orderId, prefer checking that specific order
          if (orderId) {
            orderQuery._id = orderId;
          }

          const found = await Order.findOne(orderQuery).session(mongoSession)
          verifiedPurchase = !!found;
        }
      } catch (err) {
        // if any error occurs during order lookup, just treat as not verified (do not fail the review)
        verifiedPurchase = false;
      }

      // 4) create review object and push
      const reviewObj = {
        user: session.user.id,
        name: session.user.name ?? undefined, // if you store user's name in session
        rating,
        comment: (comment || "").trim(),
        createdAt: new Date(),
      };

      product.reviews = product.reviews || [];
      // @ts-ignore
      product.reviews.push(reviewObj);

      // update reviewCount & rating (incremental average)
      const prevCount = product.reviewCount ?? 0;
      const prevAvg = product.rating ?? 0;
      const newCount = prevCount + 1;
      const newAvg = (prevAvg * prevCount + rating) / newCount;

      product.reviewCount = newCount;
      product.rating = Math.round((newAvg + Number.EPSILON) * 100) / 100; // round to 2 decimals

      await product.save({ session: mongoSession });

      // return last pushed review (the one we just added)
      createdReview = product.reviews[product.reviews.length - 1];
    });

    mongoSession.endSession();

    return {
      success: true,
      data: { review: createdReview, verifiedPurchase },
    } as ActionResponse<{ review: any; verifiedPurchase: boolean }>;
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}
