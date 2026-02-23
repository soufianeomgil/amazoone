"use client"

import { updateUserInterestsEngine } from "@/actions/recommendations.actions";
import { addItemAsync } from "@/lib/store/cartSlice";
import { IProduct } from "@/models/product.model";
import { Heart, ShoppingCart, Timer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LocalCartItem } from "./MainCard";
import { useSession } from "next-auth/react";
import { RootState } from "@/lib/store";
import { SpinnerIcon } from "../shared/icons";
import CartSidebar from "../shared/CartSidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const DarDarekDealCard = ({ product }: { product:IProduct }) => {
  const [loading,setLoading] = useState(false)
  const session = useSession()
  const [openCart, setOpenCart] = useState(false);
  const [addedItems, setAddedItems] = useState<LocalCartItem[]>([]);
  const dispatch = useDispatch()
  const router = useRouter()
  
    const selectedVariantIndex = useSelector(
      (state: RootState) =>
        state.product.selectedVariant?.[String(product?._id ?? "")]
    );
  
    const defaultVariant =
      Array.isArray(product?.variants) && product.variants.length
        ? product.variants[Math.max(0, Number(selectedVariantIndex) || 0)]
        : null;
  
    const [chosenVariant, setChosenVariant] = useState<any | null>(defaultVariant);
   const handleAddToCart = async () => {
      try {
        setLoading(true);
        const variant = chosenVariant ?? null;
        const variantId = variant?._id ? String(variant._id) : null;
        const itemId = variantId
          ? `${String(product._id)}:${variantId}`
          : String(product._id);
  
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
          basePrice:
            typeof product.basePrice === "number"
              ? product.basePrice
              : Number(product.basePrice ?? 0),
          quantity: 1,
          _id: itemId,
          variantId: variantId ?? null,
          variant: variant ? { ...variant } : undefined,
        };
  
        await dispatch(addItemAsync(payload) as any);
  
        setAddedItems((prev) => [
          {
            _id: payload._id,
            productId: payload.productId,
            title: payload.name,
            price: payload.basePrice,
            variant: payload.variant as any,
            quantity: payload.quantity,
            thumbnail: payload.imageUrl,
          },
          ...prev,
        ]);
  
        await updateUserInterestsEngine({
          userId: session?.data?.user.id ?? "",
          tags: product.tags,
          weight: 10,
        });
  
        setOpenCart(true);
        router.refresh?.();
      } catch (err) {
        console.error("Add to cart failed:", err);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="bg-white group min-h-[300px] relative border border-gray-200 rounded-lg p-3 flex flex-col min-w-[220px] max-w-[280px]">
      
      {/* Top Badges */}
      <div className="flex justify-between items-start mb-2">
        <span className="bg-[#FFD200] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
          Dar Darek
        </span>
        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </button>
      </div>

      {/* Image Section */}
      <div className="aspect-square min-h-[165px] relative mb-4">
        <img 
          src={product?.thumbnail?.url} 
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        {/* Delivery Badge */}
        {true && (
          <div className="inline-flex items-center gap-1 bg-[#FF6B35] text-white text-[10px] px-2 py-0.5 rounded-sm mb-2">
            <Timer size={12} />
            <span className="font-semibold uppercase">Livraison rapide</span>
          </div>
        )}
       <Link href={`/product/${product._id}`}>
        <h3 className="text-sm text-[#003B65] font-medium line-clamp-2  leading-tight mb-1">
          {product.name}
        </h3>
       </Link>
       
        
        <p className="text-[11px] text-gray-500 mb-4">
          Vendu par <span className="text-[#00A89E] font-bold uppercase">{product.brand}</span>
        </p>
      </div>

      {/* Pricing & Cart */}
      <div className="flex justify-between items-end ">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#00A89E]">
              {product.basePrice}<span className="text-xs ml-0.5">DH</span>
            </span>
            <span className="bg-[#E61E54] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{61}%
            </span>
          </div>
          <span className="text-xs text-gray-400 line-through">
            {product.listPrice} DH
          </span>
        </div>

          <Button
  type="button"
  onClick={handleAddToCart}
  disabled={loading}
  className={cn(
    "relative  items-center p-0! justify-center gap-3 rounded-full w-[40px]  h-[40px]",
    "bg-[#08ada8] hover:bg-[#079691] active:scale-[0.98]", // Brand color & interaction
    "text-white font-semibold uppercase tracking-wide transition-all duration-200 shadow-md hover:shadow-lg",
    "disabled:bg-gray-300 disabled:cursor-not-allowed",
    "" // Replaced fixed width with padding for flexible content
  )}
>
  {loading ? (
   
      <SpinnerIcon  />
     
    
  ) : (
    <>
      <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
      {/* <span className="text-[12px] sm:text-[15px]">Add to Cart</span> */}
    </>
  )}
</Button>
      </div>
         <CartSidebar
              open={openCart}
              onClose={() => setOpenCart(false)}
              setOpen={setOpenCart}
              items={addedItems}
            />
    </div>
  );
};