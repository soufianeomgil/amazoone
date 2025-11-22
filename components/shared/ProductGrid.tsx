"use client"
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import { IProduct } from '@/models/product.model';




const ProductGrid= ({products}: {products: IProduct[]}) => {
//     const bestSellersData = {
//     title: 'Best Sellers in Clothing, Shoes and Jewelry',
//     products: [
//         { id: 1, name: "Hanes Men's Sweatshirt, EcoSmart Fleece Crewneck Sweatshirt, Cotton-Blend Fleece Sweatshirt, Plush Fleece Pullover Sweatshirt", image: "/bag1-removebg-preview.png", rating: 4.5, reviews: 145037, price: '18.00', isBestSeller: true },
//         { id: 2, name: "Gildan Men's Crew T-Shirts, Multipack, Style G1100", image: "/bag2-removebg-preview.png", rating: 4.6, reviews: 204510, price: '19.99', isBestSeller: true },
//         { id: 3, name: "Hanes Women's EcoSmart Crewneck Sweatshirt, Cotton-Blend Fleece", image: "/bag3-removebg-preview.png", rating: 4.4, reviews: 54641, price: '13.98', isBestSeller: true },
//         { id: 4, name: "Crocs Unisex-Adult Classic Clogs", image: "/bag4-removebg-preview.png", rating: 3, reviews: 512961, price: '29.95', isBestSeller: true },
//         { id: 5, name: "Hey Dude Men's Wally Sox", image: "/bag5-removebg-preview.png", rating: 2.8, reviews: 93668, price: '41.99', isBestSeller: true },
//         { id: 6, name: "Fullsoft 3 Pack Leggings for Women, Buttery Soft High Waisted", image: "/bag6-removebg-preview.png", rating: 4.5, reviews: 54342, price: '21.99', isBestSeller: true },
//     ]
// };
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  relative z-10">
                {/* <div className="bg-white p-4 rounded-t-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800">Today's Deals</h2>
                </div> */}
                 <div className="mt-6 bg-white p-4">
                    <h2 className="text-xl font-bold mb-4">Best Sellers in Clothing, Shoes and Jewelry</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                        {products.map(product => (
                             <ProductCard onQuickViewClick={() => handleQuickView(product)} key={product.id} product={product} />
                         
                        ))}
                    </div>
                    
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

