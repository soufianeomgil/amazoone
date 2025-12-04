
// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { DollarSign, ShoppingBag } from "lucide-react";
// import Gimini from "./_components/Gimini";
// import { formatDate, formatPrice } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";


// const PAGE_SIZE = 2;

// const statusColor = (status?: string | null) => {
//   switch (status) {
//     case "CANCELED":
//       return "bg-red-500 text-white";
//     case "PAID":
//     case "PROCESSING":
//       return "bg-yellow-500 text-white";
//     case "SHIPPED":
//       return "bg-indigo-600 text-white";
//     case "DELIVERED":
//       return "bg-green-600 text-white";
//     default:
//       return "bg-gray-300 text-gray-800";
//   }
// };

// type OrderItem = {
//   name: string;
//   quantity: number;
//   unitPrice: number;
//   linePrice: number;
//   thumbnail?: string | null;
//   variant?: { images?: { url?: string }[]; attributes?: { name: string; value: string }[] } | null;
// };

// type Order = {
//   id: string;
//   createdAt: string;
//   total: number;
//   status?: string | null;
//   items: OrderItem[];
// };

// type ApiResponse = { orders: Order[]; hasMore: boolean };

// export default function OrderHistoryClient() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const sentinelRef = useRef<HTMLDivElement | null>(null);

//   const fetchPage = useCallback(
//     async (p: number) => {
//       setLoading(true);
//       setError(null);
//       try {
//         // NOTE: adjust endpoint to match your backend.
//         const res = await fetch(`/api/orders?page=${p}&limit=${PAGE_SIZE}`, { cache: "no-store" });
//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text || `Failed to fetch orders: ${res.status}`);
//         }
//         const json: ApiResponse = await res.json();
//         setOrders((prev) => [...prev, ...(json.orders ?? [])]);
//         setHasMore(Boolean(json.hasMore));
//       } catch (err: any) {
//         console.error("Orders fetch error", err);
//         setError(err?.message ?? "Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   // initial load
//   useEffect(() => {
//     fetchPage(1);
//   }, [fetchPage]);

//   // when `page` changes, fetch it (page=1 already fetched above, we guard)
//   useEffect(() => {
//     if (page === 1) return;
//     fetchPage(page);
//   }, [page, fetchPage]);

//   // IntersectionObserver to auto-increment page
//   useEffect(() => {
//     if (!sentinelRef.current) return;
//     if (observerRef.current) observerRef.current.disconnect();

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         const ent = entries[0];
//         if (ent.isIntersecting && !loading && hasMore) {
//           setPage((p) => p + 1);
//         }
//       },
//       { root: null, rootMargin: "200px", threshold: 0.1 }
//     );

//     observerRef.current.observe(sentinelRef.current);

//     return () => observerRef.current?.disconnect();
//   }, [loading, hasMore]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-10">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//           <div>
//             <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-semibold text-gray-900">
//               <ShoppingBag className="w-6 h-6 text-gray-700" />
//               Vos commandes
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">View, track, and manage orders from your account.</p>
//           </div>

//           <div className="flex items-center gap-3">
//             <Button className="hidden sm:inline-flex bg-[#FF9900] hover:bg-amber-500 text-white">
//               <DollarSign className="mr-2" /> Order Details
//             </Button>
//             <Link href="/" className="text-sm text-gray-600 hover:underline">
//               Help & support
//             </Link>
//           </div>
//         </div>

