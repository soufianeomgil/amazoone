"use client"
import { IProduct } from '@/models/product.model'
import { IUser } from '@/types/actionTypes'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Minus, Plus, ShoppingBag, ShoppingCart } from 'lucide-react'
import { ModePaiment } from './ModePaiment'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { addItemAsync } from '@/lib/store/cartSlice'
import { Spinner } from '../ui/spinner'
import FixedQTY from './FixedQTY'
import AddToListButton from './clientBtns/ListBtn'
import { ISavedList } from '@/models/savedList.model'

const BuyPanel = ({product,data}: {product: IProduct, data:ISavedList[]}) => {
  const items = [
     {
       img: "https://www.marjanemall.ma/images/auth-white.png",
       name: `Produits 100% authentiques`
     },
      {
       img: "https://www.marjanemall.ma/images/return-white.png",
       name: "Satisfait ou remboursé"
     },
      {
       img: "https://www.marjanemall.ma/images/morocco-white.png",
       name: "Livraison partout au Maroc"
     },
      {
       img: "https://www.marjanemall.ma/images/globe-white.png",
       name: "Offre nationale et internationale"
     },
  ]
    const variants = product?.variants ?? [];

  const selectedVariantIndex = useSelector(
    (state: RootState) => state.product.selectedVariant[product?._id as string]
  );
  const selectedVariant = product?.variants?.[selectedVariantIndex ?? 0] || null;

  const defaultStock = variants.length ? variants[0].stock ?? 0 : product?.stock ?? 0;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentVariantStock = defaultStock;
  const dispatch = useDispatch();
  const router = useRouter();
    const handleAddToCart = async () => {
      try {
        setLoading(true);
  
        const variant = selectedVariant ?? null;
  
        const payload = {
          productId: product?._id as string,
          brand: product?.brand as string,
          name: product?.name as string,
          imageUrl: product?.thumbnail ?? { url: product?.images?.[0]?.url ?? "" },
          basePrice: product?.basePrice as number,
          quantity: quantity,
          _id: `${product?._id ?? ""}:${variant?.sku ?? ""}`,
          variantId: variant?.sku ?? undefined,
          variant: variant ?? undefined,
        };
  
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await dispatch(addItemAsync(payload) as any);
        router.refresh?.();
      } catch (err) {
        console.error("Add to cart failed:", err);
      } finally {
        setLoading(false);
      }
    };
  return (
    <>
 <div className='bg-white lg:grid hidden shadow-2xl h-fit rounded-lg py-3 lg:col-span-3 '> 
       <div className="flex flex-col items-center justify-center gap-3">
            <h4 className='font-bold text-xl  text-[hsl(178,100%,34%)] '>
                £ {product.basePrice}
            </h4>
            <div className='flex px-2 border-b mx-auto pb-3 text-center justify-center w-full border-gray-300 items-center gap-3'>
    
                 <p className='line-through font-medium text-sm text-gray-500 '>
                   £ 58.00
                 </p>
                  <div className='rounded-md  bg-[rgb(212,0,84)] font-medium text-xs py-1 text-white px-3 '>
                      -19%
                  </div>
            </div>
            <div className='border-b  px-2 pb-3 border-gray-300 flex w-full gap-3 flex-col'>
                   <div className='flex  justify-between w-full  items-center gap-3'>
          
                 <p className='text-gray-800 font-bold text-sm '>
                   Livraison à domicile
                 </p>
                  <p className='underline text-[hsl(178,100%,34%)] font-medium text-xs '>
                      <Link href={"/"}>
                         Details
                      </Link>
                  </p>
            </div>
            <div className='flex  justify-between w-full  items-center gap-3'>
          
                 <p className='text-gray-800 text-xs font-light '>
                   Frais de livraison
                 </p>
                  <p className='text-gray-700 font-medium text-xs '>
                       £ 15.00
                  </p>
            </div>
            </div>
                <div className='flex  px-2 mx-auto pb-3 text-center
                  justify-center flex-col w-full border-gray-300 items-center gap-3'>
    
                    <div className="flex items-center space-x-2">
                      <button
                        aria-label="Decrease quantity"
                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                       
                      >
                        <Minus className="w-4 h-4"  />
                      </button>
                
                      <span
                        className="px-3 py-1 border border-gray-300 rounded min-w-12 text-center text-sm"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {quantity}
                      </span>
                
                      <button
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(Math.min(currentVariantStock, quantity + 1))}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  <Button onClick={handleAddToCart} className='bg-[hsl(178,100%,34%)] w-full text-white font-medium hover:opacity-80 cursor-pointer '>
                     {loading ? <Spinner /> : <><ShoppingCart /> Add to cart</>}  
                  </Button>
                  <AddToListButton product={product} data={data} />
            </div>
            <div className="
             ">
              <ModePaiment isMobile={false} />
             </div>
             <div className='bg-[hsl(178,100%,34%)] grid grid-cols-2 gap-5 w-[95%] p-3 rounded-lg mx-auto '>
                 {items.map((item,index) => (
                    <div className='items-center flex gap-2 text-white' key={index}>
                       <img className='w-[25px] object-contain ' src={item.img} alt="" />
                          <p className='text-xs font-medium  '>
                             {item.name}
                          </p>
                         
                    </div>
                 ))}
             </div>
             
       </div>
       
    </div>
     <FixedQTY pending={loading} handleAddToCart={handleAddToCart} product={product} />
    </>
   
  )
}

export default BuyPanel