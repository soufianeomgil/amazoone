"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Session } from "next-auth"

// Components
import MainCard from "@/components/cards/MainCard"
import OpenListModelBtn from "@/components/shared/clientBtns/OpenListModelBtn"
import EmptyWishlist from "./EmptyWishlist"
import Btns from "./Btns"
import WishlistSkeleton from "@/components/skeletons/WishlistSkeleton"
import { SpinnerIcon } from "@/components/shared/icons"

// Types
import { IProduct } from "@/models/product.model"

type Props = {
  session: Session | null
  lists: any[]
  initialList: any
  initialProducts: any[]
}

const WishlistClient = ({
  session,
  lists,
  initialList,
  initialProducts,
}: Props) => {
  const searchParams = useSearchParams()
  const listId = searchParams.get("list")

  // UI State
  const [activeList, setActiveList] = useState(initialList)
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  // UI Placeholder for the click handler
  const selectList = (list: any) => {
    setActiveList(list)
    // Logic for fetching/router.push goes here
  }

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-5 max-w-[1400px] px-3 mx-auto py-5">
        
        {/* HEADER */}
        <div className="flex w-full items-center justify-between">
          <h2 className="font-bold text-2xl text-black">Wishlist</h2>
          <OpenListModelBtn />
        </div>

        {lists.length > 0 ? (
          <>
            {/* MOBILE LIST SCROLLER */}
            <div className="flex w-full sm:hidden gap-3 overflow-x-auto no-scrollbar py-3 px-2">
              {lists.map((list, index) => (
                <div
                  key={index}
                  onClick={() => selectList(list)}
                  className={`
                    shrink-0 w-[180px] bg-white rounded-lg border border-gray-200 shadow-sm
                    ${list.id === activeList?.id ? "bg-gray-50 border-orange-400" : ""}
                    hover:shadow-md transition-all active:scale-[0.97] flex items-center gap-3 p-2 cursor-pointer
                  `}
                >
                  <div className="w-[60px] h-[60px] bg-white border border-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    <Image 
                      width={60} 
                      height={60}
                      alt={list.name}
                      className="w-full h-full object-contain"
                      src={
                        list.items?.[0]?.variant?.images?.[0]?.url ??
                        "https://m.media-amazon.com/images/I/41qmXnVZFmL.jpg"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold truncate">{list.name}</p>
                    <p className="text-[12px] text-gray-500">{list?.items?.length} Items</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sm:border sm:flex gap-5 p-3 sm:border-gray-100 rounded-xl w-full">
              
              {/* DESKTOP SIDEBAR LISTS */}
              <div className="sm:flex hidden space-y-2.5 flex-col">
                {lists.map((list, index) => (
                  <div
                    key={index}
                    onClick={() => selectList(list)}
                    className={`
                      ${list.id === activeList?.id ? "bg-[#f3f3f3] border-l-4 border-l-orange-500" : "border-transparent"}
                      cursor-pointer group w-[250px] border flex flex-col space-y-1.5 p-3 transition-colors
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold group-hover:text-orange-500">
                        {list.name}
                      </h4>
                      <p className="text-xs text-gray-400 uppercase tracking-tighter">
                        {list.isPrivate ? "Private" : "Public"}
                      </p>
                    </div>
                    {list.isDefault && (
                      <p className="text-xs text-gray-500 italic">Default List</p>
                    )}
                    <p className="text-xs font-medium text-gray-700">
                      {list?.items?.length} Items
                    </p>
                  </div>
                ))}
              </div>

              {/* PRODUCTS DISPLAY AREA */}
              <div className="flex-1 flex relative flex-col w-full border-b border-gray-200 pb-1.5">
                
                {/* OVERLAY LOADER */}
                {pending && (
                  <div className="absolute bg-white/60 inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
                    <SpinnerIcon />
                  </div>
                )}

                {/* ACTIVE LIST INFO & ACTIONS */}
                <div className="w-full border-b border-gray-200 pb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-md font-bold">{activeList?.name}</h2>
                    <p className="text-sm text-gray-500">
                      • {activeList?.isPrivate ? "Private" : "Public"}
                    </p>
                  </div>
                  <Btns 
                    isDefault={activeList?.isDefault} 
                    setPending={setPending} 
                    hasItems={activeList?.items?.length > 0} 
                    id={activeList?.id} 
                    name={activeList?.name} 
                  />
                </div>

                {/* PRODUCTS GRID */}
                {loading ? (
                  <WishlistSkeleton />
                ) : products.length === 0 ? (
                  <div className="flex w-full justify-center mt-10">
                    <EmptyWishlist />
                  </div>
                ) : (
                  <div className="grid mt-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {products.map((item: any, index: number) => (
                      <MainCard 
                        key={index}
                        listId={listId!}
                        product={item.productId as unknown as IProduct}
                        userId={session?.user.id!}
                        isWishlist={true}
                        isWished={true} // UI state shows as wished in this view
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </div>
  )
}

export default WishlistClient