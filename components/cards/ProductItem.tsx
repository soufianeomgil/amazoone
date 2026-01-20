import { IProduct } from "@/models/product.model";
import Image from "next/image";
import Link from "next/link";



interface ProductItemProps {
  product: IProduct;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const [whole, decimal] = product.basePrice.toFixed(2).split('.');

  return (
    <Link href={`/product/${product._id}`} className="flex gap-4 py-3 group cursor-pointer border-b border-gray-100 last:border-0 md:border-0 hover:bg-gray-50 transition-colors duration-200">
      <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
        <Image 
         loading="lazy" 
         width={96}
         height={96}
          src={product.thumbnail.url || ""} 
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex flex-col grow">
        <h3 className="text-gray-800 text-[15px] font-medium leading-tight line-clamp-2 mb-1">
          {product.name}
        </h3>
        
        <div className="flex items-baseline gap-1">
          <span className="text-gray-900 text-sm font-bold align-top mt-0.5">$</span>
          <span className="text-gray-900 text-xl font-bold">{whole}</span>
          <span className="text-gray-900 text-xs font-bold align-top mt-0.5">{decimal}</span>
          
         
            <div className="ml-2  flex items-center gap-1 text-[13px] text-gray-500">
              <span>ListPrice:</span>
              <span className="line-through">${product.listPrice.toFixed(2)}</span>
            </div>
        
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;