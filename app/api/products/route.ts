import { NextResponse } from "next/server";
import { Product as ProductModel } from "@/models/product.model";
import connectDB from "@/database/db";

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || undefined;
    const category = url.searchParams.get("category") || url.searchParams.get("slug") || undefined;
    
    const priceMin = Number(url.searchParams.get("priceMin") ?? 0);
    const priceMax = Number(url.searchParams.get("priceMax") ?? 1000000);
    const brandsParam = url.searchParams.get("brands") || undefined;
    const ratingMin = Number(url.searchParams.get("ratingMin") ?? 0);
    
    const sort = url.searchParams.get("sort") || "relevance";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const perPage = Math.max(1, Number(url.searchParams.get("perPage") ?? 20));
    const inStockOnly = url.searchParams.get("inStockOnly") === "true" || url.searchParams.get("inStockOnly") === "1";

    const filters: any = { status: "ACTIVE" };

    // 1. Text Search (Handle Score for relevance)
    if (q) {
      filters.$text = { $search: q };
    }

    // 2. Flexible Category Filter (Checks for exact match or slug)
    if (category) {
      filters.$or = [
        { category: category },
        { slug: category }
      ];
    }

    // 3. Multi-Brand Filter
    if (brandsParam) {
      const brands = brandsParam.split(",").map((b) => b.trim()).filter(Boolean);
      if (brands.length) filters.brand = { $in: brands };
    }

    // 4. Price Logic
    filters.basePrice = { $gte: priceMin, $lte: priceMax };

    // 5. Rating Logic
    if (!Number.isNaN(ratingMin) && ratingMin > 0) {
      filters.rating = { $gte: ratingMin };
    }

    // 6. Stock Management
    if (inStockOnly) {
      filters.$or = [
        { "variants.0": { $exists: true }, "variants.stock": { $gt: 0 } },
        { "variants.0": { $exists: false }, stock: { $gt: 0 } },
      ];
    }

    // 7. Sort Mapping
    let sortObj: any = { isFeatured: -1, createdAt: -1 };
    
    if (sort === "newest") {
      sortObj = { createdAt: -1 };
    } else if (sort === "price_asc") {
      sortObj = { basePrice: 1 };
    } else if (sort === "price_desc") {
      sortObj = { basePrice: -1 };
    } else if (sort === "relevance" && q) {
      // Sort by text score if searching, otherwise stick to featured/newest
      sortObj = { score: { $meta: "textScore" } };
    }

    const skip = (page - 1) * perPage;

    // Execute Query
    const [items, total] = await Promise.all([
      ProductModel.find(
        filters, 
        q ? { score: { $meta: "textScore" } } : undefined
      )
        .sort(sortObj)
        .skip(skip)
        .limit(perPage)
        .lean()
        .exec(),
      ProductModel.countDocuments(filters),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products: items || [],
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (err: any) {
    console.error("SEARCH_API_ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}