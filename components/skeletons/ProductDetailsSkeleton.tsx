import React from "react";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200/70 ${className}`} />
);

export default function ProductDetailsSkeleton() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-3 py-5">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          {/* LEFT: Gallery */}
          <div className="flex flex-col gap-3">
            {/* main image */}
            <div className="border border-gray-200 rounded-lg p-3">
              <Skeleton className="w-full h-[340px] sm:h-[420px]" />
            </div>

            {/* thumbnails */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 border border-gray-200 rounded-md p-2 bg-white"
                >
                  <Skeleton className="w-[72px] h-[72px]" />
                </div>
              ))}
            </div>

            {/* delivery/assurance small line (noon-like) */}
            <div className="border border-gray-200 rounded-lg p-4 mt-2">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-[60%] mb-2" />
                  <Skeleton className="h-3 w-[40%]" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Buy Box */}
          <div className="border border-gray-200 rounded-lg p-4 sm:p-5">
            {/* title */}
            <Skeleton className="h-5 w-[90%] mb-3" />
            <Skeleton className="h-5 w-[80%] mb-5" />

            {/* brand + rating */}
            <div className="flex items-center gap-3 mb-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* badges row */}
            <div className="flex flex-wrap gap-2 mb-5">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* price block */}
            <div className="border border-gray-100 rounded-lg p-4 bg-gray-50 mb-5">
              <div className="flex items-end gap-3">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-3 w-40 mt-3" />
            </div>

            {/* variant selectors */}
            <div className="space-y-3 mb-6">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-16 rounded-lg" />
                ))}
              </div>

              <Skeleton className="h-4 w-28 mt-2" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              <Skeleton className="h-11 w-full rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-11 w-full rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            </div>

            {/* small info rows */}
            <div className="mt-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-[70%] mb-2" />
                    <Skeleton className="h-3 w-[45%]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Below sections */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mt-6">
          {/* Left: description/specs/reviews */}
          <div className="space-y-5">
            {/* Tabs row */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>

            {/* Description block */}
            <div className="border border-gray-200 rounded-lg p-4">
              <Skeleton className="h-5 w-40 mb-4" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className={`h-3 mb-2 ${i === 5 ? "w-[60%]" : "w-full"}`} />
              ))}
            </div>

            {/* Specs table block */}
            <div className="border border-gray-200 rounded-lg p-4">
              <Skeleton className="h-5 w-36 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[140px_1fr] gap-3">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-[80%]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews block */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>

              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-28 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-[90%] mb-2" />
                  <Skeleton className="h-3 w-[75%] mb-2" />
                  <Skeleton className="h-3 w-[55%]" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: sticky side (ads / recommendations style) */}
          <div className="hidden lg:block">
            <div className="sticky top-4 border border-gray-200 rounded-lg p-4 space-y-4">
              <Skeleton className="h-5 w-40" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-[90%] mb-2" />
                    <Skeleton className="h-3 w-[60%] mb-2" />
                    <Skeleton className="h-3 w-[40%]" />
                  </div>
                </div>
              ))}
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
