"use client";

import React from "react";

const S = ({ className = "" }: { className?: string }) => (
  <div
    className={[
      "animate-pulse rounded-xl bg-gray-200/80",
      "dark:bg-neutral-800/60",
      className,
    ].join(" ")}
  />
);

export default function HomeSkeleton() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-5 space-y-6">
        {/* Top bar / search */}
        <div className="flex items-center gap-3">
          <S className="h-10 w-10 rounded-full" />
          <S className="h-11 flex-1 rounded-full" />
          <S className="h-10 w-10 rounded-full" />
        </div>

        {/* Hero banner */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100">
          <S className="h-[160px] sm:h-[220px] w-full rounded-none" />
          {/* fake overlay badges */}
          <div className="absolute left-4 top-4 flex gap-2">
            <S className="h-7 w-24 rounded-full bg-gray-300/80" />
            <S className="h-7 w-16 rounded-full bg-gray-300/80" />
          </div>
          <div className="absolute left-4 bottom-4">
            <S className="h-8 w-56 rounded-lg bg-gray-300/80" />
            <S className="mt-2 h-5 w-40 rounded-lg bg-gray-300/80" />
          </div>
        </div>

        {/* Category chips (horizontal) */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <S key={i} className="h-10 w-[130px] shrink-0 rounded-full" />
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <S className="h-7 w-52" />
            <S className="h-4 w-72" />
          </div>
          <S className="h-9 w-28 rounded-full" />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>

        {/* Second section (deals / recommended) */}
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-2">
            <S className="h-7 w-60" />
            <S className="h-4 w-64" />
          </div>
          <S className="h-9 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={`b-${i}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* image */}
      <div className="p-3">
        <div className="relative rounded-xl bg-gray-100 overflow-hidden">
          <div className="animate-pulse h-[150px] sm:h-[165px] w-full bg-gray-200/80" />
          <div className="absolute top-2 left-2">
            <div className="animate-pulse h-6 w-20 rounded-full bg-gray-300/80" />
          </div>
          <div className="absolute top-2 right-2">
            <div className="animate-pulse h-9 w-9 rounded-full bg-gray-300/80" />
          </div>
        </div>
      </div>

      {/* body */}
      <div className="px-3 pb-3 space-y-2">
        <div className="space-y-2">
          <div className="animate-pulse h-4 w-[90%] rounded bg-gray-200/80" />
          <div className="animate-pulse h-4 w-[70%] rounded bg-gray-200/80" />
        </div>

        <div className="flex items-center gap-2">
          <div className="animate-pulse h-4 w-16 rounded bg-gray-200/80" />
          <div className="animate-pulse h-4 w-10 rounded bg-gray-200/80" />
        </div>

        <div className="flex items-end justify-between pt-2">
          <div className="space-y-1">
            <div className="animate-pulse h-6 w-24 rounded bg-gray-200/80" />
            <div className="animate-pulse h-3 w-16 rounded bg-gray-200/80" />
          </div>
          <div className="animate-pulse h-10 w-10 rounded-full bg-gray-200/80" />
        </div>
      </div>
    </div>
  );
}
