// components/MainCard.tsx
"use client";
import React, { useEffect, useState } from "react";

import { RootState } from "@/lib/store";
import { addItemAsync } from "@/lib/store/cartSlice";
import { IProduct } from "@/models/product.model";
import { ArrowLeft, ArrowRight, Copy, Edit, Heart, HeartMinus, ShoppingCart, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import Rating from "../shared/Rating";
import AmazonPrice from "../shared/AmazonPrice";
import { updateUserInterestsEngine } from "@/actions/recommendations.actions";
import { calculateDiscount, getConversionBadge } from "@/lib/utils";
import CODBadge from "../shared/CODBadge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DotsVerticalIcon, SpinnerIcon, TrashIcon } from "../shared/icons";
import { Switch } from "../ui/switch";
import { addItemToDefaultListAction, removeItemFromSavedListAction } from "@/actions/savedList.actions";
import { toast } from "sonner";
import Image from "next/image";





type Props = {
  product: IProduct
  listId?:string;
  userId: string
  isWishlist?: boolean
  isWished?: boolean
}


/**
 * Updated MainCard:
 * - fixed layout so all cards have identical height in a grid
 * - image area fixed height
 * - product title area has fixed height (line-clamp + explicit min/max height)
 * - footer area (price / actions) fixed height so cards align
 * - variant selector shown but limited height — scrolls if many options
 */
  const MainCard: React.FC<Props> = ({ product, userId, listId, isWished ,isWishlist }) => {
   const dispatch = useDispatch();
   const router = useRouter();
   const [wishLoading, setWishLoading] = useState(false);
 const [localWished, setLocalWished] = useState(isWished)


   useEffect(() => {
    setLocalWished(isWished)
  }, [isWished])
  
   const [loading, setLoading] = useState(false);
//const conversionBadge = getConversionBadge(product);

  // If you keep selectedVariant in Redux for listing pages, read it;
  // otherwise we manage local chosenVariant below.
  const selectedVariantIndex = useSelector(
    (state: RootState) => state.product.selectedVariant?.[String(product?._id ?? "")]
  );

  const defaultVariant =
    Array.isArray(product?.variants) && product.variants.length
      ? product.variants[Math.max(0, Number(selectedVariantIndex) || 0)]
      : null;

  const [chosenVariant, setChosenVariant] = useState<any | null>(defaultVariant);

  useEffect(() => {
    setChosenVariant(defaultVariant);
  }, [defaultVariant]);
console.log(typeof product.listPrice, "LIST PRICE TYPE")
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
})
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
 const [response,setResponse] = useState<any>()
  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0;
const PURCHASE_SIGNAL = "500+ bought this week";
const SAMPLE_CONVERSION_BADGES = [
  { type: "FAST_SELLING", label: "Selling out fast" },
  { type: "SOCIAL_PROOF", label: "+420 sold recently" },
  { type: "LOWEST_PRICE", label: "Lowest price in 7 days" },
];

const handleAddItemToWishlist = async () => {
  if (wishLoading) return

  try {
    setWishLoading(true)

    const variant = chosenVariant ?? null
    const variantId = variant?._id ? String(variant._id) : null

    const thumbnail =
      variant?.images?.[0]?.url ??
      product?.thumbnail?.url ??
      product?.images?.[0]?.url

    const res = await addItemToDefaultListAction({
      productId: String(product._id),
      variantId,
      priceSnapshot: Number(product.basePrice ?? 0),
      thumbnail,
    })

    if (res?.error) {
      toast.error("Wishlist update failed")
      return
    }

    /**
     * 🔑 SINGLE SOURCE OF TRUTH
     * server decides whether item was added or removed
     */
    setLocalWished(Boolean(res?.data?.added))
  
    router.refresh()
  } catch (err) {
    console.error(err)
    toast.error("Something went wrong")
  } finally {
    setWishLoading(false)
  }
}

