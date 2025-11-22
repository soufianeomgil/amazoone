"use client"
import React, { useState } from 'react';
import {  StarIcon } from './icons';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-4 border-b border-gray-200">
            <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <h3 className="text-sm font-bold text-gray-800">{title}</h3>
                {isOpen ? <ChevronUpIcon className="h-4 w-4 text-gray-500" /> : <ChevronDownIcon className="h-4 w-4 text-gray-500" />}
            </button>
            {isOpen && <div className="mt-3 space-y-2 text-sm">{children}</div>}
        </div>
    );
};

const FilterSidebar: React.FC = () => {
    return (
        <aside>
            <div className="mb-4">
                <h2 className="text-lg font-bold">Filter by</h2>
                <button className="text-xs text-blue-600 hover:underline">Clear all</button>
            </div>
            
            <FilterSection title="Department">
                <a href="#" className="block text-gray-700 hover:text-orange-600">Electronics</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">Computers & Accessories</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">Smart Home</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">Arts & Crafts</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">Books</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">Luggage</a>
            </FilterSection>

            <FilterSection title="Customer Reviews">
                <a href="#" className="flex items-center text-gray-700 hover:text-orange-600">
                    <StarIcon className="text-yellow-500" /><StarIcon className="text-yellow-500" /><StarIcon className="text-yellow-500" /><StarIcon className="text-yellow-500" /><StarIcon className="text-gray-300" />
                    <span className="ml-2">& Up</span>
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-orange-600">
                    <StarIcon className="text-yellow-500" /><StarIcon className="text-yellow-500" /><StarIcon className="text-yellow-500" /><StarIcon className="text-gray-300" /><StarIcon className="text-gray-300" />
                    <span className="ml-2">& Up</span>
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-orange-600">
                    <StarIcon className="text-yellow-500" /><StarIcon className="text-yellow-500" /><StarIcon className="text-gray-300" /><StarIcon className="text-gray-300" /><StarIcon className="text-gray-300" />
                    <span className="ml-2">& Up</span>
                </a>
                 <a href="#" className="flex items-center text-gray-700 hover:text-orange-600">
                    <StarIcon className="text-yellow-500" /><StarIcon className="text-gray-300" /><StarIcon className="text-gray-300" /><StarIcon className="text-gray-300" /><StarIcon className="text-gray-300" />
                    <span className="ml-2">& Up</span>
                </a>
            </FilterSection>

            <FilterSection title="Price">
                <a href="#" className="block text-gray-700 hover:text-orange-600">Under $25</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">$25 to $50</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">$50 to $100</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">$100 to $200</a>
                <a href="#" className="block text-gray-700 hover:text-orange-600">$200 & Above</a>
                <div className="flex items-center space-x-2 mt-2">
                    <input type="text" placeholder="$ Min" className="w-full text-xs p-1 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <span className="text-gray-500">-</span>
                    <input type="text" placeholder="$ Max" className="w-full text-xs p-1 border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <button className="text-xs p-1 border rounded-sm hover:bg-gray-100">Go</button>
                </div>
            </FilterSection>

            <FilterSection title="Brand">
                <label className="flex items-center space-x-2 text-gray-700 hover:text-orange-600">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span>Amazon</span>
                </label>
                 <label className="flex items-center space-x-2 text-gray-700 hover:text-orange-600">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span>Apple</span>
                </label>
                 <label className="flex items-center space-x-2 text-gray-700 hover:text-orange-600">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span>Sony</span>
                </label>
                <label className="flex items-center space-x-2 text-gray-700 hover:text-orange-600">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span>Logitech</span>
                </label>
            </FilterSection>
        </aside>
    );
};

export default FilterSidebar;