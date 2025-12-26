"use server"
import User, { IUser } from "@/models/user.model"

import { NotFoundError } from "@/lib/http-errors"
import handleError from "@/lib/handlers/error"
import { action } from "@/lib/handlers/action"
import connectDB from "@/database/db"
import { trackProductViewSchema } from "@/lib/zod"
import { IProduct } from "@/models/product.model"
import { auth } from "@/auth"

type InterestSource = "auto" | "manual"

interface UpdateInterestParams {
  userId: string
  tags: string[]
  weight: number
  source?: InterestSource
}

// export async function updateUserInterestsEngine({
//   userId,
//   tags,
//   weight,
//   source = "auto",
// }: UpdateInterestParams): Promise<ActionResponse> {
//     try {
//         await connectDB()
//         const user = await User.findById(userId)
//    if (!user) throw new NotFoundError("User")

//   for (const tag of tags) {
//     const existing = user.interests.find(i => i.tag === tag)

//     if (existing) {
//       existing.score = Math.min(100, existing.score + weight)
//       existing.updatedAt = new Date()
//       if (source === "manual") existing.source = "manual"
//     } else {
//       user.interests.push({
//         tag,
//         score: source === "manual" ? 50 : weight,
//         source,
//         updatedAt: new Date(),
//       })
//     }
//   }

//   await user.save()
//   return {
//     success: true
//   }
//     } catch (error) {
//        return handleError(error) as ErrorResponse
//     }
  
// }
export async function updateUserInterestsEngine({
  userId,
  tags,
  weight,
  source = "auto",
}: UpdateInterestParams): Promise<ActionResponse> {
  try {
    await connectDB()

    const user = await User.findById(userId) as IUser
    if (!user) throw new NotFoundError("User")

    for (const rawTag of tags) {
      const tag = rawTag.trim().toLowerCase()

      const interest = user.interests.find(i => i.tag === tag)

      if (interest) {
        interest.score = Math.min(100, interest.score + weight)
        interest.updatedAt = new Date()
        if (source === "manual") interest.source = "manual"
      } else {
        user.interests.push({
          tag,
          score: source === "manual" ? 50 : Math.min(weight, 100),
          source,
          updatedAt: new Date(),
        })
      }
    }

    // 🔒 Deduplicate as final safety net
    user.interests = Array.from(
      new Map(user.interests.map(i => [i.tag, i])).values()
    )
   // @ts-ignore
    await user.save()

    return { success: true }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

interface trackProductViewParams {
  userId: string
  productId: string
  productTags: string[]
}
export async function trackProductView(params: trackProductViewParams) : Promise<ActionResponse>{
  // DO THIS LIKE CART GUEST AND USER;
  //  const validatedResult = await action({params,schema:trackProductViewSchema})
  //  if(validatedResult instanceof Error) {
  //     return handleError(validatedResult) as ErrorResponse
  //  }
   const {userId,productId,productTags} = params;
    try {
        await connectDB()
         const user = await User.findById(userId) as IUser
    if (!user) throw new NotFoundError("User")
    
  const existing = user.browsingHistory.find(
    h => String(h.product) === productId
  )

  if (existing) {
    existing.viewCount += 1
    existing.viewedAt = new Date()
  } else {
    user.browsingHistory.unshift({
      product: productId,
      viewedAt: new Date(),
      viewCount: 1,
    })
  }

  // 🧹 Keep last 50 items only (Amazon does this)
  user.browsingHistory = user.browsingHistory.slice(0, 50)
 // @ts-ignore
  await user.save()

  // 🧠 Feed auto-interest learning
  await updateUserInterestsEngine({
    userId,
    tags: productTags,
    weight: 2, // browsing = weak signal
    source: "auto",
  })
  return {
    success: true
  }
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
type IUserPopulated = Omit<IUser, "browsingHistory"> & {
  browsingHistory: {
    product: IProduct
    viewedAt: Date
    viewCount: number
  }[]
}

export async function getRecentlyViewedProducts(): Promise<ActionResponse<{items:IUserPopulated}>> {
  // come back here for guest and user same like cart; handle this
  const session = await auth()
  try {
    const recentlyViewed = await User.findById(session?.user.id)
  .populate({
    path: "browsingHistory.product",
  })
  return {
    success: true,
     data: {items: JSON.parse(JSON.stringify(recentlyViewed))}
  }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

