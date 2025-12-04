// components/CategoryClient.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { Star, ShoppingCart, Filter } from "lucide-react";
import ProdtCard from "./ProdCard";


type Product = {
  id: string | number;
  name: string;
  basePrice: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  prime?: boolean;
  badge?: string | null;
  brand?: string;
  available?: boolean;
};

export default function CategoryClient({
  slug = "women-bags",
  initialProducts = [],
  initialTotal = null,
  initialHero,
  serverPerPage = 20,
}: {
  slug?: string;
  initialProducts?: Product[];
  initialTotal?: number | null;
  initialHero?: { title?: string; subtitle?: string; image?: string };
  serverPerPage?: number;
}) {
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000,
    brands: [] as string[],
    onlyPrime: false,
    inStockOnly: false,
  });
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [perPage] = useState<number>(serverPerPage ?? 20);
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState<number | null>(initialTotal ?? null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hero = useMemo(
    () => ({
      title: initialHero?.title ?? "Top picks in Bags & Accessories",
      subtitle: initialHero?.subtitle ?? "Discover the best sellers, everyday low prices and top rated items in this category.",
      image: initialHero?.image ?? "https://images.unsplash.com/photo-1543163521-1bf53932f2aa?auto=format&fit=crop&w=1600&q=60",
    }),
    [initialHero]
  );

  const fetchProductsFromServer = async (params: Record<string, any>) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && String(v) !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const res = await fetch(`/api/products?${qs}`, { method: "GET", headers: { Accept: "application/json" } });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Failed to fetch products: ${res.status} ${txt}`);
    }
    const payload = await res.json();
    const body = payload?.success ? payload.data : payload;
    return {
      products: (body?.products ?? []) as Product[],
      page: Number(body?.page ?? params.page ?? 1),
      perPage: Number(body?.perPage ?? params.perPage ?? perPage),
      total: Number(body?.total ?? 0),
      totalPages: Number(body?.totalPages ?? Math.ceil((body?.total ?? 0) / (body?.perPage ?? params.perPage ?? perPage))),
    };
  };

  const fetchPage = useCallback(
    async (opts?: { reset?: boolean; page?: number }) => {
      const shouldReset = opts?.reset ?? false;
      const targetPage = opts?.page ?? (shouldReset ? 1 : page);
      setLoading(true);
      try {
        const params = {
          q: query || undefined,
          slug,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          brands: filters.brands.length ? filters.brands.join(",") : undefined,
          onlyPrime: filters.onlyPrime ? "1" : undefined,
          inStockOnly: filters.inStockOnly ? "1" : undefined,
          sort,
          page: targetPage,
          perPage,
        };

        const res = await fetchProductsFromServer(params);

        if (shouldReset) setProducts(res.products || []);
        else setProducts((p) => (targetPage === 1 ? res.products : [...p, ...res.products]));

        setPage(res.page);
        setHasMore(res.page < res.totalPages);
        setTotal(res.total);
      } catch (err) {
        console.error("fetch error", err);
      } finally {
        setLoading(false);
      }
    },
    [query, slug, filters, sort, page, perPage]
  );

  // debounce
  const debouncedFetch = useMemo(() => debounce(() => fetchPage({ reset: true, page: 1 }), 450), [fetchPage]);
  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [query, filters, sort, debouncedFetch]);

  // initial load when slug or initialProducts change
  useEffect(() => {
    // hydrate with server products then ensure client can fetch next pages
    setProducts(initialProducts ?? []);
    setTotal(initialTotal ?? null);
    setPage(1);
  }, [slug, initialProducts, initialTotal]);

  // infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchPage({ page: page + 1 });
        }
      },
      { rootMargin: "300px" }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [fetchPage, page, hasMore, loading]);

  const toggleBrand = (b: string) =>
    setFilters((f) => ({ ...f, brands: f.brands.includes(b) ? f.brands.filter((x) => x !== b) : [...f.brands, b] }));

  const brandList = ["Alpha", "Beta", "Gamma", "Delta", "Acme", "Nordic"];

  const money = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

  return (
    <div>
      {/* Hero */}
      <section
        className="w-full rounded-lg overflow-hidden relative mb-6"
        aria-label="Category hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.05)), url(${hero.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="p-6 md:p-10 text-white">
          <h1 className="text-2xl md:text-4xl font-bold leading-tight drop-shadow">{hero.title}</h1>
          <p className="mt-2 text-sm md:text-base max-w-2xl drop-shadow">{hero.subtitle}</p>

          <div className="mt-6 flex gap-3 flex-wrap">
            <button onClick={() => setFilters((s) => ({ ...s, onlyPrime: !s.onlyPrime }))} className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium shadow ${filters.onlyPrime ? "bg-white text-black" : "bg-black/60 text-white"}`}>
              <Star size={14} />
              Prime eligible
            </button>

            <button onClick={() => setFilters((s) => ({ ...s, priceMax: 50 }))} className="px-4 py-2 rounded-md bg-white/90 text-black text-sm font-medium">
              Under $50
            </button>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="hidden md:flex items-center gap-3 text-sm">
          <div className="text-sm text-gray-600">Showing</div>
          <div className="font-semibold">{total ?? "—"}</div>
          <div className="text-sm text-gray-600">results</div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-2 border border-gray-200 rounded-md px-2 py-1 bg-white">
            <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="text-sm bg-transparent outline-none">
              <option value="relevance">Featured</option>
              <option value="newest">Newest arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <button className="md:hidden px-3 py-2 rounded-md bg-white border border-gray-200 flex items-center gap-2" onClick={() => setFiltersOpen(true)}>
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 hidden md:block">
          <aside className="p-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Refine</h3>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-600">Search within category</label>
              <input aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands, keywords..." className="mt-2 w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" />
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-600">Price</label>
              <div className="flex items-center gap-2 mt-2">
                <input type="number" value={filters.priceMin} onChange={(e) => setFilters((s) => ({ ...s, priceMin: Number(e.target.value || 0) }))} className="w-1/2 px-2 py-1 rounded border border-gray-200 text-sm" />
                <input type="number" value={filters.priceMax} onChange={(e) => setFilters((s) => ({ ...s, priceMax: Number(e.target.value || 1000) }))} className="w-1/2 px-2 py-1 rounded border border-gray-200 text-sm" />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-600">Brands</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {brandList.map((b) => {
                  const active = filters.brands.includes(b);
                  return <button key={b} onClick={() => toggleBrand(b)} className={`text-sm px-2 py-1 rounded border ${active ? "bg-orange-50 border-orange-400" : "bg-white border-gray-200"}`}>{b}</button>;
                })}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-gray-600 mb-2 block">Availability</label>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.inStockOnly} onChange={(e) => setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))} />In stock</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.onlyPrime} onChange={(e) => setFilters((f) => ({ ...f, onlyPrime: e.target.checked }))} />Prime eligible</label>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => { setFilters({ priceMin: 0, priceMax: 1000, brands: [], onlyPrime: false, inStockOnly: false }); fetchPage({ reset: true, page: 1 }); }} className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm">Reset</button>
              <button onClick={() => fetchPage({ reset: true, page: 1 })} className="flex-1 px-3 py-2 rounded-md bg-[#FF9900] text-white text-sm">Apply</button>
            </div>
          </aside>
        </div>

        <div className="md:col-span-9">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p,index) => (<ProdtCard key={index} p={p} />))}
          </div>

          <div ref={sentinelRef} className="mt-6 flex flex-col items-center">
            {loading ? <div className="py-6 text-sm text-gray-500">Loading more products...</div> : !hasMore ? <div className="py-6 text-sm text-gray-500">You reached the end</div> : <div className="py-6 text-sm text-gray-500">Scroll to load more</div>}
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md p-4">
            <aside className="p-4 bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Refine</h3><button onClick={() => setFiltersOpen(false)} className="text-sm text-gray-600">Close</button></div>
              <div className="mb-3"><label className="text-xs text-gray-600">Search within category</label><input aria-label="Search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands, keywords..." className="mt-2 w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400" /></div>
              <div className="mb-3"><label className="text-xs text-gray-600">Price</label><div className="flex items-center gap-2 mt-2"><input type="number" value={filters.priceMin} onChange={(e) => setFilters((s) => ({ ...s, priceMin: Number(e.target.value || 0) }))} className="w-1/2 px-2 py-1 rounded border border-gray-200 text-sm" /><input type="number" value={filters.priceMax} onChange={(e) => setFilters((s) => ({ ...s, priceMax: Number(e.target.value || 1000) }))} className="w-1/2 px-2 py-1 rounded border border-gray-200 text-sm" /></div></div>
              <div className="mb-3"><label className="text-xs text-gray-600">Brands</label><div className="mt-2 grid grid-cols-2 gap-2">{brandList.map((b) => { const active = filters.brands.includes(b); return <button key={b} onClick={() => toggleBrand(b)} className={`text-sm px-2 py-1 rounded border ${active ? "bg-orange-50 border-orange-400" : "bg-white border-gray-200"}`}>{b}</button>; })}</div></div>
              <div className="mt-4 flex gap-2"><button onClick={() => setFilters({ priceMin: 0, priceMax: 1000, brands: [], onlyPrime: false, inStockOnly: false })} className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm">Reset</button><button onClick={() => { setFiltersOpen(false); fetchPage({ reset: true, page: 1 }); }} className="flex-1 px-3 py-2 rounded-md bg-[#FF9900] text-white text-sm">Apply</button></div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
