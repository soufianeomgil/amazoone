
import { getAllProducts } from '@/actions/product.actions';
import Hero from '@/components/shared/Hero';

import ProductGrid from '@/components/shared/ProductGrid';
import Rating from '@/components/shared/Rating';
import StarRating from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { IProduct } from '@/models/product.model';
import { Star, StarIcon } from 'lucide-react';
import Link from 'next/link';

import React from 'react';
// best sellers in school and work bags
// bags under 50
// best sellers in sport bags
// best sellers in class bags
// popular bags
// new arrivals
// trendy bags

const categoryData = [
    {
        title: 'suitcases',
        images: [
            { src: 'https://m.media-amazon.com/images/I/812UbW2uIEL._AC_SY300_SX300_QL70_FMwebp_.jpg', caption: 'Kamiliant' },
            { src: 'https://m.media-amazon.com/images/I/81XYZqOoIPL._AC_SY300_SX300_QL70_FMwebp_.jpg', caption: 'suitcase 3P' },
            { src: 'https://m.media-amazon.com/images/I/71fLAk1Z54L._AC_UL320_.jpg', caption: 'Computer mice' },
            { src: 'https://m.media-amazon.com/images/I/71gEAnu3CpL._AC_UL320_.jpg', caption: 'Chairs' },
        ],
         slug: "suitcases",
        link: 'See more'
    },
    {
        title: 'Luxury Bags',
        images: [
            { src: 'https://m.media-amazon.com/images/I/71MvaBpX3LL._AC_UL320_.jpg', caption: 'Gucci' },
            { src: 'https://m.media-amazon.com/images/I/71sFoHs+0aL._AC_UL320_.jpg', caption: 'David jones' },
            { src: 'https://m.media-amazon.com/images/I/5172ZZ8z6OL._AC_UL320_.jpg', caption: 'Lanchamp paris' },
            { src: 'https://images-na.ssl-images-amazon.com/images/I/71aSmObQ36L._AC_UL165_SR165,165_.jpg', caption: 'channel' },
        ],
         slug: "bags",
        link: 'See all deals'
    },
    {
        title: 'Carry bags',
        images: [
            { src: 'https://m.media-amazon.com/images/I/81iYGCfF0GL._AC_UY1100_.jpg', caption: 'LV carry bag' },
            {src: "https://m.media-amazon.com/images/I/41F17fItByL._SY300_SX300_QL70_FMwebp_.jpg", caption:""},
            { src: 'https://m.media-amazon.com/images/I/41QKIdcp0jL._SY300_SX300_QL70_FMwebp_.jpg', caption: 'Home' },
            { src: 'https://m.media-amazon.com/images/I/41apOpMpC9S._SY300_SX300_QL70_FMwebp_.jpg', caption: 'Kitchen' },
          //  { src: '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', caption: 'Health & Beauty' },
        ],
         slug: "carry bags",
        link: 'Shop now'
    },
    {
        title: 'footwear',
        images: [
            { src: 'https://m.media-amazon.com/images/I/71h3FJ5p0AL._AC_UL320_.jpg', caption: 'Sneakers' },
             { src: 'https://m.media-amazon.com/images/I/81nI-xxEKML._AC_UL320_.jpg', caption: 'Soft slippers' },
              { src: 'https://m.media-amazon.com/images/I/81FmthaCwpL._AC_UL320_.jpg', caption: '' },
               { src: 'https://m.media-amazon.com/images/I/61lMtobvwXL._AC_UL320_.jpg', caption: 'high heels' },
        ],
        slug: "footwear",
        link: 'See more'
    },
];





