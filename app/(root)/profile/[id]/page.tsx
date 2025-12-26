
import { BoxIcon, LockIcon, MapPinIcon, CreditCardIcon, GiftIcon, StarIcon, ChevronRightIcon } from "@/components/shared/icons"
import { ROUTES } from '@/constants/routes';
import { ChevronRight, FilterIcon, Heart, UserCircleIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import FilterSidebar from '@/components/shared/FilterSidebar';
import MainCard from "@/components/cards/MainCard";
import { IProduct } from "@/models/product.model";
import { getRecentlyViewedProducts } from "@/actions/recommendations.actions";


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
        href: ROUTES.addresses
    },
    {
        icon: <CreditCardIcon />,
        title: 'Payment options',
        description: 'Edit or add payment methods',
        href: '#'
    },
    {
        icon: <Heart />,
        title: 'My Collection',
        description: 'View wishlist items, remove, or buy them',
        href: ROUTES.mywishlist
    },
    {
        icon: <UserCircleIcon />,
        title: 'Your Profiles',
        description: 'Manage your public profile and settings',
        href: ROUTES.profile("")
    },
];




const AccountCard: React.FC<AccountCardProps> = ({ icon, title, description, href }) => (
    <Link className="flex max-sm:items-center max-sm:justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm" href={href}>
<div  className="flex items-center ">
        <div className="shrink-0 text-gray-600 w-10 h-10">
            {icon}
        </div>
        <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
      <ChevronRight size={17} className="sm:hidden font-medium text-gray-700" />
    </Link>
    
);







const page = async() => {
     const res = await getRecentlyViewedProducts()
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                <h1 className="text-xl font-semibold mb-5">Your Account</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accountSections.map((section, index) => (
                        <AccountCard key={index} {...section} />
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between flex-wrap items-center mb-4">
                        <h2 className="text-xl font-semibold">Your Browsing History</h2>
                        <Link href={ROUTES.myBrowsingHistory} className="text-sm text-blue-600 max-sm:mt-3 hover:underline flex items-center">
                            View and manage your browsing history
                            <ChevronRightIcon />
                        </Link>
                    </div>
                   
                    {/* <FilterSidebar /> */}
                         <div className="flex  overflow-x-auto space-x-6 pb-4">
                         {res.data?.items.browsingHistory.map((item,index) => (
                             <Link
        key={item.product._id}
        href={`/product/${item.product._id}`}
        className="shrink-0 snap-start w-[140px]"
      >
        <div className="flex flex-col gap-2">
          
        
        
          <div className="h-[160px] w-full bg-gray-50 rounded-md flex items-center justify-center">
            <img
              src={item.product.thumbnail.url}
              alt={item.product.name}
              className="h-full object-contain"
              loading="lazy"
            />
          </div>

         
          <p className="text-sm text-gray-800 line-clamp-2 leading-snug">
            {item.product.name}
          </p>

       
          {item.product.basePrice && (
            <span className="text-sm font-semibold text-black">
              ${item.product.basePrice}
            </span>
          )}

          
          <span className="text-xs text-gray-500">
            Viewed recently
          </span>
        </div>
      </Link>
                        ))}
                    </div>
                  
                 
                    
                </div>

            </div>
             {/* <div className="lg:hidden fixed bottom-4 right-4 z-10">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg"
                    aria-label="Open filters"
                >
                    <FilterIcon />
                    <span>Filters</span>
                </button>
            </div>

          
            <div 
                className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
               
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}></div>
                
              
                <div className={`relative h-full bg-white w-80 shadow-xl transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-bold">Filter by</h2>
                        <button onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
                            <XIcon />
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto h-[calc(100%-65px)]">
                        <FilterSidebar />
                    </div>
                </div>
            </div> */}
       
        </div>
    );
};

export default page