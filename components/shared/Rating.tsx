"use client"
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

const STAR_COLOR = "text-yellow-400";
const STAR_EMPTY = "text-gray-300";

const sizeMap: Record<Size, { w: number; h: number; text: string }> = {
  sm: { w: 14, h: 14, text: "text-sm" },
  md: { w: 16, h: 16, text: "text-base" },
  lg: { w: 20, h: 20, text: "text-lg" },
};

const clamp = (v: number, a = 0, b = 5) => Math.max(a, Math.min(b, v));

const Rating: React.FC<RatingProps> = ({ rating, reviews, size = "md", className = "", showNumeric = true, id }) => {
  const s = sizeMap[size];
  const ariaLabel = `${rating} out of 5 stars${reviews ? ` — ${reviews} reviews` : ""}`;
  const clampedRating = clamp(rating);

  const getStarType = (index: number) => {
    if (clampedRating >= index + 1) return "full";
    if (clampedRating > index && clampedRating < index + 1) return "half";
    return "empty";
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} id={id} aria-label={ariaLabel} title={ariaLabel}>
      <div className={`flex ${s.text}`} aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const type = getStarType(i);
          if (type === "full") {
            return (
              <svg key={i} width={s.w} height={s.h} viewBox="0 0 24 24" fill="currentColor" className={STAR_COLOR}>
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.952 1.535 8.283L12 18.896 4.529 23.541l1.535-8.283L-.001 9.306l8.332-1.151z" />
              </svg>
            );
          }
          if (type === "half") {
            return (
              <div key={i} className="relative inline-block">
                <svg width={s.w} height={s.h} viewBox="0 0 24 24" fill="currentColor" className={STAR_EMPTY}>
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.952 1.535 8.283L12 18.896 4.529 23.541l1.535-8.283L-.001 9.306l8.332-1.151z" />
                </svg>
                <svg
                  width={s.w}
                  height={s.h}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`${STAR_COLOR} absolute top-0 left-0 clip-half`}
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.952 1.535 8.283L12 18.896 4.529 23.541l1.535-8.283L-.001 9.306l8.332-1.151z" />
                </svg>
              </div>
            );
          }
          return (
            <svg key={i} width={s.w} height={s.h} viewBox="0 0 24 24" fill="currentColor" className={STAR_EMPTY}>
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.952 1.535 8.283L12 18.896 4.529 23.541l1.535-8.283L-.001 9.306l8.332-1.151z" />
            </svg>
          );
        })}
      </div>

      <div className="flex flex-col leading-tight">
        {/* {showNumeric && <span className={`font-medium ${s.text}`}>{rating.toFixed(1)}</span>} */}
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
