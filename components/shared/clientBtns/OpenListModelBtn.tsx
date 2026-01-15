"use client"
import { useState } from "react"
import { Plus } from "lucide-react"
import CreateListModal from "../modals/CreateListModal"

const OpenListModelBtn = () => {
    const [open,setOpen] = useState(false)
  return (
    <>
         <button onClick={()=> setOpen(true)} className="px-4 sm:block cursor-pointer hidden uppercase py-2 rounded-md bg-[#FF9900] hover:bg-[#e68800] text-white text-sm font-medium">
            Create new Wishlist
          </button>
          <button onClick={()=> setOpen(true)} className="bg-transparent cursor-pointer font-medium gap-1.5 text-blue-800 sm:hidden mr-2 flex items-center justify-center    ">
              <Plus size={16} className="text-blue-800  " /> Create
          </button>
         <CreateListModal open={open} setOpen={setOpen} />
    </>
  )
}

export default OpenListModelBtn