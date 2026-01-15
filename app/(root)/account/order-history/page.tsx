"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag } from "lucide-react";
import Gimini from "./_components/Gimini";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProfileItems from "@/components/shared/navbars/ProfileItems";
import RightSidebar from "@/components/shared/navbars/RightSidebar";
import { Spinner } from "@/components/ui/spinner";
import { IOrderItem } from "@/models/order.model";

import CancelOrderUI from "@/components/shared/clientBtns/CancelOrderBtn";
import OrderDetailsSidebar from "@/components/shared/OrderDetailsDrawer";
import EmptyOrder from "./_components/EmptyOrder";
import Image from "next/image";

type Order = {
  id: string;
  createdAt: string | Date;
  total: number;
  status?: string;
  items: IOrderItem[];
};

/* ===== Amazon / COD friendly status mapping ===== */
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Confirmation en cours",
  PROCESSING: "Préparation de la commande",
  SHIPPED: "En livraison",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500",
  PROCESSING: "bg-orange-500",
  SHIPPED: "bg-blue-500",
  DELIVERED: "bg-green-600",
  CANCELLED: "bg-red-600",
};

export default function OrderHistoryClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false);
  const [openCancelOrderModal, setOpenCancelOrderModal] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders?page=${p}&limit=2`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      setOrders((prev) => [...prev, ...(json.orders ?? [])]);
      setHasMore(Boolean(json.hasMore));
    } catch (err: any) {
      setError(err?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  useEffect(() => {
    if (page > 1) fetchPage(page);
  }, [page, fetchPage]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex lg:flex-row flex-col lg:px-10 lg:py-8 gap-5">
      <ProfileItems />
      <RightSidebar />

      {/* Global modals (mounted once) */}
      <CancelOrderUI
        orderId={selectedOrderId}
        open={openCancelOrderModal}
        setOpen={setOpenCancelOrderModal}
        onClose={() => setOpenCancelOrderModal(false)}
      />

      <OrderDetailsSidebar
        open={openDetailsDrawer}
        id={selectedOrderId}
        setOpen={setOpenDetailsDrawer}
        onClose={() => setOpenDetailsDrawer(false)}
      />

      <div className="flex-1 w-full lg:px-3">
        {/* Header */}
        {orders.length > 0 && (
<div className="px-3 mb-6">
          <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <ShoppingBag /> Vos commandes
          </h2>
          <p className="text-sm text-gray-500">
            Consultez, suivez et gérez vos commandes
          </p>
        </div>
        )}
        

        {/* Orders */}
        {orders.length > 0 ? (
 <div className="space-y-4 px-2">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-200 bg-white">
              {/* Order header */}
              <div className="bg-[#f2f2f2] border-b border-gray-200 px-3 py-2 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Commande N° {order.id}</p>
                  <p className="text-sm font-semibold">
                    Effectuée le {formatDate(new Date(order.createdAt))}
                  </p>
                  <p className="text-xs text-gray-600">
                    🚚 Livraison estimée : 24–48h
                  </p>
                </div>

                <div className="flex max-sm:flex-col flex-row sm:items-center gap-2.5 sm:gap-4">
                  <p className="hidden sm:block text-sm text-gray-600">
                    Total : {formatPrice(order.total)}
                  </p>

                  {order.status && (
                    <Badge
                      className={`${STATUS_COLORS[order.status]} max-sm:hidden text-white`}
                    >
                      {STATUS_LABELS[order.status]}
                    </Badge>
                  )}

                  <Button
                    size="sm"
                    className="bg-blue-primary cursor-pointer text-white"
                    
                    onClick={()=> {
                      setOpenDetailsDrawer(true)
                      setSelectedOrderId(order.id)
                    }}
                  >
                    <DollarSign size={14} />
                   Order Détails
                  </Button>
                   {order.status && (
                    <Badge
                      className={`${STATUS_COLORS[order.status]} sm:hidden text-white`}
                    >
                      {STATUS_LABELS[order.status]}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Items */}
              {order.items.map((x, idx) => (
                <div
                  key={idx}
                  className="p-3 flex gap-3 border-t border-gray-200 items-start"
                >
                  <Image 
                   width={100} 
                   height={100}
                    className="w-[100px] h-[100px] border border-gray-300 object-contain"
                    src={x.variant?.images?.[0]?.url || x.thumbnail || ""}
                    alt={x.name}
                  />

                  <div className="flex-1">
                    <Link href={`/product/${x.productId._id}`} className="font-medium line-clamp-3 hover:text-[#00afaa] hover:underline text-sm">{x.name}</Link>
                    <p className="text-sm text-gray-500">
                      QTY : {x.quantity}
                    </p>
                    <p className="font-bold text-sm">
                      {formatPrice(x.unitPrice)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Footer actions */}
              {order.status !== "CANCELLED" && (
 <div className="flex justify-end gap-2 p-3 border-t border-gray-200 bg-gray-100">
                <Button className="bg-[#FFD814] no-underline!  text-white" asChild variant="link" size="sm">
                  <Link href={`/order-tracking/${order.id}`}>
                    Suivi colis
                  </Link>
                </Button>
           
              <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-600"
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setOpenCancelOrderModal(true);
                  }}
                >
                  Annuler
                </Button>
          
               
              </div>
              )}
             
            </div>
          ))}

          <div ref={sentinelRef} className="h-6" />

          {loading && (
            <div className="flex justify-center py-6">
              <Spinner className="size-6!" />
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}
        </div>
        ): (
           <EmptyOrder 
            name="You have no previous orders"
            desc="We have thousands of items available across our wide range of sellers. Start ordering today!"
            alt="No Order state"
            srcUrl="/no_orders.svg"
            url="/"
             btnText="continue shopping"
                    
            />
        )}
       

        <Gimini />
      </div>
    </div>
  );
}
