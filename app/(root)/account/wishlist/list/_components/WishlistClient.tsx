"use client"

import React, { useState, useTransition, useEffect, useMemo } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Session } from "next-auth"

// Components
import MainCard from "@/components/cards/MainCard"
import OpenListModelBtn from "@/components/shared/clientBtns/OpenListModelBtn"
import EmptyWishlist from "./EmptyWishlist"
import Btns from "./Btns"
import WishlistSkeleton from "@/components/skeletons/WishlistSkeleton"
import { SpinnerIcon } from "@/components/shared/icons"
import { IProduct } from "@/models/product.model"

type Props = {
  session: Session | null
  lists: any[]
  initialList: any
  initialProducts: any[]
}

const WishlistClient = ({ session, lists, initialList, initialProducts }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listId = searchParams.get("list")
  
  // Use React Transition for smooth navigation without manual loading states
  const [isPending, startTransition] = useTransition()
  const [loading,setLoading] = useState(false)
  // Sync state with props when initialProducts change (Server -> Client handoff)
  // This avoids the "stale data" bug when navigating via router.refresh()
  const [products, setProducts] = useState(initialProducts)
  const [activeList, setActiveList] = useState(initialList)

  useEffect(() => {
    setProducts(initialProducts)
    setActiveList(initialList)
  }, [initialProducts, initialList])

  const selectList = (list: any) => {
    startTransition(() => {
      // router.push is handled within the transition
      router.push(`/account/wishlist/list?list=${list._id}`, { scroll: false })
    })
  }

  // Memoize the grid to prevent re-renders of the entire list when only pending changes
  const productGrid = useMemo(() => (
    <div className="grid mt-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {products.map((item: any,index) => (
        <MainCard 
          key={index}
          listId={listId!}
          priority={index < 4}
          product={item.productId as unknown as IProduct}
          userId={session?.user.id!}
          isWishlist={true}
          isWished={true}
        />
      ))}
    </div>
  ), [products, listId, session?.user.id])

  return (
    <div className="bg-white w-full min-h-screen">
      <div className="flex flex-col gap-5 max-w-[1400px] px-3 mx-auto py-5">
        <div className="flex w-full items-center justify-between">
          <h2 className="font-bold text-2xl text-black">Wishlist</h2>
          <OpenListModelBtn />
        </div>

        {lists.length > 0 ? (
          <div className="sm:flex sm:gap-5 sm:p-3 rounded-xl w-full">
                 <div className="flex w-full sm:hidden gap-3 overflow-x-auto no-scrollbar py-3 ">
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
            {/* DESKTOP SIDEBAR - Optimized with better CSS logic */}
            <aside className="sm:flex hidden space-y-2.5 flex-col shrink-0">
              {lists.map((list) => (
                <button
                  key={list._id}
                  disabled={isPending}
                  onClick={() => selectList(list)}
                  className={`
                    ${list._id === activeList?._id ? "bg-gray-100 border-l-4 border-l-orange-500" : "border-transparent bg-white"}
                    text-left w-[250px] border p-3 transition-all hover:bg-gray-50
                    ${isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold ${list._id === activeList?._id ? "text-orange-500" : "text-black"}`}>
                      {list.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 uppercase">{list.isPrivate ? "Private" : "Public"}</span>
                  </div>
                  <p className="text-xs text-gray-500">{list?.items?.length || 0} Items</p>
                </button>
              ))}
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 relative flex flex-col w-full min-h-[400px]">
              {/* Transition Overlay */}
              {isPending && (
                <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                  <SpinnerIcon  />
                </div>
              )}
             {loading && (
                <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                  <SpinnerIcon  />
                </div>
              )}

              <div className="w-full border-b border-gray-200 pb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h2 className="text-md font-bold">{activeList?.name}</h2>
                  <p className="text-sm text-gray-500">• {activeList?.isPrivate ? "Private" : "Public"}</p>
                </div>
                <Btns  
                  setPending={setLoading}
                  isDefault={activeList?.isDefault} 
                  hasItems={products.length > 0} 
                  id={activeList?._id} 
                  name={activeList?.name} 
                />
              </div>

              {products.length === 0 && !isPending ? (
                <div className="flex w-full justify-center mt-20">
                  <EmptyWishlist />
                </div>
              ) : productGrid}
            </main>
          </div>
        ) : (
          <EmptyWishlist />
        )}
      </div>
    </div>
  )
}

export default WishlistClient