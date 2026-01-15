"use client";

import React, { useState } from "react";
import { IProduct, IVariant, IVariantAttribute } from "@/models/product.model";
import { useDispatch } from "react-redux";
import { removeItemAsync, updateQuantityAsync } from "@/lib/store/cartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DeleteIcon } from "lucide-react";
import QuantitySelector from "@/components/shared/QTY";
import { addToSaveForLater } from "@/actions/saveForLater.actions";
import AmazonPrice from "@/components/shared/AmazonPrice";
import { SpinnerIcon } from "@/components/shared/icons";
import Image from "next/image";


interface Props {
  productId: IProduct;
  quantity: number;
  variantId?: string | null;
  variant?: IVariant | null;
  onQuantityChange?: (newQty: number) => void;
  onDelete?: () => void;
}

export const CartItemComponent: React.FC<{ item: Props, userId:string | null  }> = ({ item , userId}) => {
  const product = item.productId;
  const variant = item.variant ?? null;
  const dispatch = useDispatch();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const imageUrl =
    (variant && (variant as any).images?.[0]?.url) ||
    product?.thumbnail?.url ||
    product?.images?.[0]?.url ||
    "";

  const basePrice = Number(product?.basePrice ?? 0);
  const priceModifier =
    variant && typeof (variant as any).priceModifier !== "undefined"
      ? Number((variant as any).priceModifier)
      : 0;
  const unitPrice = basePrice + priceModifier;

  const handleUpdateQuantity = async (newQty: number) => {
    if (!product._id) return;
    try {
      setPending(true);
      await dispatch(
        updateQuantityAsync({
          productId: product._id as string,
          variantId: variant?._id ?? "",
          quantity: newQty,
        }) as any
      );
      setPending(false);
      router.refresh();
      item.onQuantityChange?.(newQty);
    } catch (err) {
      console.error(err);
      setPending(false);
    }
  };
   const handleRemoveItem = async(productId:string, variantId:string | undefined)=> {
      try {
         setPending(true)
         await new Promise(resolve => setTimeout(resolve, 500) )
         dispatch(removeItemAsync({productId,variantId}) as any)
         setPending(false)
         router.refresh()
      } catch (error) {
          console.log(error)
      }finally {
         setPending(false)
      }
        
     }
  const renderVariantAttributes = () => {
    if (!variant) return null;
    if (Array.isArray((variant as any).attributes)) {
      return (
        <div className="mt-1 text-xs text-gray-700 flex flex-wrap gap-1">
          {(variant as any).attributes.map((a:IVariantAttribute, idx: number) => (
            <span
              key={idx}
              className="bg-gray-100 px-2 py-1 rounded-md text-[11px]"
            >
              <strong className="mr-1">{a.name}:</strong>
              {a.value}
            </span>
          ))}
        </div>
      );
    }
    return null;
  };

const handleAddToSaveForLater = async () => {
  try {
    const payload = {
      productId: String(product._id),
      variant,
      variantId: variant?._id ?? null, // normalize: string or null
      quantity: item.quantity,
      snapshot: {
        price: unitPrice,
        thumbnail: item.productId.thumbnail,
        title: item.productId.name,
      },
    };

    const { error, success } = await addToSaveForLater({
      payload,
      userId: userId as string,
    });

    if (error) {
      console.error("addToSaveForLater error:", error);
      alert(error.message);
      return;
    }

    if (success) {
      // Wait for the thunk to finish and unwrap errors if any
      try {
        await dispatch(
          removeItemAsync({
            productId: String(product._id),
            variantId: payload.variantId, // null when no variant
          }) as any
        ).unwrap();

        // optional: refresh UI
        // router.refresh?.();
      } catch (removeErr: any) {
        console.error("Failed to remove item from cart after saving:", removeErr);
        // fallback: refresh to sync UI
        // router.refresh?.();
      }
    }
  } catch (err) {
    console.error("handleAddToSaveForLater unexpected error:", err);
  }
};

  return (
   <article className={`relative border-b border-gray-100 py-4 ${pending ? "opacity-70 pointer-events-none" : ""}`}>
{pending && (
    <div className="absolute inset-0 z-10 flex items-center justify-center ">
        <SpinnerIcon />
    </div>
  )}
      
      {/* ===================== bg-white/70 backdrop-blur-sm rounded-mdMOBILE LAYOUT ===================== */}
      <div className="flex sm:hidden gap-3">
        {/* IMAGE */}
        <div className="w-24 h-24 flex items-center justify-center bg-white border border-gray-300 rounded-md">
          <Image
          width={96}
          height={96}
            src={imageUrl}
            alt={product?.name}
            className=" object-contain"
          />
        </div>

        {/* MAIN INFO NEXT TO IMAGE */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link href={`/product/${product._id as string}`}>
              <h3 className="text-base font-semibold text-gray-700 line-clamp-2">
                {product?.name}
              </h3>
            </Link>

            {renderVariantAttributes()}

            {product?.status !== "OUT OF STOCK" ? (
              <p className="text-sm text-green-700 mt-1">In Stock</p>
            ) : (
              <p className="text-sm text-red-600 mt-1">Out of Stock</p>
            )}

            <p className="text-xs text-gray-500">Eligible for FREE Shipping</p>
          </div>

         
        </div>
      </div>

      {/* ===================== DESKTOP / TABLET LAYOUT ===================== */}
      <div className="hidden sm:grid sm:grid-cols-[100px_1fr_120px] gap-4 items-start">
        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-white border border-gray-300 rounded-md flex items-center justify-center">
            <Image 
            width={96}
            height={96}
              src={imageUrl}
              className=" object-contain"
              alt="product"
            />
          </div>
        </div>

        {/* MAIN INFO */}
        <div>
          <Link href={`/product/${product._id as string}`}>
            <h3 className="text-base font-medium text-gray-700">{product?.name}</h3>
          </Link>

          {renderVariantAttributes()}

          {product?.status !== "OUT OF STOCK" ? (
            <p className="text-sm text-green-700 mt-2">In Stock</p>
          ) : (
            <p className="text-sm text-red-600 mt-2">Out of Stock</p>
          )}

          <p className="text-sm text-gray-500">Eligible for FREE Shipping</p>
        </div>

        {/* PRICE & QUANTITY */}
        <div className="text-right flex flex-col items-end gap-2 ">
  

  <AmazonPrice price={unitPrice} className="text-lg font-bold text-gray-900" />

  <QuantitySelector
    value={item.quantity}
    max={variant?.stock ?? product.stock ?? 10}
    onChange={handleUpdateQuantity}
    size="sm"
    disabled={pending}
  />
</div>
      </div>

      {/* ===================== ACTIONS (SHARED) ===================== */}
      <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-2">
        <button className="text-sm hover:underline" onClick={()=> handleRemoveItem(product?._id,variant?._id)}>
          <Image width={20} height={20} src="/trashe.png" className="cursor-pointer w-5 h-5 object-contain " alt="trash icon" />
        </button>

        <button
          className="text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
          onClick={handleAddToSaveForLater}
        >
          Save for later
        </button>
        <div className="sm:hidden">
            <QuantitySelector
              value={item.quantity}
              max={variant?.stock ?? product.stock ?? 10}
              onChange={handleUpdateQuantity}
              size="sm"
            />
          </div>
      </div>
    </article>
  );
};

export default CartItemComponent;
