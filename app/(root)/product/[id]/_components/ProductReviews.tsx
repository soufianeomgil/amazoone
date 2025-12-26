"use client"

import { WriteReviewModal } from "@/components/shared/modals/ReviewModel"
import { Button } from "@/components/ui/button"
import { RootState } from "@/lib/store"
import { IProduct } from "@/models/product.model"
import { useState } from "react"
import { useSelector } from "react-redux"

const ProductReviews = ({productId,product}:  {product:IProduct,productId:string}) => {
    const [open,setOpen] = useState(false)
     const selectedVariantIndex = useSelector(
        (state: RootState) => state.product.selectedVariant[productId as string]
      );
      const selectedVariant = product?.variants?.[selectedVariantIndex ?? 0] || null;
     const review = {
  userName: "John D.",
  rating: 4,
  headline: "Great quality for the price",
  isVerifiedPurchase: true,
  comment:
    "The bag looks even better in person. The material feels solid and durable, and the size is perfect for daily use. I've been using it for two weeks now with no issues.",
  helpfulVotes: 23,
  notHelpfulVotes: 2,

  variantSnapshot: {
    attributes: [
      { name: "Color", value: "Black" },
      { name: "Size", value: "Medium" },
    ],
  },

  media: [
    {
      url: "https://m.media-amazon.com/images/I/C1XVDXu-wzS._SY88.jpg",
      preview: "https://m.media-amazon.com/images/I/C1XVDXu-wzS._SY88.jpg",
    },
    {
      url: "https://m.media-amazon.com/images/I/C1XVDXu-wzS._SY88.jpg",
      preview: "https://m.media-amazon.com/images/I/C1XVDXu-wzS._SY88.jpg",
    },
  ],

  sellerReply: {
    message:
      "Thank you for your feedback! We're happy to hear you're enjoying the product. If you need any help, feel free to contact us.",
  },
}
  return (
    <div id="reviews">
    <div  className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
      {/* <div className="flex flex-col-reverse  justify-between w-full">
         
        <div className="flex flex-col gap-2 w-full justify-end!">
           <h3 className="font-semibold text-base sm:text-lg  text-gray-700 ">Review this product</h3>
           <p className="text-sm text-gray-600">Share your thoughts with other customers</p>
           <Button className="border bg-transparent hover:bg-gray-100 cursor-pointer border-gray-200 rounded-full text-gray-700 text-sm">
              Write a customer review
           </Button>
        </div>
         <div>
 <h2 className="text-xl font-semibold text-gray-900 mb-4">
    Customer reviews
  </h2>

  <div className="flex items-center gap-4">
    <div className="text-4xl font-bold text-gray-900">
      {4.2.toFixed(1)}
    </div>

    <div>
      <div className="flex items-center">
        {[1,2,3,4,5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= Math.round(4.2)
                ? "text-orange-400"
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.975c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.975a1 1 0 00-.364-1.118L2.04 9.402c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.975z" />
          </svg>
        ))}
      </div>

      <p className="text-sm text-gray-600 mt-1">
        {3591} global ratings
      </p>
    </div>
  </div>
          </div>
      </div> */}
      <div className="flex max-sm:flex-col justify-between items-start sm:items-center w-full h-full">
  
  {/* TOP: Customer reviews summary */}
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Customer reviews
    </h2>

    <div className="flex items-center gap-4">
      <div className="text-4xl font-bold text-gray-900">
        {4.2.toFixed(1)}
      </div>

      <div>
        <div className="flex items-center">
          {[1,2,3,4,5].map((star) => (
            <svg
              key={star}
              className={`w-5 h-5 ${
                star <= Math.round(4.2)
                  ? "text-orange-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.975c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.975a1 1 0 00-.364-1.118L2.04 9.402c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.975z" />
            </svg>
          ))}
        </div>

        <p className="text-sm text-gray-600 mt-1">
          {3591} global ratings
        </p>
      </div>
    </div>
  </div>

  {/* BOTTOM: Write review CTA */}
  <div className="max-sm:justify-end flex max-sm:w-full ">
 <div className="mt-auto flex flex-col max-sm:pt-6">
    <h3 className="font-semibold  text-base sm:text-lg text-gray-700">
      Review this product
    </h3>
    <p className="text-sm  text-gray-600 mb-3">
      Share your thoughts <br className="sm:hidden block" /> with other customers
    </p>
    <Button type="button" onClick={()=> setOpen(true)} className="border bg-transparent   hover:bg-gray-100 cursor-pointer border-gray-200 rounded-full text-gray-700 text-xs sm:text-sm">
      Write a customer review
    </Button>
  </div>
  </div>
 

</div>

 
  {/* SINGLE REVIEW */}
<div className="border-b border-gray-200 py-6">
  {/* USER */}
  <div className="flex items-center gap-3 mb-2">
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
      <img className='rounded-full' src="https://m.media-amazon.com/images/S/amazon-avatars-global/406c44e8-f7d5-4f9a-9128-e32463dd7bdf._CR0%2C0%2C429%2C429_UX460_.jpg" alt="" />
    </div>

    <span className="text-sm font-semibold text-gray-800">
      Sanae popya
    </span>
  </div>

  {/* RATING + TITLE */}
  <div className="flex items-center gap-2 mb-1">
    <div className="flex">
      {[1,2,3,4,5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= 4.2
              ? "text-orange-400"
              : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.975c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.975a1 1 0 00-.364-1.118L2.04 9.402c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.975z" />
        </svg>
      ))}
    </div>

    <h3 className="font-semibold text-sm text-gray-900">
      {review.headline}
    </h3>
  </div>

  {/* VERIFIED */}
  {true && (
    <p className="text-xs text-orange-600 font-semibold mb-2">
      Verified Purchase
    </p>
  )}

  {/* VARIANT */}
  {review.variantSnapshot?.attributes?.length > 0 && (
    <p className="text-xs text-gray-500 mb-2">
      Reviewed variant:
      {review.variantSnapshot.attributes.map((attr, i) => (
        <span key={i} className="ml-1">
          {attr.name}: {attr.value}
        </span>
      ))}
    </p>
  )}
{review.media?.length > 0 && (
    <div className="flex gap-2 mb-3">
      {review.media.map((m, i) => (
        <img
          key={i}
          src={m.preview || m.url}
          alt="Review media"
          className=" object-contain rounded border"
        />
      ))}
    </div>
  )}
  {/* COMMENT */}
  <p className="text-sm text-gray-700 leading-relaxed mb-3">
    {review.comment}
  </p>

  {/* MEDIA */}
  

  {/* ACTIONS */}
  <div className="flex items-center gap-4 text-sm text-gray-600">
    <span>Helpful?</span>

    <button className="border px-3 py-1 rounded hover:bg-gray-100">
      Yes ({review.helpfulVotes})
    </button>

    <button className="border px-3 py-1 rounded hover:bg-gray-100">
      No ({review.notHelpfulVotes})
    </button>

    <button className="ml-auto text-gray-400 hover:text-gray-600">
      Report
    </button>
  </div>

  {/* SELLER REPLY */}
  {review.sellerReply?.message && (
    <div className="mt-4 bg-gray-50 border-l-4 border-orange-400 p-4 rounded">
      <p className="text-sm font-semibold text-gray-800 mb-1">
        Seller Response
      </p>
      <p className="text-sm text-gray-700">
        {review.sellerReply.message}
      </p>
    </div>
  )}
</div>

</div>
        <WriteReviewModal product={product}  id={productId} open={open} setOpen={setOpen} />
    </div>
  )
}

export default ProductReviews