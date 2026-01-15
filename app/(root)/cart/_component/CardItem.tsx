import AmazonPrice from '@/components/shared/AmazonPrice'
import { Button } from '@/components/ui/button'
import { ISaveForLaterDoc } from '@/models/saveForLater.model';
import { CheckCircle } from 'lucide-react'
import Image from 'next/image';
import React from 'react'

const CardItem = ({item, handleMoveToCart, handleRemove}: {item: ISaveForLaterDoc,handleMoveToCart: ()=> void,handleRemove:()=> void}) => {
  return (
    <div  className='bg-gray-50 px-3 py-3 sm:hidden flex flex-col rounded-lg'>
         <div className='flex items-start gap-2'>
          {/* //@ */}
             <Image width={150} height={150} className="w-[150px] object-contain"
              // @ts-ignore
              src={item?.variant?.images[0].url ?? "https://res.cloudinary.com/djadlnbfq/image/upload/v1766358063/cxiqi6dfkyznpza0aktc.webp"} alt="" />
             <div className="flex py-2 flex-col space-y-0.5">
                 <p className='line-clamp-2 font-semibold text-gray-800 text-sm'>
                     {item.snapshot?.title}
                 </p>
                 <p className='font-medium text-sm text-[#00afaa]'>1k+ bought in past month</p>
                 <AmazonPrice price={item?.snapshot?.price as number} />
                  <div className='flex items-center gap-2'>
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700 font-medium">In stock</span>
        </div>
             </div>
         </div>
         <div className='flex items-center space-x-2 '>
             <Button 
              type='button'
              onClick={handleRemove}
              className='rounded-full w-[120px] cursor-pointer border border-gray-500! '
               variant="outline"
               >Delete</Button>
             <Button 
              type='button'
              onClick={handleMoveToCart}
              className='w-[120px] cursor-pointer rounded-full border-gray-500! border'
              variant="outline"
              >Move to cart</Button>
         </div>
    </div>
  )
}

export default CardItem