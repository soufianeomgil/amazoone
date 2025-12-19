"use client";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
 

  InstapaperIcon,
 
  LinkedinIcon,

 
  PinterestIcon,

 
  TelegramIcon,
  ThreadsIcon,

  WeiboIcon,
  WhatsappIcon,

  XIcon,
 
} from "react-share";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Heart, Share } from "lucide-react";
import { RootState } from "@/lib/store";
import { IProduct } from "@/models/product.model";
import ShareTrigger from "@/app/(root)/product/[id]/_components/ShareTrigger";

const ProductImage = ({ product }: { product: IProduct }) => {
    const shareUrl = "https://yourstore.com/product/123";
  const title = "Check out this product on Our Store";
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
    <div className="lg:col-span-5 px-2.5">
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
       <div className="flex items-center mt-3 px-4 justify-between">
      <div style={{visibility: "hidden"}}>
         Placeholder
      </div>
 {gallery.length > 1 && (
          <div className="flex justify-center gap-2  lg:hidden">
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
        <div className="flex sm:hidden items-center gap-2 5">
        <div className="flex    rounded-full bg-gray-100 w-[45px] h-[45px] items-center justify-center  ">
           <Heart color="black" />
        </div>
        {/* <div className="flex    rounded-full bg-gray-100 w-[45px] h-[45px] items-center justify-center  ">
           <Share color="black" />
        </div> */}
        <ShareTrigger title={title} url={shareUrl} />
        </div>
        
       </div>
       
       
        
      </div>
    </div>
  );
};

export default ProductImage;
