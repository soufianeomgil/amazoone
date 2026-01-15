"use client"
import React, { useState } from 'react';
import { MenuIcon, SearchIcon, CaretDownIcon, BellIcon,  CogIcon, LogoutIcon } from './icons';
import { UserCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';

const AdminHeader: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const pathname = usePathname()
    const navItems = [
    {
        name: "dashboard",
        route:ROUTES.admin.dashboard
    },
     {
        name: "orders",
        route:ROUTES.admin.orders
    },
     {
        name: "products",
        route:ROUTES.admin.products
    },
     {
        name: "users",
        route:ROUTES.admin.users
    },
     {
        name: "analytics",
        route:ROUTES.admin.analytics
    },
     {
        name: "marketing",
        route:ROUTES.admin.marketing
    },
]
    return ( 
        <header className="bg-[#232F3E] text-white shadow-md">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2">
                {/* Left Side */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Link href="/">
                         <Image height={28} width={96} src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                          alt="Amazon Logo" className="h-7 w-24 object-contain " />
                        </Link>
                        
                         <span className="text-xl font-bold text-gray-300 border-l border-gray-500 pl-2 hidden sm:inline">Admin</span>
                    </div>
                </div>

                {/* Center Search (Desktop) */}
                <div className="hidden md:flex flex-grow max-w-xl mx-4">
                    <div className="flex w-full">
                        <input type="text" className="w-full p-2 text-white rounded-l-md border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search orders, products, customers..." />
                        <button className="bg-[#FEBD69] hover:bg-orange-400 p-2 rounded-r-md">
                            <SearchIcon />
                        </button>
                    </div>
                </div>
                
                {/* Right Side */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 border border-transparent hover:bg-gray-700 rounded-full relative">
                        <BellIcon />
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 text-center">3</span>
                    </button>
                    <div className="relative">
                        <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 p-2 border border-transparent hover:bg-gray-700 rounded-md">
                           <UserCircle2Icon  />
                           <span className="hidden lg:inline">Admin User</span>
                           <CaretDownIcon />
                        </button>
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 text-gray-800">
                                <a href="#" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"><CogIcon /> <span className="ml-2">Settings</span></a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"><LogoutIcon /> <span className="ml-2">Sign Out</span></a>
                            </div>
                        )}
                    </div>
                     <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 border border-transparent hover:border-white rounded-sm lg:hidden">
                        <MenuIcon />
                    </button>
                </div>
            </div>

            {/* Bottom Navigation (Desktop) */}
            {/* <nav className="hidden lg:flex items-center bg-[#37475A] text-white text-sm font-semibold space-x-2 px-4 py-1">
                {navItems.map((item,index) => {
                    const isActive = pathname.includes(item.name);
                    return (
 <Link key={index} href={item.route} className={`p-2 border-b-2 ${isActive ? 'border-b-2 border-orange-400 text-orange-300 ' : "border-transparent"} capitalize  hover:border-white rounded-sm`}>
     {item.name}
 </Link>
                    )
                })}
               
               
            </nav> */}
            
            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                 <nav className="lg:hidden bg-[#37475A] text-white text-sm font-semibold px-4 py-2">
                    <Link href="#" className="block p-2 rounded-sm bg-gray-700">Dashboard</Link>
                    <Link href="#" className="block p-2 hover:bg-gray-700 rounded-sm">Orders</Link>
                    <Link href="#" className="block p-2 hover:bg-gray-700 rounded-sm">Products</Link>
                    <Link href="#" className="block p-2 hover:bg-gray-700 rounded-sm">Customers</Link>
                    <Link href="#" className="block p-2 hover:bg-gray-700 rounded-sm">Analytics</Link>
                    <Link href="#" className="block p-2 hover:bg-gray-700 rounded-sm">Marketing</Link>
                </nav>
            )}

             {/* Mobile Search */}
            <div className="md:hidden px-4 pb-3">
                 <div className="flex w-full">
                    <input type="text" className="w-full p-2 text-white border border-orange-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search..." />
                    <button className="bg-[#FEBD69] hover:bg-orange-400 p-2 rounded-r-md">
                        <SearchIcon />
                    </button>
                </div>
            </div>

        </header>
    );
};

export default AdminHeader;