// components/VariantSelector.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";

type VariantAttr = { name: string; value: string };
type Variant = {
  _id?: string;
  sku?: string;
  priceModifier?: number | string;
  stock?: number;
  attributes?: VariantAttr[];
  images?: { url?: string; preview?: string; public_id?: string }[];
};

type Props = {
  variants?: Variant[] | null;
  attributesOrder?: string[]; // e.g. ["Color","Size"]
  initialVariantId?: string | null;
  onVariantChange?: (variant: Variant | null) => void;
};

const NON_REAL_SIZES = [
  "same size",
  "one size",
  "onesize",
  "free size",
  "default",
  "os",
];

export default function VariantSelector({
  variants = [],
  attributesOrder = [],
  initialVariantId = null,
  onVariantChange,
}: Props) {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  // Build attribute -> unique values map
  const attributeOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {};

    variants?.forEach((v) => {
      v.attributes?.forEach((a) => {
        if (!a || !a.name) return;
        const key = a.name;
        if (!options[key]) options[key] = new Set();
        options[key].add(String(a.value ?? "").trim());
      });
    });

    return Object.fromEntries(
      Object.entries(options).map(([k, s]) => [k, Array.from(s)])
    );
  }, [variants]);

  // Initialize selection from initialVariantId or first variant
  useEffect(() => {
    if (!variants || variants.length === 0) {
      setSelectedValues({});
      onVariantChange?.(null);
      return;
    }

    if (initialVariantId) {
      const v = variants.find((x) => String(x._id) === String(initialVariantId));
      if (v) {
        const vals: Record<string, string> = {};
        v.attributes?.forEach((a) => {
          if (a?.name) vals[a.name] = a.value;
        });
        setSelectedValues(vals);
        onVariantChange?.(v);
        return;
      }
    }

    // fallback to first variant
    const first = variants[0];
    const vals: Record<string, string> = {};
    first.attributes?.forEach((a) => {
      if (a?.name) vals[a.name] = a.value;
    });
    setSelectedValues(vals);
    onVariantChange?.(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants, initialVariantId]);

  // Whenever selectedValues changes, find matching variant
  useEffect(() => {
    if (!variants || variants.length === 0) return;
    const match = variants.find((v) =>
      (v.attributes || []).every((a) => selectedValues[a.name] === a.value)
    );
    onVariantChange?.(match || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValues, variants]);

  if (!variants || variants.length === 0) return null;

  // Determine which attributes to show in order
  const order = attributesOrder.length ? attributesOrder : Object.keys(attributeOptions);

  const handleChange = (attrName: string, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [attrName]: value }));
  };

  return (
    <div className="space-y-3">
      {order.map((attrName) => {
        const values = attributeOptions[attrName] || [];
        if (!values.length) return null;

        const attrNameLower = attrName.toLowerCase();
        const isColor = attrNameLower.includes("color") || attrNameLower.includes("colour");
        const isSize = attrNameLower.includes("size");

        // NEW: hide size selector when there's only one "non-real" size value
        if (
          isSize &&
          values.length === 1 &&
          NON_REAL_SIZES.includes(String(values[0]).trim().toLowerCase())
        ) {
          return null;
        }

        return (
          <div key={attrName}>
            <div className="text-xs font-semibold mb-2">{attrName}</div>

            <div className="flex gap-2 flex-wrap">
              {values.map((val) => {
                const normalizedVal = String(val ?? "").trim();
                // Color swatches
                if (isColor) {
                  return (
                    <button
                      key={normalizedVal}
                      type="button"
                      aria-pressed={selectedValues[attrName] === normalizedVal}
                      onClick={() => handleChange(attrName, normalizedVal)}
                      title={normalizedVal}
                      className={`w-8 h-8 rounded-full border focus:outline-none ${
                        selectedValues[attrName] === normalizedVal
                          ? "ring-2 ring-offset-1 ring-indigo-400"
                          : "border-gray-200"
                      }`}
                      style={{ background: normalizedVal }}
                    />
                  );
                }

                // Sizes or other textual attributes
                return (
                  <button
                    key={normalizedVal}
                    type="button"
                    onClick={() => handleChange(attrName, normalizedVal)}
                    className={`px-2 py-1 rounded-md text-sm border focus:outline-none ${
                      selectedValues[attrName] === normalizedVal
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    {normalizedVal}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
