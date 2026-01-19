import { getUserAddresses } from '@/actions/address.actions';
import RemoveAddressBtn from '@/components/shared/clientBtns/RemoveAddressBtn';
import ProfileItems from '@/components/shared/navbars/ProfileItems';
import RightSidebar from '@/components/shared/navbars/RightSidebar';

import { ROUTES } from '@/constants/routes';
import { ChevronRightIcon, PlusIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import EmptyOrder from '../order-history/_components/EmptyOrder';
import { auth } from '@/auth';
import Image from 'next/image';

interface BrowsingHistoryItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    rating: number;
    reviewCount: number;
}


const Addresses = async() => {
  const browsingHistoryItems: BrowsingHistoryItem[] = [
    {
        id: 1,
        name: 'Echo Dot (5th Gen, 2022 release) | Smart speaker with Alexa',
        imageUrl: 'https://m.media-amazon.com/images/I/81O6ark9UvL._AC_UL320_.jpg',
        price: 49.99,
        rating: 4.5,
        reviewCount: 13876,
    },
    {
        id: 2,
        name: 'Keurig K-Mini Coffee Maker, Single Serve K-Cup Pod Coffee Brewer',
        imageUrl: 'https://m.media-amazon.com/images/I/51SmxbR4QWL._AC_UL320_.jpg',
        price: 79.99,
        rating: 4,
        reviewCount: 89341,
    },
    {
        id: 3,
        name: 'Amazon Basics Lightweight Super Soft Easy Care Microfiber Bed Sheet Set',
        imageUrl: 'https://m.media-amazon.com/images/I/71Lp7UpChCL._AC_UL320_.jpg',
        price: 19.99,
        rating: 5,
        reviewCount: 412531,
    },
    {
        id: 4,
        name: 'Anker Portable Charger, 313 Power Bank (PowerCore Slim 10K)',
        imageUrl: 'https://m.media-amazon.com/images/I/71QjmBAjE7L._AC_UL320_.jpg',
        price: 21.99,
        rating: 4.5,
        reviewCount: 65432,
    },
    {
        id: 5,
        name: 'Logitech MX Master 3S - Wireless Performance Mouse with Ultra-Fast Scrolling',
        imageUrl: 'https://m.media-amazon.com/images/I/71oiOtOHqDL._AC_UL320_.jpg',
        price: 99.99,
        rating: 5,
        reviewCount: 9876,
    },
     {
        id: 6,
        name: 'SAMSUNG 32" Odyssey G32A FHD 1ms 165Hz Gaming Monitor',
        imageUrl: 'https://m.media-amazon.com/images/I/41NX3N+JpxL._AC_UL320_.jpg',
        price: 249.99,
        rating: 4,
        reviewCount: 1245,
    },
];
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
            <Image width={160} height={160} src={imageUrl} alt={name} className="w-full h-40 object-contain mb-2" />
        </Link>
        <Link href="#" className="text-sm text-blue-600 hover:text-orange-700 hover:underline line-clamp-4">{name}</Link>
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
const session = await auth()
    const result = await getUserAddresses({userId: session?.user.id as string})
     console.log(result, "ADDRESS RESULT")
    return (
        <div className="min-h-screen w-full bg-gray-50 lg:px-10 lg:py-8">
             <div className=" flex lg:flex-row flex-col  gap-5">
              <ProfileItems />
              <RightSidebar />
               <div className="flex-1 p-4 w-full lg:px-3">
                 {result.data?.addresses?.length! > 0 && (
 <h1 className="text-2xl flex items-center gap-1 md:text-3xl font-bold text-gray-800 mb-6">
           <Image width={22} height={22} src="/location.png" alt="location icon" className="w-[22px] object-contain " />  <span>Your Addresses</span>
        </h1>
                 )}
           
       {result.data?.addresses?.length! > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                    <Link href={ROUTES.addAddress} className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[200px] hover:bg-gray-50 cursor-pointer">
                    <PlusIcon className="h-10 w-10 text-gray-400" />
                    <span className="mt-2 text-xl font-medium text-gray-700">Add Address</span>
                </Link>
                
                

               
                { result.data?.addresses.map((address) => (
                    <div key={address._id} className="border border-gray-300 rounded-lg p-5 flex flex-col">
                        {address.isDefault && (
                            <div className="border-b border-gray-200 pb-2 mb-3">
                                <h3 className="font-bold text-sm">Default:</h3>
                            </div>
                        )}
                      <div className="grow space-y-1 text-sm text-gray-700">
  <p className="font-semibold text-base text-gray-900">{address.name}</p>

  <p className="leading-tight">{address.addressLine1}</p>

  {address.addressLine2 && (
    <p className="leading-tight">{address.addressLine2}</p>
  )}

  <p className="leading-tight">
    {address.city}, {address.zipCode}
  </p>

  <p className="leading-tight">
     {address.state && `• ${address.state}`}
  </p>

  <p className="text-gray-600">
    <span className="font-medium text-gray-800">Phone:</span> {address.phone}
  </p>

  {address.DeliveryInstructions && (
    <p className="italic text-gray-600 border-l-2 border-gray-300 pl-2">
      {address.DeliveryInstructions}
    </p>
  )}
</div>

                       <RemoveAddressBtn address={address} />
                    </div>
                ))}
            </div>
       ): (
         <EmptyOrder 
                     name='No saved addresses' 
                     desc='Add an address to get your orders delivered straight to your doorstep.'
                     alt="No address state"
                     srcUrl='/no_address.svg'
                     url="/account/addresses/add"
                     btnText="add new address"
                     
                     />
       )}
          
      
             
               </div>
 
        </div>
             <div className="mt-8  pt-6 border-t border-gray-200">
                <div className='max-w-7xl p-4 mx-auto'>
 <div className="flex justify-between flex-wrap items-center mb-4">
                        <h2 className="text-xl font-semibold">Your Browsing History</h2>
                        <Link href={ROUTES.myBrowsingHistory} className="text-sm text-blue-600 max-sm:mt-3 hover:underline flex items-center">
                            View and manage your browsing history
                            <ChevronRightIcon />
                        </Link>
                    </div>
                   
                   
                         <div className="flex  overflow-x-auto space-x-6 pb-4">
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

export default Addresses;