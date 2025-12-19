import { ChevronDown } from 'lucide-react';
import React from 'react'

const ProfileStatementCard = ({title,desc}: {title:string;desc:string}) => {
  return (
    <div className='flex items-center px-4 py-3 rounded-lg justify-between bg-[#f7fafa] border border-[#d5d9d9] '>
 <div className='  flex sm:flex-row flex-col  sm:items-center gap-1 sm:gap-2.5  '>
        <h3 className="text-black sm:text-2xl text-lg font-medium">
             {title}
        </h3>
        <span className='font-medium max-sm:hidden text-lg text-black '>|</span>
        <p className='text-gray-700 text-sm sm:text-base font-normal'>
            {desc}
        </p>
    </div>
    <ChevronDown size={22} className='text-gray-700 sm:hidden font-bold' />
    </div>
   
  )
}

export default ProfileStatementCard