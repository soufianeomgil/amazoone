"use server"
import connectDB from "@/database/db";
import { action } from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors";
import { CreateReviewParams, CreateReviewSchema } from "@/lib/zod";
import Order from "@/models/order.model";
import {  Product } from "@/models/product.model";
import Review, { IReview } from "@/models/review.model";
// server/actions/createProductReviewAction.ts


    // 3️⃣ Verified purchase check
    export default async function createProductReviewAction(
  params: CreateReviewParams
): Promise<ActionResponse<{ review: IReview; verifiedPurchase: boolean }>> {
  const validated = await action({
    params,
    schema: CreateReviewSchema,
    authorize: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.id) throw new UnAuthorizedError("");

  const {
    productId,
    rating,
    headline,
    comment,
    images = [],
    isRecommendedByBuyer,
    variantSnapshot,
  } = validated.params!;

  try {
    await connectDB();

    // 1️⃣ Ensure product exists
    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product");

    // 2️⃣ Prevent duplicate review
    const existing = await Review.findOne({
      product: productId,
      user: session.user.id,
    });

    if (existing) {
      throw new Error("You have already reviewed this product");
    }

    // 3️⃣ Verified purchase check
   
    // 4️⃣ Create review
   // 3️⃣ Verified purchase check (SERVER-ONLY)
let verifiedPurchase = false;
let verifiedOrderId: string | undefined;

if (typeof Order !== "undefined") {
  const statusAccepted = [
    "DELIVERED",
    "COMPLETED",
    "PAID",
    "SHIPPED",
    "FULFILLED",
  ];

  const order = await Order.findOne({
    userId: session.user.id,
    "items.productId": product._id,
    status: { $in: statusAccepted },
  }).sort({ createdAt: -1 }); // most recent purchase

  if (order) {
    verifiedPurchase = true;
    verifiedOrderId = String((order as any)._id);
  }
}
  
   // 🔐 Final image sanitization (server-side)
const safeImages = images.map(img => ({
  url: img.url,
  preview: img.preview,
  public_id: img.public_id,
  type: img.type ?? "image",
}));


    
  
    // 4️⃣ Create review
    const review = await Review.create({
      product: productId,
      user: session.user.id,
      userName: session.user.name ?? "Anonymous",
      rating,
      headline,
      images: safeImages,
      comment,
      orderId: verifiedOrderId,
      isVerifiedPurchase: verifiedPurchase,
      isRecommendedByBuyer,
      variantSnapshot,
      status: verifiedPurchase ? "APPROVED" : "PENDING",
    });

    // 5️⃣ Update product aggregates
    const newCount = (product.reviewCount ?? 0) + 1;
    const newAvg =
      ((product.rating ?? 0) * (newCount - 1) + rating) / newCount;

    product.reviewCount = newCount;
    product.rating = Math.round(newAvg * 100) / 100;

    await product.save();

    return {
      success: true,
      data: {
        review: JSON.parse(JSON.stringify(review)),
       
        verifiedPurchase,
      },
    }
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}

