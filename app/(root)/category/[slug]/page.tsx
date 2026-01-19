// app/(your-path)/[slug]/page.tsx
import React from "react";

import { IProduct, Product } from "@/models/product.model";
import connectDB from "@/database/db";
import CategoryClient from "./_components/CategoryClient";

interface PageProps {
  params: { slug?: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function CategoryPage({ params }: PageProps) {
  const slug = params?.slug ?? "all";
  const perPage = 2;
  await connectDB();

  // Simple server-side query: category === slug (adjust to your real category relation)
  // Return first page to hydrate client
  const page = 1;
  const skip = (page - 1) * perPage;

  const productsRaw = await Product.find({ category: slug, status: "ACTIVE" })
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .lean()
    .exec();

  // map to client-friendly shape (avoid sending Mongoose specific fields)
  const products: Partial<IProduct & { id: string }>[] = (productsRaw || []).map((p: any) => ({
    id: String(p._id),
    name: p.name,
    price: p.basePrice,
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    image: (p.thumbnail && p.thumbnail.url) || (p.images?.[0]?.url) || "",
    prime: false,
    badge: p.isFeatured ? "Featured" : null,
    brand: p.brand,
    available: p.totalStock ? p.totalStock > 0 : (p.stock ?? 0) > 0,
  }));

  const total = await Product.countDocuments({ category: slug});
// implement add to cart btn in product card
  const initialHero = {
    title: `Top picks in ${slug.replace("-", " ")}`,
    subtitle: "Discover the best sellers, everyday low prices and top rated items in this category.",
    image: "https://images.unsplash.com/photo-1543163521-1bf53932f2aa?auto=format&fit=crop&w=1600&q=60",
  };

  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <CategoryClient
          slug={slug} 
          // @ts-ignore
          initialProducts={products}
          initialTotal={total}
          initialHero={initialHero}
          serverPerPage={perPage}
        />
      </div>
    </main>
  );
}
