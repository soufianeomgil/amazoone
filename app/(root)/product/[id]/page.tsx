
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




const renderStars = (rating: number = 0, size: 'sm' | 'md' = 'md') => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} fill-yellow-400 text-yellow-400`} />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-300`} />
          <Star className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} fill-yellow-400 text-yellow-400 absolute top-0 left-0`} style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    } else {
      stars.push(<Star key={i} className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-300`} />);
    }
  }
  return stars;
};

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
          <div className="flex items-center flex-wrap space-x-2 text-sm text-gray-600">
            {product.tags.map((tag,index)=> (
 <span key={index} className="hover:text-orange-600 cursor-pointer">{tag} ›</span>
            ) )}
           
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-5">
            <ProductImage product={{ ...product, images: safeImages, thumbnail: safeThumbnail } as IProduct} />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Brand & Title */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                    {product.brand}
                  </span>
                  {product.isFeatured && (
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-normal text-gray-900 leading-tight">{product.name}</h1>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating ?? 0)}
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer ml-2">
                    {(product.rating ?? 0).toFixed(1)} out of 5
                  </span>
                </div>
                <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  {(product.reviewCount ?? 0).toLocaleString()} global ratings
                </span>
              </div>

              {/* Price & Variant selector */}
              <Variant product={product} />

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {totalStock > 10 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">In Stock</span>
                  </>
                ) : totalStock > 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-700 font-medium">Only {totalStock} left in stock - order soon</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700 font-medium">Currently unavailable</span>
                  </>
                )}
              </div>
            </div>
           </div>
<BuyPanel product={product} data={data?.lists || []} />
      
        </div>

       
         <div className="sm:max-w-7xl w-full mx-auto sm:px-4 py-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full sm:grid-cols-4 grid-cols-2 h-auto rounded-2xl bg-muted p-2">
              <TabsTrigger value="description" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              Description
            </TabsTrigger>
            <TabsTrigger value="features" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              Features
            </TabsTrigger>
            <TabsTrigger value="specs" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-xl py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              Reviews ({product.reviewCount})
            </TabsTrigger>
          </TabsList>
  
          <TabsContent value="description" className="mt-8">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Product description:</h3>
               <ParseHtml data={product.description} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features" className="mt-8">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Premium Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.attributes.slice(0, 6).map((attr, i) => (
                    <div key={i} className="flex items-start gap-4 group hover:translate-x-2 transition-transform">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50">
                        <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{attr.name}</h4>
                        <p className="text-muted-foreground">{attr.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-8">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
                <div className="space-y-4">
                  {product.attributes.map((attr, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-4
                       border-b border-border last:border-0 hover:bg-muted/50 sm:px-4 rounded-lg transition-colors"
                    >
                      <span className="font-semibold max-sm:text-xs ">{attr.name}</span>
                      <span className="text-muted-foreground max-sm:text-xs">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-6">
              {/* Rating Summary */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-6xl font-bold gradient-text mb-2">
                        {product.rating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {renderStars(product.rating)}
                      </div>
                      <p className="text-muted-foreground">Based on {product.reviewCount.toLocaleString()} reviews</p>
                    </div>

                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const percentage = stars === 5 ? 65 : stars === 4 ? 20 : stars === 3 ? 10 : stars === 2 ? 3 : 2;
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8">{stars}★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              {[0,1,2,3,4,5].map((_,index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                            SH
                          </div>
                          <div>
                            <p className="font-semibold">Soufiane hMM</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">{renderStars(4.5)}</div>
                      </div>
                      {true && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <h4 className="font-bold mb-2">Soufiane anouar</h4>
                    <p className="text-muted-foreground mb-4">lovely product . don't cost too much but it's very helpfull</p>

                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      Helpful (233)
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  );
};

export default ProductDetails;
// app/(site)/product/[id]/page.tsx  (or wherever you keep it)


