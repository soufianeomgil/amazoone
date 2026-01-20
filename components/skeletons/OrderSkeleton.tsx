import React from "react";

export default function OrderSkeleton() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-44 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-80 bg-gray-100 rounded-md animate-pulse" />
          </div>

          <div className="h-10 w-40 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Tabs / filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 bg-gray-100 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Orders list */}
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-52 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-4 w-72 bg-gray-100 rounded-md animate-pulse" />
                </div>

                <div className="space-y-2 text-right">
                  <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse ml-auto" />
                  <div className="h-4 w-24 bg-gray-100 rounded-md animate-pulse ml-auto" />
                </div>
              </div>

              {/* Items preview */}
              <div className="mt-4 flex gap-3 overflow-hidden">
                {Array.from({ length: 4 }).map((__, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center"
                  >
                    <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-9 w-28 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-9 w-28 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-9 w-36 bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
