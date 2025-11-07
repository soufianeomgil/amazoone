// "use client"
// import React from 'react';
// import { HeartIcon, StarIcon } from './icons';
// import Rating from './Rating';



// const ProductCard = ({ name, image, onQuickViewClick, rating, reviews, price, isBestSeller }: {
//     name:string;
//     image:string;
//     onQuickViewClick?: () => void;
//     rating: number;
//     reviews: number;
//     price: string;
//     isBestSeller:boolean
// }) => {
//     return (
//         <div className="flex flex-col h-full">
//             <div className="relative bg-gray-100 p-2 rounded-md">
//                 {isBestSeller && <div className="absolute top-0 left-0 bg-[#C7511F] text-white text-xs font-bold px-2 py-1 rounded-tl-md rounded-br-md">Best Seller</div>}
//                 <a href="#">
//                     <img src={image} alt={name} className="w-full h-40 object-contain" />
//                 </a>
//             </div>
//             <div className="mt-2 grow flex flex-col">
//                 <a href="#" className="text-sm text-gray-800 hover:text-orange-600 h-20 overflow-hidden">
//                     {name}
//                 </a>
//                 <div className="mt-1">
//                     <Rating rating={rating} size="md" reviews={reviews} />
//                 </div>
//                 <div className="mt-auto pt-1">
//                     <p className="text-lg font-bold text-gray-900">${price}</p>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default ProductCard
"use client";
import React from "react";
import Rating from "./Rating";
import { Button } from "../ui/button";

const ProductCard = ({
  name,
  image,
  onQuickViewClick,
  rating,
  reviews,
  price,
  isBestSeller,
}: {
  name: string;
  image: string;
  onQuickViewClick: () => void;
  rating: number;
  reviews: number;
  price: string;
  isBestSeller: boolean;
}) => {
  return (
    <div className="group flex flex-col h-full border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative bg-gray-100 p-2 rounded-md flex items-center justify-center overflow-hidden">
        {isBestSeller && (
          <div className="absolute top-0 left-0 bg-[#C7511F] text-white text-xs font-bold px-2 py-1 rounded-tl-md rounded-br-md">
            Best Seller
          </div>
        )}

        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div
          
          className="absolute inset-0 z-101 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer"
        >
          <span onClick={onQuickViewClick} className="text-white cursor-pointer text-sm font-medium tracking-wide">
            Quick View
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="mt-2 grow flex flex-col">
        <a
          href="#"
          className="text-sm text-gray-800 hover:text-orange-600 h-20 overflow-hidden"
        >
          {name}
        </a>

        <div className="mt-1">
          <Rating rating={rating} size="md" reviews={reviews} />
        </div>

        <div className="mt-auto pt-1">
          <p className="text-lg font-bold text-gray-900">${price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

