"use client"

import { PencilIcon } from "lucide-react"
import { AddressModal } from "../modals/AddressModal"
import { useState } from "react"
import { IAddress } from "@/models/address.model"

const EditAddressBtn = ({data}: {
  data: IAddress[] |  []
}) => {
    const [open,setOpen] = useState(false)
  return (
    <div>
         <PencilIcon onClick={()=> setOpen(true)} color='#FEBD69' cursor="pointer" className='w-[22px] '  />
         <AddressModal data={data} open={open} setOpen={setOpen} />
    </div>
  )
}

export default EditAddressBtn