// "use client";
// import { RootState } from "@/lib/store";
// import { IProduct } from "@/models/product.model";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useState, useEffect, useMemo } from "react";
// import { useSelector } from "react-redux";

// const ProductImage = ({ product }: { product: IProduct }) => {
//   // get selected variant index from redux (default 0)
//   const selectedIndex = useSelector(
//     (state: RootState) => state.product.selectedVariant[product._id ?? product._id?? product.name] ?? 0
//   );

//   // compute gallery: prefer selected variant images -> product.images -> thumbnail
//   const gallery = useMemo(() => {
//     const variants = Array.isArray(product.variants) ? product.variants : [];
//     const selectedVariant = variants[selectedIndex];
//     // normalize images to objects with url/preview
//     const normalize = (img: any) =>
//       typeof img === "string" ? { url: img } : { url: img?.url ?? img?.preview ?? "" };

//     if (selectedVariant && Array.isArray(selectedVariant.images) && selectedVariant.images.length) {
//       return selectedVariant.images.map(normalize).filter((i) => i.url);
//     }

//     if (Array.isArray(product.images) && product.images.length) {
//       return product.images.map(normalize).filter((i) => i.url);
//     }

//     if (product.thumbnail?.url) return [{ url: product.thumbnail.url }];

//     return [];
//   }, [product, selectedIndex]);

//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);

//   // reset index whenever gallery or selected variant changes
//   useEffect(() => {
//     setSelectedImageIndex(0);
//   }, [gallery.length, selectedIndex]);

//   const nextImage = () => {
//     if (gallery.length === 0) return;
//     setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
//   };

//   const prevImage = () => {
//     if (gallery.length === 0) return;
//     setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
//   };

//   const mainSrc = gallery[selectedImageIndex]?.url ?? "";

//   return (
//     <div className="lg:col-span-5">
//       <div className="sticky self-start top-6">
//         <div className="relative bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
//           {mainSrc ? (
//             <img src={mainSrc} alt={product.name} className="w-full h-96 object-contain" />
//           ) : (
//             <div className="w-full h-96 flex items-center justify-center text-gray-400">No image</div>
//           )}

//           {gallery.length > 1 && (
//             <>
//               <button
//                 onClick={prevImage}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
//                 aria-label="Previous image"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={nextImage}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
//                 aria-label="Next image"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </>
//           )}

//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
//             {gallery.map((_, index) => (
//               <div
//                 key={index}
//                 className={`w-2 h-2 rounded-full transition-all ${index === selectedImageIndex ? "bg-orange-500" : "bg-white/60"}`}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="hidden lg:grid grid-cols-4 gap-2">

//           {gallery.map((image, index) => (
//             <button
//               key={index}
//               onClick={() => setSelectedImageIndex(index)}
//               className={`relative bg-white rounded-lg border-2 overflow-hidden transition-all ${index === selectedImageIndex ? "border-orange-500" : "border-gray-200 hover:border-gray-300"}`}
//               aria-label={`Show image ${index + 1}`}
//             >
//               <img src={image.url} alt={`Product ${index + 1}`} className="w-full h-20 object-contain" />
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductImage;

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RootState } from "@/lib/store";
import { IProduct } from "@/models/product.model";

const ProductImage = ({ product }: { product: IProduct }) => {
  const selectedIndex = useSelector(
    (state: RootState) =>
      state.product.selectedVariant?.[product._id ?? product.name] ?? 0
  );

  const gallery = useMemo(() => {
    const normalize = (img: any) =>
      typeof img === "string"
        ? { url: img }
        : { url: img?.url ?? img?.preview ?? "" };

    const variantImages =
      product.variants?.[selectedIndex]?.images?.map(normalize) ?? [];

    if (variantImages.length) return variantImages;
    if (product.images?.length) return product.images.map(normalize);
    if (product.thumbnail?.url) return [{ url: product.thumbnail.url }];

    return [];
  }, [product, selectedIndex]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [gallery.length, selectedIndex]);

  const next = () => setActive((i) => (i + 1) % gallery.length);
  const prev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length);

  return (
    <div className="lg:col-span-5">
      {/* 🔒 Sticky container */}
      <div className="sticky top-6 self-start">
        <div className="flex gap-4">
          {/* 🟦 Thumbnails (desktop like Amazon) */}
          <div className="hidden lg:flex flex-col gap-2">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-16 h-16 border rounded-md bg-white flex items-center justify-center
                  ${i === active ? "border-orange-500" : "border-gray-200 hover:border-gray-400"}`}
              >
                <img
                  src={img.url}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* 🟧 Main image */}
          <div className="relative flex-1 border border-gray-200 rounded-md bg-white">
            {gallery[active]?.url ? (
              <img
                src={gallery[active].url}
                alt={product.name}
                className="w-full h-[420px] object-contain"
              />
            ) : (
              <div className="h-[420px] flex items-center justify-center text-gray-400">
                No image
              </div>
            )}

            {/* ◀ ▶ Mobile arrows */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="lg:hidden absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="lg:hidden absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 🔵 Mobile dots */}
        {gallery.length > 1 && (
          <div className="flex justify-center gap-2 mt-3 lg:hidden">
            {gallery.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i === active ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImage;
