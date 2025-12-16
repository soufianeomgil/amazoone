"use client";
import React from "react";

import { Button } from "../ui/button";
import { IProduct } from "@/models/product.model";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Rating from "../shared/Rating";
import AmazonPrice from "../shared/AmazonPrice";

const ProductCard = ({
  product,
  onQuickViewClick,
}: {
  product: IProduct;
  onQuickViewClick: () => void;
}) => {
  return (
    <div className="group flex flex-col h-full border   border-gray-200
     rounded-md overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative bg-gray-100 p-2 rounded-md flex items-center justify-center overflow-hidden">
        {/* {product.isFeatured && (
          <div className="absolute top-0 left-0 bg-[#C7511F] text-white text-xs font-bold px-2 py-1 rounded-tl-md rounded-br-md">
            Best Seller
          </div>
        )} */}

        {/* Product Image */}
        <img
          src={"/pla.png"}
          alt={product.name}
          className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        {/* <div
          className="absolute inset-0 z-101 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
        >
          <span
            onClick={onQuickViewClick}
            className="text-white cursor-pointer text-sm font-medium tracking-wide"
          >
            Quick View
          </span>
        </div> */}
      </div>

      {/* Card Body */}
      <div className="mt-2 p-2 grow flex flex-col">
        <Link
          href={`/product/${product._id}`}
          className="text-sm   hover:text-[#131921] h-14 overflow-hidden"
        >
           <p className="line-clamp-5 hover:underline text-[#2162a1] hover:text-blue-900">{product.name}</p>
          
        </Link>
         <div className="mt-1">
          <Rating rating={4.5} size="md" reviews={20} />
        </div>
        <p className=" text-xs text-gray-500 font-medium">
           vendu par <span className="text-xs font-medium ">{product.brand}</span> 
        </p>

       
<div className="flex items-center justify-between">
    <div className="mt-auto flex flex-col pt-1">
          {/* <p className="text-lg font-bold text-[#131921] ">${product.basePrice}</p> */}
          <AmazonPrice price={product.basePrice} className="text-[#131921] text-lg font-bold " />
           <p className="text-[10px] font-medium text-gray-900">List Price: <span className=" line-through text-[12px] text-gray-900">${product.basePrice + 50}</span></p>
        </div>
      <div className="flex items-center cursor-pointer bg-[#131921] justify-center rounded-full w-[30px] h-[30px] ">
          <ShoppingCart size={16} color='white' />
      </div>
</div>
        
      </div>
    </div>
  );
};

export default ProductCard;
