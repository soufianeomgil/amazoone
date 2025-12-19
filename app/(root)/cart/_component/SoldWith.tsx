"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { relatedProducts } from "../../product/[id]/_components/RelatedProducts";
import Rating from "@/components/shared/Rating";

const SoldWith = ({title}: {title:string}) => {
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
    <section className="mt-10 bg-white py-3 relative px-4">
      <h2 className="text-xl font-bold text-black mb-5">
         {title}
      </h2>
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 max-sm:hidden sm:left-[-30px] top-1/2 flex items-center justify-center -translate-y-1/2 z-10 bg-white dark:bg-gray-900 w-[40px] h-[40px]
         rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <ChevronLeft color="gray" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 max-sm:hidden sm:right-[-30px] top-1/2 flex items-center justify-center -translate-y-1/2
         z-10 bg-white dark:bg-gray-900 w-[40px] h-[40px] rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <ChevronRight color="gray" />
      </button>

      {/* Scrollable Products */}
      

      <div  ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
        {relatedProducts.map((product,index) => (
           <div className="flex flex-col" key={index}>
                <div>
                     <img src={product.thumbnail.url} alt={product.name} />
                </div>
                <div className="flex flex-col space-y-0.5 text-left">
<p className="text-blue-800 font-medium text-sm line-clamp-2 ">DREAM PAIRS Women's Square Open Toe Block Heels Two Strap Slip On High Heeled Slides Sandals</p>
                <Rating rating={4.5} />
                <p className="text-red-600 font-medium text-sm">$42.99</p>
                <button className="rounded-full cursor-pointer  w-fit px-2.5 py-1 bg-[#FF9900] text-black text-xs  ">
                     Add to cart
                </button>
                </div>
                
           </div>
        ))}
      </div>
    </section>
  );
};

export default SoldWith;