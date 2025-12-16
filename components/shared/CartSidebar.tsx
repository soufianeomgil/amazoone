"use client";

import React, { useEffect } from "react";
import { X, Check, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { IVariant } from "@/models/product.model";
import { Button } from "../ui/button";

type ImageObject = { url?: string; preview?: string; public_id?: string };

export type CartItem = {
  _id: string;
  productId: string;
  title: string;
  price: number;
  variant: IVariant
  listPrice?: number | null;
  quantity: number;
  thumbnail?: ImageObject | { url?: string };
  sku?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  currency?: string;
  setOpen: (v:boolean) => void;
  
};

/**
 * Pixel-polished Cart Sidebar component (Tailwind).
 * - right sheet, overlay, keyboard accessible
 * - item rows with thumbnail, title, qty controls, price
 * - summary and two CTA buttons (Continue shopping, Go to cart)
 */
export default function CartSidebar({
  open,
  onClose,
  items,
  currency = "Dh",
  setOpen
}: Props) {
  // lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const subtotal =150.00

  const formatPrice = (n: number) =>
    `${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency}`;

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
      />

      {/* sidebar */}
      <aside
        role="dialog"
        aria-label="Cart panel"
        className="fixed right-0 top-0 h-full w-[420px] max-w-full bg-white z-50 shadow-2xl flex flex-col"
      >
        {/* header */}
        <header className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-50">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Produit ajouté au panier</p>
              <p className="text-xs text-gray-500">Quantité: 2</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* content */}
        <div className="flex-1 overflow-y-auto">
          {false ? (
            <div className="p-6 text-center text-sm text-gray-600">Votre panier est vide.</div>
          ) : (
            <div className="p-4 space-y-4">
             {items.map((item,index) => (
 <div key={index} className="flex gap-3 items-start">
                  <div className="w-20 h-20 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border">
                    <img
                    // @ts-ignore
                      src={item?.variant?.images[0]?.url} 
                        alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>
                       
                        {item.variant && item.variant.attributes.map((att,index)=> (
                           <div key={index}>
                               <p className="text-xs text-gray-500 mt-1">{att.name}: <span className="text-blue-600 font-medium">{att.value}</span>  </p>
                           </div>
                        ) )}
                      </div>
                      <div className="text-right">
                       
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <p className="text-sm font-bold text-green-700">{formatPrice(item.price)}</p>
                        
                          <p className="text-xs text-gray-400 line-through">{formatPrice(item.price + 50)}</p>
                    </div>
 
                        
                    <div className="mt-3 flex items-center justify-between gap-3">
                    
                    </div>
                  </div>
                </div>
             ))}
               
             
            </div>
          )}
        </div>

        {/* footer */}
        <footer className=" p-4 bg-white">
          

          <div className="grid grid-cols-2 gap-3">
            <Button
            className="bg-[hsl(178,100%,34%)] text-white cursor-pointer rounded-lg text-xs font-medium "
              onClick={() => setOpen(false)}
              
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              Continuer mes achats
            </Button>

            <Button
            className="border bg-transparent cursor-pointer text-xs font-medium hover:text-gray-700 hover:bg-[hsl(179,66%,84%)] border-[hsl(178,100%,34%)] rounded-lg  text-[hsl(178,100%,34%)] "
              asChild
             
            >
              <Link href="/cart">
              Aller au panier
              </Link>
            </Button>
          </div>
        </footer>
      </aside>
    </>
  );
}
