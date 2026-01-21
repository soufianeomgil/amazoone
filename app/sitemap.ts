import { MetadataRoute } from 'next';
import { Product as ProductModel } from "@/models/product.model";
import connectDB from "@/database/db";

// Replace with your actual production URL
const URL = "https://your-custom-domain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  // 1. Fetch all active products
  // We only need the slug and the updated date for the sitemap
  const products = await ProductModel.find({ status: "ACTIVE" })
    .select("slug updatedAt")
    .lean();

  const productEntries = products.map((product) => ({
    url: `${URL}/product/${product.name}`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 2. Define your static pages
  const staticPages = [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  return [...staticPages, ...productEntries];
}