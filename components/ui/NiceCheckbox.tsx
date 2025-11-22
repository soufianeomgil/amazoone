"use client";

import React, { forwardRef } from "react";

type Props = {
  id?: string;
  checked?: boolean; // controlled
  defaultChecked?: boolean; // uncontrolled
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { box: "w-5 h-5", icon: "w-3.5 h-3.5" },
  md: { box: "w-6 h-6", icon: "w-4 h-4" },
  lg: { box: "w-8 h-8", icon: "w-5 h-5" },
};

const NiceCheckbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    id,
    checked,
    defaultChecked,
    onChange,
    label,
    size = "md",
    disabled = false,
    className = "",
    ...rest
  } = props;

  const sizes = sizeMap[size];
  const isControlled = typeof checked === "boolean";

  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 select-none cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      <input
        id={id}
        ref={ref}
        type="checkbox"
        className="sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        aria-checked={checked}
        {...rest}
      />

      <span
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          if (!isControlled && typeof onChange === "function") {
            // For uncontrolled case call onChange with toggled value of native input is not easily read here,
            // but the native input will toggle itself; we call onChange with the opposite of defaultChecked as a best-effort.
            onChange(!(defaultChecked ?? false));
          } else if (isControlled && typeof onChange === "function") {
            onChange(!checked);
          }
        }}
        className={`
          ${sizes.box} flex items-center justify-center rounded-lg transition-all
          bg-white border shadow-sm
          border-gray-200
          hover:scale-[1.03]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-400
        `}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className={`pointer-events-none ${sizes.icon} transition-all duration-200 transform
            ${checked || (defaultChecked && !isControlled) ? "opacity-100 scale-100" : "opacity-0 scale-75"}
          `}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#FFB84D" />
              <stop offset="100%" stopColor="#FF7A00" />
            </linearGradient>
          </defs>

          <rect
            x="1"
            y="1"
            width="22"
            height="22"
            rx="6"
            fill={checked ? "url(#g1)" : "transparent"}
            stroke={checked ? "url(#g1)" : "transparent"}
          />

          <path
            d="M7 12.5l2.5 2.5L17 8"
            stroke={checked ? "#fff" : "transparent"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>

      {label ? (
        <span className="text-sm text-gray-800 leading-none select-none">
          {label}
        </span>
      ) : null}
    </label>
  );
});

NiceCheckbox.displayName = "NiceCheckbox";

export default NiceCheckbox;
