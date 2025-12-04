"use client"
import React, { useState, useEffect } from 'react';
import { MenuIcon, LocationIcon, SearchIcon, CartIcon, FlagIcon, CaretDownIcon, UserIcon, CloseIcon } from './icons';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { ROUTES } from '@/constants/routes';
import { useSelector } from 'react-redux';
import { getTotalItems } from '@/lib/store/cartSlice';

// TODO: CREATE A SUB HEADER FOR FREE SHIPPING [TOWN]
// RENDER CART ITEMS
// CART SIDEBAR
// CHECKOUT PAGE
const Header = ({qty,data}: {
    qty: number | undefined;
    data: any
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
   const session = useSession()
 const totalItems = useSelector(getTotalItems)
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const menuItems = {
        "Digital Content & Devices": ["Amazon Music", "Kindle E-readers & Books", "Amazon Appstore"],
        "Shop By Department": ["Electronics", "Computers", "Smart Home", "Arts & Crafts"],
        "Programs & Features": ["Gift Cards", "Shop By Interest", "Amazon Live", "International Shopping"],
        "Help & Settings": ["Your Account", "Sign In"],
    };


    return (
        <>
            <header className="bg-[#131921] w-full text-white">
                {/* Top Navigation */}
                <div className="flex items-center justify-between px-2 py-1">
                    {/* Left Side */}
                    <div className="flex items-center space-x-2">
                       
                        <Link href="/" className="p-1 border border-transparent hover:border-white rounded-sm">
                            <Image 
                             src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
                             alt="Amazon Logo" 
                             width={96} height={40}
                             className="h-10 w-24 object-contain " />
                        </Link>
                        <div className="hidden md:flex items-center p-2 border border-transparent hover:border-white rounded-sm space-x-1">
                            <LocationIcon />
                            <div>
                                <p className="text-xs text-gray-300">Deliver to</p>
                                <p className="text-sm font-bold">New York 10001</p>
                            </div>
                        </div>
                    </div>

                    {/* Center Search (Desktop) */}
                    <div className="hidden md:flex grow mx-4">
                        <div className="flex w-full">
                            <button className="bg-gray-200 text-gray-700 text-xs px-3 rounded-l-md border-r border-gray-300 flex items-center space-x-1">
                                <span>All</span>
                                <CaretDownIcon />
                            </button>
                            <input type="text" className="w-full bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search Amazon" />
                            <button className="bg-[#FEBD69] hover:bg-orange-400 p-2 rounded-r-md">
                                <SearchIcon />
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Side */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="hidden md:flex items-center p-2 border border-transparent hover:border-white rounded-sm space-x-1">
                            <FlagIcon />
                            <span className="font-bold text-sm">EN</span>
                            <CaretDownIcon />
                        </div>
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsAccountDropdownOpen(true)}
                            onMouseLeave={() => setIsAccountDropdownOpen(false)}
                        >
                            <div className="p-2 border border-transparent hover:border-white rounded-sm cursor-pointer">
                                <p className="text-xs">
                                    Hello, {session.status === "unauthenticated" ?  "sign in" : session?.data?.user.name } 
                                </p>
                                <div className="flex items-center">
                                    <p className="text-sm font-bold">Account & Lists</p>
                                    <CaretDownIcon />
                                </div>
                            </div>

                             {/* Account Dropdown */}
                            <div className={`absolute top-full right-0 w-[500px] bg-white text-black shadow-lg rounded-md z-50 transition-opacity duration-300 ${isAccountDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                <div className="absolute -top-2 right-10 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
                                <div className="p-4 border-b">
                                    <div className="flex flex-col items-center">
                                        {session.status === "unauthenticated" ? (
                                          <div>
                                              <Button className="w-48 bg-yellow-400 hover:bg-yellow-500 text-sm font-bold py-1.5 rounded-md shadow-sm">
                                             <Link href="/login">Sign in</Link> 
                                        </Button>
                                        <p className="text-xs mt-1">New customer? <Link href="/sign-up" className="text-blue-600 hover:underline">Start here.</Link></p>
                                          </div>
                                        ): (

 <Button className='lassName="w-48 cursor-pointer  bg-yellow-400 hover:bg-yellow-500 text-sm font-bold py-1.5 rounded-md shadow-sm"' onClick={()=> signOut({redirect: false})}>Sign out</Button>

                                        )}
                                        
                                    </div>
                                </div>
                                <div className="flex p-4">
                                    <div className="w-1/2 pr-4 border-r">
                                        <h3 className="font-bold text-base mb-2">Your Lists</h3>
                                        <ul className="text-sm space-y-2 list-none!">
                                            <li className="list-none!"><a href="#" className="text-gray-700 hover:text-orange-600 hover:underline">Create a List</a></li>
                                            <li className="list-none!"><a href="#" className="text-gray-700 hover:text-orange-600 hover:underline">Find a List or Registry</a></li>
                                            <li className="list-none!"><a href="#" className="text-gray-700 hover:text-orange-600 hover:underline">AmazonSmile Charity Lists</a></li>
                                        </ul>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <h3 className="font-bold text-base mb-2">Your Account</h3>
                                        <ul className="text-sm list-none! space-y-2">
                                            <li className="list-none!"><Link href={`/profile/${session.data?.user.id}`} className="text-gray-700 hover:text-orange-600 hover:underline">Account</Link></li>
                                            <li className="list-none!"><Link href={ROUTES.myorders} className="text-gray-700 hover:text-orange-600 hover:underline">Orders</Link></li>
                                            <li className="list-none!"><a href="#" className="text-gray-700 hover:text-orange-600 hover:underline">Recommendations</a></li>
                                            <li className="list-none!"><Link href="/browsing-history" className="text-gray-700 hover:text-orange-600 hover:underline">Browsing History</Link></li>
                                            <li className="list-none!"><Link href="/account/wishlist" className="text-gray-700 hover:text-orange-600 hover:underline">Wishlist</Link></li>
                                            <li className="list-none!"><a href="#" className="text-gray-700 hover:text-orange-600 hover:underline">Video Purchases & Rentals</a></li>
                                            <li className="list-none!"><a href="#" className="text-gray-700 hover:text-orange-600 hover:underline">Kindle Unlimited</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link href="/account/order-history" className="hidden md:block p-2 border border-transparent hover:border-white rounded-sm">
                            <p className="text-xs">Returns</p>
                            <p className="text-sm font-bold">& Orders</p>
                        </Link>
                        <Link href="/cart" className="flex items-end p-2 border border-transparent hover:border-white rounded-sm relative">
                            <CartIcon />
                            <span className="absolute top-1 right-5 md:right-7 bg-[#FEBD69] text-black text-xs font-bold rounded-full h-4 w-4 text-center">
                                 {qty ? qty : totalItems}
                            </span>
                            <span className="hidden md:inline text-sm font-bold">Cart</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden px-2 pb-2">
                    <div className="flex w-full">
                        <button className="bg-gray-200 text-gray-700 text-xs px-3 rounded-l-md border-r border-gray-300 flex items-center space-x-1">
                            <span>All</span>
                            <CaretDownIcon />
                        </button>
                        <input type="text" className="w-full bg-white p-2 text-black focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Search Amazon" />
                        <button className="bg-[#FEBD69] hover:bg-orange-400 p-2 rounded-r-md">
                            <SearchIcon />
                        </button>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex items-center bg-[#232F3E] text-white text-sm space-x-3 md:space-x-4 px-2 md:px-4 py-2 overflow-x-auto whitespace-nowrap">
                    <button onClick={handleMenuToggle} className="flex items-center font-bold space-x-1 p-1 border border-transparent hover:border-white rounded-sm">
                        <MenuIcon />
                        <span>All</span>
                    </button>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Today's Deals</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Customer Service</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Registry</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Gift Cards</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Sell</a>
                </div>
            </header>

            {/* Collapsible Menu */}
            <div className={`fixed inset-0 z-30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div onClick={handleMenuToggle} className="absolute inset-0 bg-black/80 bg-opacity-70"></div>

                {/* Side Menu */}
                <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white text-black z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="bg-[#232F3E] text-white p-4 flex items-center space-x-3">
                        <UserIcon />
                        <h2 className="text-xl font-bold">Hello, Sign in</h2>
                    </div>

                    <div className="overflow-y-auto h-full pb-16">
                         {Object.entries(menuItems).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="font-bold text-lg p-4 pb-2 text-gray-800">{category}</h3>
                                <ul>
                                    {items.map(item => (
                                        <li key={item}>
                                            <a href="#" className="block p-4 py-3 text-gray-700 hover:bg-gray-100">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                                <hr className="my-2" />
                            </div>
                        ))}
                    </div>

                    <button onClick={handleMenuToggle} className="absolute top-3 right-3 text-white">
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Header;