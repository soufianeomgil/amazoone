"use client"

import { Button } from "@/components/ui/button"
import AddReviewModal from "../modals/AddReviewModal"
import { useState } from "react"

const WriteReviewBtn = () => {
     const  [open,setOpen] = useState(false)
  return (
    <div>
           <Button onClick={()=> setOpen(true)}  type="button" className="px-3 py-1 rounded-md bg-white border
                                      border-gray-200 text-gray-700 text-sm hover:bg-gray-50">
                                       Write a product review
                                     </Button>
                     <AddReviewModal  open={open} productId={"690e64262942120edd24eb0c"} onClose={()=>  setOpen(false)} />
    </div>
  )
}

export default WriteReviewBtn