//         {/* Orders list */}
//         <div className="space-y-6">
//           {orders.length === 0 && !loading ? (
//             <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
//               <p className="text-lg font-medium text-gray-800">No orders yet</p>
//               <p className="text-sm text-gray-500 mt-1">Once you place an order it will appear here.</p>
//               <div className="mt-4">
//                 <Link href="/" className="inline-block">
//                   <Button className="bg-[#FF9900] text-white">Start shopping</Button>
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             orders.map((order, orderIndex) => (
//               <article
//                 key={ orderIndex}
//                 className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
//                 aria-labelledby={`order-${order.id}`}
//               >
//                 {/* Header */}
//                 <div className="flex items-center justify-between bg-gray-100 px-4 py-3 sm:px-6">
//                   <div className="flex items-center gap-4">
//                     <div className="text-xs text-gray-500">
//                       <div className="hidden sm:block">Order #{order.id}</div>
//                       <div className="sm:hidden text-sm">N°{order.id}</div>
//                     </div>

//                     <div className="border-l border-gray-200 h-6" />

//                     <div>
//                       <h3 id={`order-${order.id}`} className="text-sm font-semibold text-gray-800">
//                         Placed on {formatDate(new Date(order.createdAt))}
//                       </h3>
//                       <p className="text-xs text-gray-500">
//                         {order.items?.length ?? 0} item{(order.items?.length ?? 0) > 1 ? "s" : ""}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex lg:pr-2 pr-1 items-center gap-4">
//                     <p className="font-light lg:block hidden text-sm text-gray-600 ">
//                       <span>Total :</span> {formatPrice(order.total)}
//                     </p>

//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
//                       {order.status ?? "PENDING"}
//                     </span>

//                     <Button className="bg-[#FF9900] text-white text-xs" type="button">
//                       View details
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Items */}
//                 <div className="divide-y divide-gray-100">
//                   {order.items?.map((it, idx) => (
//                     <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start p-4 sm:p-5">
//                       <div className="w-full sm:w-24 shrink-0">
//                         <div className="border border-gray-200 rounded-md overflow-hidden bg-white h-24 w-full flex items-center justify-center">
//                           <img
//                             loading="lazy"
//                             src={(it.variant?.images?.[0]?.url as string) || it.thumbnail || "/placeholder.png"}
//                             alt={it.name ?? "product"}
//                             className="object-contain max-h-full"
//                           />
//                         </div>
//                       </div>

//                       <div className="flex-1 flex flex-col justify-between">
//                         <div>
//                           <h4 className="text-sm font-medium text-gray-800">{it.name}</h4>
//                           <p className="text-sm text-gray-600 mt-1">
//                             <span className="font-semibold text-gray-700">Qty:</span> {it.quantity}
//                           </p>

//                           <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
//                             {Array.isArray(it.variant?.attributes) && it.variant.attributes.length > 0
//                               ? it.variant.attributes.map((a, i) => (
//                                   <div key={i} className="flex items-center gap-1">
//                                     <span className="text-gray-500">{a.name}:</span>
//                                     <span className="font-medium text-gray-700">{a.value}</span>
//                                   </div>
//                                 ))
//                               : null}
//                           </div>
//                         </div>

//                         <div className="mt-3 flex items-center justify-between sm:justify-end gap-4">
//                           <div className="text-sm text-gray-700 font-semibold">{formatPrice(it.linePrice ?? (it.unitPrice ?? 0) * (it.quantity ?? 1))}</div>
//                           <div className="hidden sm:flex items-center gap-2">
//                             <Button className="px-3 py-1 text-xs border border-gray-200 bg-transparent text-gray-700">Track package</Button>
//                             <Button className="px-3 py-1 text-xs border border-red-600 bg-red-600 text-white">Cancel order</Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Mobile footer */}
//                 <div className="sm:hidden px-4 py-3 flex items-center gap-2">
//                   <Button className="flex-1 px-3 py-2 border border-yellow-500 text-yellow-500 bg-transparent">Track</Button>
//                   <Button className="flex-1 px-3 py-2 bg-red-500 text-white">Cancel</Button>
//                 </div>
//               </article>
//             ))
//           )}
//         </div>

//         {/* sentinel + loading + end of list */}
//         <div ref={sentinelRef} className="mt-6" />
//         <div className="mt-4 text-center">
//           {loading && <div className="text-sm text-gray-600">Loading more orders…</div>}
//           {!hasMore && !loading && orders.length > 0 && <div className="text-sm text-gray-500">You’ve reached the end of your orders.</div>}
//           {error && <div className="text-sm text-red-500">Error: {error}</div>}
//         </div>

//         <div className="mt-8">
//           <Gimini />
//         </div>
//       </div>
//     </div>
//   );
// }
// // FINISH ORDER PAGE DESIGN 
// // LIST PAGE
// // infite scroll for other pages
// abdali 200 | yassine 50 | rachid 10 || 7aja 650
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



type OrderItem = any;
type Order = {
  id: string;
  createdAt: string | Date;
  total: number;
  status?: string;
  items: OrderItem[];
};

export default function OrderHistoryClient() {
  // const LIMIT = 6; // page size
  // const [orders, setOrders] = useState<Order[]>([]);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // const sentinelRef = useRef<HTMLDivElement | null>(null);

  // const fetchPage = useCallback(
  //   async (p: number) => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const q = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
  //       const res = await fetch(`/api/orders?${q.toString()}`);
  //       if (!res.ok) throw new Error(`Failed to load (status ${res.status})`);
  //       const payload = await res.json();
  //       const fetched: Order[] = Array.isArray(payload.data?.orders) ? payload.data.orders : [];
  //       // append or set
  //       setOrders((prev) => (p === 1 ? fetched : [...prev, ...fetched]));
  //       // if fewer than limit => no more
  //       setHasMore(fetched.length >= LIMIT);
  //     } catch (err: any) {
  //       console.error(err);
  //       setError(err?.message ?? "Unknown error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [LIMIT]
  // );

  // // initial load
  // useEffect(() => {
  //   setPage(1);
  //   fetchPage(1);
  // }, [fetchPage]);

  // // intersection observer to load more
  // useEffect(() => {
  //   if (!sentinelRef.current) return;
  //   const el = sentinelRef.current;
  //   const obs = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting && !loading && hasMore) {
  //           setPage((p) => p + 1);
  //         }
  //       });
  //     },
  //     { root: null, rootMargin: "400px", threshold: 0.1 }
  //   );
  //   obs.observe(el);
  //   return () => obs.disconnect();
  // }, [loading, hasMore]);

  // // load when page increments (skip initial because initial already loaded when page===1)
  // useEffect(() => {
  //   if (page === 1) return;
  //   fetchPage(page);
  // }, [page, fetchPage]);
   const [orders, setOrders] = useState<Order[]>([]);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
   const [loading, setLoading] = useState(false);
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

               
                 {item.items?.map((x: any, idx: number) => (
                  <div key={idx} className="p-2.5 flex items-center bg-white justify-between">
                    <div className="flex items-start gap-3 w-full">
                      <div className="border border-gray-200 w-[100px] lg:w-[75px] shrink-0">
                        <img
                          loading="lazy"
                          className="w-full object-contain h-full"
                          src={(x?.variant?.images?.[0]?.url as string) || x?.thumbnail || ""}
                          alt={x?.name || "product"}
                        />
                      </div>

                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between">
                          <Badge
                            className={`${
                              item.status === "CANCELLED" ? "bg-red-500" : "bg-green-500"
                            } text-white`}
                          >
                            {item.status === "CANCELLED" ? "Cancelled" : "Delivered"}
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
                    <Link href={"/"}>suivi colis</Link>
                  </Button>

                  <Button className="border border-red-700 bg-red-500 hover:bg-light_blue text-white rounded-lg text-xs font-bold">
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

                  <Button className="border border-yellow-500 bg-red-500 hover:bg-light_blue text-white rounded-lg text-xs font-bold">
                    Annuler la commande
                  </Button>
                </div>
              </div>
            ))} 

            {/* sentinel & loaders */}
            <div ref={sentinelRef} className="h-6" />
            {loading && (
              <div className="py-6 text-center text-gray-600">
                Loading...
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

