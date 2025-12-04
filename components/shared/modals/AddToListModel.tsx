// components/AddToListModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Rating from "../Rating";
import { IProduct } from "@/models/product.model";
import { ISavedItem } from "@/models/savedList.model";



type SavedList = {
  id: string;
  name: string;
  isPrivate: boolean;
  count: number;
  previewImages: string[]; // small grid of images
};

interface AddToListModalProps {
  open: boolean;
   setOpen: (v:boolean)=> void;
   listName: string
  item: ISavedItem | undefined
  // optional callbacks to integrate with backend
 
 
}

/**
 * Pixel-perfect Amazon-like "Add to List" modal clone
 */
const AddToListModal: React.FC<AddToListModalProps> = ({ open, item, listName,setOpen}) => {
  // mock lists if none provided by API
  const initialLists: SavedList[] = [
    {
      id: "1",
      name: "luxury bags",
      isPrivate: false,
      count: 12,
      previewImages: [
        "https://m.media-amazon.com/images/I/61vJtANn4CL._AC_UY90_.jpg",
        "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_UY90_.jpg",
        "https://m.media-amazon.com/images/I/61SQz8S+fEL._AC_UY90_.jpg",
      ],
    },
    {
      id: "2",
      name: "underwears",
      isPrivate: true,
      count: 3,
      previewImages: [
        "https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UY90_.jpg",
        "https://m.media-amazon.com/images/I/91BdMBWd2bL._AC_UY90_.jpg",
      ],
    },
    {
      id: "3",
      name: "gift ideas",
      isPrivate: false,
      count: 5,
      previewImages: [],
    },
  ];


  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    // focus first actionable element
    setTimeout(() => firstFocusableRef.current?.focus(), 40);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // small focus-trap: keep focus within dialog when open
  useEffect(() => {
    if (!open) return;
    function onFocus(e: FocusEvent) {
      const el = dialogRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        e.preventDefault();
        firstFocusableRef.current?.focus();
      }
    }
    document.addEventListener("focusin", onFocus);
    return () => document.removeEventListener("focusin", onFocus);
  }, [open]);

  if (!open) return null;







  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={close}
        aria-hidden
      />

      {/* modal */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Add to List"
        className="relative my-10 w-[95%] mx-auto max-w-[900px] "
      >
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
          {/* header */}
          <div className="flex items-start bg-[#f3f3f3] justify-between px-5 py-4 border-b border-gray-300 shadow">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add to List</h3>
             
            </div>
            <div className="flex items-center gap-3">
              <button
                ref={firstFocusableRef}
                onClick={close}
                aria-label="Close"
                className="p-2 rounded hover:bg-gray-50 text-gray-500"
                title="Close"
              >
                {/* X icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* product preview */}
          <div className="px-5 pt-5 flex flex-col pb-4 border-b border-gray-200">
             <h3 className="font-bold text-black sm:text-xl text-lg max-lg:mb-3 ">1 item added to <span className="text-blue-600">
               {listName}</span></h3>
             <div className="flex items-center justify-between gap-4 flex-col lg:flex-row  lg:gap-7">
   <div className="flex items-center flex-1 gap-x-4">
              <div>
                <img className="w-[200px] object-contain" 
                src={item?.variant?.images[0].url}
                 alt={item?.productId.name}  />
              </div>
              <div >
                  <Link href={`/product/${item?.productId._id}`} className="text-blue-600 text-sm font-medium hover:underline hover:text-blue-950 ">
                      {item?.productId.name}
                  </Link>
              </div>
            </div>
            <div className="border w-[250px] gap-4 rounded-lg p-3 flex flex-col border-gray-300">
                <Button className="border border-gray-700 rounded-full text-gray-900 text-xs font-medium capitalize ">
                    View your List
                </Button>
                  <Button className="px-4 py-2 rounded-full bg-[#ffa622] hover:bg-[#e68800] text-black text-xs font-medium">
                    Continue shopping
                </Button>
            </div>
             </div>
         
          </div>

          {/* lists */}
        <div className="px-3 py-4">
           <h2 className="font-bold text-black text-lg ">Customers who bought this also bought</h2>
        </div>
          <div className="flex items-center pb-5 gap-3 px-2">
  {[0,1,2,3].map((_,i) => (
              <div className="border border-gray-300 rounded-lg flex flex-col p-3 " key={i}>
                  <div>
                     <img className="w-[150px] object-contain" src="https://images-na.ssl-images-amazon.com/images/I/51w5L5YhRdL.AC_.jpg" alt="" />
                  </div>
                  <div className="flex flex-col mt-2 gap-2">
                     <p className="line-clamp-2 text-blue-600 font-medium text-xs">Lacel Urwebin Handbags for Women Designer Fashion Purses Top Handle Satchel Shoulder Bags 2pcs with Small Wallet (Brown)</p>
                     <Rating rating={4.2} />
                     <p className="text-red-600 text-xs font-normal ">$ 14.39</p>
                     <div className='flex flex-col gap-2.5'>
                      <Button className="rounded-full  h-[35px]
                          bg-[#ffce12]  text-gray-900 text-xs font-medium capitalize"> 
                    Add to cart
                </Button>
                  <Button className="px-4 h-[35px] py-2 rounded-full border border-gray-500 text-black text-xs font-medium">
                    Add to List
                </Button>
                     </div>
                  </div>
              </div>
          ))}
          </div>
        
        
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;
