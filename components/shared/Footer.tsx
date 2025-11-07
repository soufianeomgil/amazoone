"use client"
import React from 'react';
import { FlagIcon, GlobeIcon, UpDownArrowsIcon } from './icons';

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="text-white">
            <div className="bg-[#37475A] hover:bg-[#485769] cursor-pointer" onClick={scrollToTop}>
                <p className="text-center py-4 text-sm">Back to top</p>
            </div>

            <div className="bg-[#232F3E] py-10">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-2">Get to Know Us</h3>
                        <ul className="text-sm space-y-2 text-gray-300">
                            <li><a href="#" className="hover:underline">Careers</a></li>
                            <li><a href="#" className="hover:underline">Blog</a></li>
                            <li><a href="#" className="hover:underline">About Amazon</a></li>
                            <li><a href="#" className="hover:underline">Investor Relations</a></li>
                            <li><a href="#" className="hover:underline">Amazon Devices</a></li>
                            <li><a href="#" className="hover:underline">Amazon Science</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Make Money with Us</h3>
                        <ul className="text-sm space-y-2 text-gray-300">
                            <li><a href="#" className="hover:underline">Sell products on Amazon</a></li>
                            <li><a href="#" className="hover:underline">Sell on Amazon Business</a></li>
                            <li><a href="#" className="hover:underline">Sell apps on Amazon</a></li>
                            <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
                            <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
                            <li><a href="#" className="hover:underline">Self-Publish with Us</a></li>
                            <li><a href="#" className="hover:underline">Host an Amazon Hub</a></li>
                            <li><a href="#" className="hover:underline">› See More Make Money with Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Amazon Payment Products</h3>
                        <ul className="text-sm space-y-2 text-gray-300">
                            <li><a href="#" className="hover:underline">Amazon Business Card</a></li>
                            <li><a href="#" className="hover:underline">Shop with Points</a></li>
                            <li><a href="#" className="hover:underline">Reload Your Balance</a></li>
                            <li><a href="#" className="hover:underline">Amazon Currency Converter</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Let Us Help You</h3>
                        <ul className="text-sm space-y-2 text-gray-300">
                            <li><a href="#" className="hover:underline">Amazon and COVID-19</a></li>
                            <li><a href="#" className="hover:underline">Your Account</a></li>
                            <li><a href="#" className="hover:underline">Your Orders</a></li>
                            <li><a href="#" className="hover:underline">Shipping Rates & Policies</a></li>
                            <li><a href="#" className="hover:underline">Returns & Replacements</a></li>
                            <li><a href="#" className="hover:underline">Manage Your Content and Devices</a></li>
                            <li><a href="#" className="hover:underline">Amazon Assistant</a></li>
                            <li><a href="#" className="hover:underline">Help</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="bg-[#232F3E] border-t border-gray-700 py-6">
                 <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                    <img src="https://pngimg.com/uploads/amazon/amazon_PNG11.png" alt="Amazon Logo" className="h-7 w-24 object-contain invert" />
                    <div className="flex space-x-2">
                        <button className="flex items-center border border-gray-500 rounded-sm px-3 py-1 text-sm">
                            <GlobeIcon />
                            <span>English</span>
                            <UpDownArrowsIcon />
                        </button>
                         <button className="flex items-center border border-gray-500 rounded-sm px-3 py-1 text-sm">
                            <span className="mr-1">$</span>
                            <span>USD - U.S. Dollar</span>
                        </button>
                        <button className="flex items-center border border-gray-500 rounded-sm px-3 py-1 text-sm">
                            <FlagIcon />
                            <span className="ml-2">United States</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-[#131921] py-8 text-xs">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-6">
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Amazon Music</a>
                            <a href="#" className="block hover:underline text-gray-400">Stream millions of songs</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Amazon Ads</a>
                            <a href="#" className="block hover:underline text-gray-400">Reach customers wherever they spend their time</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">6pm</a>
                            <a href="#" className="block hover:underline text-gray-400">Score deals on fashion brands</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">AbeBooks</a>
                            <a href="#" className="block hover:underline text-gray-400">Books, art & collectibles</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">ACX</a>
                            <a href="#" className="block hover:underline text-gray-400">Audiobook Publishing Made Easy</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Sell on Amazon</a>
                            <a href="#" className="block hover:underline text-gray-400">Start a Selling Account</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Amazon Business</a>
                            <a href="#" className="block hover:underline text-gray-400">Everything For Your Business</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">AmazonGlobal</a>
                            <a href="#" className="block hover:underline text-gray-400">Ship Orders Internationally</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Home Services</a>
                            <a href="#" className="block hover:underline text-gray-400">Experienced Pros Happiness Guarantee</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Amazon Web Services</a>
                            <a href="#" className="block hover:underline text-gray-400">Scalable Cloud Computing Services</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Audible</a>
                            <a href="#" className="block hover:underline text-gray-400">Listen to Books & Original Audio Performances</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Box Office Mojo</a>
                            <a href="#" className="block hover:underline text-gray-400">Find Movie Box Office Data</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">Goodreads</a>
                            <a href="#" className="block hover:underline text-gray-400">Book reviews & recommendations</a>
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="block hover:underline font-bold text-white">IMDb</a>
                            <a href="#" className="block hover:underline text-gray-400">Movies, TV & Celebrities</a>
                        </div>
                    </div>
                    <div className="text-center pt-8 mt-8 space-x-4 text-gray-300">
                        <a href="#" className="hover:underline">Conditions of Use</a>
                        <a href="#" className="hover:underline">Privacy Notice</a>
                        <a href="#" className="hover:underline">Your Ads Privacy Choices</a>
                    </div>
                    <p className="text-center mt-2 text-gray-300">© 1996-2024, Amazon.com, Inc. or its affiliates</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;