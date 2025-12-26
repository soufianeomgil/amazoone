"use server"

import { ROUTES } from "@/constants/routes"
import cron from "node-cron";
import connectDB from "@/database/db"
import { action } from "@/lib/handlers/action"
import { deleteFromCloudinary } from "@/lib/handlers/cloudinaryHelper"
import handleError from "@/lib/handlers/error"
import { NotFoundError, UnAuthorizedError } from "@/lib/http-errors"
import { DeleteProductSchema, GetSingleProductSchema, productSchema} from "@/lib/zod"
import { IProduct, Product } from "@/models/product.model"
import { CreateProductParams, GetSingleProductParams } from "@/types/actionTypes"
import { revalidatePath } from "next/cache"
import Review from "@/models/review.model";
import { auth } from "@/auth";
import User, { IUser } from "@/models/user.model";
export async function CreateProductAction(params:CreateProductParams): Promise<ActionResponse> {
   const validatedResult = await action({ params, schema: productSchema, authorize: true })
   if(validatedResult instanceof Error) {
       return handleError(validatedResult) as ErrorResponse
   }
   const { name, description, category, brand, basePrice, isTrendy, isBestSeller,
       status, stock, imageUrl, images, listPrice, variants, attributes, isFeatured, tags, } = validatedResult.params!
   try {
      await connectDB()
      const newProduct = await Product.create({
         name,
         brand,
         isTrendy,
         isBestSeller,
         description,
         category,
         basePrice,
         listPrice,
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
// talk to chatgpt about that comeback football competitin mindset 
type GetAllProductsParams = {
  q?: string;
  category?: string;
  brands?: string | string[];
  tags?: string | string[];
  priceMin?: number | string;
  priceMax?: number | string;
  inStockOnly?: boolean | string;
  sort?: "relevance" | "newest" | "price_asc" | "price_desc";
  page?: number | string;
  perPage?: number | string;
};

export async function getAllProducts(
  params: GetAllProductsParams = {}
): Promise<
  ActionResponse<{
    products: IProduct[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  }>
> {
  try {
    await connectDB();

    const MAX_PER_PAGE = 10;
    const page = Math.max(1, Number(params.page ?? 1));
    let perPage = Math.max(1, Number(params.perPage ?? 20));
    perPage = Math.min(perPage, MAX_PER_PAGE);
    const skip = (page - 1) * perPage;

    const q = typeof params.q === "string" && params.q.trim() ? String(params.q).trim() : undefined;
    const category = typeof params.category === "string" && params.category.trim() ? String(params.category).trim() : undefined;

    // brands / tags normalization
    const normalizeToArray = (v?: string | string[]) =>
      Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean) : typeof v === "string" && v.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const brands = normalizeToArray(params.brands);
    const tags = normalizeToArray(params.tags);

    const priceMin = params.priceMin != null ? Number(params.priceMin) : undefined;
    const priceMax = params.priceMax != null ? Number(params.priceMax) : undefined;
    const inStockOnly = params.inStockOnly === true || String(params.inStockOnly).toLowerCase() === "true";

    const sortParam = (params.sort as GetAllProductsParams["sort"]) || "relevance";

    // Build filter
    const filter: any = { /* optionally exclude archived/drafts here if you store that */ };

    if (category && category !== "all") {
      // your schema stores category as a string (slug or name). Adjust if you keep slugs.
      filter.category = category;
    }

    if (brands.length) filter.brand = { $in: brands };
    if (tags.length) filter.tags = { $in: tags };

    if (!isNaN(Number(priceMin)) || !isNaN(Number(priceMax))) {
      const pcond: any = {};
      if (!isNaN(Number(priceMin))) pcond.$gte = Number(priceMin);
      if (!isNaN(Number(priceMax))) pcond.$lte = Number(priceMax);
      filter.basePrice = pcond;
    }

    if (inStockOnly) {
      // use variants stock or product stock / virtual totalStock is not queryable directly, but we can check variants or stock
      filter.$or = [{ stock: { $gt: 0 } }, { "variants.stock": { $gt: 0 } }];
    }

    // Search: prefer $text (you created a text index on name, description, brand, tags)
    if (q) {
      filter.$text = { $search: q };
    }

    // Sorting
    let sort: Record<string, any> = { updatedAt: -1 };
    if (sortParam === "newest") sort = { createdAt: -1 };
    else if (sortParam === "price_asc") sort = { basePrice: 1 };
    else if (sortParam === "price_desc") sort = { basePrice: -1 };
    else if (sortParam === "relevance" && filter.$text) sort = { score: { $meta: "textScore" }, updatedAt: -1 };

    // projection to keep response small
    const projection: any = {
      _id: 1,
      name: 1,
      slug: 1,
      brand: 1,
      basePrice: 1,
      thumbnail: 1,
      images: 1,
      rating: 1,
      reviewCount: 1,
      isFeatured: 1,
      stock: 1,
      variants: { $slice: 3 }, // return up to first 3 variants
      createdAt: 1,
      updatedAt: 1,
    };

    let products: any[] = [];
    let total = 0;

    if (filter.$text) {
      // use aggregation to include text score and total count in a single pipeline
      const pipeline: any[] = [
        { $match: filter },
        { $addFields: { score: { $meta: "textScore" } } },
        { $sort: sort },
        {
          $facet: {
            results: [{ $skip: skip }, { $limit: perPage }, { $project: projection }],
            meta: [{ $count: "total" }],
          },
        },
      ];

      const agg = await Product.aggregate(pipeline).exec();
      if (Array.isArray(agg) && agg.length) {
        products = agg[0].results || [];
        total = Number((agg[0].meta && agg[0].meta[0] && agg[0].meta[0].total) || 0);
      } else {
        products = [];
        total = 0;
      }
    } else {
      total = await Product.countDocuments(filter).exec();
      products = await Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(perPage)
        .select(projection)
        
        .exec();
    }

    const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

    // Normalize products for client: ensure thumbnail url, images array, id string
    const normalized = (products || []).map((p: IProduct) => {
     // const thumbnail = p.thumbnail?.url ?? p.thumbnail ?? (Array.isArray(p.images) && p.images[0]?.url) ?? null;
      return {
        _id: p._id?.toString?.(),
        name: p.name,
       //  slug: p.slug ?? null,
        description: p.description,
        brand: p.brand ?? null,
        basePrice: p.basePrice ?? null,
        category: p.category,
        status: p.status,
        thumbnail:  p.thumbnail,
        tags: p.tags,
        isTrendy: p.isTrendy,
        isBestSeller: p.isBestSeller,
        images: p.images ?? [],
        rating: p.rating ?? 0,
        reviewCount: p.reviewCount ?? 0,
        isFeatured: !!p.isFeatured,
        stock: p.stock ?? 0,
        variants: p.variants ?? [],
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      } as IProduct;
    });

    return {
      success: true,
      data: {
        products: JSON.parse(JSON.stringify(normalized)),
        page,
        perPage,
        total,
        totalPages,
      },
    };
  } catch (err) {
    console.error("getAllProducts error:", err);
    return handleError(err) as ErrorResponse;
  }
}
// export async function getAllProducts(): Promise<ActionResponse<{products: IProduct[]}>> {
//    try {
//        await connectDB()
//        const products = await Product.find({})
//        return {
//          success: true,
//          data: {products: JSON.parse(JSON.stringify(products))}
//        }
//    } catch (error) {  
//        return handleError(error) as ErrorResponse
//    }
// }
// accept an optional params object for filters/pagination


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



interface GetSearchInputResultsParams {
  query: string
  limit?: number
}

export async function getSuggestionResult(
  params: GetSearchInputResultsParams
): Promise<ActionResponse<{ products: IProduct[] }>> {
  const { query, limit = 2 } = params

  if (!query?.trim()) {
    return { success: true, data: { products: [] } }
  }

  try {
    await connectDB()

   const products = await Product.aggregate([
  {
    $search: {
      index: "products_search",
      text: {
        query,
        path: ["name", "description", "brand", "tags"],
        fuzzy: {
          maxEdits: 2,
          prefixLength: 1
        }
      }
    }
  },
  {
    $match: {
      status: "ACTIVE"
    }
  },
  {
    $project: {
      name: 1,
      basePrice: 1,
      thumbnail: 1,
      brand: 1,
      score: { $meta: "searchScore" }
    }
  },
  { $sort: { score: -1 } },
  { $limit: limit }
])


    console.log(products, "product suggestions")

    return {
      success: true,
      data: { products : JSON.parse(JSON.stringify(products))}
    }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}



interface DeleteProductParams {
  productId: string;
}

export async function softDeleteProduct(
  params: DeleteProductParams
): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: DeleteProductSchema,
    authorize: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const session = validated.session;

  if (!session?.user?.isAdmin) {
    throw new UnAuthorizedError("Admin access required");
  }

  const { productId } = validated.params!;

  try {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) throw new NotFoundError("Product");

    // ⛔ Already deleted
    if (product.isDeleted) {
      return {
        success: true,
        message: "Product already deleted",
      };
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    
    await product.save();

    return {
      success: true,
      message: "Product soft deleted successfully",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function restoreProduct(
  params: DeleteProductParams
): Promise<ActionResponse> {
  const validated = await action({
    params,
    schema: DeleteProductSchema,
    authorize: true,
  });

  if (validated instanceof Error)
    return handleError(validated) as ErrorResponse;

  const session = validated.session;
  if (!session?.user?.isAdmin)
    throw new UnAuthorizedError("Admin access required");

  try {
    await connectDB();

    const product = await Product.findById(params.productId);
    if (!product) throw new NotFoundError("Product");

    product.isDeleted = false;
    product.deletedAt = null;

    await product.save();
    revalidatePath(ROUTES.admin.products)
    revalidatePath("/")
    return {
      success: true,
      message: "Product restored successfully",
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}


const HARD_DELETE_AFTER_DAYS = 30;

export async function startHardDeleteCron() {
  // ⏰ Runs every day at 03:00 AM
  cron.schedule("0 3 * * *", async () => {
    console.log("🧹 Running hard delete job...");

    try {
      await connectDB();

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - HARD_DELETE_AFTER_DAYS);

      const productsToDelete = await Product.find({
        isDeleted: true,
        deletedAt: { $lte: cutoffDate },
      });

      for (const product of productsToDelete) {
        // 🖼️ Delete images from Cloudinary
        if (product.images?.length) {
          for (const img of product.images) {
            if (img.public_id) {
              await deleteFromCloudinary(img.public_id);
            }
          }
        }else if(product.thumbnail.url && product.thumbnail.public_id) {
            await deleteFromCloudinary(product.thumbnail.public_id)
        } 

        // ❌ Permanent DB delete
       
      
        await Review.deleteMany({product: product._id})
        
         await Product.findByIdAndDelete(product._id);
        // delete relevant stuff
        console.log(`🔥 Hard deleted product ${product._id}`);
      }

      console.log(`✅ Hard delete job finished (${productsToDelete.length} products)`);
    } catch (error) {
      console.error("❌ Hard delete cron failed", error);
    }
  });
}

export async function getDeletedProducts(): Promise<ActionResponse<{products:IProduct[]}>> {
  const session = await auth()
  if(!session) throw new UnAuthorizedError("")
    if(session && !session.user.isAdmin) throw new UnAuthorizedError("admin access only")
  await connectDB();
 
  try {
    const products = await Product.find({ isDeleted: true })
    .sort({ deletedAt: -1 })

  return {
    success: true,
    data: { products: JSON.parse(JSON.stringify(products))}
  }
  } catch (error) {
     return handleError(error) as ErrorResponse
  }
  
}

export async function hardDeleteProduct(
  params: DeleteProductParams
): Promise<ActionResponse> {

  const validatedResult = await action({
    params,
    schema: DeleteProductSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;

  const session = validatedResult.session;
  if (!session?.user?.isAdmin)
    throw new UnAuthorizedError("Admin access only");

  const { productId } = validatedResult.params!;

  try {
    await connectDB();

    const product = await Product.findOne({
      _id: productId,
      isDeleted: true,
    });

    if (!product) {
      throw new NotFoundError("Deleted product");
    }

    /* 🖼️ Delete gallery images */
    if (product.images?.length) {
      for (const img of product.images) {
        if (img.public_id) {
          await deleteFromCloudinary(img.public_id);
        }
      }
    }

    /* 🖼️ Delete thumbnail */
    if (product.thumbnail?.public_id) {
      await deleteFromCloudinary(product.thumbnail.public_id);
    }

    /* 🗑️ Delete related reviews */
    await Review.deleteMany({ product: product._id });

    /* ❌ Delete product */
    await Product.findByIdAndDelete(product._id);

    console.log(`🔥 Hard deleted product ${product._id}`);

    return { success: true };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
interface GetFrequentlyBoughtTogetherParams {
  productId:string
}
export async function getFrequentlyBoughtTogether(params:GetFrequentlyBoughtTogetherParams):Promise<ActionResponse<{products: IProduct[]}>> {
  const { productId } = params;
  try {
    if(!productId) throw new Error("Product ID is required")
    await connectDB()
    const product = await Product.findById(productId) as IProduct;
    if(!product) throw new NotFoundError("Product")
   const products = await Product.find({
    category: product.category,
    _id: { $ne: productId },
  })
    .sort({ weeklySales: -1 })
    return {
      success: true,
      data: {products : JSON.parse(JSON.stringify(products))}
    }
  } catch (error) {
     return handleError(error) as ErrorResponse;
  }
 
}

interface getRecommendedForUserParams {
  userId: string;
  limit?: number;
}


export async function getRecommendedForUser(
  userId: string | undefined,
  limit = 12
): Promise<ActionResponse<{products: IProduct[]}>> {
  try {
     await connectDB();
     if(!userId) return {
       success: false,
     }
  const user = await User.findById(userId) as IUser
  if (!user) throw new NotFoundError("User")

  // --- Build interest map ---
  const interestMap = new Map<string, number>();
  for (const interest of user.interests ?? []) {
    interestMap.set(interest.tag.toLowerCase(), interest.score);
  }

  // --- Recently viewed product IDs ---
  const viewedProductIds = (user.browsingHistory ?? [])
    .slice(-20)
    .map(h => h.product.toString());

  const products = await Product.find({
    status: "ACTIVE",
    isDeleted: { $ne: true },
  });

  const scored = products.map(product => {
    let score = 0;

    // 🎯 Interest → tag match
    for (const tag of product.tags ?? []) {
      const interestScore = interestMap.get(tag.toLowerCase());
      if (interestScore) {
        score += interestScore * 0.4;
      }
    }

    // 👀 Browsing proximity
    if (viewedProductIds.includes(product._id.toString())) {
      score += 25;
    }

    // 🔥 Popularity (weeklySales)
    score += Math.min(product.weeklySales ?? 0, 100) * 0.25;

    // 🕒 Recency boost
    const daysOld =
      (Date.now() - new Date(product.createdAt).getTime()) / 86_400_000;
    score += Math.max(0, 20 - daysOld);

    return { product, score };
  });

  const recommendedProducts = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
    return {
      success: true,
      data: {products: JSON.parse(JSON.stringify(recommendedProducts))}
    }
  } catch (error) {
     return handleError(error) as ErrorResponse
  }
 
}




export async function getInspiredByViewed(
  userId: string,
  limit = 10
): Promise<ActionResponse<{products:IProduct[]}>> {
  try {
    await connectDB();

  const user = await User.findById(userId)
    .populate({
      path: "browsingHistory.product",
      select: "tags _id",
    }) as IUser
    

  if (!user) throw new NotFoundError("User")
    if(user.browsingHistory.length === 0) throw new Error("Your browsing history is empty")

  const viewedProductIds = new Set<string>();
  const viewedTags = new Set<string>();

  for (const entry of user.browsingHistory) {
    if (entry.product) {
      viewedProductIds.add((entry.product as any)._id.toString());
      (entry.product as any).tags?.forEach((tag:any) =>
        viewedTags.add(tag.toLowerCase())
      );
    }
  }

   const products = await Product.find({
    status: "ACTIVE",
    isDeleted: { $ne: true },
    tags: { $in: Array.from(viewedTags) },
    _id: { $nin: Array.from(viewedProductIds) },
  })
  .limit(limit)
  return {
    success: true,
    data: {products: JSON.parse(JSON.stringify(products))}
  }
  } catch (error) {
    return handleError(error) as ErrorResponse
  }
}

