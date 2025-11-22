"use client";
import React from "react";
import Rating from "./Rating";
import { Button } from "../ui/button";
import { IProduct } from "@/models/product.model";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

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
        {product.isFeatured && (
          <div className="absolute top-0 left-0 bg-[#C7511F] text-white text-xs font-bold px-2 py-1 rounded-tl-md rounded-br-md">
            Best Seller
          </div>
        )}

        {/* Product Image */}
        <img
          src={product.thumbnail.preview}
          alt={product.name}
          className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 z-101 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
        >
          <span
            onClick={onQuickViewClick}
            className="text-white cursor-pointer text-sm font-medium tracking-wide"
          >
            Quick View
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="mt-2 p-2 grow flex flex-col">
        <Link
          href={`/product/${product._id}`}
          className="text-sm text-gray-800 hover:underline hover:text-[#131921] h-14 overflow-hidden"
        >
           <p className="line-clamp-3 hover:text-[#131921]">{product.name}</p>
          
        </Link>
        <p className="mt-2 text-sm text-gray-400 font-normal">
           vendu par <span className="text-[#131921] font-medium ">{product.brand}</span> 
        </p>

        <div className="mt-1">
          <Rating rating={4.5} size="md" reviews={20} />
        </div>
<div className="flex items-center justify-between">
    <div className="mt-auto flex flex-col pt-1">
          <p className="text-lg font-bold text-[#131921] ">${product.basePrice}</p>
           <p className="text-sm font-medium text-gray-400 line-through">${product.basePrice + 50}</p>
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
