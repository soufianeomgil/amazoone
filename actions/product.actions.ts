"use server"

import { ROUTES } from "@/constants/routes"
import connectDB from "@/database/db"
import { action } from "@/lib/handlers/action"
import handleError from "@/lib/handlers/error"
import { productSchema} from "@/lib/zod"
import { Product } from "@/models/product.model"
import { CreateProductParams } from "@/types/actionTypes"
import { revalidatePath } from "next/cache"
export async function CreateProductAction(params:CreateProductParams): Promise<ActionResponse> {
   const validatedResult = await action({ params, schema: productSchema, authorize: true })
   if(validatedResult instanceof Error) {
       return handleError(validatedResult) as ErrorResponse
   }
   const { name, description, category, brand, basePrice,
       status, stock, imageUrl, images, variants, attributes, isFeatured, tags, } = validatedResult.params!
   try {
      await connectDB()
      const newProduct = await Product.create({
         name,
         brand,
         description,
         category,
         basePrice,
         status,
         isFeatured,
         tags,
         stock,
         thumbnail: imageUrl,
         variants,
         attributes,
         images,

      })
     revalidatePath(ROUTES.admin.products)
     revalidatePath("/")
      return {
         success: true,
         data: JSON.parse(JSON.stringify(newProduct))
      }
   } catch (error) {
       return handleError(error) as ErrorResponse
   }
}