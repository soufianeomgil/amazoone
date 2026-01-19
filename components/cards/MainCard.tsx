// components/MainCard.tsx
"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { RootState } from "@/lib/store";
import { addItemAsync } from "@/lib/store/cartSlice";
import { IProduct } from "@/models/product.model";
import { ArrowLeft, ArrowRight, Copy, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import Rating from "../shared/Rating";
import AmazonPrice from "../shared/AmazonPrice";
import { updateUserInterestsEngine } from "@/actions/recommendations.actions";
import { calculateDiscount } from "@/lib/utils";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DotsVerticalIcon, SpinnerIcon, TrashIcon } from "../shared/icons";
import { addItemToDefaultListAction, removeItemFromSavedListAction } from "@/actions/savedList.actions";
import { toast } from "sonner";
import Image from "next/image";

type Props = {
  product: IProduct;
  listId?: string;
  userId: string;
  isWishlist?: boolean;
  isWished?: boolean;
};

const SAMPLE_CONVERSION_BADGES = [
  { type: "FAST_SELLING", label: "Selling out fast" },
  { type: "SOCIAL_PROOF", label: "+420 sold recently" },
  { type: "LOWEST_PRICE", label: "Lowest price in 7 days" },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const MainCard: React.FC<Props> = ({ product, userId, listId, isWished, isWishlist }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [wishLoading, setWishLoading] = useState(false);
  const [localWished, setLocalWished] = useState(isWished);
  useEffect(() => setLocalWished(isWished), [isWished]);

  const [loading, setLoading] = useState(false);

  const selectedVariantIndex = useSelector(
    (state: RootState) => state.product.selectedVariant?.[String(product?._id ?? "")]
  );

  const defaultVariant =
    Array.isArray(product?.variants) && product.variants.length
      ? product.variants[Math.max(0, Number(selectedVariantIndex) || 0)]
      : null;

  const [chosenVariant, setChosenVariant] = useState<any | null>(defaultVariant);
  useEffect(() => setChosenVariant(defaultVariant), [defaultVariant]);

  // -----------------------------
  // ✅ Image sources (Noon-like swipe)
  // Priority: chosenVariant.images -> product.thumbnail -> product.images
  // -----------------------------
  const gallery = useMemo(() => {
    const urls: string[] = [];
    const vImgs = (chosenVariant?.images ?? []).map((x: any) => x?.url).filter(Boolean);
    const pThumb = product?.thumbnail?.url ? [product.thumbnail.url] : [];
    const pImgs = (product?.images ?? []).map((x: any) => x?.url).filter(Boolean);

    // Prefer variant images if exist, else thumbnail + product images
    const base = vImgs.length ? vImgs : [...pThumb, ...pImgs];

    // de-dup while preserving order
    const seen = new Set<string>();
    for (const u of base) {
      if (!u) continue;
      if (!seen.has(u)) {
        seen.add(u);
        urls.push(u);
      }
    }

    // fallback placeholder
    if (!urls.length) urls.push("");
    return urls;
  }, [chosenVariant, product?.thumbnail?.url, product?.images]);

  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => {
    // reset image index when variant/product changes
    setImgIndex(0);
  }, [product?._id, chosenVariant?._id]);

  const canSwipe = gallery.length > 1;

  // -----------------------------
  // ✅ Swipe/drag logic
  // -----------------------------
  const trackRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const draggingRef = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const slideTo = (next: number) => setImgIndex(clamp(next, 0, gallery.length - 1));
  const nextSlide = () => slideTo(imgIndex + 1);
  const prevSlide = () => slideTo(imgIndex - 1);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!canSwipe) return;

    draggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    setDragX(0);

    // capture pointer to keep receiving events
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    lastXRef.current = e.clientX;

    // small friction at edges
    const atStart = imgIndex === 0;
    const atEnd = imgIndex === gallery.length - 1;
    const friction = (atStart && dx > 0) || (atEnd && dx < 0) ? 0.35 : 1;

    setDragX(dx * friction);
  };

  const endDrag = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    setIsDragging(false);

    const width = trackRef.current?.clientWidth ?? 1;
    const threshold = Math.min(80, width * 0.22); // Noon-ish feel
    const dx = dragX;

    if (dx <= -threshold && imgIndex < gallery.length - 1) {
      setDragX(0);
      nextSlide();
      return;
    }
    if (dx >= threshold && imgIndex > 0) {
      setDragX(0);
      prevSlide();
      return;
    }

    // snap back
    setDragX(0);
  };

  // prevent accidental click navigation when user was dragging
  const [blockClick, setBlockClick] = useState(false);
  useEffect(() => {
    if (!isDragging) return;
    setBlockClick(true);
    const t = setTimeout(() => setBlockClick(false), 250);
    return () => clearTimeout(t);
  }, [isDragging]);

  // -----------------------------
  // Existing actions
  // -----------------------------
  const handleAddToCart = async () => {
    try {
      setLoading(true);
      const variant = chosenVariant ?? null;
      const variantId = variant?._id ? String(variant._id) : null;
      const itemId = variantId ? `${String(product._id)}:${variantId}` : String(product._id);

      const imageUrl =
        variant?.images?.[0]?.url
          ? { url: variant.images[0].url }
          : product?.thumbnail?.url
          ? { url: product.thumbnail.url }
          : product?.images?.[0]?.url
          ? { url: product.images[0].url }
          : { url: "" };

      const payload = {
        productId: String(product._id),
        brand: product.brand ?? "",
        name: product.name ?? "",
        imageUrl,
        basePrice: typeof product.basePrice === "number" ? product.basePrice : Number(product.basePrice ?? 0),
        quantity: 1,
        _id: itemId,
        variantId: variantId ?? null,
        variant: variant ? { ...variant } : undefined,
      };

      await dispatch(addItemAsync(payload) as any);

      await updateUserInterestsEngine({
        userId,
        tags: product.tags,
        weight: 10,
      });

      router.refresh?.();
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const priceForDisplay = (() => {
    const base = Number(product.basePrice ?? 0);
    if (chosenVariant?.priceModifier) {
      const mod = Number(chosenVariant.priceModifier ?? 0);
      return (base + mod).toFixed(2);
    }
    return base.toFixed(2);
  })();

  const handleAddItemToWishlist = async () => {
    if (wishLoading) return;

    try {
      setWishLoading(true);

      const variant = chosenVariant ?? null;
      const variantId = variant?._id ? String(variant._id) : null;

      const thumbnail =
        variant?.images?.[0]?.url ?? product?.thumbnail?.url ?? product?.images?.[0]?.url;

      const res = await addItemToDefaultListAction({
        productId: String(product._id),
        variantId,
        priceSnapshot: Number(product.basePrice ?? 0),
        thumbnail,
      });

      if (res?.error) {
        toast.error("Wishlist update failed");
        return;
      }

      setLocalWished(Boolean(res?.data?.added));
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setWishLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!listId) return;

    const variantId = chosenVariant?._id ? String(chosenVariant._id) : null;

    const res = await removeItemFromSavedListAction({
      listId,
      productId: String(product._id),
      variantId,
    });

    if (res?.success) {
      toast.success("Item deleted");
      router.refresh();
    }
  };

  return (
    <div>
      <article
        className="group relative flex flex-col sm:min-w-[180px] w-full bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        aria-labelledby={`product-${product._id}-title`}
        style={{ minHeight: 300 }}
      >
        {/* Image area */}
        <div className="relative bg-gray-50 overflow-hidden flex items-center justify-center p-3 md:p-4" style={{ height: 165 }}>
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 z-20 inline-flex items-center px-2.5 py-1 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white text-xs font-semibold shadow">
              Best Seller
            </span>
          )}

          {!isWishlist && (
            <div
              onClick={!wishLoading ? handleAddItemToWishlist : undefined}
              className="absolute top-3 cursor-pointer right-3 z-30 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-white shadow"
            >
              {localWished ? (
                <Heart size={22} className="text-red-500 fill-red-500" />
              ) : (
                <Heart size={22} className="text-gray-700 hover:text-red-500" />
              )}
            </div>
          )}

          {/* ✅ Swipeable image carousel */}
          <div className="relative w-full h-full">
            <div
              ref={trackRef}
              className={`relative w-full h-full overflow-hidden ${canSwipe ? "touch-pan-y" : ""}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
            >
              {/* Track */}
              <div
                className="flex h-full will-change-transform"
                style={{
                  transform: `translateX(calc(${-imgIndex * 100}% + ${dragX}px))`,
                  transition: isDragging ? "none" : "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {gallery.map((src, i) => (
                  <div key={i} className="relative min-w-full h-full flex items-center justify-center">
                    {src ? (
                      <Image
                        fill
                        src={src}
                        alt={product?.name ?? "product"}
                        className="object-contain"
                        sizes="(max-width: 768px) 50vw, 20vw"
                        priority={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-white rounded">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="opacity-60">
                          <path
                            d="M4 7h16M4 12h8m-8 5h16"
                            stroke="#cbd5e1"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ✅ Click-to-open only if NOT dragging */}
              <Link
                href={`/product/${product._id}`}
                className="absolute inset-0 z-10"
                onClick={(e) => {
                  if (blockClick || isDragging) e.preventDefault();
                }}
                aria-label={`Open ${product?.name}`}
              />
            </div>

            {/* Dots */}
            {canSwipe && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {gallery.slice(0, 6).map((_, i) => {
                  const active = i === imgIndex;
                  return (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        active ? "w-4 bg-[hsl(178,100%,34%)]" : "w-1.5 bg-black/20"
                      }`}
                    />
                  );
                })}
              </div>
            )}

            {/* Arrows (desktop) */}
            {canSwipe && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevSlide();
                  }}
                  disabled={imgIndex === 0}
                  className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow
                  opacity-0 group-hover:opacity-100 transition ${imgIndex === 0 ? "cursor-not-allowed opacity-40!" : ""}`}
                  aria-label="Previous image"
                >
                  <ArrowLeft size={16} className="text-gray-700" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextSlide();
                  }}
                  disabled={imgIndex === gallery.length - 1}
                  className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow
                  opacity-0 group-hover:opacity-100 transition ${
                    imgIndex === gallery.length - 1 ? "cursor-not-allowed opacity-40!" : ""
                  }`}
                  aria-label="Next image"
                >
                  <ArrowRight size={16} className="text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-3 flex-1 flex flex-col">
          <h3
            id={`product-${product._id}-title`}
            className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 mb-2"
            style={{ minHeight: 70 }}
          >
            <Link href={`/product/${product._id}`} className="hover:text-orange-600">
              {product.name}
            </Link>
          </h3>

          <p className="text-xs text-gray-500 mb-1 font-normal">
            Sold by:{" "}
            <span className="font-medium text-[hsl(178,100%,34%)]">
              {product.brand}
            </span>
          </p>

          <Rating rating={4.2} />

          <div className="relative overflow-hidden h-6">
            <div className="flex flex-col animate-badge-loop">
              {[...SAMPLE_CONVERSION_BADGES, ...SAMPLE_CONVERSION_BADGES].map((badge, index) => (
                <div
                  key={index}
                  className="h-6 flex items-center text-xs font-semibold text-orange-600"
                  data-badge={badge.type}
                >
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-white flex items-center justify-between" style={{ minHeight: 68 }}>
          <div className="flex flex-col">
            <div className="flex gap-1.5 items-center">
              <span className="text-base font-normal text-red-700">
                -{calculateDiscount(product.basePrice + 50, product.basePrice)}%
              </span>
              <AmazonPrice price={Number(priceForDisplay)} className="font-bold text-lg text-black" />
            </div>
            <span className="text-[10px] text-gray-500">
              List: <span className="line-through">${Number(product.basePrice + 70)}</span>
            </span>
          </div>

          <div className="flex flex-col items-end gap-2">
            {!isWishlist && (
              <button
                onClick={handleAddToCart}
                disabled={loading || (chosenVariant && chosenVariant.stock === 0)}
                className="flex bg-[hsl(178,100%,34%)] rounded-full w-[35px] h-[35px] items-center justify-center disabled:opacity-60"
              >
                <ShoppingCart size={16} color="white" />
              </button>
            )}
          </div>
        </div>
      </article>

      {isWishlist && (
        <div className="w-full   mt-2 gap-2.5 flex items-center">
          <Button
            type="button"
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-[#08ada8] flex items-center cursor-pointer
             justify-center flex-1 uppercase font-medium text-[10px] sm:text-[15px] text-white"
          >
            {loading ? <SpinnerIcon /> : "add to cart"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="px-3 cursor-pointer flex items-center justify-center bg-gray-200 hover:bg-gray-100 text-gray-600">
                <DotsVerticalIcon />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[320px] bg-white">
              <DropdownMenuItem onClick={() => {}} className="flex border-b border-gray-100 items-center gap-2 cursor-pointer">
                <ArrowRight color="gray" size={16} />
                Move to another Wishlist
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => {}} className="flex border-b border-gray-100 items-center gap-2 cursor-pointer">
                <Copy color="gray" size={16} />
                Copy to another Wishlist
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleDeleteItem} className="flex items-center gap-2 text-red-500! cursor-pointer">
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default MainCard;
