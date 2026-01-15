"use client"
import CreateListModal from '@/components/shared/modals/CreateListModal'
import React, { useState } from 'react'

const EmptyWishlist = () => {
  const [open,setOpen] = useState(false)
  return (
    <div className='flex flex-col space-y-2.5 items-center justify-center'>
      <video
  autoPlay
  muted
  loop   

 src="https://f.nooncdn.com/s/app/com/noon/images/wishlist-empty-desktop.mp4"
    type="video/mp4"
 playsInline
  preload="auto"
  className="w-[300px] h-[300px] object-contain pointer-events-none"
/>

       <div className="flex flex-col text-center items-center gap-2.5 justify-center">
           <h2 className='font-bold text-gray-700 text-xl'>Ready to make a wish?</h2>
           <p className='text-sm text-gray-500'>Start adding items you love to your wishlist by tapping on the heart icon</p>
       </div>
        <button onClick={()=> setOpen(true)} className="px-4 sm:hidden cursor-pointer mb-5 uppercase py-2 rounded-md bg-[#FF9900] hover:bg-[#e68800] text-white text-sm font-medium">
            Create new Wishlist
          </button>
          <CreateListModal open={open} setOpen={setOpen} />
    </div>
  )
}

export default EmptyWishlist