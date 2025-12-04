"use client";

import React from "react";

type Size = "sm" | "md" | "lg";

interface RatingProps {
  rating: number; // 0 - 5 (can be fractional like 4.3)
  reviews?: number; // optional review count
  size?: Size; // star size
  className?: string; // wrapper class
  showNumeric?: boolean; // show numeric rating text (e.g. 4.3)
  id?: string; // optional id for linking
}

const AMAZON_ORANGE = "#FF9900"; // Amazon-like orange
const STAR_EMPTY_CLASS = "text-gray-300";

const sizeMap: Record<Size, { w: number; h: number; text: string }> = {
  sm: { w: 14, h: 14, text: "text-sm" },
  md: { w: 16, h: 16, text: "text-base" },
  lg: { w: 20, h: 20, text: "text-lg" },
};

const clamp = (v: number, a = 0, b = 5) => Math.max(a, Math.min(b, v));

const STAR_PATH = "M12 .587l3.668 7.568 8.332 1.151-6.064 5.952 1.535 8.283L12 18.896 4.529 23.541l1.535-8.283L-.001 9.306l8.332-1.151z";

const Rating: React.FC<RatingProps> = ({
  rating,
  reviews,
  size = "md",
  className = "",
  showNumeric = true,
  id,
}) => {
  const s = sizeMap[size];
  const ariaLabel = `${rating} out of 5 stars${reviews ? ` — ${reviews} reviews` : ""}`;
  const clampedRating = clamp(rating);

  const getStarType = (index: number) => {
    if (clampedRating >= index + 1) return "full";
    if (clampedRating > index && clampedRating < index + 1) return "half";
    return "empty";
  };

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      id={id}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <div className={`flex ${s.text}`} aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const type = getStarType(i);

          // FULL STAR
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
                <path d={STAR_PATH} />
              </svg>
            );
          }

          // HALF STAR
          if (type === "half") {
            return (
              <span key={i} className="relative inline-block" style={{ width: s.w, height: s.h }}>
                {/* empty star outline/background */}
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
                  <path d={STAR_PATH} />
                </svg>

                {/* colored half overlay clipped to left half */}
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
                    // clip left half (works well in modern browsers)
                    clipPath: "inset(0 50% 0 0)",
                    WebkitClipPath: "inset(0 50% 0 0)",
                  }}
                >
                  <path d={STAR_PATH} />
                </svg>
              </span>
            );
          }

          // EMPTY STAR
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
              <path d={STAR_PATH} />
            </svg>
          );
        })}
      </div>

      <div className="flex flex-col leading-tight">
        {showNumeric && (
          <span className={`font-medium ${s.text} text-blue-600 hover:underline text-xs `}>{rating.toFixed(1)}</span>
        )}
        {typeof reviews === "number" && (
          <a href={`#${id ?? ""}`} className="text-xs text-gray-600 hover:underline">
            ({reviews.toLocaleString()})
          </a>
        )}
      </div>
    </div>
  );
};

export default Rating;


/*
Usage examples:

// Default
<Rating rating={4.3} reviews={234} />

// Small
<Rating rating={3.8} size="sm" reviews={12} showNumeric={false} />

// Linkable
<Rating rating={4.9} id="product-123-reviews" reviews={1200} />

*/
