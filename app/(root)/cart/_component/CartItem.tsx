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
          variantId: variant?.sku ?? "",
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
   const handleRemoveItem = async(productId:string, variantId:string | null)=> {
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
    const normalizedVariantId =  variant?.sku ?? variant?._id;

    const { error, success } = await addToSaveForLater({
      payload: {
        productId: String(product._id),
        variant,
        variantId: normalizedVariantId,
        quantity: item.quantity,
        snapshot: {
          price: item.productId.basePrice,
          thumbnail: item.productId.thumbnail,
          title: item.productId.name,
        },
      },
      userId: userId as string,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (success) {
      // Wait for the removal to finish
      await dispatch(
        removeItemAsync({
          productId: String(product._id),
          variantId: normalizedVariantId,
        }) as any
      );
    }
  } catch (err) {
    console.log(err);
  }
};


  return (
    <article className="w-full  border-b border-gray-200 py-4">
      {/* ===================== MOBILE LAYOUT ===================== */}
      <div className="flex sm:hidden gap-3">
        {/* IMAGE */}
        <div className="w-24 h-24 flex items-center justify-center bg-white border border-gray-300 rounded-md">
          <img
            src={imageUrl}
            alt={product?.name}
            className="w-full h-full object-contain"
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

          {/* Quantity Selector */}
          {/* <div className="mt-2">
            <QuantitySelector
              value={item.quantity}
              max={variant?.stock ?? product.stock ?? 10}
              onChange={handleUpdateQuantity}
              size="sm"
            />
          </div> */}
        </div>
      </div>

      {/* ===================== DESKTOP / TABLET LAYOUT ===================== */}
      <div className="hidden sm:grid sm:grid-cols-[100px_1fr_120px] gap-4 items-start">
        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <div className="w-24 h-24 bg-white border border-gray-300 rounded-md flex items-center justify-center">
            <img
              src={imageUrl}
              className="w-full h-full object-contain"
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
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-lg font-bold text-gray-900">
            ${unitPrice.toFixed(2)}
          </p>

          {/* Quantity Selector */}
          <QuantitySelector
            value={item.quantity}
            max={variant?.stock ?? product.stock ?? 10}
            onChange={handleUpdateQuantity}
            size="sm"
          />
        </div>
      </div>

      {/* ===================== ACTIONS (SHARED) ===================== */}
      <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-2">
        <button className="text-sm hover:underline" onClick={()=> handleRemoveItem(product._id as string,variant?.sku ?? variant?.id)}>
          <DeleteIcon className="w-4 h-4 cursor-pointer" />
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
