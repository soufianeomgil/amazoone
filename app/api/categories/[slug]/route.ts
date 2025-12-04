// /app/api/categories/[slug]/route.ts
import connectDB from "@/database/db";
import handleError from "@/lib/handlers/error";
import { Product } from "@/models/product.model";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


// Max per page to avoid expensive queries
const MAX_PER_PAGE = 100;

function parseBool(v: string | null | undefined) {
  if (!v) return false;
  return v === "1" || v.toLowerCase() === "true" || v === "yes";
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // connect to DB
    await connectDB();

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || undefined;
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    let perPage = Math.max(1, Number(url.searchParams.get("perPage") || 20));
    perPage = Math.min(perPage, MAX_PER_PAGE);
    const sortParam = url.searchParams.get("sort") || "relevance"; // relevance|newest|price_asc|price_desc
    const priceMinRaw = url.searchParams.get("priceMin");
    const priceMaxRaw = url.searchParams.get("priceMax");
    const brandsParam = url.searchParams.get("brands") || "";
    const onlyPrime = parseBool(url.searchParams.get("onlyPrime"));
    const inStockOnly = parseBool(url.searchParams.get("inStockOnly"));
    const slug = params.slug || "all";

    const priceMin = priceMinRaw ? Number(priceMinRaw) : undefined;
    const priceMax = priceMaxRaw ? Number(priceMaxRaw) : undefined;
    const brands = brandsParam ? brandsParam.split(",").map((b) => b.trim()).filter(Boolean) : [];

    // Build Mongo filter
    const filter: any = {
      // exclude archived/inactive products if you have that
      archived: { $ne: true },
    };

    // Category matching: adjust to your schema: category slug, categoryId, or categories array
    if (slug && slug !== "all") {
      // common patterns: product.categorySlug, product.categories.slug, product.category._id
      // adapt this block to how you store categories
      filter.$or = [
        { categorySlug: slug },
        { "categories.slug": slug },
        { "category.slug": slug },
      ];
    }

    // Search text (name, description, brand) - use text index if possible
    if (q) {
      // If you created a text index (e.g. { name: "text", description: "text", brand: "text" }), use $text
      // otherwise fallback to case-insensitive regex on name and description (less efficient)
      if (Product.collection && (await Product.collection.indexExists("text_index"))) {
        // optional: your app might not have indexExists check; this is just safe fallback.
        filter.$text = { $search: q };
      } else {
        const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = filter.$or ? [...filter.$or, { name: rx }, { description: rx }, { brand: rx }] : [{ name: rx }, { description: rx }, { brand: rx }];
      }
    }

    // Price range
    if (priceMin !== undefined || priceMax !== undefined) {
      filter.$and = filter.$and || [];
      const pcond: any = {};
      if (priceMin !== undefined) pcond.$gte = priceMin;
      if (priceMax !== undefined) pcond.$lte = priceMax;
      // if you store basePrice
      filter.$and.push({ basePrice: pcond });
    }

    // Brands
    if (brands.length) {
      filter.brand = { $in: brands };
    }

    // Prime flag (if you store boolean field prime/primeEligible)
    if (onlyPrime) {
      filter.prime = true;
    }

    // in-stock check: either product.stock > 0 OR any variant.stock > 0
    if (inStockOnly) {
      filter.$or = filter.$or || [];
      filter.$or.push({ stock: { $gt: 0 } }, { "variants.stock": { $gt: 0 } });
    }

    // Sort mapping
    let sort: Record<string, any> = { updatedAt: -1 }; // default relevance/newest
    switch (sortParam) {
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "price_asc":
        sort = { basePrice: 1 };
        break;
      case "price_desc":
        sort = { basePrice: -1 };
        break;
      case "relevance":
      default:
        // If using $text search and want score
        if (filter.$text) {
          // we'll project score and sort by it
          sort = { score: { $meta: "textScore" }, updatedAt: -1 };
        } else {
          sort = { updatedAt: -1 };
        }
        break;
    }

    // Projection: return only the fields the client needs
    const projection: any = {
      name: 1,
      slug: 1,
      basePrice: 1,
      thumbnail: 1,
      images: 1,
      brand: 1,
      rating: 1,
      reviewCount: 1,
      prime: 1,
      badge: 1,
      stock: 1,
      variants: { $slice: 3 }, // only return up to first 3 variants to keep payload small (adjust if you want)
      createdAt: 1,
      updatedAt: 1,
    };

    // If using text search, add score projection when sorting by textScore
    const aggregatePipeline: any[] = [];

    // If $text is used prefer aggregation to include $meta score
    if (filter.$text) {
      aggregatePipeline.push({ $match: filter });
      aggregatePipeline.push({ $addFields: { score: { $meta: "textScore" } } });
      aggregatePipeline.push({ $sort: sort });
      aggregatePipeline.push({ $project: projection });
    } else {
      // Use find
      // count and find
    }

    // compute counts and fetch
    const skip = (page - 1) * perPage;

    // Two paths: aggregation (when text) or find
    let products: any[] = [];
    let total = 0;
    if (aggregatePipeline.length) {
      // Aggregation path
      // add pagination
      const facetPipeline = [
        {
          $facet: {
            results: [
              { $skip: skip },
              { $limit: perPage },
            ],
            meta: [{ $count: "total" }],
          },
        },
        {
          $unwind: {
            path: "$meta",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            results: 1,
            total: "$meta.total",
          },
        },
      ];
      const fullPipeline = [...aggregatePipeline, ...facetPipeline];
      const aggRes = await Product.aggregate(fullPipeline).exec();
      if (Array.isArray(aggRes) && aggRes.length) {
        products = aggRes[0].results || [];
        total = Number(aggRes[0].total || 0);
      } else {
        products = [];
        total = 0;
      }
    } else {
      // Normal find path
      total = await Product.countDocuments(filter).exec();
      products = await Product.find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(perPage)
        .select(projection)
        .lean()
        .exec();
    }

    const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

    return NextResponse.json(
      {
        products: products.map((p) => {
          // normalize thumbnail field (some schemas have thumbnail.url)
          const thumbnail = p.thumbnail?.url ?? p.thumbnail ?? (Array.isArray(p.images) && p.images[0]?.url) ?? (Array.isArray(p.images) && p.images[0]) ?? null;
          return {
            id: p._id,
            name: p.name,
            slug: p.name,
            images: p.images,
            price: p.basePrice ?? null,
            thumbnail,
            brand: p.brand ?? null,
            rating: p.rating ?? null,
            reviewCount: p.reviewCount ?? 0,
            prime: !!p.prime,
            badge: p.badge ?? null,
            stock: p.stock ?? 0,
            variants: p.variants ?? [],
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          };
        }),
        page,
        perPage,
        total,
        totalPages,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (err) {
    console.error("Category API error:", err);
    return handleError(err) as APIErrorResponse
  }
}
