"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { Star, X, SlidersHorizontal, Search, Home, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

import MainCard from "@/components/cards/MainCard";
import { IProduct } from "@/models/product.model";
import { Button } from "@/components/ui/button";

type SearchFilters = {
  priceMin: number;
  priceMax: number;
  brands: string[];
  category: string;
  ratingMin: number;
  inStockOnly: boolean;
};

const DEFAULT_FILTERS: SearchFilters = {
  priceMin: 0,
  priceMax: 5000,
  brands: [],
  category: "",
  ratingMin: 0,
  inStockOnly: false,
};

const CATEGORIES = ["Electronics", "Fashion", "Home & Garden", "Beauty", "Sports", "Toys"];
const BRAND_LIST = ["Apple", "Samsung", "Sony", "Dell", "HP", "Nike", "Adidas", "Logitech"];
const PRICE_PRESETS = [
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 to $200", min: 50, max: 200 },
  { label: "$200 to $500", min: 200, max: 500 },
  { label: "$500 & Above", min: 500, max: 5000 },
];

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-5 bg-gray-100 rounded w-1/2 mt-4" />
      </div>
    </div>
  );
}

export default function SearchClient({
  initialQuery,
  userId,
  initialProducts = [],
  initialTotal = 0,
  serverPerPage = 20,
}: {
  initialQuery: string;
  userId:string
  initialProducts?: IProduct[];
  initialTotal?: number;
  serverPerPage?: number;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [total, setTotal] = useState<number>(initialTotal);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const fetchPage = useCallback(
    async ({ reset, nextPage }: { reset: boolean; nextPage: number }) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      reset ? setLoading(true) : setLoadingNext(true);

      try {
        const params = new URLSearchParams({
          q: query || "",
          priceMin: String(filters.priceMin),
          priceMax: String(filters.priceMax),
          brands: filters.brands.join(","),
          category: filters.category,
          ratingMin: filters.ratingMin ? String(filters.ratingMin) : "",
          sort,
          page: String(nextPage),
          perPage: String(serverPerPage),
        });

        const res = await fetch(`/api/products?${params.toString()}`);
        const payload = await res.json();
        const body = payload?.success ? payload.data : payload;

        setProducts((prev) => (reset ? body.products : [...prev, ...body.products]));
        setTotal(body.total || 0);
        setPage(Number(body.page));
        setHasMore(body.page < body.totalPages);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setLoadingNext(false);
        isFetchingRef.current = false;
      }
    },
    [query, filters, sort, serverPerPage]
  );

  const debouncedReset = useMemo(() => debounce(() => fetchPage({ reset: true, nextPage: 1 }), 500), [fetchPage]);

  useEffect(() => {
    debouncedReset();
    return () => debouncedReset.cancel();
  }, [query, filters, sort, debouncedReset]);

  useEffect(() => {
    const observer = new IntersectionObserver((ent) => {
      if (ent[0].isIntersecting && hasMore && !loading && !loadingNext) {
        fetchPage({ reset: false, nextPage: page + 1 });
      }
    }, { rootMargin: "400px" });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingNext, page, fetchPage]);

  const toggleBrand = (b: string) =>
    setFilters((f) => ({
      ...f,
      brands: f.brands.includes(b) ? f.brands.filter((x) => x !== b) : [...f.brands, b],
    }));

  const FilterContent = () => (
    <div className="space-y-10">
      {/* Categories */}
      <section>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-900">Department</h3>
        <ul className="space-y-2">
          {CATEGORIES.map(cat => (
            <li 
              key={cat} 
              onClick={() => setFilters(f => ({ ...f, category: f.category === cat ? "" : cat }))}
              className={`text-sm flex items-center justify-between cursor-pointer group ${filters.category === cat ? "font-bold text-black" : "text-gray-500 hover:text-black"}`}
            >
              {cat}
              <ChevronRight size={14} className={filters.category === cat ? "opacity-100" : "opacity-0 group-hover:opacity-100"} />
            </li>
          ))}
        </ul>
      </section>

      {/* Ratings */}
      <section>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-900">Rating</h3>
        <div className="space-y-3">
          {[4, 3, 2].map(num => (
            <div 
              key={num} 
              onClick={() => setFilters(f => ({ ...f, ratingMin: f.ratingMin === num ? 0 : num }))}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.ratingMin === num ? "bg-black border-black" : "border-gray-200 group-hover:border-gray-400"}`}>
                {filters.ratingMin === num && <Check size={12} className="text-white" />}
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < num ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-400 group-hover:text-black">& Up</span>
            </div>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-900">Brands</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {BRAND_LIST.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${filters.brands.includes(brand) ? "bg-black border-black" : "border-gray-200 group-hover:border-gray-400"}`}>
                {filters.brands.includes(brand) && <Check size={12} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={filters.brands.includes(brand)} onChange={() => toggleBrand(brand)} />
              <span className="text-sm text-gray-500 group-hover:text-black">{brand}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Presets */}
      <section>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-gray-900">Price Range</h3>
        <div className="space-y-3">
          {PRICE_PRESETS.map(preset => (
            <label key={preset.label} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="price_preset" 
                className="w-4 h-4 accent-black"
                checked={filters.priceMin === preset.min && filters.priceMax === preset.max}
                onChange={() => setFilters(f => ({ ...f, priceMin: preset.min, priceMax: preset.max }))} 
              />
              <span className="text-sm text-gray-500 group-hover:text-black">{preset.label}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Home size={20} className="text-gray-900" />
              </Link>
              <div>
                <h1 className="text-xl font-black tracking-tight text-gray-900">
                  {query ? `"${query}"` : "Search"}
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                  {total} Results Found
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                />
              </div>
              <Button variant="outline" onClick={() => setFiltersOpen(true)} className="lg:hidden rounded-xl border-gray-200">
                <SlidersHorizontal size={18} />
              </Button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="hidden lg:block bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer"
              >
                <option value="relevance">Featured</option>
                <option value="price_asc">Price: Low-High</option>
                <option value="price_desc">Price: High-Low</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto flex px-4 md:px-8 py-8 gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 overflow-y-auto sticky top-32 h-[calc(100vh-160px)] scrollbar-hide">
          <FilterContent />
          <Button 
            variant="ghost" 
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="w-full mt-10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500"
          >
            Reset All
          </Button>
        </aside>

        {/* Product Feed */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-40 text-center">
              <div className="mb-4 inline-flex p-6 bg-gray-50 rounded-full text-gray-300">
                <Search size={48} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">No matches found</h2>
              <p className="text-gray-500 mt-2 max-w-xs mx-auto">Try broadening your search or clearing your filters.</p>
              <Button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-6 rounded-full px-8">Clear All</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
              {products.map((p,index) => (
                <MainCard key={index} userId={userId} listId="" product={p} />
              ))}
            </div>
          )}

          {/* Infinity Loader */}
          <div ref={sentinelRef} className="h-40 flex flex-col items-center justify-center gap-4">
            {loadingNext && <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />}
            {!hasMore && products.length > 0 && (
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">End of catalog</p>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] p-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 pb-2">
              <h2 className="text-xl font-black uppercase tracking-tight">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <FilterContent />
            <div className="flex gap-4 mt-12 sticky bottom-0 bg-white pt-4">
               <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => { setFilters(DEFAULT_FILTERS); setFiltersOpen(false); }}>Reset</Button>
               <Button className="flex-1 h-14 rounded-2xl bg-black text-white font-bold" onClick={() => setFiltersOpen(false)}>Show Results</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}