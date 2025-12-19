"use server"
import User from "@/models/user.model"

import { NotFoundError } from "@/lib/http-errors"
import handleError from "@/lib/handlers/error"
import { action } from "@/lib/handlers/action"
import connectDB from "@/database/db"
import { trackProductViewSchema } from "@/lib/zod"

type InterestSource = "auto" | "manual"

interface UpdateInterestParams {
  userId: string
  tags: string[]
  weight: number
  source?: InterestSource
}

export async function updateUserInterestsEngine({
  userId,
  tags,
  weight,
  source = "auto",
}: UpdateInterestParams): Promise<ActionResponse> {
    try {
        await connectDB()
        const user = await User.findById(userId)
   if (!user) throw new NotFoundError("User")

  for (const tag of tags) {
    const existing = user.interests.find(i => i.tag === tag)

    if (existing) {
      existing.score = Math.min(100, existing.score + weight)
      existing.updatedAt = new Date()
      if (source === "manual") existing.source = "manual"
    } else {
      user.interests.push({
        tag,
        score: source === "manual" ? 50 : weight,
        source,
        updatedAt: new Date(),
      })
    }
  }

  await user.save()
  return {
    success: true
  }
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
         const user = await User.findById(userId)
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