const carouselData = {
    title: 'Deals Black Friday',
    products: [
        { src: 'https://m.media-amazon.com/images/I/61UUnJgoW-L._AC_UL320_.jpg', alt: 'Book 1' },
        { src: 'https://m.media-amazon.com/images/I/712jQf0vWXL._AC_UL320_.jpg', alt: 'Book 2' },
        { src: 'https://m.media-amazon.com/images/I/611tmKjLZgL._AC_UL320_.jpg', alt: 'Book 3' },
        { src: 'https://m.media-amazon.com/images/I/61JPv8lRdvL._AC_UL320_.jpg', alt: 'Book 4' },
        { src: 'https://m.media-amazon.com/images/I/81GrqOqeX7L._AC_UL320_.jpg', alt: 'Book 5' },
        { src: 'https://m.media-amazon.com/images/I/51wQ6xI6USL._AC_UL320_.jpg', alt: 'Book 6' },
        { src: 'https://cdnmm.azureedge.net/32aa5684-89df-4d88-bd64-4abb8246ce4c.jpg', alt: 'Book 7' },
        { src: 'https://images.ctfassets.net/brzb6u29244a/6mdlGKjDEFgjaqvibTZV1R/0f9aff60d5f29936483cd20760c22c59/LandscapeXL_Gucci-GIFT-GIVING-NOV25-Set-2-19-0669-B_001_Default.png?w=720&fm=avif&q=50', alt: 'Book 8' },
        { src: 'https://images.ctfassets.net/brzb6u29244a/24Nu2y4UTDY8yFd1lnmOXd/2a8186119726bf0d41d050dd6b168717/LandscapeXL_Gucci-GIFT-GIVING-NOV25-Set-1-26-1220_001_Default.png?w=720&fm=avif&q=50', alt: 'Book 9' },
        { src: 'https://cdnmm.azureedge.net/54ca1a33-5391-4fe1-8400-cef0cb9b213e.jpg', alt: 'Book 10' },
    ]
}
const itemsUnder50 = {
    title: 'Items under $50',
    products: [
        { src: 'https://m.media-amazon.com/images/I/619aUX88NiL._AC_UL320_.jpg', alt: 'Book 1' },
        { src: 'https://m.media-amazon.com/images/I/71N+ScLZcGL._AC_UL320_.jpg', alt: 'Book 2' },
        { src: 'https://m.media-amazon.com/images/I/51TbyX38TTL._AC_UL320_.jpg', alt: 'Book 3' },
        { src: 'https://m.media-amazon.com/images/I/71itdHYNYOL._AC_UL320_.jpg', alt: 'Book 4' },
        { src: 'https://m.media-amazon.com/images/I/71xj1Z47jdL._AC_UL320_.jpg', alt: 'Book 5' },
        { src: 'https://m.media-amazon.com/images/I/81zTIY78joL._AC_UL320_.jpg', alt: 'Book 6' },
        { src: 'https://m.media-amazon.com/images/I/71iJLv43yIL._AC_UL320_.jpg', alt: 'Book 7' },
        { src: 'https://m.media-amazon.com/images/I/71sP8iAUs7L._AC_UL320_.jpg', alt: 'Book 8' },
        { src: 'https://m.media-amazon.com/images/I/41q03EeMf3L._AC_UL320_.jpg', alt: 'Book 9' },
        { src: 'https://m.media-amazon.com/images/I/71fJS967sVL._AC_UL320_.jpg', alt: 'Book 10' },
    ]
}


interface CategoryCardProps {
    title: string;
    slug: string;
    images: { src: string; caption: string }[];
    link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, images, link, slug }) => {
    const isSingleImage = images.length === 1;
    return (
        <div className="bg-white p-4 h-full gap-3 flex flex-col">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div className={`grow grid ${isSingleImage ? 'grid-cols-1' : 'grid-cols-2'} gap-7 mb-4`}>
                {images.map((image, index) => (
                    <Link href="#" key={index} className="hover:underline">
                        <img src={image.src} alt={image.caption || title} className="w-full h-full object-contain" />
                        {image.caption && <Badge className="text-xs bg-gray-100 mt-1">{image.caption}</Badge>}
                    </Link>
                ))}
            </div>
            <Link href={`/category/${slug}`} className="text-sm  text-blue-600 hover:text-orange-600 hover:underline">
                {link}
            </Link>
        </div>
    );
};

interface ProductCarouselProps {
    title: string;
    products: { src: string; alt: string }[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, products }) => {
    return (
     
        <div className="bg-white p-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div className="flex overflow-x-auto space-x-4 p-2 -m-2">
                {products.map((product, index) => (
                    <a href="#" key={index} className="shrink-0">
                        <img src={product.src} alt={product.alt} className="h-48 object-contain" />
                    </a>
                ))}
            </div>
        </div>
      
    );
};


const Home = async () => {
    const result = await getAllProducts()
    console.log(result, "products")
    return (
      <main>
          <Hero />
            <div className="relative -mt-25 sm:mt-40 md:-mt-48 lg:-mt-64">
             <div 
                className="h-60 md:h-96 bg-cover bg-center" 
                style={{ backgroundImage: "url('https://m.media-amazon.com/images/I/61GfW-kfbFL._SX3000_.jpg')" }}
            >
                <div className="h-full bg-linear-to-t from-gray-200"></div>
            </div>

            <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryData.map((category, index) => (
                        <CategoryCard key={index} {...category} />
                    ))}
                </div>

                <div className="mt-6">
                    <ProductCarousel {...carouselData} />
                </div>
                
                <ProductGrid
                // @ts-ignore
                 products={result.data?.products ?? []} />
                  <div className="mt-6">
                    <ProductCarousel {...itemsUnder50} />
                </div>
            </div>
        </div>
       
      </main>
      
    );
};

export default Home;