import React from "react";

export default function AddressSkeleton() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-72 bg-gray-100 rounded-md animate-pulse" />
          </div>

          <div className="h-10 w-44 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Default address highlight */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-44 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-4 w-28 bg-gray-100 rounded-md animate-pulse" />
                <div className="h-4 w-72 bg-gray-100 rounded-md animate-pulse" />
              </div>
            </div>

            <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
          </div>

          <div className="mt-4 flex gap-3">
            <div className="h-4 w-16 bg-gray-100 rounded-md animate-pulse" />
            <div className="h-4 w-16 bg-gray-100 rounded-md animate-pulse" />
            <div className="h-4 w-24 bg-gray-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* List skeleton */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-4 w-28 bg-gray-100 rounded-md animate-pulse" />
                    <div className="h-4 w-64 bg-gray-100 rounded-md animate-pulse" />
                    <div className="h-4 w-52 bg-gray-100 rounded-md animate-pulse" />
                  </div>
                </div>

                <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse" />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="h-9 w-24 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-9 w-24 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-9 w-32 bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
