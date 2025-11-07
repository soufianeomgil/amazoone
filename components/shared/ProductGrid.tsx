"use client"
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import { ProductAttribute } from '@/types/actionTypes';
interface Product {
  name: string;
  image: string;
  onQuickViewClick?: () => void;
  rating: number;
  reviews: number;
  price: string;
  isBestSeller: boolean;
}
// const products = [
//     {
//         id: 1,
//         image: "https://cdnmm.azureedge.net/e8a0ce94-06ad-4670-bdd1-bdec85fc1fa7.jpg",
//         tag: "-25%",
//         isBestSeller: true,
//         name: "Tefal Air Fryer, 4.2L, 1500W",
         
//         rating: 4.5,
//         reviews: 120,
//         price: "899 DH",
       
//     },
//     {
//         id: 2,
//         image: "https://cdnmm.azureedge.net/AAAMW72417-0002_img1.jpg",
//         tag: "-15%",
//          isBestSeller: true,
//         name: "Samsung Galaxy S23 Ultra, 256GB, Phantom Black",
          
//         rating: 5,
//         reviews: 310,
//         price: "12,499 DH",
        
//     },
//     {
//         id: 3,
//         image: "https://cdnmm.azureedge.net/NEW1696354495630_img1.jpg",
//         isBestSeller: true,
//         name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
//         rating: 4.8,
          
//         reviews: 890,
//         price: "3,790 DH",
     
//     },
//     {
//         id: 4,
//         image: "https://cdnmm.azureedge.net/AAAAW61172_img1.jpg",
//         tag: "-20%",
//        isBestSeller: true,
          
//         name: "LG 55-inch OLED 4K UHD Smart TV",
//         rating: 4.7,
//         reviews: 450,
//         price: "11,999 DH",
       
//     },
//     {
//         id: 5,
//         image: "https://cdnmm.azureedge.net/ESS4250947516027_img1.jpg",
        
//            isBestSeller: true,
//         name: "Nespresso Vertuo Next Coffee and Espresso Machine",
//         rating: 4.6,
//         reviews: 230,
//         price: "1,450 DH",
        
//     },
//      {
//         id: 6,
//         image: "https://cdnmm.azureedge.net/AAAQF33549_img1.jpg",
//          isBestSeller: true,
//         name: "Nespresso Vertuo Next Coffee and Espresso Machine",
//         rating: 4.6,
//         reviews: 230,
//         price: "1,450 DH",
        
//     }
// ];


const ProductGrid: React.FC = () => {
    const bestSellersData = {
    title: 'Best Sellers in Clothing, Shoes and Jewelry',
    products: [
        { id: 1, name: "Hanes Men's Sweatshirt, EcoSmart Fleece Crewneck Sweatshirt, Cotton-Blend Fleece Sweatshirt, Plush Fleece Pullover Sweatshirt", image: "/bag1-removebg-preview.png", rating: 4.5, reviews: 145037, price: '18.00', isBestSeller: true },
        { id: 2, name: "Gildan Men's Crew T-Shirts, Multipack, Style G1100", image: "/bag2-removebg-preview.png", rating: 4.6, reviews: 204510, price: '19.99', isBestSeller: true },
        { id: 3, name: "Hanes Women's EcoSmart Crewneck Sweatshirt, Cotton-Blend Fleece", image: "/bag3-removebg-preview.png", rating: 4.4, reviews: 54641, price: '13.98', isBestSeller: true },
        { id: 4, name: "Crocs Unisex-Adult Classic Clogs", image: "/bag4-removebg-preview.png", rating: 3, reviews: 512961, price: '29.95', isBestSeller: true },
        { id: 5, name: "Hey Dude Men's Wally Sox", image: "/bag5-removebg-preview.png", rating: 2.8, reviews: 93668, price: '41.99', isBestSeller: true },
        { id: 6, name: "Fullsoft 3 Pack Leggings for Women, Buttery Soft High Waisted", image: "/bag6-removebg-preview.png", rating: 4.5, reviews: 54342, price: '21.99', isBestSeller: true },
    ]
};
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleQuickView = (product: Product) => {
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
                    <h2 className="text-xl font-bold mb-4">{bestSellersData.title}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                        {bestSellersData.products.map(product => (
                             <ProductCard onQuickViewClick={() => handleQuickView(product)} key={product.id} {...product} />
                         
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

