"use client"

import { IProduct } from "@/models/product.model";
import { Heart, ShoppingCart, Timer } from "lucide-react";
import Link from "next/link";

export const DarDarekDealCard = ({ product }: { product:any }) => {
  return (
    <div className="bg-white group min-h-[300px] relative border border-gray-200 rounded-lg p-3 flex flex-col min-w-[220px] max-w-[280px]">
      
      {/* Top Badges */}
      <div className="flex justify-between items-start mb-2">
        <span className="bg-[#FFD200] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
          Dar Darek
        </span>
        <button className="text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </button>
      </div>

      {/* Image Section */}
      <div className="aspect-square min-h-[165px] relative mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        {/* Delivery Badge */}
        {product.fastDelivery && (
          <div className="inline-flex items-center gap-1 bg-[#FF6B35] text-white text-[10px] px-2 py-0.5 rounded-sm mb-2">
            <Timer size={12} />
            <span className="font-semibold uppercase">Livraison rapide</span>
          </div>
        )}
       <Link href={`/product/${product._id}`}>
        <h3 className="text-sm text-[#003B65] font-medium line-clamp-2  leading-tight mb-1">
          {product.name}
        </h3>
       </Link>
       
        
        <p className="text-[11px] text-gray-500 mb-4">
          Vendu par <span className="text-[#00A89E] font-bold uppercase">{product.vendor}</span>
        </p>
      </div>

      {/* Pricing & Cart */}
      <div className="flex justify-between items-end ">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#00A89E]">
              {product.price}<span className="text-xs ml-0.5">DH</span>
            </span>
            <span className="bg-[#E61E54] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{product.discount}%
            </span>
          </div>
          <span className="text-xs text-gray-400 line-through">
            {product.oldPrice} DH
          </span>
        </div>

        <button className="bg-[#00A89E] text-white p-2 rounded-lg hover:bg-[#008c84] transition-colors">
          <ShoppingCart size={20} />
        </button>
      </div>
    </div>
  );
};