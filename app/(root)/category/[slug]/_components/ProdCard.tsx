// components/ProductCard.tsx
"use client";

import React from "react";
import { Star, ShoppingCart } from "lucide-react";

export default function ProdtCard({ p }: { p: any }) {
  const money = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v ?? 0);

  return (
    <article className="bg-white border border-gray-100 rounded-md p-3 flex flex-col gap-2">
      <div className="relative rounded-md overflow-hidden aspect-square bg-gray-50">
        <img src={p.image || "/placeholder-300.png"} alt={p.name} className="object-contain w-full h-full" loading="lazy" />
        {p.badge && <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">{p.badge}</span>}
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{p.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <div className="inline-flex items-center gap-1">
            <Star size={14} className="text-yellow-500" />
            <span>{Number(p.rating ?? 0).toFixed(1)}</span>
            <span className="text-gray-400">({(p.reviewCount ?? 0).toLocaleString()})</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="font-semibold text-lg">{money(p.price ?? 0)}</div>
            <div className="text-xs text-gray-500">Free returns</div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button className="px-3 py-1 rounded-md bg-[#FF9900] text-white text-sm flex items-center gap-2">
              <ShoppingCart size={14} /> Add
            </button>
            {p.prime && <div className="text-xs text-sky-600">Prime</div>}
          </div>
        </div>
      </div>
    </article>
  );
}
