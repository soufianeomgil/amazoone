"use client"

import { useState } from "react"
import AddToListModal from "../modals/AddToListModel"
import { Plus } from "lucide-react"

const OpenListModelBtn = () => {
   // const [open,setOpen] = useState(true)
  return (
    <>
         <button  className="px-4 sm:block hidden py-2 rounded-md bg-[#FF9900] hover:bg-[#e68800] text-white text-sm font-medium">
            Create a List
          </button>
          <div className="w-[40px] sm:hidden mr-2 flex items-center justify-center h-[40px] rounded-full border border-gray-700 ">
              <Plus size={22} color="black" />
          </div>
          {/* <AddToListModal open={open}
           setOpen={setOpen}
          
             /> */}
    </>
  )
}

export default OpenListModelBtn