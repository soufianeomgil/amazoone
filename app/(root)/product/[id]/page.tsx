
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Star,
  Award,
  Truck,
  RotateCcw,
  Shield,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

import ProductImage from '@/components/shared/ProductImage';
import Variant from '@/components/shared/Variant';
import CartAction from '@/components/shared/CartAction';
import { IProduct } from '@/models/product.model';
import { getSignleProduct } from '@/actions/product.actions';
import ParseHtml from '@/components/editor/ParseHtml';
import { IUser } from '@/types/actionTypes';
import { getCurrentUser } from '@/actions/user.actions';
import BuyPanel from '@/components/shared/BuyPanel';
import FixedQTY from '@/components/shared/FixedQTY';
import { getSavedListsAction } from '@/actions/savedList.actions';
import Rating from '@/components/shared/Rating';
import { WriteReviewModal } from '@/components/shared/modals/ReviewModel';
import ProductSpecs from './_components/ProductSpec';
import RelatedProducts from './_components/RelatedProducts';
import ProductReviews from './_components/ProductReviews';






const ProductDetails = async ({params}: {params: Promise<{id:string}>}) => {
 

  const productId = (await params).id
  const result = await getSignleProduct({ productId });
  const {data} = await getSavedListsAction({page: 1,limit: 10, includeArchived:true})
   
  // If the API shape differs, ensure a safe product object
  const product: IProduct | null = result?.data?.product ?? null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <p className="text-gray-600 mt-2">We couldn't find the product you requested.</p>
        </div>
      </div>
    );
  }

  // Fallbacks for a few commonly-missing fields
  const safeThumbnail = product.thumbnail ?? { url: '', preview: '', public_id: '' };
  const safeImages = Array.isArray(product.images) && product.images.length ? product.images : (safeThumbnail.url ? [safeThumbnail] : []);
  const safeVariants = Array.isArray(product.variants) && product.variants.length ? product.variants : [];

  // totalStock fallback if you used virtuals on the model, otherwise compute
  const totalStock = product.totalStock ?? (safeVariants.length ? safeVariants.reduce((s, v) => s + (v.stock ?? 0), 0) : product.stock ?? 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
  {product.tags.map((tag, index) => (
    <span key={index} className="flex items-center">
      <span className="hover:text-orange-600 cursor-pointer transition-colors">
        {tag}
      </span>
      {index !== product.tags.length - 1 && (
        <span className="mx-1 text-gray-300">›</span>
      )}
    </span>
  ))}
</div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images */}
         
            <ProductImage product={{ ...product, images: safeImages, thumbnail: safeThumbnail } as IProduct} />
         

        
           <div className="lg:col-span-4">
  <div className="space-y-2.5">
    {/* Brand + Badge */}
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
        Brand: {product.brand}
      </span>
      {product.isFeatured && (
        <Badge className="bg-orange-100 text-orange-700 text-xs">
          <Award className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      )}
    </div>

    {/* Title */}
    <h1 className="text-2xl leading-snug font-normal text-gray-900">
      {product.name}
    </h1>

   
    <Rating reviews={4226} rating={4.4} />
    <p className='font-bold text-black text-xs'>100+ bought {" "} <span className="font-normal text-gray-600"> in past month</span> </p>
     <div className="flex items-center gap-2 text-sm">
      {totalStock > 10 ? (
        <>
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700 font-medium">In stock</span>
        </>
      ) : totalStock > 0 ? (
        <>
          <AlertCircle className="w-5 h-5 text-orange-500" />
          <span className="text-orange-700 font-medium">
            Only {totalStock} left — order soon
          </span>
        </>
      ) : (
        <>
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">Currently unavailable</span>
        </>
      )}
    </div>
    <Separator />

    {/* Variant + Price */}
    <Variant product={product} />
<section className="mt-8">
  <h2 className="text-2xl font-semibold mb-4">About this item</h2>

  <div className="prose prose-sm sm:prose  max-w-none">
    <ParseHtml data={product.description} />
  </div>
</section>
    {/* Availability */}
   
  </div>
</div>

<BuyPanel product={product} data={data?.lists || []} />
      
        </div>

       <div className="sm:max-w-7xl w-full mx-auto sm:px-4 py-16 space-y-16">
  
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 ">
<ProductSpecs name="Product specifications" />
<ProductSpecs name="Features & Specs" />
<ProductSpecs name="item Details" />
  </div>
<RelatedProducts />
  {/* Reviews */}
  <section>
    

    {/* Rating Summary */}
  

    
    {/* REVIEW SUMMARY */}
<ProductReviews product={product} productId={productId} />

  </section>
</div>

       

      </div>
    </div>
  );
};

export default ProductDetails;
// app/(site)/product/[id]/page.tsx  (or wherever you keep it)


