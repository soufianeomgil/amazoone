"use client"

import { IProduct, IVariant } from "@/models/product.model";
import { useSelector } from "react-redux";


export interface UserCartElement {
     qty:number;
     userCart: {
      items: [
        {
          productId: IProduct,
          quantity: number,
          variantId?: string;
          variant: IVariant
        },
      ],
     }
    
   
}
interface props {
    isAuthenticated:boolean;
    data?: UserCartElement | undefined
}
export const useCartItems = ({isAuthenticated,data}:props)=> {

     const {items} = useSelector((state: any) => (state?.cart ?? {})) as any
        const cartItems = isAuthenticated
        ? data?.userCart?.items?.map((item) => ({
            _id: item.productId._id,
            brand: item.productId.brand,
            name: item.productId.name,
            imageUrl: item.productId.thumbnail,
            basePrice: item.productId.basePrice,
            quantity: item.quantity,
            stock: item.productId.totalStock || item.productId.stock,
            variant: item.variant,
            variantId: item.variantId,
            status: item.productId.status
          })) ?? items
        : items;
    return cartItems
}
