"use client";

import React, { useState } from "react";
import { Minus, Plus, ShoppingCart, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { addItemAsync, removeItemAsync, updateQuantityAsync } from "@/lib/store/cartSlice";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import CartSidebar from "./CartSidebar";
import FixedQTY from "./FixedQTY";
import AddToListButton from "./clientBtns/ListBtn";
import { IProduct, IVariant } from "@/models/product.model";
import { ISavedList } from "@/models/savedList.model";
import { LocationIcon } from "./icons";
import AmazonPrice from "./AmazonPrice";
import { updateUserInterestsEngine } from "@/actions/recommendations.actions";
import { gaEvent } from "@/lib/analytics/ga";
import { useAnalytics } from "@/hooks/useAnalytics";

type LocalCartItem = {
  _id: string;
  productId: string;
  title: string;
  price: number;
  listPrice?: number | null;
  variant: IVariant;
  quantity: number;
  thumbnail?: { url?: string };
  sku?: string;
};

const BuyPanel = ({ product, data,userId }: { product: IProduct; userId: string; data: ISavedList[] }) => {
  const variants = product?.variants ?? [];
  const selectedVariantIndex = useSelector(
    (state: RootState) => state.product.selectedVariant[product?._id as string]
  );
  const selectedVariant = product?.variants?.[selectedVariantIndex ?? 0] || null;
 const  { trackAddToCart } = useAnalytics()
  const defaultStock = variants.length ? variants[0].stock ?? 0 : product?.stock ?? 0;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<LocalCartItem[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const currentVariantStock = defaultStock;

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      const variant = selectedVariant ?? null;

      const payload = {
        productId: String(product?._id),
        brand: product?.brand ?? "",
        name: product?.name ?? "",
        imageUrl: product?.thumbnail,
        basePrice: Number(product?.basePrice ?? 0),
        quantity,
        variantId: variant?._id ?? null,
        variant,
        _id: `${String(product?._id)}:${variant?._id ?? ""}`,
      };

      await dispatch(addItemAsync(payload) as any);

      setAddedItems((prev) => [
        {
          _id: payload._id,
          productId: payload.productId,
          title: payload.name,
          price: payload.basePrice,
          variant: payload.variant,
          quantity: payload.quantity,
          thumbnail: payload.imageUrl,
        },
        ...prev,
      ]);
       await updateUserInterestsEngine({
  userId: userId,
  tags: product.tags,
  weight: 10,
})
 trackAddToCart(product, quantity)


      setOpen(true);
      router.refresh?.();
    } finally {
      setLoading(false);
    }
  };
  const [dollars, cents] = product.basePrice.toFixed(2).split(".");
/// We apologize but this account has not met the minimum eligibility requirements to write a review. If you would like to learn more about our eligibility requirements, please see our community guidelines.
  return (
    <>
      {/* DESKTOP BUY PANEL */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className=" rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          
          {/* PRICE */}
          <div className="p-5 border-b flex items-center gap-x-4 border-gray-100 bg-gradient-to-br from-gray-50 to-white">
           
            <div>
  <span className={`inline-flex items-start font-bold text-gray-900`}>
      <span className="text-[12px] text-gray-700 font-medium mr-0.5 mt-1 ">$</span>
      <span className={`text-3xl text-black font-bold`}>{dollars} </span>
      <span className="text-[10px] mt-1 text-gray-700 font-medium">{cents}</span>
    </span>
            </div>
           
   <div>
  <span className={`inline-flex items-start line-through font-bold text-gray-900`}>
      <span className="text-[8px] text-gray-500 font-medium mr-0.5 mt-1 ">$</span>
      <span className={`text-xl text-gray-500 font-bold`}>{Number(dollars) + 50} </span>
      <span className="text-[8px] mt-1 text-gray-500 font-medium">{cents}</span>
    </span>
            </div>


           
          </div>
             <h3 className="text-sm px-5 pt-2 text-gray-800">Delivery <span className="text-black font-bold"> Friday</span>, <span className="text-black font-bold">January 2</span></h3>
              <div className="flex py-2.5 gap-2 items-start px-5">
                <LocationIcon />
                  <p className="text-xs text-blue-600 font-medium"> Deliver to HMAMOU - Meknes <br /> 50000‌</p>
              </div>
       
          {/* STOCK */}
          <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-2 text-sm">
            {/* <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700">
              In stock — ready to ship
            </span> */}
            <p className="font-bold animate-pulse text-sm text-red-700">
                  Only 2 left in stock - order soon.
                </p>
          </div>

               
          {/* DELIVERY */}
         

          {/* ACTIONS */}
          <div className="p-5 space-y-4">
            {/* Quantity */}
          <div className="flex w-[75%] justify-center mx-auto 
           items-center border border-gray-300 rounded-md overflow-hidden">
  {/* Decrement */}
  <button
    onClick={() => setQuantity(Math.max(1, quantity - 1))}
    className="h-10 mx-auto  flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
  >
    <Minus className="w-4 h-4" />
  </button>

  {/* Quantity */}
  <input
    type="text"
    value={quantity}
    readOnly
    className="w-14 text-center border-l border-r border-gray-300 h-10 text-sm font-medium focus:outline-none"
  />

  {/* Increment */}
  <button
    onClick={() => setQuantity(Math.min(currentVariantStock, quantity + 1))}
    className="h-10 mx-auto  flex items-center justify-center text-gray-700 hover:bg-gray-100 transition"
  >
    <Plus className="w-4 h-4" />
  </button>
</div>



            {/* CTA */}
            <Button
              onClick={handleAddToCart}
              className="w-full h-11 bg-[hsl(178,100%,34%)] text-white font-semibold hover:opacity-90"
            >
              {loading ? <Spinner /> : <><ShoppingCart className="mr-2" /> Add to cart</>}
            </Button>

            <AddToListButton product={product} data={data} />
          </div>

          {/* TRUST */}
          <div className="p-4 bg-[hsl(178,100%,34%)] grid grid-cols-2 gap-3 text-white text-xs">
            <div className="flex items-center gap-2">
              <img className="w-5" src="https://www.marjanemall.ma/images/auth-white.png" />
              <span>100% authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <img className="w-5" src="https://www.marjanemall.ma/images/return-white.png" />
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CART SIDEBAR */}
      <CartSidebar open={open} onClose={() => setOpen(false)} setOpen={setOpen} items={addedItems} />

      {/* MOBILE CTA */}
      <FixedQTY pending={loading} handleAddToCart={handleAddToCart} product={product} />
    </>
  );
};

export default BuyPanel;

