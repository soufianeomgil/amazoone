import { StarIcon } from "lucide-react";
import Link from "next/link";
interface BrowsingHistoryItem {
    id: number;
    name: string;
    thumbnail: {
        url: string;
        preview?:string;
        public_id?:string
    };
    basePrice: number;
    rating: number;
    reviewCount: number;
}
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
// LIST PAGE
export const MainCard: React.FC<BrowsingHistoryItem> = ({ name,id, thumbnail, basePrice, rating, reviewCount }) => (
    <div className="shrink-0  w-40 sm:w-48 text-left">
        <Link href="#">
            <img src={thumbnail.url} alt={name} className="w-full h-40 object-contain mb-2" />
        </Link>
        <Link href={`/product/${id}`} className="text-sm text-blue-600 hover:text-orange-700 hover:underline line-clamp-4">{name}</Link>
        <div className="flex items-center mt-1">
            {renderStars(rating)}
            <span className="text-sm text-blue-600 ml-1">{reviewCount.toLocaleString()}</span>
        </div>
        <p className="text-base font-bold text-red-700 mt-1">${basePrice.toFixed(2)}</p>
         <p className="text-[10px] font-medium text-gray-900">List Price: <span className=" line-through text-[12px] text-gray-900">${basePrice + 50}</span></p>
        <button className="w-full bg-yellow-300 hover:bg-yellow-400 text-black text-xs rounded-md py-1 mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Add to Cart
        </button>
    </div>
);