// const handleDeleteItem = async()=>  {
//   const variant = chosenVariant ?? null
//     const variantId = variant?._id ? String(variant._id) : null
//    try {
//     const {error,success,data} = await removeItemFromSavedListAction({
//         listId:listId!,
//         productId: product._id,
//         variantId
//      })
//      if(error) {
//        toast.error(error.message)
//        return
//      }else if(success) {
//        toast.success("item deleted")
//      }
//      setResponse(data)
//    } catch (error) {
//       console.log(error)
//    }
// }
const handleDeleteItem = async () => {
  if (!listId) return

  const variantId = chosenVariant?._id
    ? String(chosenVariant._id)
    : null

  const res = await removeItemFromSavedListAction({
    listId,
    productId: String(product._id),
    variantId,
  })

  if (res?.success) {
    toast.success("Item deleted")
    router.refresh()
  }
}

 console.log(response, 'RESPONSE HHHE')
  return (
    <div>
 <article
      className="group relative flex flex-col min-w-[180px] w-full bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      aria-labelledby={`product-${product._id}-title`}
      // fixed card height — tweak as needed for your grid (e.g., 420px)
      style={{ minHeight: 300 }}
    >
      
      {/* Image area (fixed height) */}
      <div className="relative bg-gray-50 overflow-hidden flex items-center justify-center p-3 md:p-4" style={{ height: 165 }}>
        {product.isBestSeller && (
          <span className="absolute top-3 left-3 z-20 inline-flex items-center px-2.5 py-1 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white text-xs font-semibold shadow">
            Best Seller
          </span>
        )}
        {!isWishlist && (
          <div  onClick={!wishLoading ? handleAddItemToWishlist : undefined}
 className="absolute top-3 cursor-pointer right-3 z-20  w-[35px] h-[35px] flex items-center justify-center rounded-full
           bg-white from-orange-500 to-rose-500 text-white text-xs font-semibold shadow">
            {localWished ? (
      <Heart size={22} className="text-red-500 fill-red-500" />
    ) : (
      <Heart size={22} className="text-gray-700 hover:text-red-500" />
    )}
          </div>
        )}

        <Link href={`/product/${product._id}`} className="absolute inset-0 z-10" aria-hidden="true" />

        <div className="relative w-full h-full flex items-center justify-center">
          {product?.thumbnail?.url || product?.images?.[0]?.url ? (
            <Image fill
              src={product?.thumbnail?.url ?? product?.images?.[0]?.url ?? ""}
              alt={product?.name}
              className="max-h-full object-contain transition-transform duration-400 group-hover:scale-105"
              loading="lazy"
              style={{ maxHeight: "100%" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-white rounded">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="opacity-60">
                <path d="M4 7h16M4 12h8m-8 5h16" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Body: title + rating + optional variant selector */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Title: fixed height to keep cards same size (2 lines clamp) */}
        <h3
          id={`product-${product._id}-title`}
          className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 mb-2"
          style={{ minHeight: 70 /* ~2 lines */ }}
        >
          <Link href={`/product/${product._id}`} className="hover:text-orange-600">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-gray-500 mb-1 font-normal ">Sold by: <span className="font-medium text-[hsl(178,100%,34%)] ">{product.brand}</span></p>
        
        <Rating rating={4.2}  />
    <div className="relative overflow-hidden h-6">
  <div className="flex flex-col animate-badge-loop">
    {[...SAMPLE_CONVERSION_BADGES, ...SAMPLE_CONVERSION_BADGES].map(
      (badge, index) => (
        <div
          key={index}
          className="h-6 flex items-center text-xs font-semibold text-orange-600"
          data-badge={badge.type}
        >
          {badge.label}
        </div>
      )
    )}
  </div>
</div>





        {/* {product.weeklySales > 0 && (
<div className="mt-1 mb-2 flex items-center gap-1 text-xs text-green-700 font-medium">
  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-600" />
  {PURCHASE_SIGNAL}
</div>
        )} */}
        {/* <CODBadge /> */}


 {/* Limited stock */}
{/* <div className="mt-1 mb-2  text-xs text-gray-600 font-medium">
  
  400+ viewed in past month
</div> */}
   
        {/* Variant selector (limit height so card doesn't grow) */}
        {/* {hasVariants && (
          <div className="mb-3" style={{ maxHeight: 90, overflow: "auto" }}>
            <VariantSelector
              variants={product.variants as any}
              attributesOrder={["Color", "Size"]}
              initialVariantId={defaultVariant?._id ?? null}
              onVariantChange={(v) => setChosenVariant(v)}
            />
          </div>
        )} */}

        {/* spacer to push footer to bottom */}
        {/* <div className="flex-grow" /> */}
      </div>

      {/* Footer: price + actions (fixed height to align) */}
      <div className="p-3 border-t border-gray-100 bg-white flex items-center justify-between" style={{ minHeight: 68 }}>
        <div className="flex flex-col">
          {/* <span className="text-lg font-bold text-red-700">${priceForDisplay}</span> */}
          <div className="flex gap-1.5 items-center">
            {true && (
<span className="text-base  font-normal text-red-700">
     -{calculateDiscount(product.basePrice + 50,product.basePrice)}%
  </span>
            )} 
             <AmazonPrice price={Number(priceForDisplay)} className="font-bold text-lg text-black" />
             
          </div>
          
          <span className="text-[10px] text-gray-500">List: <span className="line-through">${Number(product.basePrice + 70) }</span></span>
        </div>


        <div className="flex flex-col items-end gap-2">
          {/* <Button
            onClick={handleAddToCart}
            disabled={loading || (chosenVariant && chosenVariant.stock === 0)}
            className="px-3 py-1 rounded-md sm:block hidden text-xs font-medium bg-yellow-300 hover:bg-yellow-400 text-black shadow-sm disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add to cart"}
          </Button> */}
          {!isWishlist && (
 <button  onClick={handleAddToCart}
            disabled={loading || (chosenVariant && chosenVariant.stock === 0)} className=" flex bg-[hsl(178,100%,34%)] rounded-full w-[35px] h-[35px] items-center justify-center">
            <ShoppingCart size={16}  color="white" />
          </button>
          )}
         
        </div>
      </div>
    </article>
    {isWishlist && (
 <div className="w-full mt-2 gap-2.5 flex items-center">
         <Button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-[#08ada8] flex items-center cursor-pointer justify-center flex-1 uppercase font-medium text-[15px] text-white">
            {loading ? <SpinnerIcon /> : "add to cart"} 
         </Button>
          <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button className="px-3  cursor-pointer  flex items-center justify-center bg-gray-200 hover:bg-gray-100 text-gray-600">
                      <DotsVerticalIcon  />
                     
                   </Button>
                 </DropdownMenuTrigger>
         
                 <DropdownMenuContent align="end" className="w-[320px] bg-white  ">
                   {/* Edit */}
                   <DropdownMenuItem onClick={()=> {}} className="flex border-b  border-gray-100 items-center gap-2 cursor-pointer">
                     <ArrowRight color="gray" size={16} />
                     Move to another Wishlist
                   </DropdownMenuItem>
         
                   {/* Public sharing toggle */}
                   <DropdownMenuItem onClick={()=> {}} className="flex border-b  border-gray-100 items-center gap-2 cursor-pointer">
                     <Copy color="gray" size={16} />
                     Copy to another Wishlist
                   </DropdownMenuItem>
         
         
                  
         
                   {/* Empty wishlist */}
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
