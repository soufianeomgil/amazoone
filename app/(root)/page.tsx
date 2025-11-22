

import { getAllProducts } from '@/actions/product.actions';
import Hero from '@/components/shared/Hero';
import ProductCard from '@/components/shared/ProductCard';
import ProductGrid from '@/components/shared/ProductGrid';
import Rating from '@/components/shared/Rating';
import StarRating from '@/components/shared/StarRating';
import { Star, StarIcon } from 'lucide-react';

import React from 'react';


const categoryData = [
    {
        title: 'Gaming accessories',
        images: [
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Headset_1x._SY116_CB667159060_.jpg', caption: 'Headsets' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Keyboard_1x._SY116_CB667159063_.jpg', caption: 'Keyboards' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Mouse_1x._SY116_CB667159063_.jpg', caption: 'Computer mice' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2021/June/Fuji_Quad_Chair_1x._SY116_CB667159060_.jpg', caption: 'Chairs' },
        ],
        link: 'See more'
    },
    {
        title: 'Shop deals in Fashion',
        images: [
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_BOTTOMS_1x._SY116_CB624172947_.jpg', caption: 'Jeans under $50' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_TOPS_1x._SY116_CB623353881_.jpg', caption: 'Tops under $25' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_DRESSES_1x._SY116_CB623353881_.jpg', caption: 'Dresses under $30' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AMAZON_FASHION/2022/SITE_FLIPS/SPR_22/GW/DQC/DQC_APR_TBYB_W_SHOES_1x._SY116_CB624172947_.jpg', caption: 'Shoes under $50' },
        ],
        link: 'See all deals'
    },
    {
        title: 'Refresh your space',
        images: [
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/launchpad/2023/Gateway/January/DesktopQuadCat_186x116_LP-HP_B08MYX5Q2W_01.23._SY116_CB619238430_.jpg', caption: 'Dining' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/launchpad/2023/Gateway/January/DesktopQuadCat_186x116_home_B08RCCP3HV_01.23._SY116_CB619238430_.jpg', caption: 'Home' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/launchpad/2023/Gateway/January/DesktopQuadCat_186x116_kitchen_B0126LMDFK_01.23._SY116_CB619238430_.jpg', caption: 'Kitchen' },
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/launchpad/2023/Gateway/January/DesktopQuadCat_186x116_health-beauty_B07662GN57_01.23._SY116_CB619238430_.jpg', caption: 'Health & Beauty' },
        ],
        link: 'Shop now'
    },
    {
        title: 'Electronics',
        images: [
            { src: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Dashboard/Fuji_Dash_TV_2X._SY304_CB432517900_.jpg', caption: '' },
        ],
        link: 'See more'
    },
];





const carouselData = {
    title: 'Deals Black Friday',
    products: [
        { src: 'https://cdnmm.azureedge.net/BAS1696605492095_img1.jpg', alt: 'Book 1' },
        { src: 'https://cdnmm.azureedge.net/3b868714-8125-4aa8-bf8e-7b9d130a34c7.jpg', alt: 'Book 2' },
        { src: 'https://cdnmm.azureedge.net/005cc979-082f-4e5b-855b-036c2b58734e.jpg', alt: 'Book 3' },
        { src: 'https://cdnmm.azureedge.net/AABOJ50540_img1.jpg', alt: 'Book 4' },
        { src: 'https://cdnmm.azureedge.net/AAABN35559_img1.jpg', alt: 'Book 5' },
        { src: 'https://cdnmm.azureedge.net/AAAMG34748_img1.jpg', alt: 'Book 6' },
        { src: 'https://cdnmm.azureedge.net/32aa5684-89df-4d88-bd64-4abb8246ce4c.jpg', alt: 'Book 7' },
        { src: 'https://cdnmm.azureedge.net/da7b81fb-7b38-49c1-bf78-5812c79fda8e.jpg', alt: 'Book 8' },
        { src: 'https://cdnmm.azureedge.net/70500cd9-6a64-491d-bbbd-e561ffd85872.jpg', alt: 'Book 9' },
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
    images: { src: string; caption: string }[];
    link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, images, link }) => {
    const isSingleImage = images.length === 1;
    return (
        <div className="bg-white p-4 h-full gap-3 flex flex-col">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div className={`grow grid ${isSingleImage ? 'grid-cols-1' : 'grid-cols-2'} gap-7 mb-4`}>
                {images.map((image, index) => (
                    <a href="#" key={index} className="hover:underline">
                        <img src={image.src} alt={image.caption || title} className="w-full h-full object-cover" />
                        {image.caption && <span className="text-xs mt-1">{image.caption}</span>}
                    </a>
                ))}
            </div>
            <a href="#" className="text-sm  text-blue-600 hover:text-orange-600 hover:underline">
                {link}
            </a>
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
    console.log(result.data?.products)
    return (
      <main>
          <Hero />
            <div className="relative -mt-40 md:-mt-48 lg:-mt-64">
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
                
                <ProductGrid products={result.data?.products || []} />
                  <div className="mt-6">
                    <ProductCarousel {...itemsUnder50} />
                </div>
            </div>
        </div>
       
      </main>
      
    );
};

export default Home;