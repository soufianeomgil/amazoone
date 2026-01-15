
import { IUser } from '@/models/user.model'
import { X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const EditProfileModel = ({open,setOpen,user}: {open:boolean, user: IUser ,setOpen: (v:boolean)=> void}) => {
  return (
    open &&
    <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setOpen(false)}
    />
        <div className="relative z-10 w-[350px]  overflow-hidden rounded-2xl bg-white shadow-xl">
             <div className="flex px-3 py-4 border-b border-gray-300 bg-gray-200 items-center justify-between">
                 <h3 className='font-bold text-black text-base '>Edit profile name</h3>
                 <div onClick={() => setOpen(false)} className='flex cursor-pointer w-[35px] h-[35px] items-center justify-center bg-gray-100 rounded-full '>
                   <X color='black' size={18} />
                 </div>
             </div>
             <div className=' py-4 px-5 items-center w-full justify-center flex flex-col'>
                 <form action="" className='w-full items-center justify-center flex flex-col space-y-5'>
                 

                    <div className='flex flex-col items-center justify-center space-y-2.5 border-b border-gray-200 pb-3 w-full'>
                       <Image width={70} height={70} className='w-[70px] h-[70px] rounded-full object-contain ' src={user.profilePictureUrl ?? "https://yt3.ggpht.com/MH9TWKPxjVZNjfGbZGLa9D71D-LVpTOPJbkh_abunMIfS6Mzqeh7M4c19eQdcp5i9dTQvIodUA=s48-c-k-c0x00ffffff-no-rj"} alt="" />
                       <button type="button" className='text-blue-700 font-medium text-sm cursor-pointer'>Change profile photo</button>
                    </div>
                
                  
                    <input  type="text" placeholder='john doe' className='bg-gray-100 
                    outline-none w-full px-3 text-sm font-normal text-gray-800 rounded-lg focus:border border-yellow-400 py-1.5 ' />
                    <div className='w-full mt-3.5 flex items-center justify-between'>
                       <button onClick={() => setOpen(false)} className='cursor-pointer text-gray-500 font-medium text-sm ' type='button'>Cancel</button>
                      <button  type="button" className="text-sm disabled:text-gray-400 disabled:bg-[#ffed94] disabled:border cursor-pointer disabled:border-orange-100 px-3 py-2 rounded-full bg-[#ffce12] text-gray-800">
                          Continue 
                      </button>
                    </div>
                 </form>
             </div>
        </div>
    </div>
  )
}

export default EditProfileModel