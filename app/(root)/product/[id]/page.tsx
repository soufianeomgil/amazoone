"use client"

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Truck, 
  Shield, 
  RotateCcw, 
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

// Mock product data based on the form structure
const mockProduct = {
  id: "prod-001",
  name: "Apple MacBook Pro 16-inch M3 Max",
  description: "The most powerful MacBook Pro ever is here. With the blazing-fast M3 Max chip — the most advanced chip ever built for a personal computer — MacBook Pro delivers exceptional performance whether you're compiling millions of lines of code, processing massive datasets, or rendering intricate 3D content.",
  brand: "Apple",
  category: "Laptops & Computers",
  basePrice: 3499,
  imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&h=600&fit=crop"
  ],
  stock: 15,
  tags: ["laptop", "apple", "macbook", "professional", "m3"],
  isFeatured: true,
  status: "ACTIVE",
  variants: [
    {
      sku: "MBP-16-M3-512",
      priceModifier: 0,
      stock: 8,
      attributes: [
        { name: "Storage", value: "512GB SSD" },
        { name: "Memory", value: "18GB Unified Memory" },
        { name: "Color", value: "Space Black" }
      ]
    },
    {
      sku: "MBP-16-M3-1TB",
      priceModifier: 400,
      stock: 5,
      attributes: [
        { name: "Storage", value: "1TB SSD" },
        { name: "Memory", value: "36GB Unified Memory" },
        { name: "Color", value: "Silver" }
      ]
    },
    {
      sku: "MBP-16-M3-2TB",
      priceModifier: 800,
      stock: 2,
      attributes: [
        { name: "Storage", value: "2TB SSD" },
        { name: "Memory", value: "64GB Unified Memory" },
        { name: "Color", value: "Space Black" }
      ]
    }
  ],
  attributes: [
    { key: "Processor", value: "Apple M3 Max chip" },
    { key: "Display", value: "16.2-inch Liquid Retina XDR display" },
    { key: "Graphics", value: "Up to 40-core GPU" },
    { key: "Battery Life", value: "Up to 22 hours" },
    { key: "Weight", value: "4.7 pounds (2.13 kg)" },
    { key: "Connectivity", value: "Wi-Fi 6E, Bluetooth 5.3" },
    { key: "Ports", value: "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3" }
  ],
  rating: 4.6,
  reviewCount: 2847,
  reviews: [
    {
      id: 1,
      author: "John D.",
      rating: 5,
      date: "2024-01-15",
      title: "Incredible performance for video editing",
      content: "This MacBook Pro has completely transformed my workflow. The M3 Max chip handles 4K video editing like a breeze, and the battery life is phenomenal.",
      helpful: 45,
      verified: true
    },
    {
      id: 2,
      author: "Sarah M.",
      rating: 4,
      date: "2024-01-10",
      title: "Great laptop but expensive",
      content: "Amazing build quality and performance, but the price point is quite high. Worth it if you need the power for professional work.",
      helpful: 23,
      verified: true
    },
    {
      id: 3,
      author: "Mike R.",
      rating: 5,
      date: "2024-01-08",
      title: "Perfect for developers",
      content: "Compiling large codebases is incredibly fast. The display is gorgeous and the keyboard feels great for long coding sessions.",
      helpful: 38,
      verified: false
    }
  ]
};

