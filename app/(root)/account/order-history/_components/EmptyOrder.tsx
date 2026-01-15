"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link';

import React from 'react'
interface Props {
    name: string;
    desc: string;
    srcUrl:string;
    btnText: string;
   url:string
    alt: string;
}
const EmptyOrder = ({name,desc,srcUrl,alt,btnText,url}: Props) => {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-3'>
         <img src={srcUrl} alt={alt}  />
         <div className="flex flex-col justify-center items-center text-center">
             <h2 className="text-gray-800 font-bold text-lg">
                 {name}
             </h2>
             <p className="text-sm text-gray-500 font-medium ">
                 {desc}
             </p>
             <Button asChild className='mt-3 text-white h-[45px] bg-blue-primary uppercase font-bold text-base '  type="button">
                 <Link href={url}>{btnText}</Link>
             </Button>
         </div>
    </div>
  )
}

export default EmptyOrder