"use client"
import { DotsVerticalIcon, LockClosedIcon } from '@/components/shared/icons';
import { CogIcon, ShareIcon, TrashIcon } from 'lucide-react';
import React, { useState } from 'react';


interface WishlistItem {
    id: string;
    name: string;
    image: string;
}

interface Wishlist {
    id: number;
    name: string;
    privacy: 'Private' | 'Public';
    itemCount: number;
    items: WishlistItem[];
}

const mockWishlists: Wishlist[] = [
  {
    id: 1,
    name: 'My Wishlist',
    privacy: 'Private',
    itemCount: 5,
    items: [
      { id: 'w1-i1', name: 'Sony WH-1000XM5 Wireless Headphones', image: 'https://m.media-amazon.com/images/I/61vJtANn4CL._AC_UY218_.jpg' },
      { id: 'w1-i2', name: 'Logitech MX Master 3S Mouse', image: 'https://m.media-amazon.com/images/I/61xALMiH8pL._AC_UY218_.jpg' },
      { id: 'w1-i3', name: 'Apple MacBook Air M2', image: 'https://m.media-amazon.com/images/I/71jG+e7roXL._AC_UY218_.jpg' },
      { id: 'w1-i4', name: 'Samsung Odyssey G9 Monitor', image: 'https://m.media-amazon.com/images/I/61SQz8S+fEL._AC_UY218_.jpg' },
      { id: 'w1-i5', name: 'Elgato Stream Deck MK.2', image: 'https://m.media-amazon.com/images/I/710R9Y0q-gL._AC_UY218_.jpg' },
    ],
  },
  {
    id: 2,
    name: 'Books to Read',
    privacy: 'Private',
    itemCount: 2,
    items: [
      { id: 'w2-i1', name: 'Dune by Frank Herbert', image: 'https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UY218_.jpg' },
      { id: 'w2-i2', name: 'Project Hail Mary by Andy Weir', image: 'https://m.media-amazon.com/images/I/91BdMBWd2bL._AC_UY218_.jpg' },
    ],
  },
  {
    id: 3,
    name: 'Home Improvement',
    privacy: 'Private',
    itemCount: 0,
    items: [],
  },
];


const Wishlist: React.FC = () => {
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Lists</h1>
                <button className="text-sm text-blue-600 hover:text-orange-600 hover:underline mt-2 sm:mt-0 self-start sm:self-center">
                    Create a List
                </button>
            </div>
            
            <div className="border-b">
                <nav className="flex -mb-px">
                    <a href="#" className="py-2 px-1 mr-8 border-b-2 border-orange-500 text-orange-600 font-semibold text-sm">
                        Your Lists
                    </a>
                    <a href="#" className="py-2 px-1 mr-8 border-b-2 border-transparent text-gray-600 hover:text-gray-900 text-sm">
                        Your Idea Lists
                    </a>
                    <a href="#" className="py-2 px-1 mr-8 border-b-2 border-transparent text-gray-600 hover:text-gray-900 text-sm">
                        Your Friends
                    </a>
                </nav>
            </div>

            <div className="mt-6 space-y-4">
                {mockWishlists.map((list) => (
                    <div key={list.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                        <div className="w-full md:w-48 flex-shrink-0">
                            {list.items.length > 0 ? (
                                <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-md">
                                    {list.items.slice(0, 4).map(item => (
                                        <img key={item.id} src={item.image} alt={item.name} className="w-full h-20 object-contain bg-white rounded-sm" />
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                                    <span className="text-xs text-gray-500">No items</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <a href="#" className="font-bold text-lg text-blue-600 hover:underline hover:text-orange-600">{list.name}</a>
                                    <div className="relative">
                                        <button onClick={() => setOpenMenuId(openMenuId === list.id ? null : list.id)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full">
                                            <DotsVerticalIcon />
                                        </button>
                                        {openMenuId === list.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><CogIcon /> Manage List</a>
                                                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><ShareIcon /> Share</a>
                                                <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><TrashIcon /> Delete List</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <LockClosedIcon className="mr-1" />
                                    <span>{list.privacy}</span>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                {list.itemCount} {list.itemCount === 1 ? 'item' : 'items'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;