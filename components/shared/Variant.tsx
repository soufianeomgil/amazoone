
"use client";

import { RootState } from "@/lib/store";
import { selectVariant } from "@/lib/store/productSlice";
import { IProduct, IVariant } from "@/models/product.model";
import { CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AmazonPrice from "./AmazonPrice";

const Variant = ({ product }: { product: IProduct }) => {
  const dispatch = useDispatch();
  const productId = product._id ?? (product as any).id ?? product.name ?? "unknown_product";

  const selectedIndex = useSelector((state: RootState) => state.product.selectedVariant[productId] ?? 0);
  const [localSelectedVariant, setLocalSelectedVariant] = useState<number>(selectedIndex);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => setLocalSelectedVariant(selectedIndex), [selectedIndex]);

  const variants = Array.isArray(product.variants) ? product.variants : [];

  const getAttr = (variant: IVariant, name: string) =>
    variant?.attributes?.find((a: any) => (a.name || "").toLowerCase() === name.toLowerCase())?.value;

  const sizes = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v: any) => {
      const s = getAttr(v, "size");
      if (s) set.add(String(s));
    });
    return Array.from(set);
  }, [variants]);

  const handleSizePick = (size: string | null) => {
    if (!size) {
      setSelectedSize(null);
      return;
    }
    setSelectedSize(size);
    const idx = variants.findIndex((v: any) => {
      const s = getAttr(v, "size");
      return String(s) === size;
    });
    if (idx >= 0) {
      dispatch(selectVariant({ productId, variantIndex: idx }));
      setLocalSelectedVariant(idx);
    }
  };

  const handleVariantClick = (index: number) => {
    dispatch(selectVariant({ productId, variantIndex: index }));
    setLocalSelectedVariant(index);
    const s = getAttr(variants[index], "size");
    setSelectedSize(s ?? null);
  };

  const buildLabel = (variant: IVariant) => {
    const nonSizeAttrs = (variant.attributes || [])
      .filter((a: any) => (a.name || "").toLowerCase() !== "size")
      .map((a: any) => a.value)
      .filter(Boolean);
    if (nonSizeAttrs.length) return nonSizeAttrs.join(" / ");
    return variant.sku || "Variant";
  };

  const currentVariant = variants[localSelectedVariant] ?? {
    sku: "",
    priceModifier: 0,
    stock: product.stock ?? 0,
    attributes: [],
    images: [],
  };

  const finalPrice = (product.basePrice ?? 0) + (currentVariant.priceModifier ?? 0);
  const savings = (currentVariant.priceModifier ?? 0) > 0 ? Math.round((currentVariant.priceModifier ?? 0) * 0.1) : 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-sm text-gray-600">Price</div>
          {/* <div className="text-2xl font-semibold text-red-600">${finalPrice.toLocaleString()}</div> */}
          <AmazonPrice price={finalPrice} className="text-2xl font-semibold text-red-600" />
        </div>

        {savings > 0 && <div className="text-sm text-green-700">You save: ${savings}</div>}
        <div className="text-xs text-gray-500">& FREE Returns</div>

        {/* Size selector */}
        {sizes.length > 1 && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-900 mb-2">Size</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizePick(selectedSize === size ? null : size)}
                  className={`px-3 py-1 rounded-lg border transition text-sm ${
                    selectedSize === size ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              ))}
              {selectedSize && (
                <button type="button" onClick={() => handleSizePick(null)} className="px-3 py-1 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Variant list */}
        <div className="mt-4 space-y-3">
          {variants.length === 0 ? (
            <div className="text-sm text-gray-600">Single configuration — uses base product settings.</div>
          ) : (
            variants.map((variant: IVariant, index: number) => {
              const img = variant.images?.[0]?.url || product.thumbnail?.url || "";
              const sizeAttr = getAttr(variant, "size");
              const colorAttr = getAttr(variant, "color");
              const label = buildLabel(variant);
              const price = (product.basePrice ?? 0) + (variant.priceModifier ?? 0);
              const hiddenBySize = selectedSize ? sizeAttr !== selectedSize : false;

              return (
                <button
                  key={index}
                  onClick={() => handleVariantClick(index)}
                  aria-pressed={localSelectedVariant === index}
                  // className={`w-full p-3 text-left border rounded-lg transition-all flex items-center space-x-3 ${
                  //   localSelectedVariant === index ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"
                  // } ${hiddenBySize ? "opacity-50" : "opacity-100"}`}
                  className={`w-full p-4 rounded-xl border transition-all flex gap-4 ${
  localSelectedVariant === index
    ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
    : "border-gray-200 hover:border-gray-300"
}`}

                >
                  <div className="w-14 h-14 shrink-0 rounded overflow-hidden border bg-white">
                    {img ? (
                      <img src={img} alt={`${product.name} ${label}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium text-sm truncate">{label}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-2 mt-1">
                      {colorAttr && <span className="capitalize truncate">{colorAttr}</span>}
                      {sizeAttr && !sizeAttr.includes("same") && <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">Size: {sizeAttr}</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    {/* <div className="font-medium text-sm">${price.toLocaleString()}</div> */}
                    <AmazonPrice price={price} className="font-medium text-xl" />
                    {typeof variant.stock === "number" && variant.stock < 5 && (
                      <div className="text-xs text-red-600">Only {variant.stock} left</div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Key features */}
        <div className="mt-4 bg-gray-50 p-3 rounded">
          <h4 className="text-sm font-medium mb-2">Key features</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {(product.attributes || []).slice(0, 4).map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span><strong className="font-medium">{a.name}:</strong> {a.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Variant;

