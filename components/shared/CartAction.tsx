

"use client";

import { Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "../ui/button";
import { IProduct } from "@/models/product.model";
import { toggleAddToWishlist } from "@/actions/user.actions";
import { toast } from "sonner";
import { IUser } from "@/types/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addItemAsync } from "@/lib/store/cartSlice";
import { RootState } from "@/lib/store";
import { updateUserInterestsEngine } from "@/actions/recommendations.actions";

const CartAction = ({ product, user }: { product?: IProduct; user: IUser }) => {
  const variants = product?.variants ?? [];

  const selectedVariantIndex = useSelector(
    (state: RootState) => state.product.selectedVariant[product?._id as string]
  );
  const selectedVariant = product?.variants?.[selectedVariantIndex ?? 0] || null;

  const defaultStock = variants.length ? variants[0].stock ?? 0 : product?.stock ?? 0;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentVariantStock = defaultStock;
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleWishlistItem = async () => {
    try {
      const { error, success, message } = await toggleAddToWishlist({
        productId: product?._id as string,
      });
      if (error) {
        toast(error.message);
        return;
      } else if (success) {
        toast(message);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isWishlisted: boolean = !!user?.wishLists?.some(
    (w) => String(w) === String(product?._id)
  );

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      const variant = selectedVariant ?? null;

      const payload = {
        productId: product?._id as string,
        brand: product?.brand as string,
        name: product?.name as string,
        imageUrl: product?.thumbnail ?? { url: product?.images?.[0]?.url ?? "" },
        basePrice: product?.basePrice as number,
        quantity: quantity,
        _id: `${product?._id ?? ""}:${variant?.sku ?? ""}`,
        variantId: variant?.sku ?? undefined,
        variant: variant ?? undefined,
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await dispatch(addItemAsync(payload) as any);
      await updateUserInterestsEngine({
  userId: user._id,
  tags: product?.tags!,
  weight: 10,
})
      router.refresh?.();
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Compact quantity controls as a small component for reuse
  const QtyControls = (
    <div className="flex items-center space-x-2">
      <button
        aria-label="Decrease quantity"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        disabled={quantity <= 1}
      >
        <Minus className="w-4 h-4" />
      </button>

      <span
        className="px-3 py-1 border border-gray-300 rounded min-w-[48px] text-center text-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <button
        aria-label="Increase quantity"
        onClick={() => setQuantity(Math.min(currentVariantStock, quantity + 1))}
        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        disabled={quantity >= currentVariantStock}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <>
      {/* DESKTOP / TABLET: original layout (hidden on small screens) */}
      <div className="hidden sm:block">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Quantity:</label>
          {QtyControls}
        </div>

        <div className="space-y-3 mt-4">
          <Button
            disabled={loading || currentVariantStock === 0}
            onClick={() => handleAddToCart()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </>
            )}
          </Button>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2"
            disabled={currentVariantStock === 0}
          >
            Buy Now
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={() => toggleWishlistItem()}>
              <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              {isWishlisted ? "Wishlisted" : "Add to List"}
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE: fixed bottom bar (visible only on small screens) */}
      <div className="sm:hidden">
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-3 py-3 flex items-center gap-3">
            {/* left: qty controls */}
            <div className="flex-shrink-0">{QtyControls}</div>

            {/* middle: Add to cart / Buy now stacked vertically on small devices */}
            <div className="flex-1">
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddToCart()}
                  disabled={loading || currentVariantStock === 0}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-medium disabled:opacity-50"
                >
                  {loading ? <Spinner /> : <><ShoppingCart className="w-4 h-4 mr-2" /> Add</>}
                </button>

                <button
                  onClick={() => { /* buy now handler (optional) */ }}
                  disabled={currentVariantStock === 0}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-50"
                >
                  Buy
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleWishlistItem()}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:underline"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                  {isWishlisted ? "Wishlisted" : "Save"}
                </button>

                <button className="p-2" aria-label="Share">
                  <Share2 className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* add bottom padding to page so content isn't hidden under fixed bar */}
        <div aria-hidden className="h-24" />
      </div>
    </>
  );
};

export default CartAction;
