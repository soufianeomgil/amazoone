"use client"
import AddressCard from '@/components/cards/AddressCard';
import { useCartItems, UserCartElement } from '@/hooks/use-cart';
import { gaEvent } from '@/lib/analytics/ga';
import { IVariant } from '@/models/product.model';
import React from 'react'
import CartItemComponent from './CartItem';
import Link from 'next/link';
import SoldWith from './SoldWith';
import CheckoutBox from './CheckoutBox';
import { Button } from '@/components/ui/button';
import { MoveToCartBtn } from '@/components/shared/clientBtns/MoveToCartBtn';
import EmptyOrder from '../../account/order-history/_components/EmptyOrder';
import { ISaveForLaterDoc } from '@/models/saveForLater.model';
import { IUser } from '@/models/user.model';
import { ImageState } from '@/types/actionTypes';
interface Props {
    userId: string;
    isAuthenticated: boolean;
    savedItems: ISaveForLaterDoc[] 
    userData: IUser | null | undefined
    data?: UserCartElement;
}
export interface cartItemsProps {
  _id: string,
  brand: string,
  name: string,
  imageUrl: ImageState,
  listPrice: number,
  basePrice: number,
  quantity: number,
  variant:IVariant | null
   stock: number,
   status: "ACTIVE" | "DRAFT" | "INACTIVE" | "OUT OF STOCK"
    variantId:string | null
}
const CartClient = ({userId,isAuthenticated,data,savedItems,userData}:Props) => {
 const cartItems: cartItemsProps[]  = useCartItems({isAuthenticated,data})
   const totalQty = cartItems?.reduce((acc:number, item:{quantity:number}) => acc + item.quantity, 0);
      console.log(cartItems, "CARTITEMS TEST")
    
      // UI-level booleans
      const hasCartItems = Array.isArray(cartItems) && cartItems.length > 0;
      //const hasSavedItems = Array.isArray(data?.items) && data.items.length > 0;
        const totalPriceNumber = cartItems.reduce((acc, it) => {
        const base = Number(it.basePrice ?? 0);
        const modifier = Number(it.variant?.priceModifier ?? 0);
        return acc + (base + modifier) * (it.quantity ?? 0);
      }, 0);
    gaEvent("view_cart", {
      currency: "MAD",
      value: totalPriceNumber,
      items: cartItems.map(item => ({
        item_id: item._id,
        item_name: item.name,
        price: item.basePrice
      }))
    });
  return (
       <div className={`${hasCartItems ? "" : "bg-white"} w-full bg-inherit`}>
 <div className="max-w-7xl overflow-hidden mx-auto sm:p-4">
      {hasCartItems ? (
        <>
          <h1 className="text-2xl max-sm:p-5 mb-7 font-semibold">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-6">
            {/* Left/main column */}
            <div className="lg:col-span-3 ">
              <div className="flex flex-col gap-6">
                {/* Address (only if user present) */}
                {userId && <AddressCard {...({ user: userData } as any)} />}

                {/* Cart items card */}
                <section className="bg-white p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-baseline pb-2">
                    <h2 className="text-lg font-bold">Products ({totalQty})</h2>
                  </div>

                  <hr className="my-3" />

                  <div className="space-y-4">
                    {cartItems.map((item: cartItemsProps,index) => (
                      <CartItemComponent
                        key={index}
                        userId={userData?._id}
                        item={item}
                      />
                    ))}
                  </div>
                </section>

                {/* Saved-for-later area */}
                {savedItems?.length && (
 <section className="bg-white  sm:p-4 shadow-sm">
                  {/* <h3 className="sm:text-xl text-lg font-bold pb-3">Your Items</h3> */}

                  <div className="flex flex-col gap-3 mt-1">
                    <div className="text-gray-900 font-bold px-4 pt-2
                 sm:text-lg text-base">
                      Saved for later ({savedItems?.length} items)
                    </div>

                    <div className="sm:border border-gray-200 sm:p-3 rounded">
                      {savedItems.length ? (
                        <div className="grid grid-cols-1  p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                          {/* MoveToCartBtn component expects data prop (client component) */}
                          <MoveToCartBtn data={savedItems} />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          You have no items saved for later.{" "}
                          <Link href="/" className="text-blue-600 hover:underline">
                            Continue shopping.
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                )}
                <SoldWith title="Frequently bought with items in your cart" />
              </div>
            </div>

            {/* Right/checkout column */}
            <aside className="lg:col-span-1 max-lg:mt-3 ">
              {/* sticky top-24 */}
              <div className=" space-y-4">
                {/* Desktop */}
                <div className="hidden lg:block">
                  <CheckoutBox user={userData ?? null} 
                    
                  data={cartItems} />
                </div>

                {/* Mobile */}
                <div className="lg:hidden">
                
                  <CheckoutBox user={userData ?? null} isMobile
                   
                   data={cartItems} />
                </div>

                {/* Optional: quick link to saved for later if cart empty but saved items exist */}
                {!hasCartItems && savedItems?.length && (
                  <div className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-semibold">Saved for later</h4>
                    <p className="text-sm text-gray-600">You can move saved items back to your cart.</p>
                    <Link href="/saved-for-later" className="mt-2 inline-block">
                      <Button variant="outline">View saved items</Button>
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </>
      ) : savedItems?.length ? (
        // No cart items but has saved items
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-bold">Your Amazon Cart is empty</h2>
            <p className="text-sm text-gray-700">
              Check your Saved for later items below or{" "}
              <Link href="/" className="text-blue-700 hover:underline">
                continue shopping.
              </Link>
            </p>
          </div>

          <div className="bg-white sm:p-4 rounded-md shadow-sm">
            <h3 className="sm:text-xl p-3 text-lg font-bold pb-3">Saved for later ({savedItems.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <MoveToCartBtn data={savedItems} />
            </div>
          </div>
        </div>
      ) : (
        // Nothing in cart and nothing saved
        <div className="py-10">
             <EmptyOrder 
          name="Your cart is empty"
          desc="Looks like you haven't added any items to your cart yet."
          btnText="Continue shopping"
          alt="empty cart state"
          url='/'
          srcUrl="/empty_cartV.png"
        />
        </div>
       
      )}
    
    </div>
    </div>
  )
}

export default CartClient