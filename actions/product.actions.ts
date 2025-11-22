"use server"

import { ROUTES } from "@/constants/routes"
import connectDB from "@/database/db"
import { action } from "@/lib/handlers/action"
import handleError from "@/lib/handlers/error"
import { NotFoundError } from "@/lib/http-errors"
import { GetSingleProductSchema, productSchema} from "@/lib/zod"
import { IProduct, Product } from "@/models/product.model"
import { CreateProductParams, GetSingleProductParams } from "@/types/actionTypes"
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

export async function getAllProducts(): Promise<ActionResponse<{products: IProduct[]}>> {
   try {
       await connectDB()
       const products = await Product.find({})
       return {
         success: true,
         data: {products: JSON.parse(JSON.stringify(products))}
       }
   } catch (error) {  
       return handleError(error) as ErrorResponse
   }
}

export async function getSignleProduct(params:GetSingleProductParams): Promise<ActionResponse<{product: IProduct}>>  {
    const validatedResult = await action({params,schema: GetSingleProductSchema,authorize:false})
    if(validatedResult instanceof Error) {
         return handleError(validatedResult) as ErrorResponse;
    }
    const { productId } = validatedResult.params!
   try {
      await connectDB()
      const product = await Product.findById(productId)
      if(!product) {
         throw new NotFoundError("Product")
      }
      return {
         success: true,
         data: {product: JSON.parse(JSON.stringify(product))}
      }

   } catch (error) {
      return handleError(error) as ErrorResponse;
   }
}