"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { useSelector } from 'react-redux';
import { ChevronDown, User, ChevronRight, Heart, Menu, X } from 'lucide-react';

// Local imports
import { LocationIcon, CartIcon, FlagIcon, CaretDownIcon, UserIcon, CloseIcon } from '../icons';
import { Button } from '../../ui/button';
import { ROUTES } from '@/constants/routes';
import { getTotalItems } from '@/lib/store/cartSlice';
import SearchInput from '../SearchInput';

interface HeaderProps {
    qty?: number;
    session: Session | null;
    
    totalWishQty: number | null
}

const Header = ({ qty, session, totalWishQty }: HeaderProps) => {
    const cutName = session ? session.user?.name?.split(' ').map((word) => word[0]?.toUpperCase())?.join("") : ""
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    const totalCartItems = useSelector(getTotalItems);
    const pathname = usePathname();

    const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
    const handleRightMenuToggle = () => setIsRightMenuOpen(!isRightMenuOpen);

    useEffect(() => {
        document.body.style.overflow = (isMenuOpen || isRightMenuOpen) ? 'hidden' : 'unset';
    }, [isMenuOpen, isRightMenuOpen]);

    const menuItems = {
        "Digital Content & Devices": ["Amazon Music", "Kindle E-readers & Books", "Amazon Appstore"],
        "Shop By Department": ["Electronics", "Bags", "Footwear", "Make-up", "Accessiors", "Suitcases", "Clothes"],
        "Programs & Features": ["Gift Cards", "Shop By Interest", "Amazon Live", "International Shopping"],
        "Help & Settings": ["Your Account", "Customer Service", "Sign In"],
    };

    return (
        <>
            <header className={`bg-[#131921] w-full text-white ${pathname === "/" ? "sticky top-0 z-[140]" : ""}`}>
                
                {/* 1. TOP ANNOUNCEMENT BAR (Desktop) */}
                <div className='bg-[#232f3e] w-full hidden sm:flex items-center justify-center py-2 text-white text-[16px] font-medium'>
                    <p>🚚 Paiement à la livraison</p>
                </div>

                {/* 2. MAIN NAVBAR */}
                <div className="flex items-center px-2 md:px-4 py-1">
                    
                    {/* LEFT GROUP: Menu + Logo (TIGHTLY PACKED) */}
                    <div className="flex items-center">
                        <button 
                            onClick={handleMenuToggle} 
                            className="p-1.5 border border-transparent hover:border-white rounded-sm"
                        >
                            <Menu className="h-7 w-7" />
                        </button>
                        
                        <Link href="/" className="p-1 border border-transparent hover:border-white rounded-sm ml-0.5">
                             <Image
                                src="/ij.png"
                                alt="OMGIL Logo" 
                                priority
                                height={40}
                                width={90}
                                className="h-[35px] md:h-[45px] w-auto object-contain" 
                            />
                        </Link>

                        {/* Location (Desktop Only) */}
                        <Link href={ROUTES.addresses} className="hidden lg:flex items-center ml-2 p-2 border border-transparent hover:border-white rounded-sm leading-tight">
                            <LocationIcon />
                            <div className="ml-1">
                                <p className="text-[11px] text-gray-300">Deliver to {session?.user.name ?? "Morocco"}</p>
                                <p className="text-[13px] font-bold">Meknes 50000</p>
                            </div>
                        </Link>
                    </div>

                    {/* CENTER: Search (Desktop Only) */}
                    <div className="hidden md:flex flex-grow mx-4 max-w-[800px]">
                        <SearchInput />
                    </div>

                    {/* SPACER (Mobile Only): This pushes the left group and right group apart */}
                    <div className="flex-grow md:hidden" />

                    {/* RIGHT GROUP: Account + Wishlist + Cart */}
                    <div className="flex items-center gap-0 md:gap-1">
                        
                        {/* Language (Desktop Only) */}
                        <div className="hidden lg:flex items-center p-2 border border-transparent hover:border-white rounded-sm cursor-pointer">
                            <FlagIcon />
                            <span className="font-bold text-sm ml-1">EN</span>
                            <CaretDownIcon />
                        </div>

                        {/* Account Section */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsAccountDropdownOpen(true)}
                            onMouseLeave={() => setIsAccountDropdownOpen(false)}
                        >
                            <div 
                               onClick={() => {
                                    // If mobile, open right menu. If desktop, go to profile.
                                    if (window.innerWidth < 768) {
                                        setIsAccountDropdownOpen(false)
                                        handleRightMenuToggle();
                                    }
                                }} 
                                className="p-1.5 md:p-2 border border-transparent hover:border-white rounded-sm cursor-pointer leading-tight"
                            >
                                <div className="hidden md:block">
                                    <p className="text-[11px]">Hello, {session ? session.user.name : "sign in"}</p>
                                    <div className="flex items-center font-bold text-[13px]">
                                        <span>Account & Lists</span>
                                        <ChevronDown size={14} className="ml-0.5 text-gray-500" />
                                    </div>
                                </div>
                                <div className="p-1.5 md:hidden md:p-2 border border-transparent hover:border-white rounded-sm relative">
                                    <User className="h-7 w-7" />
                                     <span className="absolute top-1 right-1 bg-[#FEBD69] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                         {cutName}
                                     </span>
                                </div>
                            </div>

                            {/* Desktop Dropdown */}
                            <div className={`absolute top-full  border-gray-100  right-0 w-[450px] bg-white text-black shadow-2xl rounded-sm border z-[200] transition-all ${isAccountDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                {session ? (
                                    <div className='flex p-4 border-b border-gray-100 bg-gray-50 items-center justify-between'>
                                        <div className="flex items-center gap-2">
                                            <Image width={40} height={40} className='rounded-full' src={session?.user.image ?? "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"} alt="avatar" />
                                            <div>
                                                <p className='font-medium text-sm'>{session?.user.name}</p>
                                                <p className='text-gray-400 text-xs'>{session?.user.email}</p>
                                            </div>
                                        </div>
                                        <button className='text-blue-700 text-sm hover:underline' onClick={() => signOut()}>Sign Out</button>
                                    </div>
                                ) : (
                                    <div className="w-full py-4 flex flex-col items-center border-b">
                                        <Button asChild className="bg-yellow-primary w-[200px]"><Link href="/login">Sign In</Link></Button>
                                        <span className='text-xs mt-2'>New customer? <Link className='underline text-[#00afaa]' href="/sign-up">Start here</Link></span>
                                    </div>
                                )}
                                <div className="flex p-4">
                                    <div className="w-1/2 pr-4 border-r border-gray-200">
                                        <h3 className="font-bold mb-2">Your Lists</h3>
                                        <Link href="#" className="block text-xs text-gray-700 hover:text-orange-600 hover:underline">Create a List</Link>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <h3 className="font-bold mb-2">Your Account</h3>
                                        <Link href={ROUTES.myorders} className="block text-xs text-gray-700 hover:text-orange-600 hover:underline">Orders</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wishlist */}
                        <Link href={ROUTES.mywishlist} className="p-1.5 md:p-2 border border-transparent hover:border-white rounded-sm relative">
                            <Heart className="h-7 w-7" />
                           {totalWishQty !== 0 && <span className="absolute top-1 right-1 bg-[#FEBD69] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                              {totalWishQty} </span>} 
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="flex items-end p-1.5 md:p-2 border border-transparent hover:border-white rounded-sm relative">
                            <div className="relative">
                                <CartIcon />
                              
<span className="absolute -top-1 left-3 bg-[#FEBD69] text-black text-[11px] font-bold rounded-full h-4 w-5 flex items-center justify-center">
                                    {qty || totalCartItems}
                                </span>
                             
                            </div>
                            <span className="hidden md:inline font-bold text-[14px] ml-1">Cart</span>
                        </Link>
                    </div>
                </div>

                {/* 3. MOBILE SEARCH (Visible only on mobile) */}
                <div className="md:hidden px-2 pb-2">
                    <SearchInput />
                </div>

                {/* 4. MOBILE ANNOUNCEMENT BAR */}
                <div className='bg-[#232f3e] sm:hidden w-full flex items-center justify-center py-2 text-white text-[14px] font-medium'>
                    <p>🚚 Paiement à la livraison</p>
                </div>
            </header>

            {/* LEFT SIDE MENU */}
            <div className={`fixed inset-0 z-[501] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div onClick={handleMenuToggle} className="absolute inset-0 bg-black/80"></div>
                <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white z-40 transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="bg-[#232F3E] text-white p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <UserIcon />
                            <h2 className="text-xl font-bold">Hello, {session ? session.user.name : <Link href="/login">Sign In</Link>}</h2>
                        </div>
                        <button onClick={handleMenuToggle}><CloseIcon /></button>
                    </div>
                    <div className="overflow-y-auto h-full pb-16">
                        {Object.entries(menuItems).map(([category, items]) => (
                            <div className='border-b border-gray-200' key={category}>
                                <h3 className="font-bold text-lg p-4 pb-2 text-gray-800">{category}</h3>
                                <ul>
                                    {items.map(item => (
                                        <li key={item}>
                                            <Link href="#" className="block text-sm p-4 py-3 text-gray-900 hover:bg-gray-100">{item}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE MENU (MOBILE ACCOUNT) */}
          
                   <div className={`fixed inset-0 z-[99999] transition-opacity duration-300 ${isRightMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div onClick={handleRightMenuToggle} className="absolute inset-0 bg-black/60"></div>

                {/* Side Menu Panel */}
                <div className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white text-black z-[102] transform transition-transform duration-300 ease-in-out ${isRightMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold">Your Account</h2>
                        <button onClick={handleRightMenuToggle} className="text-gray-500"><CloseIcon /></button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto h-full pb-24">
                        {session ? (
                            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                                <Image width={50} height={50} className='rounded-full border-2 border-white shadow-sm' src={session?.user.image ?? "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"} alt="avatar" />
                                <div>
                                    <p className="font-bold">{session.user.name}</p>
                                    <p className="text-xs text-gray-500">{session.user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 text-center border-b border-gray-200">
                                <Button asChild className="bg-yellow-primary w-full mb-2"><Link href="/login">Sign In</Link></Button>
                                <p className="text-sm">New customer? <Link href="/sign-up" className="text-blue-600">Start here</Link></p>
                            </div>
                        )}

                        <div className="flex flex-col">
                            <h3 className="px-4 py-3 font-bold text-gray-800 bg-gray-100">Quick Links</h3>
                            <Link href={ROUTES.myorders} onClick={handleRightMenuToggle} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-100">
                                <span>Your Orders</span> <ChevronRight size={18} className="text-gray-400" />
                            </Link>
                            <Link href={`/profile/${session?.user.id}`} onClick={handleRightMenuToggle} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-100">
                                <span>Your Account</span> <ChevronRight size={18} className="text-gray-400" />
                            </Link>
                            <Link href={ROUTES.addresses} onClick={handleRightMenuToggle} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-100">
                                <span>Your Addresses</span> <ChevronRight size={18} className="text-gray-400" />
                            </Link>
                            <Link href={ROUTES.mywishlist} onClick={handleRightMenuToggle} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-100">
                                <span>Your Wishlist</span> <ChevronRight size={18} className="text-gray-400" />
                            </Link>
                            <Link href="/cart" onClick={handleRightMenuToggle} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-100">
                                <span>Your Cart</span> <ChevronRight size={18} className="text-gray-400" />
                            </Link>
                             <Link href={ROUTES.myBrowsingHistory} onClick={handleRightMenuToggle} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 active:bg-gray-100">
                                <span>Your Browding History</span> <ChevronRight size={18} className="text-gray-400" />
                            </Link>
                            {session && (
                                <button 
                                    onClick={() => signOut()}
                                    className="text-left px-4 py-4 text-red-600 font-medium active:bg-gray-100"
                                >
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </div>
                    </div>
                     </div>
        </>
    );
};

export default Header;