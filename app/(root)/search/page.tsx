import { headers } from "next/headers";
import SearchClient from "./_components/SearchClient";
import { auth } from "@/auth";

type SearchParams = {
  q?: string;
  priceMin?: string;
  priceMax?: string;
  brands?: string;
  onlyPrime?: string;
  inStockOnly?: string;
  ratingMin?: string;
  sort?: string;
};

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const q = params.q ?? "";
  const session = await auth()

  const queryParams = new URLSearchParams({
    q,
    priceMin: params.priceMin ?? "",
    priceMax: params.priceMax ?? "",
    brands: params.brands ?? "",
    onlyPrime: params.onlyPrime ?? "",
    inStockOnly: params.inStockOnly ?? "",
    ratingMin: params.ratingMin ?? "",
    sort: params.sort ?? "relevance",
  });

  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";

  let initialData = { products: [], total: 0 };
  
  try {
    const res = await fetch(`${baseUrl}/api/products?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const payload = await res.json();
    initialData = payload?.success ? payload.data : payload;
  } catch (error) {
    console.error("Search fetch error:", error);
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <SearchClient
        initialQuery={q}
        initialProducts={initialData?.products ?? []}
        initialTotal={initialData?.total ?? 0}
        serverPerPage={20}
        userId={session?.user.id ?? ""}
      />
    </div>
  );
};

export default Page;