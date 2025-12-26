"use client"
import { moveSavedItemToCart, removeFromSaveForLater } from '@/actions/saveForLater.actions'
import CardItem from '@/app/(root)/cart/_component/CardItem'
import { Button } from '@/components/ui/button'
import { ISaveForLaterDoc } from '@/models/saveForLater.model'
import Link from 'next/link'

import React from 'react'
interface props {  
    items: ISaveForLaterDoc[];
}
export const MoveToCartBtn = ({data}: {data: props}) => {
 

    const MoveToCartHandler = async(id:string)=> {
         alert(id)
      
        try {
          const {error, data, success} =   await moveSavedItemToCart({id: String(id)})
          if(error) {
            alert(error.message)
          }else {
            alert("let's go")
          }
        } catch (error) {
            console.log(error)
        }
    }
      const removeFromSaveHandler = async(id:string)=> {
        
      
        try {
          const {error, data, success} =   await removeFromSaveForLater({id: id})
          if(error) {
            alert(error.message)
          }else {
            alert("let's go")
          }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <>
         {data?.items?.map((item,index) => (
                         <React.Fragment key={index}>
<div className='sm:flex  hidden flex-col border border-gray-300 p-2.5 gap-2.5' >

                                        <div className='w-full  flex items-center justify-center '>
                                             <img  className='w-[200px] object-contain h-[200px] ' src={item?.variant?.images?.[0]?.url} alt="product name" />
                                        </div>
                                        <article>
                                             <Link href={`/product/${(item.productId as any)._id}`} className='line-clamp-2 hover:text-blue-600 hover:underline text-gray-800 text-sm font-medium '>
                                                 {item.snapshot?.title}
                                             </Link>
                                             <span className="text-xs font-normal text-gray-800">100+ bought in past month</span>
                                             <p className="text-xs font-normal text-green-800">InStock</p>
                                            {item.variant &&  <p className='text-gray-900 font-bold text-xs mt-1.5 '>Color: <span className='text-gray-700 font-normal '> {item.variant.attributes[0].value} </span></p>} 
                                              <p className='text-gray-900 font-bold text-xs mt-1.5 '>Price: <span className='text-gray-700 font-normal '> ${item?.snapshot?.price} </span></p>
                                               <Button onClick={() => MoveToCartHandler(item?._id as string)} type='button' className="border mt-2.5 cursor-pointer bg-transparent hover:bg-gray-100 text-gray-700 font-medium text-sm border-gray-500 rounded-full w-full">
                                                          Move to cart 
                                                      </Button>
                                                      <div  className='flex flex-col mt-3 gap-1.5'>
                                                              <button onClick={() => removeFromSaveHandler(item?._id as string)} type='button' className="  cursor-pointer  w-fit bg-transparent hover:underline text-blue-600 font-medium text-xs ">
                                                          Delete
                                                      </button>
                                                       <button type='button' className="  cursor-pointer w-fit bg-transparent hover:underline text-blue-600 font-medium text-xs ">
                                                          Add to list
                                                      </button>
                                                      
                                                      </div>
                                        </article>
                                   </div>
                                  <CardItem 
                                   handleMoveToCart={() => MoveToCartHandler(item?._id as string)}
                                   handleRemove={() => removeFromSaveHandler(item?._id as string)}
                                    item={item} />
                                 
                         </React.Fragment>
                                   
                                 ))}
    </>
  )
}


