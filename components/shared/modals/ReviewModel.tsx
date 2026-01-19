"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"

import { Star, Upload, X, CheckCircle } from "lucide-react"

import createProductReviewAction from "@/actions/reviews.actions"
import { toast } from "sonner"

import { CreateReviewSchema } from "@/lib/zod"
import z from "zod"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { IProduct } from "@/models/product.model"


const ratingLabels = ["Poor", "Fair", "Good", "Very good", "Excellent"]

export function WriteReviewModal({open,setOpen,id,product}: {
  open: boolean;
  setOpen: (v:boolean) => void;
  id:string;
  product: IProduct
}) {
  const [hover, setHover] = useState(0)
 const selectedVariantIndex = useSelector(
        (state: RootState) => state.product.selectedVariant[id]
      );
      const selectedVariant = product?.variants?.[selectedVariantIndex ?? 0] || null;
  const form = useForm({
    resolver: zodResolver(CreateReviewSchema),
    defaultValues: {
      rating: 0,
      productId: id,
      headline: "",
      comment: "",
      variantSnapshot: {},
      images: [],
      isRecommendedByBuyer: false,
    },
  })
useEffect(() => {
  if (open) document.body.style.overflow = "hidden"
  else document.body.style.overflow = ""
  return () => { document.body.style.overflow = "" }
}, [open])

 
   
  async function onSubmit(values: z.infer<typeof CreateReviewSchema>) {
    console.log(values.images,"images babay")
    try {
      const { error, success } = await createProductReviewAction({
         headline: values.headline,
         productId : id,
         rating: values.rating,
         comment: values.comment,
         isRecommendedByBuyer: values.isRecommendedByBuyer,
         variantSnapshot: {
           variantId:selectedVariant._id,
           attributes: selectedVariant.attributes
         },
         images: values.images
      })
      if(error) {
        toast.error(error.message)
        return
      }else if(success) {
        toast.success("success")
        form.reset()
        setOpen(false)
      }
    } catch (error) {
       console.log(error)
    }
  }
  const isPending = form.formState.isSubmitting;
 console.log(form.watch("images"), "images here from reviewmodel")
  return (
    open && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setOpen(false)}
    />

    {/* MODAL */}
    <div className="relative z-10 sm:max-w-2xl w-[95%] max-h-[95vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
      {/* HEADER */}
      <div className="  bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Write a review
          </h2>
          <p className="text-xs text-gray-500">
            Your feedback helps other customers
          </p>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* CONTENT */}
      
       <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="contents">

            {/* BODY */}
           <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

              {/* VERIFIED */}
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Verified purchase
              </div>

              {/* RATING */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Overall rating
                    </h3>

                    <FormControl>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => field.onChange(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-9 h-9 ${
                                star <= (hover || field.value)
                                  ? "text-orange-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                            />
                          </button>
                        ))}

                        {(hover || field.value) > 0 && (
                          <span className="ml-4 text-sm font-medium text-gray-700">
                            {ratingLabels[(hover || field.value) - 1]}
                          </span>
                        )}
                      </div>
                    </FormControl>

                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              {/* TITLE */}
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Review title
                    </h3>

                    <FormControl>
                      <input
                        {...field}
                        placeholder="Summarize your experience"
                        className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-400
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        "
                      />
                    </FormControl>

                    <div className="mt-1 text-xs text-gray-400">
                      Keep it short and descriptive
                    </div>

                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              {/* BODY */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Written review
                    </h3>

                    <FormControl>
                      <textarea
                        {...field}
                        rows={5}
                        placeholder="What did you like or dislike? How did you use this product?"
                        className="
                          w-full rounded-xl border border-gray-300 bg-gray-50
                          px-4 py-3 text-sm text-gray-900
                          placeholder:text-gray-400 resize-none
                          focus:bg-white focus:border-orange-400
                          focus:ring-2 focus:ring-orange-200 outline-none
                        "
                      />
                    </FormControl>

                    <div className="mt-1 text-xs text-gray-400">
                      Share specific details to help other customers
                    </div>

                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />
<FormField
  control={form.control}
  name="images"
  render={({ field }) => (
    <FormItem>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Add photos (optional)
      </h3>

      {/* Upload Button */}
<CldUploadWidget
  uploadPreset="amazone-clone"
  options={{
    maxFiles: 5,
    multiple: true,
  }}
  onSuccess={(result: any) => {
    if (!result?.info) return

    const newImage = {
      url: result.info.secure_url,
      preview: result.info.secure_url,
      public_id: result.info.public_id,
      type: "image" as const,
    }

    const current = form.getValues("images") || []

    form.setValue("images", [...current, newImage], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }}
>
 {(widget) => (
            <button
              type="button"
              onClick={() => {
      if (typeof widget.open === "function") {
        widget.open();
      } else {
        console.warn("Cloudinary widget not ready yet");
      }
    }}
              className="
                flex items-center gap-2 rounded-xl border border-dashed
                border-gray-300 px-4 py-3 text-sm text-gray-600
                hover:border-orange-400 hover:text-orange-500
                transition
              "
            >
              <Upload className="w-4 h-4" />
              Upload photos
            </button>
          )}
</CldUploadWidget>

      {/* Previews */}
      {field.value?.length! > 0 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {field?.value!.map((img, idx) => (
            <div key={idx} className="relative group">
              <Image
                src={img.url}
                alt="Review image"
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />

              {/* Remove */}
              <button
                type="button"
                onClick={() =>
                  field.onChange(
                    field?.value!.filter((_, i) => i !== idx)
                  )
                }
                className="
                  absolute -top-2 -right-2 rounded-full bg-black/70
                  p-1 text-white opacity-0 group-hover:opacity-100
                "
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-400">
        You can upload up to 5 images
      </p>

      <FormMessage />
    </FormItem>
  )}
/>

              {/* RECOMMEND */}
              <FormField
                control={form.control}
                name="isRecommendedByBuyer"
                render={({ field }) => (
                  <FormItem>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Would you recommend this product?
                    </h3>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => field.onChange(true)}
                        className={`px-4 py-2 rounded-full border ${
                          field.value ? "border-orange-400" : ""
                        }`}
                      >
                        👍 Yes
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange(false)}
                        className={`px-4 py-2 rounded-full border ${
                          field.value === false ? "border-orange-400" : ""
                        }`}
                      >
                        👎 No
                      </button>
                    </div>

                    <FormMessage className="text-red-500 font-medium" />
                  </FormItem>
                )}
              />

            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-100 px-6 py-4 mt-auto flex items-center justify-between bg-gray-50">
              <p className="text-xs text-gray-500">
                Reviews are public and follow our guidelines
              </p>

              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                 {isPending ? "Pending..." : "Submit review"} 
              </Button>
            </div>
          </form>
        </Form>
    
    </div>
  </div>


              ))}
