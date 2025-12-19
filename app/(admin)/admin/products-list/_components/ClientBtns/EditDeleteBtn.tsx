"use client"

import { softDeleteProduct } from "@/actions/product.actions"
import { TrashIcon } from "@/components/shared/icons"
import { PencilIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const EditDeleteBtn = ({id}: {id:string}) => {
    const [loading,setLoading] = useState(false)
    const handleSoftDeleteProduct = async()=> {
        setLoading(true)
        try {
          const {error,success} =   await softDeleteProduct({productId:id})
          if(error) {
             toast.error(error.message)
             return
          }else if(success) {
             toast.success("product has been deleted (soft way)")
             return
          }
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
        }
    }
    // add some loading spinner UI
  return (
   <div className="flex items-center justify-end space-x-4">
      <button className="text-gray-400 hover:text-blue-600"><PencilIcon /></button>
      <button 
          onClick={handleSoftDeleteProduct}
          type="button"
          className="text-gray-400 cursor-pointer hover:text-red-600"><TrashIcon />
      </button>
   </div>
  )
}

export default EditDeleteBtn