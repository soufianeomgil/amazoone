"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "../ui/button";

type Props = {
  value: number;
  min?: number;
  max: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
};

export const QuantitySelector: React.FC<Props> = ({
  value,
  min = 1,
  max,
  onChange,
  size = "md",
  disabled = false,
  className = "",
}) => {
  const liveRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const decrease = () => {
    if (disabled) return;
    const next = Math.max(min, value - 1);
    if (next !== value) onChange(next);
  };

  const increase = () => {
    if (disabled) return;
    const next = Math.min(max, value + 1);
    if (next !== value) onChange(next);
  };

  // keyboard support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handler = (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "ArrowLeft" || e.key === "-") {
        e.preventDefault();
        decrease();
      }

      if (e.key === "ArrowRight" || e.key === "+") {
        e.preventDefault();
        increase();
      }
    };

    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [value, min, max, disabled]);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `${value}`;
    }
  }, [value]);

  // SIZES
  const sizeClasses =
    size === "sm"
      ? {
          btn: "w-8 h-8 text-sm",
          qty: "px-3 py-1 text-sm",
          icon: "w-3 h-3",
        }
      : {
          btn: "w-10 h-10 text-base",
          qty: "px-4 py-1.5 text-base",
          icon: "w-4 h-4",
        };

  const decreaseDisabled = disabled || value <= min;
  const increaseDisabled = disabled || value >= max;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="group"
      aria-label="Quantity selector"
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {/* --- DECREASE BUTTON --- */}
      <Button
        type="button"
        onClick={decrease}
        disabled={decreaseDisabled}
        aria-label="Decrease quantity"
        className={`
          ${sizeClasses.btn}
          rounded-lg 
          bg-gray-200 hover:bg-gray-300 
          cursor-pointer
          text-gray-800 
          font-bold 
          transition
          ${decreaseDisabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        −
      </Button>

      {/* --- DISPLAY VALUE --- */}
      <div
        className={`flex items-center justify-center font-semibold select-none ${sizeClasses.qty}`}
        style={{ minWidth: 48 }}
        aria-live="polite"
        aria-atomic="true"
      >
        <span>{value}</span>
        <span ref={liveRef} className="sr-only" />
      </div>

      {/* --- INCREASE BUTTON --- */}
      <Button
        type="button"
        onClick={increase}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
        className={`
          ${sizeClasses.btn}
          rounded-lg 
          bg-gray-800 hover:bg-gray-900 
          text-white 
          cursor-pointer
          font-bold 
          transition
          ${increaseDisabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        +
      </Button>
    </div>
  );
};

export default QuantitySelector;
