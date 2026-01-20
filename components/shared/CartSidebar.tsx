"use client";

import React, { useEffect, useMemo } from "react";
import { X, Check, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { IVariant } from "@/models/product.model";
import { Button } from "../ui/button";
import Image from "next/image";

type ImageObject = { url?: string; preview?: string; public_id?: string };

export type CartItem = {
  _id: string;
  productId: string;
  title: string;
  price: number;
  variant: IVariant;
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
  setOpen: (v: boolean) => void;
};

export default function CartSidebar({
  open,
  onClose,
  items,
  currency = "Dh",
  setOpen,
}: Props) {
  // lock scroll + esc to close
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const formatPrice = (n: number) =>
    `${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency}`;

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price ?? 0) * Number(it.quantity ?? 1), 0),
    [items]
  );

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* DESKTOP: right sidebar */}
      <aside
        role="dialog"
        aria-label="Cart panel"
        className="
          fixed z-[99999] bg-white shadow-2xl flex flex-col
          max-sm:hidden
          right-0 top-0 h-full w-[420px] max-w-full
        "
      >
        {/* header */}
        <header className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-50">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Produit ajouté au panier</p>
              <p className="text-xs text-gray-500">Sous-total: {formatPrice(subtotal)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-600">Votre panier est vide.</div>
          ) : (
            <div className="p-4 space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-20 h-20 bg-gray-50 rounded-md border-gray-100 flex items-center justify-center overflow-hidden border">
                    <Image
                      width={80}
                      height={80}
                      // @ts-ignore
                      src={item?.variant?.images?.[0]?.url || ""}
                      alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>

                    {!!item.variant?.attributes?.length &&
                      item.variant.attributes.map((att, i) => (
                        <p key={i} className="text-xs text-gray-500 mt-1">
                          {att.name}: <span className="text-blue-600 font-medium">{att.value}</span>
                        </p>
                      ))}

                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm font-bold text-green-700">{formatPrice(item.price)}</p>
                      <p className="text-xs text-gray-400 line-through">{formatPrice(item.price + 50)}</p>
                      <p className="text-xs text-gray-500 ml-auto">x{item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <footer className="p-4 bg-white border-t">
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-[hsl(178,100%,34%)] text-white cursor-pointer rounded-lg text-xs font-medium"
              onClick={() => setOpen(false)}
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              Continuer mes achats
            </Button>

            <Button
              className="border bg-transparent cursor-pointer text-xs font-medium hover:text-gray-700 hover:bg-[hsl(179,66%,84%)] border-[hsl(178,100%,34%)] rounded-lg text-[hsl(178,100%,34%)]"
              asChild
            >
              <Link href="/cart">Aller au panier</Link>
            </Button>
          </div>
        </footer>
      </aside>

      {/* MOBILE: bottom sheet */}
      <aside
        role="dialog"
        aria-label="Cart bottom sheet"
        className="
          fixed z-50 inset-x-0 bottom-0
          sm:hidden
          transition-transform duration-300 ease-out
        "
        style={{
          transform: open ? "translateY(0%)" : "translateY(100%)",
        }}
      >
        <div
          className="
            bg-white
            rounded-t-2xl
            shadow-2xl
            border border-gray-200
            overflow-hidden
          "
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
          }}
        >
          {/* drag handle */}
          <div className="pt-2 pb-1 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>

          {/* header */}
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-green-50">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">Ajouté au panier</p>
                <p className="text-xs text-gray-500">
                  {items.length} article{items.length === 1 ? "" : "s"} • {formatPrice(subtotal)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-2 rounded-md hover:bg-gray-100 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* content (scroll) */}
          <div className="max-h-[55vh] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-600">Votre panier est vide.</div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center">
                      <Image
                        width={64}
                        height={64}
                        // @ts-ignore
                        src={item?.variant?.images?.[0]?.url || ""}
                        alt={item.title}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</p>

                      {!!item.variant?.attributes?.length && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {item.variant.attributes
                            .map((a) => `${a.name}: ${a.value}`)
                            .join(" • ")}
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-sm font-bold text-green-700">{formatPrice(item.price)}</p>
                        <p className="text-xs text-gray-400 line-through">{formatPrice(item.price + 50)}</p>
                        <p className="text-xs text-gray-500 ml-auto">x{item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* footer (sticky) */}
          <footer className="px-4 pt-3 border-t bg-white">
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-[hsl(178,100%,34%)] text-white cursor-pointer rounded-xl text-xs font-semibold"
                onClick={() => setOpen(false)}
              >
                Continuer
              </Button>

              <Button
                className="border bg-transparent cursor-pointer text-xs font-semibold hover:bg-[hsl(179,66%,84%)] border-[hsl(178,100%,34%)] rounded-xl text-[hsl(178,100%,34%)]"
                asChild
              >
                <Link href="/cart">Voir panier</Link>
              </Button>
            </div>
          </footer>
        </div>
      </aside>
    </>
  );
}
