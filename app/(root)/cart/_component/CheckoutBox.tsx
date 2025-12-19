"use client";

import React, { useMemo, useState } from "react";
import Features from "./Features";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/actionTypes";
import { useRouter } from "next/navigation";
import AmazonPrice from "@/components/shared/AmazonPrice";

type Props = {
  isMobile?: boolean;
  user: IUser | null
  data: {
    items: ItemProps[] | undefined;
  };
};

interface ItemProps {
  productId: {
    basePrice?: number;
    name?: string;
    thumbnail?: { url?: string } | null;
  } & any; // keep flexible for your IProduct
  quantity: number;
  variantId?: string | null;
  variant?: IVariant | null;
}

interface IVariant {
  sku?: string;
  priceModifier?: number;
}

export const CheckoutBox: React.FC<Props> = ({ isMobile = false, data, user }) => {
  const items = data?.items ?? [];
  const qty = items.reduce((acc, it) => acc + (it.quantity ?? 0), 0);
   const [openAuthModel,setOpenAuthModel] = useState(false)
   const router = useRouter()
  const totalPriceNumber = items.reduce((acc, it) => {
    const base = Number(it.productId?.basePrice ?? 0);
    const modifier = Number(it.variant?.priceModifier ?? 0);
    return acc + (base + modifier) * (it.quantity ?? 0);
  }, 0);

  const formattedSubtotal = useMemo(() => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalPriceNumber);
  }, [totalPriceNumber]);

  // mobile summary toggle state
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [containsGift, setContainsGift] = useState(false);

  const proceedDisabled = items.length === 0;

  const handleProceed = () => {
    if (proceedDisabled) return;
     if(!user)  {
        setOpenAuthModel(true)
        return
     }
     router.push("/checkout")
     return
  };

  return (
    <>
      {/* Desktop / tablet card (visible >= sm) */}
      <div className={`hidden sm:flex flex-col gap-5`}>
        <div className={`bg-white p-4 rounded-md shadow-sm ${isMobile ? "mb-4" : "w-full"}`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-300 pb-4 ">
              <p className="text-sm font-medium ">Total articles ({qty})</p>
              <p className="text-sm font-medium">{formattedSubtotal}</p>
            </div>

            <div className="flex border-b border-gray-300 pb-4 items-center justify-between">
              <p className="font-bold text-lg">Total à payer</p>
              <p className="text-lg font-bold">{formattedSubtotal}</p>
              {/* <AmazonPrice className="text-lg font-bold" price={totalPriceNumber} /> */}
            </div>

            <div className="flex items-center my-2">
              <input
                id="checkout-gift-desktop"
                type="checkbox"
                checked={containsGift}
                onChange={(e) => setContainsGift(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="checkout-gift-desktop" className="ml-2 text-sm text-gray-700 select-none">
                This order contains a gift
              </label>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleProceed}
            disabled={proceedDisabled}
            className={`w-full text-sm rounded-lg py-2 mt-2 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
              ${proceedDisabled ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-700" : "bg-[#FFD814] hover:bg-[#F7CA00] text-black"}
            `}
            aria-disabled={proceedDisabled}
          >
            Proceed to checkout
          </Button>
        </div>

        <Features />
      </div>

      {/* MOBILE: fixed CTA + collapsible mini-summary */}
      <div className="sm:hidden">
        {/* The full card shown above is hidden on mobile; show a compact card instead */}
         <Features />
        <div className="bg-white p-3 rounded-md shadow-sm my-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total articles ({qty})</p>
              <p className="text-lg font-semibold">{formattedSubtotal}</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <input
                  id="checkout-gift-mobile"
                  type="checkbox"
                  checked={containsGift}
                  onChange={(e) => setContainsGift(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="checkout-gift-mobile" className="ml-2 text-sm text-gray-700 select-none">
                  Gift
                </label>
              </div>

              <button
                onClick={() => setMobileSummaryOpen((s) => !s)}
                aria-expanded={mobileSummaryOpen}
                className="text-sm text-gray-700 px-3 py-1 rounded-md border border-gray-200"
              >
                {mobileSummaryOpen ? "Hide" : "Details"}
              </button>
            </div>
          </div>
        
        </div>
 
        {/* Fixed CTA bar at bottom */}
        <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-3xl mx-auto px-3 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-semibold text-lg">{formattedSubtotal}</p>
                <p className="text-xs text-gray-500">{qty} item{qty > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="flex-1 ml-3">
              <Button
               type='button'
                onClick={handleProceed}
                disabled={proceedDisabled}
                className={`w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-md py-3 px-4 font-semibold transition
                  ${proceedDisabled ? "bg-gray-200 text-gray-600 cursor-not-allowed" : "bg-[#FFD814] hover:bg-[#F7CA00] text-black"}
                `}
                aria-disabled={proceedDisabled}
              >
                Proceed to checkout
              </Button>
            </div>
          </div>

          {/* expandable mini summary */}
          <div
            className={`max-w-3xl mx-auto px-3 overflow-hidden transition-all duration-200 ${mobileSummaryOpen ? "max-h-56 py-3" : "max-h-0"}`}
            aria-hidden={!mobileSummaryOpen}
          >
            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-inner">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formattedSubtotal}</span>
                </div>
                {/* provide a few items preview */}
                <div className="pt-2 border-t border-gray-100">
                  {items.slice(0, 3).map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-2">
                      <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        <img src={String(it.productId?.thumbnail?.url ?? "") || undefined} alt={it.productId?.name ?? "item"} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{it.productId?.name ?? "Product"}</div>
                        <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(((it.productId?.basePrice ?? 0) + (it.variant?.priceModifier ?? 0)) * it.quantity)}</div>
                    </div>
                  ))}
                  {items.length > 3 && <div className="text-xs text-gray-500">+{items.length - 3} more item(s)</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* spacer to ensure page content isn't hidden by fixed CTA */}
        <div aria-hidden className="h-28" />
      </div>
    </>
  );
};

export default CheckoutBox;
