


"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Size = "sm" | "md" | "lg";

interface RatingProps {
  rating: number; // 0-5
  reviews?: number;
  isProductDetails?:boolean;
  size?: Size;
  className?: string;
  showNumeric?: boolean;
  id?: string;
}

const AMAZON_ORANGE = "#FF9900";
const STAR_EMPTY_CLASS = "text-gray-300";

const sizeMap: Record<Size, { w: number; h: number; text: string; gap: string }> = {
  sm: { w: 12, h: 12, text: "text-sm", gap: "gap-[2px]" },
  md: { w: 16, h: 16, text: "text-base", gap: "gap-[3px]" },
  lg: { w: 20, h: 20, text: "text-lg", gap: "gap-1" },
};

const clamp = (v: number, min = 0, max = 5) => Math.max(min, Math.min(max, v));

const Rating: React.FC<RatingProps> = ({
  rating,
  reviews,
  size = "md",
  isProductDetails,
  className = "",
  showNumeric = true,
  id,
}) => {
  const s = sizeMap[size];
  const clampedRating = clamp(rating);

  const getStarType = (index: number) => {
    if (clampedRating >= index + 1) return "full";
    if (clampedRating > index && clampedRating < index + 1) return "half";
    return "empty";
  };
const router = useRouter()
  return ( 
    <div 
    onClick={()=> isProductDetails && router.push('#reviews')}
      className={`inline-flex items-center ${className} ${s.gap}`}
      id={id}
      aria-label={`${rating} out of 5 stars${reviews ? ` — ${reviews} reviews` : ""}`}
      title={`${rating} out of 5 stars${reviews ? ` — ${reviews} reviews` : ""}`}
    >
      {/* Stars */}
      <div className={`flex ${s.text} relative`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const type = getStarType(i);

          if (type === "full") {
            return (
              <svg
                key={i}
                width={s.w}
                height={s.h}
                viewBox="0 0 24 24"
                fill={AMAZON_ORANGE}
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            );
          }

          if (type === "half") {
            return (
              <span key={i} className="relative inline-block" style={{ width: s.w, height: s.h }}>
                {/* Empty star */}
                <svg
                  width={s.w}
                  height={s.h}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  className={STAR_EMPTY_CLASS}
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>

                {/* Half star overlay */}
                <svg
                  width={s.w}
                  height={s.h}
                  viewBox="0 0 24 24"
                  fill={AMAZON_ORANGE}
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    clipPath: "inset(0 50% 0 0)",
                    WebkitClipPath: "inset(0 50% 0 0)",
                  }}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </span>
            );
          }

          return (
            <svg
              key={i}
              width={s.w}
              height={s.h}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              className={STAR_EMPTY_CLASS}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          );
        })}
      </div>

      {/* Numeric rating */}
      {showNumeric && (
        <span className=" text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      )}

      {/* Reviews link */}
      {typeof reviews === "number" && (
        <Link href={`#reviews`} className="ml-1 text-xs text-blue-600 hover:underline">
          ({reviews.toLocaleString()})
        </Link>
      )}
    </div>
  );
};

export default Rating;
