import React from "react";

const Sk = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200/70 ${className}`} />
);

export default function CartPageSkeleton() {
  return (
    <div className="bg-white w-full">
      <div className="max-w-[1400px] mx-auto px-3 py-5">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <Sk className="h-7 w-44 mb-2" />
            <Sk className="h-4 w-60" />
          </div>
          <Sk className="h-10 w-32 rounded-lg hidden sm:block" />
        </div>

        {/* layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* LEFT: items list */}
          <div className="space-y-4">
            {/* top strip (delivery/promo) */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Sk className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Sk className="h-4 w-[55%] mb-2" />
                  <Sk className="h-3 w-[35%]" />
                </div>
                <Sk className="h-9 w-28 rounded-lg hidden sm:block" />
              </div>
            </div>

            {/* cart item skeletons */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 sm:p-5"
              >
                <div className="flex gap-4">
                  {/* image */}
                  <Sk className="h-24 w-24 rounded-md shrink-0" />

                  {/* content */}
                  <div className="flex-1 min-w-0">
                    {/* title */}
                    <Sk className="h-4 w-[92%] mb-2" />
                    <Sk className="h-4 w-[70%] mb-3" />

                    {/* variant lines */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Sk className="h-5 w-20 rounded-full" />
                      <Sk className="h-5 w-24 rounded-full" />
                      <Sk className="h-5 w-16 rounded-full" />
                    </div>

                    {/* availability */}
                    <Sk className="h-3 w-28 mb-3" />

                    {/* actions + qty + price */}
                    <div className="flex items-end justify-between gap-4">
                      {/* left actions */}
                      <div className="flex items-center gap-3">
                        <Sk className="h-8 w-20 rounded-md" />
                        <Sk className="h-8 w-28 rounded-md" />
                      </div>

                      {/* right qty + price */}
                      <div className="flex items-center gap-4">
                        {/* qty controls */}
                        <div className="flex items-center gap-2">
                          <Sk className="h-9 w-9 rounded-lg" />
                          <Sk className="h-6 w-8 rounded-md" />
                          <Sk className="h-9 w-9 rounded-lg" />
                        </div>

                        {/* price */}
                        <div className="text-right">
                          <Sk className="h-5 w-20 mb-2" />
                          <Sk className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* divider + “recommended” row like noon */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Sk className="h-4 w-48" />
                    <Sk className="h-9 w-28 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}

            {/* “saved for later” section skeleton */}
            <div className="border border-gray-200 rounded-lg p-4">
              <Sk className="h-5 w-44 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Sk className="h-16 w-16 rounded-md" />
                    <div className="flex-1">
                      <Sk className="h-3 w-[85%] mb-2" />
                      <Sk className="h-3 w-[55%]" />
                    </div>
                    <Sk className="h-8 w-20 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: summary (sticky on desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-4 space-y-4">
              {/* coupon */}
              <div className="border border-gray-200 rounded-lg p-4">
                <Sk className="h-4 w-40 mb-3" />
                <div className="flex gap-2">
                  <Sk className="h-10 flex-1 rounded-lg" />
                  <Sk className="h-10 w-24 rounded-lg" />
                </div>
              </div>

              {/* order summary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <Sk className="h-5 w-36 mb-4" />

                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Sk className="h-3 w-28" />
                      <Sk className="h-3 w-16" />
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 my-4" />

                <div className="flex items-center justify-between mb-4">
                  <Sk className="h-4 w-20" />
                  <Sk className="h-5 w-24" />
                </div>

                <Sk className="h-11 w-full rounded-lg mb-3" />
                <Sk className="h-11 w-full rounded-lg" />

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sk className="h-5 w-5 rounded-md" />
                    <Sk className="h-3 w-44" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Sk className="h-5 w-5 rounded-md" />
                    <Sk className="h-3 w-36" />
                  </div>
                </div>
              </div>

              {/* payment methods / trust */}
              <div className="border border-gray-200 rounded-lg p-4">
                <Sk className="h-4 w-40 mb-3" />
                <div className="flex gap-2">
                  <Sk className="h-10 w-16 rounded-md" />
                  <Sk className="h-10 w-16 rounded-md" />
                  <Sk className="h-10 w-16 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: sticky checkout bar skeleton */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-3 py-3">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
            <div className="flex-1">
              <Sk className="h-4 w-24 mb-2" />
              <Sk className="h-5 w-32" />
            </div>
            <Sk className="h-11 w-40 rounded-lg" />
          </div>
        </div>

        {/* give space for mobile sticky bar */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
}
