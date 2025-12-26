"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import Link from 'next/link';

const slides = [
    //{url: "https://www.louisvuitton.com/images/is/image/lv/MEN_BC_MNG_SHADOW_OCT25_04_DI3.jpg"},
    //{ url: 'https://images.ctfassets.net/brzb6u29244a/1r0xTJ5E4aYyYYlHkXFk01/3ea85491d43aa09216ad889fea64c1f1/HeroCategory-Desktop_Gucci-GIFT-GIVING-NOV25-Set-2-25-1268_001_Default.png?w=1440&fm=avif&q=50' },
  // { url: '' },
    { url: 'https://media.gucci.com/style/DarkGray_Center_0_0_1200x1200/1747327503/853971_FAFFQ_8864_001_100_0000_Light-gucci-giglio-large-tote-bag.jpg' },
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
        // <section className="relative h-90 md:h-[700px] w-full  group z-0">
        //     <div className="w-full h-full overflow-hidden">
        //          <div
        //             className="w-full h-full flex transition-transform ease-in-out duration-700"
        //             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        //         >
        //             {slides.map((slide, slideIndex) => (
                       
        //                  <img
        //                     key={slideIndex}
        //                     src={slide.url as string}
        //                     alt={`Promotional banner ${slideIndex + 1}`}
        //                     className="w-full h-full sm:object-contain object-cover shrink-0"
        //                 />
        //             ))}
        //         </div>
        //     </div>
        //      <div className="absolute max-sm:hidden
        //      inset-0 bg-linear-to-t from-gray-200 via-transparent to-transparent" />

        //     {/* Left Arrow */}
        //     <div className="hidden group-hover:block absolute top-[35%] -translate-y-1/2 left-5 text-2xl rounded-md p-2 bg-white/60 text-gray-800 cursor-pointer shadow-md hover:bg-white">
        //         <ChevronLeftIcon onClick={prevSlide} />
        //     </div>
        //     {/* Right Arrow */}
        //     <div className="hidden group-hover:block absolute top-[35%] -translate-y-1/2 right-5 text-2xl rounded-md p-2 bg-white/60 text-gray-800 cursor-pointer shadow-md hover:bg-white">
        //         <ChevronRightIcon onClick={nextSlide} />
        //     </div>

        //     <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center space-x-2">
        //         {slides.map((_, slideIndex) => (
        //             <div
        //                 key={slideIndex}
        //                 onClick={() => goToSlide(slideIndex)}
        //                 className={`cursor-pointer h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
        //             ></div>
        //         ))}
        //     </div>
        // </section>
        // Hero.tsx (UPDATED)
<section className="relative h-[400px] md:h-[700px] w-full overflow-hidden">
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
  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

  {/* content */}
  <div className="absolute sm:bottom-25 bottom-16 left-6 md:left-16 text-white max-w-md">
    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
      Travel smarter. Carry better.
    </h1>
    <p className="mt-2 text-sm md:text-base text-gray-200">
      Best-selling bags & suitcases trusted by thousands
    </p>

    <Link
      href="/category/bags"
      className="inline-block mt-4 bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-500"
    >
      Shop best-selling bags under $50
      {/* call to action matters */}
    </Link>
  </div>
</section>

    );
};

export default Hero;