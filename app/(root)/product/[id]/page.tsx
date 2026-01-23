import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Award,
  CheckCircle,
  AlertCircle,
  TrainTrack,
  TrainTrackIcon,
} from 'lucide-react';
import ProductImage from '@/components/shared/ProductImage';
import Variant from '@/components/shared/Variant';
import { IProduct } from '@/models/product.model';
import { getSignleProduct } from '@/actions/product.actions';
import BuyPanel from '@/components/shared/BuyPanel';
import { getSavedListsAction } from '@/actions/savedList.actions';
import Rating from '@/components/shared/Rating';
import ProductSpecs from './_components/ProductSpec';
import RelatedProducts from './_components/RelatedProducts';
import ProductReviews from './_components/ProductReviews';
import ProductDescription from './_components/ProductDescription';
import ProductVideos from './_components/ProductVideos';
import MobileAccordionSection from './_components/MobileAccordion';
import AmazonPrice from '@/components/shared/AmazonPrice';
import { LocationIcon } from '@/components/shared/icons';
import { trackProductView } from '@/actions/recommendations.actions';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { gaEvent } from '@/lib/analytics/ga';
  export async function generateMetadata({ params }: { params:  Promise<{id: string}>  }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await getSignleProduct({ productId: id });
   
  return {
    title: data?.product.name || '',
    description: data?.product.description || '',
  };
}
const ProductDetails = async ({params}: {params: Promise<{id:string}>}) => {
 
  const productId = (await params).id
  const session = await auth()
  const result = await getSignleProduct({ productId });
 const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": result?.data?.product.name,
    "image": result.data?.product.thumbnail.url,
    "description": result.data?.product.description,
    "brand": {
      "@type": "Brand",
      "name": result.data?.product.brand
    },
    "offers": {
      "@type": "Offer",
      "price": result.data?.product.basePrice,
      "priceCurrency": "USD",
      "availability": result.data?.product.stock! > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://omgil.com/product/${result?.data?.product._id}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": result.data?.product.rating || 4.5,
      "reviewCount": result.data?.product.reviewCount || 12
    }
  };

  const {data} = await getSavedListsAction({page: 1,limit: 10, includeArchived:true})
   await trackProductView({userId:session?.user.id!,productId: productId,productTags: result.data?.product.tags!})
 
  // If the API shape differs, ensure a safe product object
  const product: IProduct | null = result?.data?.product ?? null;
 const productVideos = [
  {
    url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://picsum.photos/seed/video1/300/300",
  },
  {
    url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4",
    thumbnail: "https://picsum.photos/seed/video2/300/300",
  },
  {
    url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4",
    thumbnail: "https://picsum.photos/seed/video3/300/300",
  },
];


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
  gaEvent("view_item", {
  currency: "MAD",
  value: product.basePrice,
  items: [{
    item_id: product._id,
    item_name: product.name,
     image: product.thumbnail.url,
    item_brand: product.brand,
    price: product.basePrice,
  }],
});

  // Fallbacks for a few commonly-missing fields
  const safeThumbnail = product.thumbnail ?? { url: '', preview: '', public_id: '' };
  const safeImages = Array.isArray(product.images) && product.images.length ? product.images : (safeThumbnail.url ? [safeThumbnail] : []);
  const safeVariants = Array.isArray(product.variants) && product.variants.length ? product.variants : [];

  // totalStock fallback if you used virtuals on the model, otherwise compute
  const totalStock = product.totalStock ?? (safeVariants.length ? safeVariants.reduce((s, v) => s + (v.stock ?? 0), 0) : product.stock ?? 0);

  return (
    <div>
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
       <div className=" w-full overflow-x-hidden bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white max-sm:hidden border-b">
        <div className="max-w-7xl  mx-auto px-4 py-3">
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
      <div className='max-w-7xl sm:hidden mx-auto pt-3 px-4'>
          <div className="flex flex-col">
              <div className='flex items-center justify-between'>
                   <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
        Brand: {product.brand}
      </span>
       <Rating reviews={4226} rating={4.4} isProductDetails />
              </div>
               <p className="text-sm mt-1.5 leading-snug font-normal text-gray-900">
      {product.name}
    </p>
          </div>
      </div>
      <div >
        <div className="grid w-full sm:max-w-7xl mx-auto sm:px-4 py-6 grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images */}
         
            <ProductImage product={{ ...product, images: safeImages, thumbnail: safeThumbnail } as IProduct} />
          <div className='bg-white h-2.5 w-full sm:hidden  ' />

        
           <div className="lg:col-span-4">
  <div className="space-y-2.5">
    {/* Brand + Badge */}
    <div className="sm:flex hidden items-center gap-3">
      <span className="text-sm  font-medium text-blue-600 hover:underline cursor-pointer">
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
    <h1 className="text-2xl max-sm:hidden leading-snug font-normal text-gray-900">
      {product.name}
    </h1>

   <div className='max-sm:hidden'>
 <Rating reviews={4226} rating={4.4} isProductDetails />
   </div>
   
    <p className='font-bold text-black max-sm:hidden text-xs'>100+ bought {" "} <span className="font-normal text-gray-600"> in past month</span> </p>
     <div className="sm:flex hidden items-center gap-2 text-sm">
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
    <div className='w-full sm:hidden'>
  <div className=' flex flex-col space-y-2.5 px-4'>
       <div className="flex items-center gap-2">
           <p className='text-red-600 font-bold text-xl'>-35%</p>
           <AmazonPrice className='text-black font-bold text-2xl' price={product.basePrice} />
       </div>
       <p className="text-[15px] font-medium text-gray-900">List Price: <AmazonPrice className='text-gray-700 line-through font-bold text-lg' price={product.basePrice + 50} /></p>
       <p className='text-gray-600 flex items-center gap-1 font-medium text-base  '><span>🚚</span> Free shipping for people in Meknes</p>
        <div className="flex   gap-2 items-start">
                       <LocationIcon />
                         <p className="text-sm text-blue-600 font-medium"> Deliver to HMAMOU - Meknes <br /> 50000‌</p>
                     </div>
                     <p className='font-bold text-black  text-sm'>100+ bought {" "} <span className="font-normal text-gray-600"> in past month</span> </p>
                      <div className="flex   items-center gap-2 text-sm">
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
    </div>
    <div className='w-full bg-white h-2.5 mt-2.5' />
    </div>
  
<section className="mt-8 px-4">
  <h2 className="text-2xl font-semibold mb-4">About this item</h2>

  <div className="prose prose-sm sm:prose  max-w-none">
    <ProductDescription description={product.description} />
  </div>
</section>

    {/* Availability */}
   
  </div>
</div>

<BuyPanel userId={session?.user.id as string} product={product} data={data?.lists || []} />
      
        </div>

       <div className="sm:max-w-7xl max-w-7xl  px-4 w-full mx-auto sm:px-4 py-16 space-y-16">
  <RelatedProducts title='You Might also like' />
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 ">
    <MobileAccordionSection title="Product specifications">
      <ProductSpecs  name="Product specifications" />
     </MobileAccordionSection>
     <MobileAccordionSection title="Features & Specs">
      <ProductSpecs  name="Features & Specs" />
     </MobileAccordionSection>
     <MobileAccordionSection title="item Details">
       <ProductSpecs   name="item Details" />
     </MobileAccordionSection>
     

  </div>
<RelatedProducts title='Products related to this item' />
 <ProductVideos  videos={productVideos} />
 
  {/* Reviews */}
  <section>
   
<ProductReviews product={product} productId={productId} />
  </section>
</div>
      </div>
    </div>
    </div>
   
  );
};
export default ProductDetails;



