"use client"
import MainCard from "@/components/cards/MainCard";
import { IProduct } from "@/models/product.model";
import { ChevronLeft, ChevronRight } from "lucide-react";

import React, { useRef } from "react";



export const relatedProducts: any[] = [
  {
    _id: "1",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: true,
    isTrendy: false,
    name: "Nike Air Max 270",
    description: "Lightweight, breathable running shoes with superior cushioning.",
    basePrice: 120.99,
    status: "DRAFT",
    images: [{ url: "/products/nike-air-max-270-1.jpg",  }],
    thumbnail: { url: "https://m.media-amazon.com/images/I/71+pSKYjf0L._AC_UF480,480_SR480,480_.jpg", preview: "" },
    brand: "Nike",
    tags: ["running", "sneakers"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 2565,
    
    rating: 4.5,
    variants: [],
    attributes: [],
    stock: 25,
    totalStock: 25
  },
  {
    _id: "2",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: true,
    isTrendy: true,
    name: "KKXIU Triple Compartments Purses and Handbags for Women Fashion Ladies Satchel Shoulder Top Handle Bag",
    description: "Responsive running shoes with plush comfort.",
    basePrice: 149.99,
    status: "DRAFT",
    images: [{ url: "/products/adidas-ultraboost.jpg" }],
    thumbnail: { url: "https://m.media-amazon.com/images/I/71+pSKYjf0L._AC_UF480,480_SR480,480_.jpg", preview: "" },
    brand: "Adidas",
    tags: ["running", "sneakers"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 1987,
    
    rating: 4.7,
    variants: [],
    attributes: [],
    stock: 30,
    totalStock: 30
  },
  {
    _id: "3",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: false,
    isTrendy: true,
    name: "Puma RS-X3",
    description: "Stylish everyday sneakers with cushioned sole.",
    basePrice: 99.99,
    status: "DRAFT",
    images: [{ url: "https://m.media-amazon.com/images/I/81XscoFRknL._AC_UF480,480_SR480,480_.jpg",  }],
    thumbnail: { url: "https://m.media-amazon.com/images/I/81XscoFRknL._AC_UF480,480_SR480,480_.jpg", preview: "" },
    brand: "Puma",
    tags: ["sneakers", "casual"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 845,
    
    rating: 4.3,
    variants: [],
    attributes: [],
    stock: 18,
    totalStock: 18
  },
  {
    _id: "4",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: true,
    isTrendy: false,
    name: "Reebok Classic Leather",
    description: "Timeless casual sneakers for everyday wear.",
    basePrice: 110.0,
    status: "DRAFT",
    images: [{ url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg",  }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Reebok",
    tags: ["classic", "casual"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 1120,
    
    rating: 4.4,
    variants: [],
    attributes: [],
    stock: 22,
    totalStock: 22
  },
  {
    _id: "5",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: true,
    isTrendy: true,
    name: "New Balance 990v5",
    description: "Premium running shoes with superior comfort and style.",
    basePrice: 175.0,
    status: "DRAFT",
    images: [{ url: "https://m.media-amazon.com/images/I/71KWgFCMbYL._AC_UF480,480_SR480,480_.jpg", }],
    thumbnail: { url: "https://m.media-amazon.com/images/I/71KWgFCMbYL._AC_UF480,480_SR480,480_.jpg", preview: "" },
    brand: "New Balance",
    tags: ["running", "premium"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 1340,
    
    rating: 4.8,
    variants: [],
    attributes: [],
    stock: 15,
    totalStock: 15
  },
  {
    _id: "6",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: false,
    isTrendy: true,
    name: "Converse Chuck Taylor",
    description: "Iconic casual sneakers with a timeless look.",
    basePrice: 60.0,
    status: "DRAFT",
    images: [{ url: "https://images-na.ssl-images-amazon.com/images/I/712Q5D1puML._AC_UL165_SR165,165_.jpg" }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/712Q5D1puML._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Converse",
    tags: ["casual", "sneakers"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 2450,
    
    rating: 4.6,
    variants: [],
    attributes: [],
    stock: 40,
    totalStock: 40
  },
  {
    _id: "7",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: false,
    isTrendy: true,
    name: "Vans Old Skool",
    description: "Classic skate shoes with a durable canvas upper.",
    basePrice: 70.0,
    status: "DRAFT",
    images: [{ url: "https://images-na.ssl-images-amazon.com/images/I/71iDp0O8UJL._AC_UL165_SR165,165_.jpg", }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71iDp0O8UJL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Vans",
    tags: ["skate", "casual"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 1650,
    
    rating: 4.5,
    variants: [],
    attributes: [],
    stock: 28,
    totalStock: 28
  },
  {
    _id: "8",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: true,
    isTrendy: false,
    name: "ASICS Gel-Kayano 28",
    description: "Stability running shoes for daily workouts and long runs.",
    basePrice: 160.0,
    status: "DRAFT",
    images: [{ url: "/products/asics-gel-kayano.jpg", }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "ASICS",
    tags: ["running", "stability"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 980,
    
    rating: 4.7,
    variants: [],
    attributes: [],
    stock: 12,
    totalStock: 12
  },
  {
    _id: "9",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: true,
    isTrendy: true,
    name: "Under Armour HOVR Phantom",
    description: "High-performance running shoes with energy return cushioning.",
    basePrice: 140.0,
    status: "DRAFT",
    images: [{ url: "/products/ua-hovr.jpg",  }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Under Armour",
    tags: ["running", "tech"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 760,
    
    rating: 4.6,
    variants: [],
    attributes: [],
    stock: 20,
    totalStock: 20
  },
  {
    _id: "10",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: false,
    isTrendy: false,
    name: "Brooks Ghost 14",
    description: "Soft cushioning for comfortable daily runs.",
    basePrice: 130.0,
    status: "DRAFT",
    images: [{ url: "/products/brooks-ghost14.jpg"}],
    thumbnail: { url: "/products/brooks-ghost14-thumb.jpg", preview: "" },
    brand: "Brooks",
    tags: ["running", "comfortable"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 540,
    
    rating: 4.5,
    variants: [],
    attributes: [],
    stock: 18,
    totalStock: 18
  },
  // Add 10 more similarly...
  {
    _id: "11",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: true,
    isTrendy: true,
    name: "Mizuno Wave Rider 25",
    description: "Lightweight running shoe with smooth ride.",
    basePrice: 145.0,
    status: "DRAFT",
    images: [{ url: "/products/mizuno-wave-rider.jpg",  }],
    thumbnail: { url: "/products/mizuno-wave-rider-thumb.jpg", preview: "" },
    brand: "Mizuno",
    tags: ["running", "lightweight"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 630,
    
    rating: 4.4,
    variants: [],
    attributes: [],
    stock: 15,
    totalStock: 15
  },
  {
    _id: "12",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: false,
    isTrendy: true,
    name: "Saucony Triumph 19",
    description: "Premium cushioned running shoes for long distances.",
    basePrice: 160.0,
    status: "DRAFT",
    images: [{ url: "/products/saucony-triumph.jpg",  }],
    thumbnail: { url: "/products/saucony-triumph-thumb.jpg", preview: "" },
    brand: "Saucony",
    tags: ["running", "premium"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 480,
    
    rating: 4.6,
    variants: [],
    attributes: [],
    stock: 12,
    totalStock: 12
  },
  {
    _id: "13",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: true,
    isTrendy: false,
    name: "Fila Disruptor II",
    description: "Chunky retro sneakers with bold style.",
    basePrice: 75.0,
    status: "DRAFT",
    images: [{ url: "/products/fila-disruptor.jpg", }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Fila",
    tags: ["retro", "casual"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 1020,
    
    rating: 4.3,
    variants: [],
    attributes: [],
    stock: 20,
    totalStock: 20
  },
  {
    _id: "14",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: true,
    isTrendy: true,
    name: "Jordan Air 1 Mid",
    description: "Classic basketball sneakers with iconic design.",
    basePrice: 150.0,
    status: "DRAFT",
    images: [{ url: "/products/jordan-air1.jpg",  }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Jordan",
    tags: ["basketball", "classic"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 2750,
    
    rating: 4.8,
    variants: [],
    attributes: [],
    stock: 25,
    totalStock: 25
  },
  {
    _id: "15",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: false,
    isTrendy: false,
    name: "On Cloud X",
    description: "Versatile training shoes for high-intensity workouts.",
    basePrice: 140.0,
    status: "DRAFT",
    images: [{ url: "/products/on-cloud-x.jpg" }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "On",
    tags: ["training", "lightweight"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 310,
    
    rating: 4.5,
    variants: [],
    attributes: [],
    stock: 10,
    totalStock: 10
  },
  {
    _id: "16",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: true,
    isTrendy: true,
    name: "Hoka One One Clifton 9",
    description: "Max cushioned running shoes for ultimate comfort.",
    basePrice: 160.0,
    status: "DRAFT",
    images: [{ url: "/products/hoka-clifton.jpg" }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Hoka One One",
    tags: ["running", "cushioned"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 450,
    
    rating: 4.7,
    variants: [],
    attributes: [],
    stock: 14,
    totalStock: 14
  },
  {
    _id: "17",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: true,
    isTrendy: false,
    name: "Merrell Moab 2",
    description: "Durable hiking shoes for all terrains.",
    basePrice: 130.0,
    status: "DRAFT",
    images: [{ url: "/products/merrell-moab2.jpg"}],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Merrell",
    tags: ["hiking", "outdoor"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 680,
    
    rating: 4.6,
    variants: [],
    attributes: [],
    stock: 22,
    totalStock: 22
  },
  {
    _id: "18",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: false,
    isTrendy: true,
    name: "Columbia Redmond Waterproof",
    description: "Lightweight waterproof hiking shoes.",
    basePrice: 120.0,
    status: "DRAFT",
    images: [{ url: "/products/columbia-redmond.jpg" }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Columbia",
    tags: ["hiking", "waterproof"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 520,
    
    rating: 4.4,
    variants: [],
    attributes: [],
    stock: 18,
    totalStock: 18
  },
  {
    _id: "19",
    category: "Shoes",
    isFeatured: true,
    isBestSeller: false,
    isTrendy: true,
    name: "Salomon Speedcross 5",
    description: "Trail running shoes with aggressive grip.",
    basePrice: 150.0,
    status: "DRAFT",
    images: [{ url: "/products/salomon-speedcross.jpg",  }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Salomon",
    tags: ["trail", "running"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    reviewCount: 390,
    
    rating: 4.7,
    variants: [],
    attributes: [],
    stock: 12,
    totalStock: 12
  },
  {
    _id: "20",
    category: "Shoes",
    isFeatured: false,
    isBestSeller: true,
    isTrendy: false,
    name: "Altra Lone Peak 7",
    description: "Trail running shoes with zero-drop platform.",
    basePrice: 145.0,
    status: "DRAFT",
    images: [{ url: "/products/altra-lone-peak.jpg" }],
    thumbnail: { url: "https://images-na.ssl-images-amazon.com/images/I/71PTv8pQQiL._AC_UL165_SR165,165_.jpg", preview: "" },
    brand: "Altra",
    tags: ["trail", "running"],
    createdAt: Date.now() as any,
    updatedAt: "202",
    reviewCount: 320,
    
    rating: 4.6,
    variants: [],
    attributes: [],
    stock: 16,
    totalStock: 16
  },
];


const RelatedProducts = ({title}: {title:string}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // pixels to scroll
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <section className="mt-10 relative px-4">
      <h2 className="text-2xl font-semibold mb-4">
         {title}
      </h2>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 max-sm:hidden sm:left-[-45px] top-1/2 flex items-center justify-center -translate-y-1/2 z-10 bg-white dark:bg-gray-900 w-[40px] h-[40px] rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <ChevronLeft color="gray" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 max-sm:hidden sm:right-[-45px] top-1/2 flex items-center justify-center -translate-y-1/2 z-10 bg-white dark:bg-gray-900 w-[40px] h-[40px] rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <ChevronRight color="gray" />
      </button>

      {/* Scrollable Products */}
      

      <div  ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
        {relatedProducts.map((product,index) => (
        //   <div
        //     key={index}
        //     className="min-w-[180px] bg-white dark:bg-gray-900 rounded-md shadow-sm hover:shadow-md transition p-2 flex-shrink-0"
        //   >
        //     <img
        //       src={product.image}
        //       alt={product.title}
        //       className="w-full h-40 object-contain mb-2"
        //     />
        //     <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
        //     <p className="text-gray-900 font-bold mt-1">${product.price.toFixed(2)}</p>
        //   </div>
        <MainCard userId="" key={index} product={product as IProduct}  />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
