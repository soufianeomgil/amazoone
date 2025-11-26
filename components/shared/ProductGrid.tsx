"use client"
import React, { useState } from 'react';

import QuickViewModal from './QuickViewModal';
import { IProduct } from '@/models/product.model';
import ProductCard from '../cards/ProductCard';
import { MainCard } from '../cards/MainCard';





const ProductGrid= ({products}: {products: IProduct[]}) => {
 const fakeproducts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      title: "Premium Wireless Headphones - Noise Cancelling, Bluetooth 5.0, 30Hr Battery Life",
      rating: 4.5,
      reviewCount: 12847,
      price: 79.99,
      originalPrice: 129.99,
      isPrime: true,
      deliveryDate: "Tomorrow",
      inStock: true,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      title: "Classic Analog Watch - Stainless Steel, Water Resistant, Elegant Design",
      rating: 4.7,
      reviewCount: 8234,
      price: 149.99,
      originalPrice: 199.99,
      isPrime: true,
      deliveryDate: "Wed, Dec 27",
      inStock: true,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
      title: "Designer Sunglasses - UV Protection, Polarized Lenses, Premium Frame",
      rating: 4.3,
      reviewCount: 5621,
      price: 89.99,
      isPrime: false,
      deliveryDate: "Thu, Dec 28",
      inStock: true,
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
      title: "Bluetooth Speaker - Waterproof, 360° Sound, 12 Hours Playtime, Portable Design",
      rating: 4.6,
      reviewCount: 15234,
      price: 59.99,
      originalPrice: 89.99,
      isPrime: true,
      deliveryDate: "Tomorrow",
      inStock: true,
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
      title: "Professional Laptop Backpack - Anti-Theft, USB Charging Port, Water Resistant",
      rating: 4.8,
      reviewCount: 9876,
      price: 44.99,
      originalPrice: 69.99,
      isPrime: true,
      deliveryDate: "Tomorrow",
      inStock: true,
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop",
      title: "Running Sneakers - Breathable Mesh, Memory Foam Insole, Athletic Performance",
      rating: 4.4,
      reviewCount: 6543,
      price: 69.99,
      isPrime: false,
      deliveryDate: "Fri, Dec 29",
      inStock: true,
    },
  ];
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    const handleQuickView = (product: IProduct) => {
        setSelectedProduct(product);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        console.log(selectedProduct, "selected product here")
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        document.body.style.overflow = "unset"; // Restore background scroll
    };

    return (
        <>
            <main className="max-w-[1500px] mx-auto     relative z-10">
                {/* <div className="bg-white p-4 rounded-t-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800">Today's Deals</h2>
                </div> */}
                 <div className="mt-6 bg-white p-4">
                    <h2 className="text-xl font-bold mb-4">Best selling Bags under 50$</h2>
                    <main className="sm:container mx-auto  sm:px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {/* {products.map((product) => (
            <ProductCard onQuickViewClick={()=> handleQuickView(product)} key={product.id} product={product} />
          ))} */}
          {products.map((product) => (
            <MainCard  key={product.id}  {...product} />
          ))}
        </div>
      </main>
                </div>
            </main>
            <QuickViewModal 
                product={selectedProduct}
                isOpen={true}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default ProductGrid;
