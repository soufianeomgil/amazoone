"use client";

import React, { useEffect, useState } from "react";
import { X, Check, ShoppingCart, Minus, Plus, Trash2, User } from "lucide-react";
import Link from "next/link";
import { IVariant } from "@/models/product.model";
import { Button } from "../ui/button";
import { IOrder } from "@/models/order.model";
import { Badge } from "../ui/badge";
import { LocationIcon } from "./icons";
import { useDispatch } from "react-redux";

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
  currency?: string;
  setOpen: (v:boolean) => void;
  id:string
};


export default function OrderDetailsSidebar({
  open,
  onClose,
  id,
  currency = "Dh",
  setOpen
}: Props) {
  const [order,setOrder] = useState<IOrder | null>()
  const [error,setError] = useState('')
  const dispatch = useDispatch()
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

  

  const formatPrice = (n: number) =>
    `${n.toFixed(2).replace(/\B(?=(\d{3})<+(?!\d))/g, ",")} ${currency}`;

  if (!open) return null;
    useEffect(() => {
  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const { data } = await response.json();
      setOrder(data);
    } catch (error) {
      setError("Une erreur s'est produite lors du chargement de la commande.");
    } 
  };

  if (id) {
    fetchOrder();
  }
}, [id]);
  return (
    <>
      {/* overlay */}
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-black/20  z-40 transition-opacity"
      />

      {/* sidebar */}
      <aside
        role="dialog"
        aria-label="Cart panel"
        className="fixed right-0 top-0 h-full w-[420px] max-w-full bg-white z-50 shadow-2xl flex flex-col"
      >
        {/* header */}
        <header className="flex items-center justify-between px-4 py-4">
          <div className="flex flex-col">
             <h2 className="font-bold text-black sm:text-lg text-sm ">Detail de la commande</h2>
             <p className="text-gray-500 text-sm ">N°0026282931</p>
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
        <div className="flex-1 p-4 bg-gray-100  overflow-y-auto">
          {false ? (
            <div className="p-6 text-center text-sm text-gray-600">Votre panier est vide.</div>
          ) : (
            <div className=" space-y-4">
            
 <div  className="flex gap-3 items-start">
                  <div className="w-20 h-20 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border">
                    <img
                    // @ts-ignore
                      src={"https://cdnprd.marjanemall.ma/cn0picture0products0mm/AABAE89116_img1.jpg"} 
                        alt={"aê"}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                           Barre Lumineuse LED RGB - GENERIC - 45 cm - Contrôle Tactile - Fixation Magnétique - USB
                        </p>
                       
                        {/* {item?. && item.variant.attributes.map((att,index)=> (
                           <div key={index}>
                               <p className="text-xs text-gray-500 mt-1">{att.name}: <span className="text-blue-600 font-medium">{att.value}</span>  </p>
                           </div>
                        ) )} */}
                      </div>
                     <div>
                       <Badge className="text-white capitalize font-medium bg-red-600">
                          {order?.status}
                       </Badge>
                    </div>
                    </div>
                    <div className="flex mt-2.5 items-center justify-between gap-2">
                         <p className="text-sm font-bold text-green-700">{formatPrice(174.2)}</p>
                         <p className="text-gray-500 text-sm font-medium">QTY : <span>2</span></p>
                          {/* <p className="text-xs text-gray-400 line-through">{formatPrice( + 50)}</p> */}
                    </div>
 
                        
                    
                  </div>
                </div>
            
               
             
            </div>
          )}
          <div className="mt-5.5 bg-gray-200 p-3 space-y-1.5 rounded-lg flex flex-col">
              <p className="text-xs font-medium text-gray-800 ">Temps de livraison estimé :</p>
              <p className="text-xs font-medium text-gray-800">vendredi 21 novembre 2025 - samedi 22 novembre 2025</p>
          </div>
          <div className="mt-5.5 flex gap-3 flex-col">
             <div className="flex items-center gap-2">
                  <User color="hsl(178,100%,34%)" />
                  <p className="text-gray-800 font-bold text-sm"> <span>{order?.shippingAddress.name} </span> | <span>+212{order?.shippingAddress.phone}</span> </p>
             </div>
             <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 text-[hsl(178,100%,34%)] w-5" fill="none" viewBox="0 0 24 24" stroke={"hsl(178,100%,34%)"}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
                  <p className="text-gray-800 font-bold text-sm"> <span>{order?.shippingAddress.city} {order?.shippingAddress.addressLine1}</span> - <span className="uppercase">{order?.shippingAddress.city}</span> </p>
             </div>
          </div>
        </div>

        {/* footer */}
        <footer className=" p-4 bg-white">
          

          <div className="grid grid-cols-2 gap-3">
            <Button
            className="bg-[hsl(178,100%,34%)] text-white cursor-pointer rounded-lg text-xs font-medium "
              onClick={() => setOpen(false)}
              
            >
              
              Close
            </Button>

            <Button
            className="border bg-transparent cursor-pointer text-xs font-medium hover:text-gray-700 hover:bg-[hsl(179,66%,84%)] border-[hsl(178,100%,34%)] rounded-lg  text-[hsl(178,100%,34%)] "
              asChild
             
            >
              <Link href="/cart">
                 Suivi le colis
              </Link>
            </Button>
          </div>
        </footer>
      </aside>
    </>
  );
}
