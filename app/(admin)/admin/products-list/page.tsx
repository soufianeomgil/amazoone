
import React from 'react';
import { SearchIcon,  CaretDownIcon,  TrashIcon } from "@/components/shared/icons"
import { FilterIcon, PencilIcon } from 'lucide-react';
import Link from 'next/link';

type ProductStatus = 'Active' | 'Draft' | 'Out of Stock';

interface Product {
    id: string;
    name: string;
    image: string;
    status: ProductStatus;
    inventory: number;
    category: string;
    price: number;
}

const mockProducts: Product[] = [
    { id: 'SKU-001', name: 'Echo Dot (5th Gen) | Smart speaker with Alexa', image: 'https://m.media-amazon.com/images/I/71Que-d6-wL._AC_UY218_.jpg', status: 'Active', inventory: 120, category: 'Electronics', price: 49.99 },
    { id: 'SKU-002', name: 'Kindle Paperwhite (16 GB) – Now with a 6.8" display', image: 'https://m.media-amazon.com/images/I/61-fwv2G7GL._AC_UY218_.jpg', status: 'Active', inventory: 85, category: 'Electronics', price: 139.99 },
    { id: 'SKU-003', name: 'Amazon Basics 48-Pack AA Alkaline Batteries', image: 'https://m.media-amazon.com/images/I/71IdKRlm8+L._AC_UY218_.jpg', status: 'Out of Stock', inventory: 0, category: 'Household', price: 15.99 },
    { id: 'SKU-004', name: 'Fire TV Stick 4K Max streaming device, Wi-Fi 6', image: 'https://m.media-amazon.com/images/I/51km+p3mP-L._AC_UY218_.jpg', status: 'Active', inventory: 250, category: 'Electronics', price: 54.99 },
    { id: 'SKU-005', name: 'Blink Outdoor – wireless, weather-resistant HD security camera', image: 'https://m.media-amazon.com/images/I/51-iA8-jX-L._AC_UY218_.jpg', status: 'Draft', inventory: 30, category: 'Smart Home', price: 99.99 },
    { id: 'SKU-006', name: 'Ring Video Doorbell – 1080p HD video, improved motion detection', image: 'https://m.media-amazon.com/images/I/61DD1d-5TJL._AC_UY218_.jpg', status: 'Active', inventory: 75, category: 'Smart Home', price: 59.99 },
];

const AdminProducts: React.FC = () => {

    const getStatusClass = (status: ProductStatus) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-yellow-100 text-yellow-800';
            case 'Out of Stock': return 'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Products</h1>
                <Link href="/admin/products-list/create-product" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                    Add Product
                </Link>
            </div>

            {/* Main Content Card */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="grow">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products by name or SKU..."
                                className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50">
                            <FilterIcon />
                            <span>Filters</span>
                            <CaretDownIcon />
                        </button>
                         <button className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50">
                            <span>Status: All</span>
                            <CaretDownIcon />
                        </button>
                    </div>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4 text-left">
                                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-md object-contain" src={product.image} alt={product.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(product.status)}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.inventory} in stock</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                             <button className="text-gray-400 hover:text-blue-600"><PencilIcon /></button>
                                             <button className="text-gray-400 hover:text-red-600"><TrashIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                 {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">6</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;