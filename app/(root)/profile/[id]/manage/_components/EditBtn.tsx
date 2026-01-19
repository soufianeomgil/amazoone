"use client"
import EditProfileModel from '@/components/shared/modals/EditProfileModel'
import { IUser } from '@/models/user.model'

import { Pencil } from 'lucide-react'
import React, { useState } from 'react'

const EditBtn = ({user}: {user:IUser | null | undefined}) => {
    const [open,setOpen] = useState(false)
  return (
    <React.Fragment>
         <div className="flex gap-2.5 items-center">
       <p className="text-black font-medium text-lg">
         {user?.fullName}
       </p>
       <Pencil aria-label='Edit your details' className='cursor-pointer' onClick={()=> setOpen(true)} size={20} color='black' />
    </div>
     <EditProfileModel user={user as IUser} open={open} setOpen={setOpen} />
    </React.Fragment>
       
    
  )
}

export default EditBtn