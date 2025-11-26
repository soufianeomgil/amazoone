"use client"
import { CaretDownIcon } from '@/components/shared/icons';
import ProductCard from '@/components/cards/ProductCard';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { formatDate, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingBag } from 'lucide-react';


export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
}

 const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Echo Dot (5th Gen) | Smart speaker with Alexa | Charcoal',
        price: 49.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.5,
        reviewCount: 23485,
    },
    {
        id: 2,
        name: 'Kindle Paperwhite (16 GB) – Now with a 6.8" display and adjustable warm light',
        price: 139.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.8,
        reviewCount: 104521,
    },
    {
        id: 3,
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
        price: 398.00,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.6,
        reviewCount: 15320,
    },
    {
        id: 4,
        name: 'Apple Watch Series 9 [GPS 45mm] Smartwatch with Midnight Aluminum Case',
        price: 429.00,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.7,
        reviewCount: 7890,
    },
     {
        id: 5,
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker',
        price: 89.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.7,
        reviewCount: 150000,
    },
    {
        id: 6,
        name: 'Logitech MX Master 3S - Wireless Performance Mouse with Ultra-Fast Scrolling',
        price: 99.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.8,
        reviewCount: 25000,
    },
    {
        id: 7,
        name: 'SAMSUNG 32" Odyssey G55A QHD 165Hz 1ms Curved Gaming Monitor',
        price: 349.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.5,
        reviewCount: 9870,
    },
    {
        id: 8,
        name: 'Anker PowerCore 26800 Portable Charger, 26800mAh External Battery with Dual Input Port',
        price: 65.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.6,
        reviewCount: 55432,
    }
];

const BrowsingHistory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);

   

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-gray-900">Your Browsing History</h1>
                    <a href="#" className="text-sm text-blue-600 hover:underline hover:text-orange-700">View or edit your browsing history</a>
                </div>
                <div className="mt-4 md:mt-0">
                    <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded-lg shadow-sm border border-gray-300">
                        Manage history
                        <CaretDownIcon />
                    </button>
                </div>
            </div>

            <hr className="my-4 border-gray-300" />
            
            <h2 className="text-xl font-medium text-gray-900 mb-4">Recently viewed items</h2>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* {products.map(product => (
                        <ProductCard key={product.id} product={product} onRemove={handleRemove} />
                    ))} */}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-600">
                    <p className="text-lg">You have no recently viewed items.</p>
                    <p>Start browsing to see your history here.</p>
                </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
                <div className="flex justify-center items-center mt-8">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <Link href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span className="sr-only">Previous</span>
                            &lt; Previous
                        </Link>
                        <Link href="#" aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                            1
                        </Link>
                        <Link href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                            2
                        </Link>
                        <Link href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                             Next &gt;
                            <span className="sr-only">Next</span>
                        </Link>
                    </nav>
                </div>
            )}
        </div>
       
    );
};

export default BrowsingHistory;