"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { Filter, Star, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import MainCard from "@/components/cards/MainCard";
import { IProduct } from "@/models/product.model";


type SearchFilters = {
  priceMin: number;
  priceMax: number;
  brands: string[];
  onlyPrime: boolean;
  inStockOnly: boolean;
  ratingMin: number;
};

const DEFAULT_FILTERS: SearchFilters = {
  priceMin: 0,
  priceMax: 1000,
  brands: [],
  onlyPrime: false,
  inStockOnly: false,
  ratingMin: 0,
};

const brandList = ["Apple", "Samsung", "Sony", "Dell", "HP", "Lenovo", "Logitech", "Anker"];

const ratingOptions = [
  { label: "4★ & up", value: 4 },
  { label: "3★ & up", value: 3 },
  { label: "2★ & up", value: 2 },
];

const money = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v ?? 0);

function SkeletonCard() {
  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden animate-pulse">
      <div className="h-[150px] bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function SearchClient({
  initialQuery,
  initialProducts = [],
  initialTotal = 0,
  serverPerPage = 20,
}: {
  initialQuery: string;
  initialProducts?: IProduct[];
  initialTotal?: number;
  serverPerPage?: number;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("relevance");

  const [page, setPage] = useState(1);
  const [perPage] = useState<number>(serverPerPage ?? 20);
  const [products, setProducts] = useState<IProduct[]>(initialProducts ?? []);
  const [total, setTotal] = useState<number>(initialTotal ?? 0);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isFetchingRef = useRef(false); // HARD LOCK to prevent spam

  const fetchProductsFromServer = async (params: Record<string, any>) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && String(v) !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();

    const res = await fetch(`/api/products?${qs}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error("Failed fetching products");

    const payload = await res.json();
    const body = payload?.success ? payload.data : payload;

    const totalPages = Math.ceil((body?.total ?? 0) / (body?.perPage ?? perPage));

    return {
      products: (body?.products ?? []) as IProduct[],
      page: Number(body?.page ?? params.page ?? 1),
      perPage: Number(body?.perPage ?? params.perPage ?? perPage),
      total: Number(body?.total ?? 0),
      totalPages: Number(body?.totalPages ?? totalPages),
    };
  };

  const fetchPage = useCallback(
    async ({ reset, nextPage }: { reset: boolean; nextPage: number }) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      reset ? setLoading(true) : setLoadingNext(true);

      try {
        const params = {
          q: query || undefined,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          brands: filters.brands.length ? filters.brands.join(",") : undefined,
          onlyPrime: filters.onlyPrime ? "1" : undefined,
          inStockOnly: filters.inStockOnly ? "1" : undefined,
          ratingMin: filters.ratingMin ? String(filters.ratingMin) : undefined,
          sort,
          page: nextPage,
          perPage,
        };

        const res = await fetchProductsFromServer(params);

        setProducts((prev) => (reset ? res.products : [...prev, ...res.products]));
        setPage(res.page);
        setTotal(res.total);
        setHasMore(res.page < res.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        reset ? setLoading(false) : setLoadingNext(false);
        isFetchingRef.current = false;
      }
    },
    [query, filters, sort, perPage]
  );

  // Debounced resets when query/filters/sort change
  const debouncedReset = useMemo(
    () =>
      debounce(() => {
        fetchPage({ reset: true, nextPage: 1 });
      }, 450),
    [fetchPage]
  );

  useEffect(() => {
    debouncedReset();
    return () => debouncedReset.cancel();
  }, [query, filters, sort, debouncedReset]);

  // Intersection Observer (ONLY loads if not loadingNext + hasMore)
  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting) return;
        if (!hasMore) return;
        if (loading || loadingNext) return;
        if (isFetchingRef.current) return;

        fetchPage({ reset: false, nextPage: page + 1 });
      },
      { rootMargin: "250px" }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [fetchPage, page, hasMore, loading, loadingNext]);

  const toggleBrand = (b: string) =>
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(b) ? f.brands.filter((x) => x !== b) : [...f.brands, b],
    }));

  const emptyState = !loading && products.length === 0;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Search</p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {query ? `Results for “${query}”` : "Explore Products"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {total.toLocaleString()} products found
              </p>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Back to home
            </Link>
          </div>

          {/* Search input */}
          <div className="mt-5 flex gap-3 items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              onClick={() => setFiltersOpen(true)}
              className="md:hidden px-4 py-3 rounded-xl bg-white border border-gray-200 flex items-center gap-2"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="hidden md:block px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm"
            >
              <option value="relevance">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 grid md:grid-cols-[280px_1fr] gap-6">
        {/* Desktop filters */}
        <aside className="hidden md:block bg-white border border-gray-200 rounded-2xl p-4 space-y-5 h-fit sticky top-6">
          <div>
            <p className="font-semibold text-gray-900">Filters</p>
            <p className="text-xs text-gray-500">Refine your results</p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Price range</label>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters((s) => ({ ...s, priceMin: Number(e.target.value || 0) }))}
                className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="Min"
              />
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters((s) => ({ ...s, priceMax: Number(e.target.value || 1000) }))}
                className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Brands</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {brandList.map((b) => {
                const active = filters.brands.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      active
                        ? "bg-orange-50 border-orange-400 text-orange-800"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-2">Rating</label>
            <div className="space-y-2">
              {ratingOptions.map((r) => (
                <label key={r.value} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.ratingMin === r.value}
                    onChange={() => setFilters((f) => ({ ...f, ratingMin: r.value }))}
                  />
                  <Star size={14} className="text-yellow-500" />
                  {r.label}
                </label>
              ))}
              <button
                onClick={() => setFilters((f) => ({ ...f, ratingMin: 0 }))}
                className="text-xs text-gray-500 hover:underline"
              >
                Clear rating
              </button>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))}
              />
              In stock only
            </label>

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={filters.onlyPrime}
                onChange={(e) => setFilters((f) => ({ ...f, onlyPrime: e.target.checked }))}
              />
              Prime eligible
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
            >
              Reset
            </button>
            <button
              onClick={() => fetchPage({ reset: true, nextPage: 1 })}
              className="flex-1 px-3 py-2 rounded-lg bg-[#FF9900] text-white text-sm"
            >
              Apply
            </button>
          </div>
        </aside>

        {/* Products */}
        <section className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : emptyState ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-lg font-bold text-gray-900">No results found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <MainCard key={p.name} userId="" listId="" product={p} />
                ))}
              </div>

              {/* Load more sentinel */}
              <div ref={sentinelRef} className="flex justify-center py-8">
                {loadingNext ? (
                  <div className="text-sm text-gray-500">Loading more...</div>
                ) : !hasMore ? (
                  <div className="text-sm text-gray-500">You reached the end</div>
                ) : (
                  <button
                    onClick={() => fetchPage({ reset: false, nextPage: page + 1 })}
                    className="px-5 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-sm"
                  >
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Mobile filter sheet */}
     {filtersOpen && (
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />

    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl overflow-hidden">
      {/* Sheet header */}
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-gray-900">Filters</p>
          <p className="text-xs text-gray-500">Refine results</p>
        </div>
        <button
          onClick={() => setFiltersOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Sheet body */}
      <div className="max-h-[75vh] overflow-y-auto p-4 space-y-4">
        {/* Price */}
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-900">Price</p>
            <p className="text-xs text-gray-500">
              {money(filters.priceMin)} – {money(filters.priceMax)}
            </p>
          </div>

          <input
            type="range"
            min={0}
            max={5000}
            value={filters.priceMin}
            onChange={(e) =>
              setFilters((s) => ({
                ...s,
                priceMin: Math.min(Number(e.target.value), s.priceMax),
              }))
            }
            className="w-full"
          />
          <input
            type="range"
            min={0}
            max={5000}
            value={filters.priceMax}
            onChange={(e) =>
              setFilters((s) => ({
                ...s,
                priceMax: Math.max(Number(e.target.value), s.priceMin),
              }))
            }
            className="w-full mt-2"
          />

          <div className="grid grid-cols-2 gap-2 mt-3">
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => setFilters((s) => ({ ...s, priceMin: Number(e.target.value || 0) }))}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              placeholder="Min"
            />
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => setFilters((s) => ({ ...s, priceMax: Number(e.target.value || 1000) }))}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Brands */}
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-900">Brands</p>
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, brands: [] }))}
              className="text-xs text-gray-500 hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {brandList.map((b) => {
              const active = filters.brands.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBrand(b)}
                  className={[
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                    active
                      ? "bg-orange-50 border-orange-400 text-orange-700"
                      : "bg-white border-gray-200 text-gray-700",
                  ].join(" ")}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability */}
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Availability</p>

          <label className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">In stock only</span>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters((f) => ({ ...f, inStockOnly: e.target.checked }))}
              className="h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700">Prime eligible</span>
            <input
              type="checkbox"
              checked={filters.onlyPrime}
              onChange={(e) => setFilters((f) => ({ ...f, onlyPrime: e.target.checked }))}
              className="h-4 w-4"
            />
          </label>
        </div>
      </div>

      {/* Sheet footer */}
      <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
        <button
          type="button"
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            setFiltersOpen(false);
            fetchPage({ reset: true, nextPage: 1 });
          }}
          className="flex-1 py-3 rounded-xl bg-[#FF9900] text-white text-sm font-semibold"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
