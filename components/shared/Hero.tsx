"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const slides = [
    { url: 'https://m.media-amazon.com/images/I/71U-Q+N7PXL._SX3000_.jpg' },
    { url: 'https://m.media-amazon.com/images/I/61zAjw4bqPL._SX3000_.jpg' },
    { url: 'https://m.media-amazon.com/images/I/71cp9PVuTfL._SX3000_.jpg' },
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
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, [nextSlide]);


    return (
        <section className="relative h-56 md:h-[600px] w-full -mt-1 group z-0">
            <div className="w-full h-full overflow-hidden">
                 <div
                    className="w-full h-full flex transition-transform ease-in-out duration-700"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, slideIndex) => (
                         <img
                            key={slideIndex}
                            src={slide.url as string}
                            alt={`Promotional banner ${slideIndex + 1}`}
                            className="w-full h-full object-cover shrink-0"
                        />
                    ))}
                </div>
            </div>
             <div className="absolute inset-0 bg-linear-to-t from-gray-200 via-transparent to-transparent"></div>

            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[35%] -translate-y-1/2 left-5 text-2xl rounded-md p-2 bg-white/60 text-gray-800 cursor-pointer shadow-md hover:bg-white">
                <ChevronLeftIcon onClick={prevSlide} />
            </div>
            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[35%] -translate-y-1/2 right-5 text-2xl rounded-md p-2 bg-white/60 text-gray-800 cursor-pointer shadow-md hover:bg-white">
                <ChevronRightIcon onClick={nextSlide} />
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex justify-center space-x-2">
                {slides.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`cursor-pointer h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                    ></div>
                ))}
            </div>
        </section>
    );
};

export default Hero;