// "use client"
// import React, { useState, useEffect, useCallback } from 'react';
// import { ChevronLeftIcon, ChevronRightIcon } from './icons';
// import Link from 'next/link';
// import Image from 'next/image';

// const slides = [
//     {url: "https://www.louisvuitton.com/images/is/image/lv/MEN_BC_MNG_SHADOW_OCT25_04_DI3.jpg"},
//     { url: 'https://images.ctfassets.net/brzb6u29244a/1r0xTJ5E4aYyYYlHkXFk01/3ea85491d43aa09216ad889fea64c1f1/HeroCategory-Desktop_Gucci-GIFT-GIVING-NOV25-Set-2-25-1268_001_Default.png?w=1440&fm=avif&q=50' },
//  // { url: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/ab01a6b6-7ded-4419-a843-de06988edb31.__CR0,0,1464,600_PT0_SX1464_V1___.jpg' },
//      //{ url: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/9fd2a6da-d89d-4e3f-aeff-5f2e196c24df.__CR0,0,1464,600_PT0_SX1464_V1___.jpg' },
// ];

// const Hero: React.FC = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);

//     const prevSlide = () => {
//         const isFirstSlide = currentIndex === 0;
//         const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
//         setCurrentIndex(newIndex);
//     };

//     const nextSlide = useCallback(() => {
//         const isLastSlide = currentIndex === slides.length - 1;
//         const newIndex = isLastSlide ? 0 : currentIndex + 1;
//         setCurrentIndex(newIndex);
//     }, [currentIndex]);
    
//     const goToSlide = (slideIndex: number) => {
//         setCurrentIndex(slideIndex);
//     };

//     useEffect(() => {
//         const slideInterval = setInterval(nextSlide, 10000);
//         return () => clearInterval(slideInterval);
//     }, [nextSlide]);


//     return (
       
//         // Hero.tsx (UPDATED)
// <section className="relative md:h-[555px] h-[400px] w-full overflow-hidden">
//   <div
//     className="absolute inset-0 transition-transform duration-700 ease-in-out flex"
//     style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//   >
//     {slides.map((slide, i) => (
//       <img
        
//         key={i}
//         src={slide.url}
//         className="w-full h-full object-contain shrink-0"
//         alt=""
//       />
      
  

//     ))}
//   </div>

//   {/* overlay */}
//   <div className="absolute  inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

//   {/* content */}
//   <div className="absolute  sm:bottom-25 bottom-16 left-6 md:left-16 text-white max-w-md">
//     <h1 className="text-xl md:text-3xl font-bold leading-tight">
//       Bring Laptop, Books and Stationery for Students
//     </h1>
//     <p className="mt-2 text-sm md:text-base text-gray-200">
//       Womens purse and Handbags as College Book Bag to Bring Laptop, Books and Stationery.
//     </p>

//     <Link
//       href="/category/bags"
//       className="inline-block mt-4  bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-500"
//     >
//       Shop best-selling bags 
//       {/* call to action matters */}
//     </Link>
//   </div>
// </section>

//     );
// };

// export default Hero;

"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import Link from 'next/link';

const slides = [
    {
        url: "https://www.louisvuitton.com/images/is/image/lv/MEN_BC_MNG_SHADOW_OCT25_04_DI3.jpg",
        title: "The Luxury Collection",
        desc: "Premium craftsmanship for the modern professional."
    },
    { 
        url: 'https://images.ctfassets.net/brzb6u29244a/1r0xTJ5E4aYyYYlHkXFk01/3ea85491d43aa09216ad889fea64c1f1/HeroCategory-Desktop_Gucci-GIFT-GIVING-NOV25-Set-2-25-1268_001_Default.png?w=1440&fm=avif&q=50',
        title: "Elegance Reimagined",
        desc: "Find the perfect gift from our exclusive handbag selection."
    },
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

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 8000); // 8 seconds is smoother for reading
        return () => clearInterval(slideInterval);
    }, [nextSlide]);

    return (
        <section className="relative md:h-[600px] h-[450px] w-full overflow-hidden bg-black">
            {/* Slider Track */}
            <div
                className="absolute inset-0 transition-transform duration-1000 ease-out flex"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, i) => (
                    <div key={i} className="w-full h-full shrink-0 relative">
                        <img
                            src={slide.url}
                            className="w-full h-full object-cover" 
                            alt={slide.title}
                        />
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:bg-gradient-to-t" />
                    </div>
                ))}
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 z-[99] flex flex-col justify-end md:justify-center
              px-6 md:px-20 pb-16 md:pb-0 pointer-events-none">
                <div className="max-w-2xl text-white pointer-events-auto">
                    {/* Animated Badge */}
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-black uppercase bg-yellow-400 rounded-sm">
                        Limited Edition
                    </span>
                    
                    <h1 className="text-3xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
                        {slides[currentIndex].title}
                    </h1>
                    
                    <p className="mt-4 text-sm md:text-xl text-gray-200 max-w-lg drop-shadow-md">
                        {slides[currentIndex].desc}
                    </p>

                    <div className="flex gap-4 mt-8">
                        <Link
                            href="/category/bags"
                            className="bg-yellow-400 text-black px-8 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-yellow-500 transition-colors shadow-lg"
                        >
                            Shop Bags
                        </Link>
                        <Link
                            href="/new-arrivals"
                            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
                        >
                            Discover
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all md:block hidden"
            >
                <ChevronLeftIcon  />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full transition-all md:block hidden"
            >
                <ChevronRightIcon  />
            </button>

            {/* Indicators (Dots) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1.5 transition-all rounded-full ${currentIndex === i ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50'}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;