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

type Order = {
  id: string;
  createdAt: string | Date;
  total: number;
  status?: string;
  items: IOrderItem[];
};

export default function OrderHistoryClient() {
  
   const [orders, setOrders] = useState<Order[]>([]);
   const [orderId,setOrderId] = useState("")
   const [openDetailsDrawer,setOpenDetailsDrawer] = useState(false)
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [loading, setLoading] = useState(false);
   const [openCancelOrderModal,setOpenCancelOrderModel] = useState(false)
   const [error, setError] = useState<string | null>(null);
   
   const observerRef = useRef<IntersectionObserver | null>(null);
   const sentinelRef = useRef<HTMLDivElement | null>(null);

   const fetchPage = useCallback(
     async (p: number) => {
       setLoading(true);
       setError(null);
       try {
//         // NOTE: adjust endpoint to match your backend.
         const res = await fetch(`/api/orders?page=${p}&limit=${2}`, { cache: "no-store" });
         if (!res.ok) {
           const text = await res.text();
           throw new Error(text || `Failed to fetch orders: ${res.status}`);
         }
         const json = await res.json();
         setOrders((prev) => [...prev, ...(json.orders ?? [])]);
         setHasMore(Boolean(json.hasMore));
       } catch (err: any) {
         console.error("Orders fetch error", err);
         setError(err?.message ?? "Failed to load orders");
       } finally {
         setLoading(false);
       }
     },
     []
   );

//   // initial load
   useEffect(() => {
     fetchPage(1);
   }, [fetchPage]);

//   // when `page` changes, fetch it (page=1 already fetched above, we guard)
   useEffect(() => {
     if (page === 1) return;
     fetchPage(page);
   }, [page, fetchPage]);

//   // IntersectionObserver to auto-increment page
   useEffect(() => {
     if (!sentinelRef.current) return;
     if (observerRef.current) observerRef.current.disconnect();

     observerRef.current = new IntersectionObserver(
       (entries) => {
         const ent = entries[0];
         if (ent.isIntersecting && !loading && hasMore) {
           setPage((p) => p + 1);
         }
       },
       { root: null, rootMargin: "200px", threshold: 0.1 }
     );

     observerRef.current.observe(sentinelRef.current);

     return () => observerRef.current?.disconnect();
   }, [loading, hasMore]);
  
  return (
    <div className="min-h-screen w-full bg-gray-50 flex lg:flex-row flex-col lg:px-10 lg:py-8 gap-5 ">
       <ProfileItems />
      <RightSidebar />
      <div className=" w-full flex-1  lg:px-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="px-3">
            <h2 className="sm:text-2xl flex items-center gap-2 text-lg font-bold text-black mb-1">
              <ShoppingBag /> vos Commandes
            </h2>
            <p className="text-sm text-gray-500">View, track, and manage orders from your account.</p>
          </div>
        </div>

        {/* Orders list */}
        <div className="w-full px-2 py-5 flex-1">
          <div className="flex flex-col space-y-3 w-full">
            {orders.length === 0 && !loading && (
              <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">
                No orders found.
              </div>
            )}

            {orders.map((item, orderIndex) => (
              <div className="rounded-lg border w-full border-light_gray" key={orderIndex}>
          <CancelOrderUI
 
 orderId={orderId}
 
  open={openCancelOrderModal}
  setOpen={setOpenCancelOrderModel}
  onClose={() => setOpenCancelOrderModel(false)}
 
/>
<OrderDetailsSidebar setOpen={setOpenDetailsDrawer} open={openDetailsDrawer} onClose={() => setOpenDetailsDrawer(false)}  />

                <div className="bg-[#f2f2f2] border-b w-full border-gray-200 max-sm:h-auto h-[50px] flex items-center justify-between rounded-tr-lg rounded-tl-lg">
                  <div className="flex h-full py-2 max-sm:px-1 max-sm:py-[11px] px-2.5 items-center gap-3">
                    <div>
                      <p className="font-light text-xs text-gray-500 max-sm:hidden">N°{item.id}</p>
                    </div>

                    <div className="border-l max-sm:hidden border-gray-200 h-full" />

                    <div className="flex flex-col max-sm:gap-1">
                      <p className="font-bold text-[#333] lg:text-sm text-xs whitespace-nowrap">
                        Effectuée le {formatDate(new Date(item.createdAt))}
                      </p>

                      <p className="font-light lg:hidden block text-sm text-gray-600">
                        <span>Total :</span> {formatPrice(item.total)}
                      </p>

                      <div>
                        <p className="font-light text-xs text-gray-500 sm:hidden">N°{item.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:pr-2 pr-1 items-center gap-4">
                    <p className="font-light lg:block hidden text-sm text-gray-600">
                      <span>Total :</span> {formatPrice(item.total)}
                    </p>
                    

                    <Button className="bg-[#FF9900] text-xs font-medium lg:w-[150px] text-white rounded-lg" type="button">
                      <DollarSign size={15} />
                       Order Details
                    </Button>
                  </div>
                </div>

               
                 {item.items?.map((x: IOrderItem, idx: number) => (
                  <div key={idx} className="p-2.5 flex items-center bg-white justify-between">
                    <div className="flex items-start gap-3 w-full">
                      <div className="border border-gray-200 w-[100px] lg:w-[75px] shrink-0">
                        <img
                          loading="lazy"
                          className="w-full object-contain h-full"
                          src={(x?.variant?.images?.[0]?.url as string) || x?.thumbnail || ""}
                          alt={x?.name}
                        />
                      </div>

                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`${
                              item.status === "CANCELLED" ? "bg-red-500" : "bg-green-500"
                            } text-white`}
                          >
                            {/* {item.status === "CANCELLED" ? "Cancelled" : "Delivered"} */}
                             {item.status}
                          </Badge>

                          <div className="flex items-center gap-1 sm:hidden">
                            <p className="text-gray-500 font-light text-sm">
                              <span>QTY :</span> {x.quantity}
                            </p>
                            <span className="text-gray-500">|</span>
                            <h4 className="font-bold text-black text-sm m-0">{formatPrice(x.linePrice)}</h4>
                          </div>
                        </div>

                        <p className="max-w-[500px] max-sm:max-w-[350px] text-[#333] text-sm font-medium">{x.name}</p>

                        <p className="text-gray-500 font-light max-sm:hidden text-sm">
                          <span>QTY :</span> {x.quantity}
                        </p>

                        <h4 className="font-bold text-black max-sm:hidden text-sm m-0">{formatPrice(x.unitPrice)}</h4>

                        <div className="space-x-1 flex items-center justify-between mt-2">
                          {Array.isArray(x.variant?.attributes) &&
                            x.variant.attributes.map((a: any, i: number) => (
                              <p key={i} className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-800">{a.name}:</span> {a.value}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))} 

                
                 <div className="flex py-5 px-3 items-center justify-end w-full bg-white shadow border-t border-gray-100 max-sm:hidden gap-3">
                  <Button
                    asChild
                    className="border border-yellow-500 bg-transparent hover:bg-light_blue text-yellow-500 rounded-lg text-xs font-bold"
                  >
                    <Link href={`/order-tracking/${item.id}`}>suivi colis</Link>
                  </Button>

                  <Button onClick={()=> {
                    setOrderId(item.id)
                    setOpenCancelOrderModel(true)

                  }} className="border cursor-pointer border-red-700 bg-red-500 hover:bg-light_blue text-white rounded-lg text-xs font-bold">
                    Annuler la commande
                  </Button>
                </div> 

                {/* Footer actions (mobile) */}
                 <div className="flex items-center py-3 px-2 w-full sm:hidden gap-2">
                  <Button
                    asChild
                    className="border border-yellow-500 bg-transparent hover:bg-light_blue text-yellow-500 rounded-lg text-xs font-bold"
                  >
                    <Link href={"/"}>suivi colis</Link>
                  </Button>

                  <Button onClick={()=> {
                    setOrderId(item.id)
                    setOpenCancelOrderModel(true)

                  }} className="border border-yellow-500 cursor-pointer
                   bg-red-500 hover:bg-light_blue text-white rounded-lg text-xs font-bold">
                    Annuler la commande
                  </Button>
                </div>
              </div>
            ))} 

            {/* sentinel & loaders */}
            <div ref={sentinelRef} className="h-6" />
            {loading && (
              <div className="py-6 flex items-center justify-center text-center text-gray-600">
                <Spinner className="size-6! " color="hsl(178,100%,34%)"  />
              </div>
            )}
            {!hasMore && orders.length > 0 && (
              <div className="py-4 text-center text-sm text-gray-500">End of orders</div>
            )}
            {error && <div className="py-4 text-center text-sm text-red-500">Error: {error}</div>}
          </div>
        </div>

        <Gimini />
        
      </div>
    </div>
  );
}

