"use client"

import React, { useState } from "react"
import { Button } from "../ui/button"
import { ShoppingCart } from "lucide-react"
import QuantitySelector from "./QTY"
import { IProduct } from "@/models/product.model"

const FixedQTY = ({product}: {product: IProduct}) => {
    const [qty,setQty] = useState(1)
  return (
    <div className="sm:hidden fixed bottom-0 right-0 left-0 px-2 py-2 shadow items-center justify-between w-full flex bg-white ">
          <QuantitySelector  value={qty} min={1} max={product.totalStock} onChange={setQty} size="md" />
           <Button className='bg-[hsl(178,100%,34%)] text-white w-[180px] font-medium hover:opacity-80 cursor-pointer '>
                                <ShoppingCart /> Add to cart
                            </Button>
    </div>
  )
}

export default FixedQTY