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
        .lean()
        .exec();
    }

    const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

    // Normalize products for client: ensure thumbnail url, images array, id string
    const normalized = (products || []).map((p: IProduct) => {
     // const thumbnail = p.thumbnail?.url ?? p.thumbnail ?? (Array.isArray(p.images) && p.images[0]?.url) ?? null;
      return {
         _id: p._id?.toString?.() ?? p.id,
        name: p.name,
       //  slug: p.slug ?? null,
        description: p.description,
        brand: p.brand ?? null,
        basePrice: p.basePrice ?? null,
        category: p.category,
        status: p.status,
        thumbnail:  p.thumbnail,
        tags: p.tags,
        reviews: p.reviews,
        
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