import React from 'react';
import { BoxIcon, LockIcon, MapPinIcon, CreditCardIcon, GiftIcon, StarIcon, ChevronRightIcon } from "@/components/shared/icons"
import { ROUTES } from '@/constants/routes';
import { UserCircleIcon } from 'lucide-react';
import Link from 'next/link';

interface AccountCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
}

const accountSections: AccountCardProps[] = [
    {
        icon: <BoxIcon />,
        title: 'Your Orders',
        description: 'Track, return, or buy things again',
        href: ROUTES.myorders, 
    },
    {
        icon: <LockIcon />,
        title: 'Login & security',
        description: 'Edit login, name, and mobile number',
        href: '#'
    },
    {
        icon: <MapPinIcon />,
        title: 'Your Addresses',
        description: 'Edit addresses for orders and gifts',
        href: '#'
    },
    {
        icon: <CreditCardIcon />,
        title: 'Payment options',
        description: 'Edit or add payment methods',
        href: '#'
    },
    {
        icon: <GiftIcon />,
        title: 'Gift cards',
        description: 'View balance, redeem, or reload cards',
        href: '#'
    },
    {
        icon: <UserCircleIcon />,
        title: 'Your Profiles',
        description: 'Manage your public profile and settings',
        href: '#'
    },
];

interface BrowsingHistoryItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    rating: number;
    reviewCount: number;
}

const browsingHistoryItems: BrowsingHistoryItem[] = [
    {
        id: 1,
        name: 'Echo Dot (5th Gen, 2022 release) | Smart speaker with Alexa',
        imageUrl: 'https://m.media-amazon.com/images/I/51u2wA8F3EL._AC_UY327_FMwebp_QL65_.jpg',
        price: 49.99,
        rating: 4.5,
        reviewCount: 13876,
    },
    {
        id: 2,
        name: 'Keurig K-Mini Coffee Maker, Single Serve K-Cup Pod Coffee Brewer',
        imageUrl: 'https://m.media-amazon.com/images/I/612bB68I5PL._AC_UY327_FMwebp_QL65_.jpg',
        price: 79.99,
        rating: 4,
        reviewCount: 89341,
    },
    {
        id: 3,
        name: 'Amazon Basics Lightweight Super Soft Easy Care Microfiber Bed Sheet Set',
        imageUrl: 'https://m.media-amazon.com/images/I/71R21-82+wL._AC_UY327_FMwebp_QL65_.jpg',
        price: 19.99,
        rating: 5,
        reviewCount: 412531,
    },
    {
        id: 4,
        name: 'Anker Portable Charger, 313 Power Bank (PowerCore Slim 10K)',
        imageUrl: 'https://m.media-amazon.com/images/I/51b-21LpGfL._AC_UY327_FMwebp_QL65_.jpg',
        price: 21.99,
        rating: 4.5,
        reviewCount: 65432,
    },
    {
        id: 5,
        name: 'Logitech MX Master 3S - Wireless Performance Mouse with Ultra-Fast Scrolling',
        imageUrl: 'https://m.media-amazon.com/images/I/61-5-d1sKQL._AC_UY327_FMwebp_QL65_.jpg',
        price: 99.99,
        rating: 5,
        reviewCount: 9876,
    },
     {
        id: 6,
        name: 'SAMSUNG 32" Odyssey G32A FHD 1ms 165Hz Gaming Monitor',
        imageUrl: 'https://m.media-amazon.com/images/I/81xItlVqxPL._AC_UY327_FMwebp_QL65_.jpg',
        price: 249.99,
        rating: 4,
        reviewCount: 1245,
    },
];


const AccountCard: React.FC<AccountCardProps> = ({ icon, title, description, href }) => (
    <a href={href} className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
        <div className="flex-shrink-0 text-gray-600 w-10 h-10">
            {icon}
        </div>
        <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </a>
);

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(<StarIcon key={i} className="text-yellow-500 h-4 w-4" />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            // This logic can be expanded for half-stars if needed
            stars.push(<StarIcon key={i} className="text-yellow-500 h-4 w-4" />);
        } else {
            stars.push(<StarIcon key={i} className="text-gray-300 h-4 w-4" />);
        }
    }
    return stars;
};


const BrowsingHistoryCard: React.FC<BrowsingHistoryItem> = ({ name, imageUrl, price, rating, reviewCount }) => (
    <div className="flex-shrink-0 w-48 text-left">
        <Link href="#">
            <img src={imageUrl} alt={name} className="w-full h-40 object-contain mb-2" />
        </Link>
        <Link href="#" className="text-sm text-blue-600 hover:text-orange-700 hover:underline line-clamp-2">{name}</Link>
        <div className="flex items-center mt-1">
            {renderStars(rating)}
            <span className="text-sm text-blue-600 ml-1">{reviewCount.toLocaleString()}</span>
        </div>
        <p className="text-base font-bold text-red-700 mt-1">${price.toFixed(2)}</p>
        <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-black text-xs rounded-md py-1 mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Add to Cart
        </button>
    </div>
);


const Profile: React.FC = () => {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                <h1 className="text-3xl font-normal mb-6">Your Account</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accountSections.map((section, index) => (
                        <AccountCard key={index} {...section} />
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Your Browsing History</h2>
                        <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                            View and manage your browsing history
                            <ChevronRightIcon />
                        </Link>
                    </div>
                    <div className="flex overflow-x-auto space-x-6 pb-4">
                         {browsingHistoryItems.map(item => (
                            <BrowsingHistoryCard key={item.id} {...item} />
                        ))}
                    </div>
                     <div className="text-right mt-2">
                        <Link href="#" className="text-sm text-blue-600 hover:underline">Turn Browsing History on/off</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;