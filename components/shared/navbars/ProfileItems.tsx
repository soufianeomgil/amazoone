

"use client";
import React, { useState } from "react";
import { ProfileItems as Items } from "@/constants";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { clearCart } from "@/lib/store/cartSlice";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";

/**
 * Polished ProfileItems component
 * - horizontal scroll on mobile (no scrollbar visible)
 * - grid / row on larger screens
 * - active state with soft gradient ring + scale
 * - subtle shadows, hover lift, transitions
 * - logout shows spinner while pending
 * - accessible (aria-labels)
 */

const ProfileItems = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    setLoading(true);
    try {
      if (session.status === "authenticated") {
        await fetch("/api/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: (session.data as any).user.id }),
        });
      }

      dispatch(clearCart());
      localStorage.removeItem("guest_cart");
      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_API_ENDPOINT || "/" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav
      aria-label="Profile navigation"
      className="mt-5 lg:hidden lg:mt-0 mx-4 lg:mx-0"
    >
      {/* Container: horizontal scroll on small, flex row on lg */}
      <div
        className="flex gap-4 lg:gap-6 overflow-x-auto no-scrollbar py-2 px-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {Items.map((item, index) => {
          const isActive = pathname === item.pathname;

          return (
            <Link
              key={index}
              href={item.pathname}
              aria-current={isActive ? "page" : undefined}
              className="min-w-[84px] lg:min-w-0 flex-shrink-0 lg:flex-shrink rounded-lg"
            >
              <div
                className={`group relative flex flex-col items-center gap-2 transition-transform transform cursor-pointer
                            hover:-translate-y-1 ease-out duration-200`}
              >
                {/* Outer ring */}
                <div
                  className={`rounded-full p-0.5 transition-shadow duration-200 ${
                    isActive
                      ? "bg-gradient-to-tr from-[#FF9900] to-[#FF7A00] shadow-lg"
                      : "bg-transparent"
                  }`}
                  aria-hidden
                >
                  {/* Inner circle */}
                  <div
                    className={`w-[74px] h-[74px] rounded-full flex items-center justify-center
                               ${isActive ? "bg-white/5 backdrop-blur-sm" : "bg-white"}
                               shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-200`}
                    style={{
                      // tiny glossy radial highlight
                      boxShadow: isActive
                        ? "0 6px 18px rgba(255,153,0,0.18)"
                        : "0 4px 8px rgba(16,24,40,0.04)",
                    }}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200
                                 ${isActive ? "bg-gradient-to-b from-[#FF9F3B] to-[#FF7A00] text-white" : "bg-gray-50 text-[#374151]"}`}
                      aria-hidden
                    >
                      <item.icon size={28} className={`${isActive ? "text-white" : "text-[#374151]"}`} />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={`text-[12px] leading-none font-semibold transition-colors duration-150 ${
                      isActive ? "text-[#FF7A00]" : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </div>

                  {/* micro-info: show badge when active */}
                  <div className="mt-1">
                    {isActive ? (
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[#FFF4E6] text-[#B85A00]">
                        Active
                      </span>
                    ) : (
                      <span className="sr-only">not active</span>
                    )}
                  </div>
                </div>

                {/* subtle focus ring for keyboard users */}
                <span className="absolute -inset-1 rounded-full focus-within:ring-2 focus-within:ring-[#FF9900]/40" />
              </div>
            </Link>
          );
        })}

        {/* Logout item */}
        <button
          onClick={handleLogOut}
          disabled={loading}
          aria-label="Sign out"
          className="flex-shrink-0 rounded-lg"
        >
          <div className="group relative flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform duration-200">
            <div className="rounded-full p-0.5">
              <div
                className={`w-[74px] h-[74px] rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100`}
                style={{ boxShadow: "0 4px 10px rgba(16,24,40,0.06)" }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 text-[#374151]">
                  {/* spinner when loading */}
                  {loading ? (
                    <svg
                      className="animate-spin w-6 h-6 text-[#FF9900]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : (
                    <LogOut size={28} className="text-[#374151]" />
                  )}
                </div>
              </div>
            </div>

            <div className="text-[12px] leading-none font-semibold text-gray-700">Log out</div>
          </div>
        </button>
      </div>

      {/* Decorative separator */}
      <div className="mt-3 mx-1">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>
    </nav>
  );
};

export default ProfileItems;
