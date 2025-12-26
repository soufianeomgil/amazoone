

"use client";
import React from "react";
import { FlagIcon, GlobeIcon, UpDownArrowsIcon } from "./icons";
import Link from "next/link";

const footerTopLinks = [
  {
    title: "Get to Know Us",
    items: [
      "Careers",
      "Blog",
      "About Amazon",
      "Investor Relations",
      "Amazon Devices",
      "Amazon Science",
    ],
  },
  {
    title: "Make Money with Us",
    items: [
      "Sell products on Amazon",
      "Sell on Amazon Business",
      "Sell apps on Amazon",
      "Become an Affiliate",
      "Advertise Your Products",
      "Self-Publish with Us",
      "Host an Amazon Hub",
      "› See More Make Money with Us",
    ],
  },
  {
    title: "Amazon Payment Products",
    items: [
      "Amazon Business Card",
      "Shop with Points",
      "Reload Your Balance",
      "Amazon Currency Converter",
    ],
  },
  {
    title: "Let Us Help You",
    items: [
      "Amazon and COVID-19",
      "Your Account",
      "Your Orders",
      "Shipping Rates & Policies",
      "Returns & Replacements",
      "Manage Your Content and Devices",
      "Amazon Assistant",
      "Help",
    ],
  },
];

const footerBottomGrid = [
  {
    title: "Amazon Music",
    desc: "Stream millions of songs",
  },
  {
    title: "Amazon Ads",
    desc: "Reach customers wherever they spend their time",
  },
  {
    title: "6pm",
    desc: "Score deals on fashion brands",
  },
  {
    title: "AbeBooks",
    desc: "Books, art & collectibles",
  },
  {
    title: "ACX",
    desc: "Audiobook Publishing Made Easy",
  },
  {
    title: "Sell on Amazon",
    desc: "Start a Selling Account",
  },
  {
    title: "Amazon Business",
    desc: "Everything For Your Business",
  },
  {
    title: "AmazonGlobal",
    desc: "Ship Orders Internationally",
  },
  {
    title: "Home Services",
    desc: "Experienced Pros Happiness Guarantee",
  },
  {
    title: "Amazon Web Services",
    desc: "Scalable Cloud Computing Services",
  },
  {
    title: "Audible",
    desc: "Listen to Books & Original Audio Performances",
  },
  {
    title: "Box Office Mojo",
    desc: "Find Movie Box Office Data",
  },
  {
    title: "Goodreads",
    desc: "Book reviews & recommendations",
  },
  {
    title: "IMDb",
    desc: "Movies, TV & Celebrities",
  },
];

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="text-white max-lg:hidden">
      <div
        className="bg-[#37475A] hover:bg-[#485769] cursor-pointer"
        onClick={scrollToTop}
      >
        <p className="text-center py-4 text-sm">Back to top</p>
      </div>

      {/* TOP FOUR COLUMNS */}
      <div className="bg-[#232F3E] py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerTopLinks.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold mb-2">{section.title}</h3>
              <ul className="text-sm space-y-2 text-gray-300">
                {section.items.map((item, idx) => (
                  <li  className="list-none!" key={idx}>
                    <Link href={"/"} className="hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* LANGUAGE & SETTINGS BAR */}
      <div className="bg-[#232F3E] border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <img
            src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
            alt="Amazon Logo"
            className="h-7 w-24 object-contain "
          />

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

      {/* BOTTOM GRID */}
      {/* <div className="bg-[#131921] py-8 text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-6">
            {footerBottomGrid.map((item, index) => (
              <div key={index} className="space-y-1">
                <a href="#" className="block hover:underline font-bold text-white">
                  {item.title}
                </a>
                <a href="#" className="block hover:underline text-gray-400">
                  {item.desc}
                </a>
              </div>
            ))}
          </div>

          <div className="text-center pt-8 mt-8 space-x-4 text-gray-300">
            <a href="#" className="hover:underline">Conditions of Use</a>
            <a href="#" className="hover:underline">Privacy Notice</a>
            <a href="#" className="hover:underline">Your Ads Privacy Choices</a>
          </div>

          <p className="text-center mt-2 text-gray-300">
            © 1996-2024, Amazon.com, Inc. or its affiliates
          </p>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;