const ProductDetails: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentVariant = mockProduct.variants[selectedVariant];
  const finalPrice = mockProduct.basePrice + currentVariant.priceModifier;
  const savings = currentVariant.priceModifier > 0 ? Math.round(currentVariant.priceModifier * 0.1) : 0;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % mockProduct.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + mockProduct.images.length) % mockProduct.images.length);
  };

  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} fill-yellow-400 text-yellow-400`} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} text-gray-300`} />
            <Star className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} fill-yellow-400 text-yellow-400 absolute top-0 left-0`} style={{clipPath: 'inset(0 50% 0 0)'}} />
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} text-gray-300`} />
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center flex-wrap space-x-2 text-sm text-gray-600">
            <span className="hover:text-orange-600 cursor-pointer">Electronics</span>
            <span>›</span>
            <span className="hover:text-orange-600 whitespace-nowrap cursor-pointer">Computers & Accessories</span>
            <span>›</span>
            <span className="hover:text-orange-600 cursor-pointer">Laptops</span>
            <span>›</span>
            <span className="text-gray-900">{mockProduct.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-5">
            <div className="sticky top-6">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
                <img
                  src={mockProduct.images[selectedImageIndex]}
                  alt={mockProduct.name}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {mockProduct.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedImageIndex ? 'bg-orange-500' : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {mockProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative bg-white rounded-lg border-2 overflow-hidden transition-all ${
                      index === selectedImageIndex ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Brand & Title */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                    {mockProduct.brand}
                  </span>
                  {mockProduct.isFeatured && (
                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl font-normal text-gray-900 leading-tight">
                  {mockProduct.name}
                </h1>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(mockProduct.rating)}
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer ml-2">
                    {mockProduct.rating} out of 5
                  </span>
                </div>
                <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                  {mockProduct.reviewCount.toLocaleString()} global ratings
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-3xl font-normal text-red-600">
                    ${finalPrice.toLocaleString()}
                  </span>
                  {savings > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ${(finalPrice + savings).toLocaleString()}
                    </span>
                  )}
                </div>
                {savings > 0 && (
                  <div className="text-sm text-green-700">
                    You save: ${savings} ({Math.round((savings / (finalPrice + savings)) * 100)}%)
                  </div>
                )}
                <div className="text-xs text-gray-600">
                  & FREE Returns
                </div>
              </div>

              {/* Variant Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Configuration:
                  </label>
                  <div className="space-y-2">
                    {mockProduct.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`w-full p-3 text-left border rounded-lg transition-all ${
                          selectedVariant === index
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">
                              {variant.attributes.find(attr => attr.name === 'Storage')?.value} / {' '}
                              {variant.attributes.find(attr => attr.name === 'Memory')?.value}
                            </div>
                            <div className="text-xs text-gray-600">
                              {variant.attributes.find(attr => attr.name === 'Color')?.value}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">
                              ${(mockProduct.basePrice + variant.priceModifier).toLocaleString()}
                            </div>
                            {variant.stock < 5 && (
                              <div className="text-xs text-red-600">
                                Only {variant.stock} left
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Key Features:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {mockProduct.attributes.slice(0, 4).map((attr, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span><strong>{attr.key}:</strong> {attr.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {currentVariant.stock > 10 ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 font-medium">In Stock</span>
                  </>
                ) : currentVariant.stock > 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-700 font-medium">
                      Only {currentVariant.stock} left in stock - order soon
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
          </div>

          {/* Purchase Options */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <Card className="border border-gray-200">
                <CardContent className="p-6 space-y-4">
                  {/* Price Summary */}
                  <div>
                    <div className="text-2xl font-normal text-red-600">
                      ${finalPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      & FREE Returns
                    </div>
                    <div className="text-sm text-blue-600">
                      FREE delivery <strong>Tomorrow, Jan 25</strong>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      Deliver to New York 10001
                    </div>
                  </div>

                  <Separator />

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Quantity:
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded min-w-[50px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(currentVariant.stock, quantity + 1))}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                        disabled={quantity >= currentVariant.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2"
                      disabled={currentVariant.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2"
                      disabled={currentVariant.stock === 0}
                    >
                      Buy Now
                    </Button>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                        {isWishlisted ? 'Wishlisted' : 'Add to List'}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Trust Badges */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Truck className="w-4 h-4 mr-2 text-blue-600" />
                      FREE delivery on orders over $25
                    </div>
                    <div className="flex items-center text-gray-700">
                      <RotateCcw className="w-4 h-4 mr-2 text-blue-600" />
                      30-day return policy
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Shield className="w-4 h-4 mr-2 text-blue-600" />
                      2-year warranty included
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-4">{mockProduct.description}</p>
                    
                    <h4 className="text-lg font-medium mt-6 mb-3">What's in the Box</h4>
                    <ul className="list-disc list-inside space-y-1 mb-4">
                      <li>MacBook Pro</li>
                      <li>140W USB-C Power Adapter</li>
                      <li>USB-C to MagSafe 3 Cable (2 m)</li>
                      <li>Documentation</li>
                    </ul>

                    <h4 className="text-lg font-medium mt-6 mb-3">Key Benefits</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Unprecedented performance with M3 Max chip</li>
                      <li>Stunning 16.2-inch Liquid Retina XDR display</li>
                      <li>All-day battery life up to 22 hours</li>
                      <li>Advanced camera and audio for video calls</li>
                      <li>Extensive connectivity with Thunderbolt 4</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockProduct.attributes.map((attr, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{attr.key}</span>
                        <span className="text-gray-700 text-right">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center space-x-1">
                            {renderStars(mockProduct.rating)}
                          </div>
                          <span className="text-lg font-medium">{mockProduct.rating} out of 5</span>
                        </div>
                        <p className="text-gray-600">{mockProduct.reviewCount.toLocaleString()} global ratings</p>
                      </div>
                      
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const percentage = stars === 5 ? 65 : stars === 4 ? 20 : stars === 3 ? 10 : stars === 2 ? 3 : 2;
                          return (
                            <div key={stars} className="flex items-center space-x-2 text-sm">
                              <span className="w-12">{stars} star</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-400 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="w-8 text-right">{percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {mockProduct.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{review.author}</span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating, "sm")}
                              </div>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-gray-700 mb-4">{review.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful ({review.helpful})</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                            <ThumbsDown className="w-4 h-4" />
                            <span>Not helpful</span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qa" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Questions & Answers</h3>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium mb-2">Q: Is this compatible with external monitors?</h4>
                      <p className="text-gray-700 mb-2">
                        <strong>A:</strong> Yes, it supports up to four external displays with up to 6K resolution at 60Hz over Thunderbolt, plus one external display with up to 4K resolution at 144Hz over HDMI.
                      </p>
                      <p className="text-sm text-gray-500">Answered by Apple on January 10, 2024</p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-medium mb-2">Q: What's the difference between M3 Max and M3 Pro?</h4>
                      <p className="text-gray-700 mb-2">
                        <strong>A:</strong> The M3 Max has up to 40-core GPU compared to M3 Pro's 18-core GPU, and supports up to 128GB unified memory vs 36GB. It's designed for the most demanding professional workflows.
                      </p>
                      <p className="text-sm text-gray-500">Answered by TechExpert on January 8, 2024</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="mt-6">
                    Ask a Question
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;