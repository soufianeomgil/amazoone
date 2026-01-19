"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
    {url: "https://www.louisvuitton.com/images/is/image/lv/MEN_BC_MNG_SHADOW_OCT25_04_DI3.jpg"},
    { url: 'https://images.ctfassets.net/brzb6u29244a/1r0xTJ5E4aYyYYlHkXFk01/3ea85491d43aa09216ad889fea64c1f1/HeroCategory-Desktop_Gucci-GIFT-GIVING-NOV25-Set-2-25-1268_001_Default.png?w=1440&fm=avif&q=50' },
 // { url: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/ab01a6b6-7ded-4419-a843-de06988edb31.__CR0,0,1464,600_PT0_SX1464_V1___.jpg' },
     //{ url: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/9fd2a6da-d89d-4e3f-aeff-5f2e196c24df.__CR0,0,1464,600_PT0_SX1464_V1___.jpg' },
];

const Hero: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);
    
    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 10000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);


    return (
       
        // Hero.tsx (UPDATED)
<section className="relative md:h-[555px] h-[400px] w-full overflow-hidden">
  <div
    className="absolute inset-0 transition-transform duration-700 ease-in-out flex"
    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
  >
    {slides.map((slide, i) => (
      <img
        
        key={i}
        src={slide.url}
        className="w-full h-full object-contain shrink-0"
        alt=""
      />
      
  

    ))}
  </div>

  {/* overlay */}
  <div className="absolute  inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

  {/* content */}
  <div className="absolute  sm:bottom-25 bottom-16 left-6 md:left-16 text-white max-w-md">
    <h1 className="text-xl md:text-3xl font-bold leading-tight">
      Bring Laptop, Books and Stationery for Students
    </h1>
    <p className="mt-2 text-sm md:text-base text-gray-200">
      Womens purse and Handbags as College Book Bag to Bring Laptop, Books and Stationery.
    </p>

    <Link
      href="/category/bags"
      className="inline-block mt-4  bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-500"
    >
      Shop best-selling bags 
      {/* call to action matters */}
    </Link>
  </div>
</section>

    );
};

export default Hero;