
import { features } from '@/constants/routes'
import React from 'react'

const Features = () => {
  return (
     <div className="rounded-lg border border-gray-300   bg-white lg:py-7 py-3 lg:px-5
      px-3 flex max-lg:justify-between flex-col  space-y-3 ">
                  {
                    features.map((item,index) => (
                        <div key={index} className={` max-lg:${!item.show && "hidden"}  flex flex-row     items-center gap-2`}>
                            <div className='rounded-full w-[45px] h-[45px] bg-[#131921] flex items-center justify-center '>
                               <item.icon className='object-contain' size={20}  color="yellow" />
                            </div>
                           
                            <p className='text-gray-700 max-sm:black text-[15px] font-semibold leading-4 text-left '>{item.title} </p>
                        </div>
                    ))
                  }
             </div>
  )
}

export default Features