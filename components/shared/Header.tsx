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
import SearchInput from './SearchInput';
import { ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Session } from 'next-auth';

// TODO: CREATE A SUB HEADER FOR FREE SHIPPING [TOWN]
// RENDER CART ITEMS
// CART SIDEBAR
// CHECKOUT PAGE
const Header = ({qty,session,isAuthenticated}: {
    isAuthenticated: boolean;
    session: Session | null
    qty: number | undefined
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  
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
        "Shop By Department": ["Electronics", "Bags", "Footwear", "Make-up", "Accessiors" , "Suitcases", "Clothes"],
        "Programs & Features": ["Gift Cards", "Shop By Interest", "Amazon Live", "International Shopping"],
        "Help & Settings": ["Your Account", "Customer Service" , "Sign In"],
    };
  const pathname = usePathname()


    return (
        <>
            <header className={`bg-[#131921]   ${pathname !== "/" ? "" : "sticky top-0 right-0 left-0 z-[999999999999999]"}  w-full text-white`}>
                  <div className='bg-[#232f3e] relative max-sm:hidden w-full flex items-center justify-center  px-2 py-2'>
                     <p className='text-white text-[16px] font-medium'>🚚 Paiement à la livraison</p>
                </div>
                {/* Top Navigation */}
                <div className="flex items-center justify-between px-2 py-1">
                    {/* Left Side */}
                    <div className="flex items-center space-x-2">
                       <div className="flex items-center gap-2">
                        <button onClick={handleMenuToggle} className=" font-bold  p-1 border border-transparent hover:border-white rounded-sm">
                        <MenuIcon />
                        {/* <span>All</span> */}
                    </button>
                      <Link href="/" className="p-1 border border-transparent hover:border-white rounded-sm">
                            <Image
                             src="https://assets.aboutamazon.com/2e/d7/ac71f1f344c39f8949f48fc89e71/amazon-logo-squid-ink-smile-orange.png"
                             alt="Amazon Logo" 
                             width={96} height={40}
                             className="h-10 w-24 object-contain invert " />
                        </Link>
                       </div>
                        
                        <div className="hidden md:flex items-center p-2 border border-transparent hover:border-white rounded-sm space-x-1">
                            <LocationIcon />
                            <div>
                                <p className="text-xs text-gray-300">Deliver to HMAMOU</p>
                                <p className="text-sm text-white font-bold">Meknes 50000</p>
                            </div>
                        </div>
                    </div>

                    {/* Center Search (Desktop) */}
                    <div className="hidden md:flex grow mx-4">
                       
                        <SearchInput />
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
                                    Hello, {!session ?  "sign in" : session?.user.name } 
                                </p>
                                <div className="flex  items-center">
                                    <p className="text-sm font-bold">Account & Lists</p>
                                    <ChevronDown size={14} className='ml-0.5 text-gray-500'  />
                                </div>
                            </div>

                             {/* Account Dropdown */}
                            <div className={`absolute max-sm:hidden top-full right-0 w-[500px] bg-white text-black shadow-lg rounded-md z-50 transition-opacity duration-300 ${isAccountDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                <div className="absolute -top-2 right-10 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
                                {session ? (
 <div className='flex p-4 border-gray-200 border-b bg-gray-100 items-center justify-between'>
                                               <div className="flex items-start gap-2">
                                                  <Image width={40} height={40} className='rounded-full object-contain w-10 h-10 ' src={session?.user.image ?? "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"} alt="avatar" />
                                                  <div className="flex space-y-0.5 flex-col">
                                                       <p className='text-black font-medium text-sm'>
                                                         {session?.user.name}
                                                       </p>
                                                        <p className='text-gray-400 text-xs font-medium'>
                                                         {session?.user.email}
                                                       </p>

                                                  </div>
                                               </div>
                                              
                                              <button 
                                               className='text-blue-700 font-medium text-sm hover:underline cursor-pointer '
                                                type='button' 
                                                 onClick={()=> signOut()}
                                                >
                                                   Sign Out
                                               </button>
                                               
                                               
                                     </div>
                                ): (
                                    <div className="w-full pb-2.5 border-b border-gray-100 py-3 space-y-2 flex flex-col items-center justify-center">
                                          <Button asChild type='button' className="bg-yellow-primary shadow-sm cursor-pointer hover:underline text-xs w-[250px] py-1.5 ">
                                             <Link href="/login">Sign In</Link>
                                          </Button>
                                          <div className='flex items-center'>
                                              <span className='text-xs text-gray-700 font-medium'>New customer? <Link  className='underline text-[#00afaa]' href="/sign-up">Start here</Link> </span>
                                          </div>
                                    </div>
                                )}
                                    
                               
                                <div className="flex p-4">
                                    <div className="w-1/2 pr-4 border-gray-100 border-r">
                                        <h3 className="font-bold text-base ">Your Lists</h3>
                                         <div className='border-b mb-2 pb-1.5 border-gray-100'>
                                              <li className="list-none!"><Link href="#" className="text-gray-700 text-xs hover:text-orange-600 hover:underline">my bags</Link></li>
                                         </div>
                                        <ul className="text-sm space-y-2 list-none!">
                                            <li className="list-none!"><Link href="#" className="text-gray-700 text-xs hover:text-orange-600 hover:underline">Create a List</Link></li>
                                            <li className="list-none!"><Link href="#" className=" text-xs text-gray-700 hover:text-orange-600 hover:underline">Find a List or Registry</Link></li>
                                            <li className="list-none!"><Link href="#" className=" text-xs text-gray-700 hover:text-orange-600 hover:underline">AmazonSmile Charity Lists</Link></li>
                                        </ul>
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <h3 className="font-bold text-base mb-2">Your Account</h3>
                                        <ul className="text-sm list-none! space-y-2">
                                            <li className="list-none!"><Link href={`/profile/${session?.user.id}`} className="text-gray-700 text-xs hover:text-orange-600 hover:underline">Account</Link></li>
                                            <li className="list-none!"><Link href={ROUTES.myorders} className="text-gray-700 hover:text-orange-600 text-xs hover:underline">Orders</Link></li>
                                            <li className="list-none!"><Link href="#" className="text-gray-700 hover:text-orange-600 hover:underline text-xs">Recommendations</Link></li>
                                            <li className="list-none!"><Link href="/browsing-history" className="text-gray-700 hover:text-orange-600 text-xs hover:underline">Browsing History</Link></li>
                                            <li className="list-none!"><Link href="/account/wishlist" className="text-gray-700 hover:text-orange-600 text-xs hover:underline">Wishlist</Link></li>
                                            <li className="list-none!"><Link href={ROUTES.addresses} className="text-gray-700 hover:text-orange-600 text-xs hover:underline">addresses</Link></li>
                                            <li className="list-none!"><Link href="#" className="text-gray-700 hover:text-orange-600 hover:underline text-xs">today's deals</Link></li>
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
                    
                    <SearchInput />
                </div>

                {/* Bottom Navigation */}
                {/* <div className="flex items-center max-sm:hidden bg-[#232F3E] text-white text-sm space-x-3 md:space-x-4 px-2 md:px-4 py-2 overflow-x-auto whitespace-nowrap">
                    <button onClick={handleMenuToggle} className="flex items-center font-bold space-x-1 p-1 border border-transparent hover:border-white rounded-sm">
                        <MenuIcon />
                        <span>All</span>
                    </button>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Today's Deals</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Customer Service</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Registry</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Gift Cards</a>
                    <a href="#" className="p-1 border border-transparent hover:border-white rounded-sm">Sell</a>
                </div> */}
                <div className='bg-[#232f3e] relative sm:hidden w-full flex items-center justify-center  px-2 py-2'>
                     <p className='text-white text-[16px] font-medium'>🚚 Paiement à la livraison</p>
                </div>
            </header>

            {/* Collapsible Menu */}
            <div className={`fixed inset-0 z-30 z-[999999999999999999999999999999999999] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Overlay */}
                <div onClick={handleMenuToggle} className="absolute inset-0 bg-black/80 bg-opacity-70"></div>

                {/* Side Menu */}
                <div className={`fixed top-0 left-0 h-full  w-full max-w-xs bg-white text-black z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="bg-[#232F3E] text-white p-4 flex items-center space-x-3">
                        <UserIcon />
                        <h2 className="text-xl font-bold">Hello, {session ? session?.user.name?.split(" ")[0] : <Link href="/login">Sign In</Link>}</h2>
                    </div>

                    <div className="overflow-y-auto h-full pb-16">
                         {Object.entries(menuItems).map(([category, items]) => (
                            <div className='border-b border-gray-200' key={category}>
                                <h3 className="font-bold text-lg p-4 pb-2 text-gray-800">{category}</h3>
                                <ul>
                                    {items.map(item => (
                                        <li key={item}>
                                            <Link href="#" className="block  text-sm p-4 py-3 text-gray-900 hover:bg-gray-100">{item}</Link>
                                        </li>
                                    ))}
                                </ul>
                                {/* <hr className="my-2" /> */}
                            </div>
                        ))}
                    </div>

                    <button onClick={handleMenuToggle} className="absolute cursor-pointer top-3 right-3 text-white">
                        <CloseIcon  />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Header;