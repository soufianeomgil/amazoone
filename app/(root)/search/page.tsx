import { headers } from "next/headers";
import SearchClient from "./_components/SearchClient";

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

const page = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;
  const q = params.q ?? "";

  const queryParams = new URLSearchParams({
    q,
    priceMin: params.priceMin ?? "",
    priceMax: params.priceMax ?? "",
    brands: params.brands ?? "",
    onlyPrime: params.onlyPrime ?? "",
    inStockOnly: params.inStockOnly ?? "",
    ratingMin: params.ratingMin ?? "",
    sort: params.sort ?? "",
  });

  const headerList = headers();
  const host = (await headerList).get("host");
  const protocol = (await headerList).get("x-forwarded-proto") ?? "http";
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products?${queryParams.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const payload = await res.json();
  const data = payload?.success ? payload.data : payload;

  return (
    <div className="px-4 bg-white w-full md:px-8 lg:px-12 py-6">
      <SearchClient
        initialQuery={q}
        initialProducts={data?.products ?? []}
        initialTotal={data?.total ?? 0}
        serverPerPage={20}
      />
    </div>
  );
};

export default page;
