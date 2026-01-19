"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { WriteReviewModal } from "../modals/ReviewModel"

const WriteReviewBtn = () => {
     const  [open,setOpen] = useState(false)
  return (
    <div>
           <Button onClick={()=> setOpen(true)}  type="button" className="px-3 py-1 rounded-md bg-white border
                                      border-gray-200 text-gray-700 text-sm hover:bg-gray-50">
                                       Write a product review
                                     </Button> 
                                     
                                     <WriteReviewModal 
                                     // @ts-ignore
                                      product={{}} 
                                      id="" open={open} setOpen={setOpen} />
                    
    </div>
  )
}

export default WriteReviewBtn