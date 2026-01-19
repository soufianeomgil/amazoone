"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import MainCard from "@/components/cards/MainCard"
import OpenListModelBtn from "@/components/shared/clientBtns/OpenListModelBtn"

import { Session } from "next-auth"
import EmptyWishlist from "./EmptyWishlist"
import Btns from "./Btns"
import { ISavedItem, ISavedList } from "@/models/savedList.model"
import { IProduct } from "@/models/product.model"
import WishlistSkeleton from "@/components/skeletons/WishlistSkeleton"
import { SpinnerIcon } from "@/components/shared/icons"

import Image from "next/image"


type Props = {
  session: Session | null
  lists: ISavedList[]
  initialList: ISavedList
  initialProducts: ISavedItem[]
}

const WishlistClient = ({
  session,
  lists,
  initialList,
  initialProducts,
}: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [activeList, setActiveList] = useState(initialList)
  const [products, setProducts] = useState<ISavedItem[]>(initialProducts)
  const [loading, setLoading] = useState(false)
 const listId = searchParams.get("list")

  /** Sync URL → state (back/forward support) */
  useEffect(() => {
    const listId = searchParams.get("list")
    if (!listId) return

    const found = lists.find(l => l.id === listId)
    if (found) setActiveList(found)
  }, [searchParams, lists])

  /** Handle list click */
 const selectList = async (list: ISavedList) => {
  if (list.id === activeList?.id) return

  setActiveList(list)
  setProducts([])            // 🔑 reset immediately
  setLoading(true)

  router.push(`?list=${list.id}`, { scroll: false })

  try {
    const res = await fetch(`/api/wishlist/${list.id}`)
    const json = await res.json()

    setProducts(json.data?.list?.items ?? [])
  } finally {
    setLoading(false)
  }
}
const wishlistedProductIds = new Set(
  lists.flatMap(list =>
    list.items?.map(item => String(item.productId?._id ?? item.productId))
  )
)
const wishlistedMap = React.useMemo(() => {
  const map = new Set<string>()

  lists.forEach(list => {
    list.items?.forEach(item => {
      const id =
        typeof item.productId === "object"
          ? String(item.productId._id)
          : String(item.productId)

      map.add(id)
    })
  })

  return map
}, [lists])

  
 const [pending,setPending] = useState(false)
console.log(products, "PRODUCTS WISHLIST HERE ...")
  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-5 max-w-[1400px] px-3 mx-auto py-5">

        <div className="flex w-full items-center justify-between">
          <h2 className="font-bold text-2xl text-black">Wishlist</h2>
          <OpenListModelBtn />
        </div>
   {lists.length > 0 ? (
     <>
      <div className="flex w-full sm:hidden gap-3 overflow-x-auto no-scrollbar py-3 px-2">
          {lists.map((list, index) => (
            <div
              key={index}
              onClick={() => selectList(list)}
              className={`
                shrink-0 w-[180px]
                bg-white
                ${list.id === activeList?.id ? "bg-gray-50!" : ""}
                rounded-lg border border-gray-200 shadow-sm
                hover:shadow-md transition-all active:scale-[0.97]
                flex items-center gap-3 p-2
              `}
            >
              <div className="w-[60px] h-[60px] bg-white border border-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                <Image width={60} height={60}
                alt={list.name}
                  className="w-full h-full object-contain"
                  src={
                    list.items?.[0]?.variant?.images?.[0]?.url ??
                    "https://m.media-amazon.com/images/I/41qmXnVZFmL.jpg"
                  }
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate">
                  {list.name}
                </p>
                <p className="text-[12px] text-gray-500">
                  {list?.items?.length} Items
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="sm:border sm:flex gap-5 p-3 sm:border-gray-700 w-full">

          {/* DESKTOP LISTS */}
          <div className="sm:flex hidden space-y-2.5 flex-col">
            {lists.map((list, index) => (
              <div
                key={index}
                onClick={() => selectList(list)}
                className={`
                  ${list.id === activeList?.id ? "bg-[#f3f3f3]" : ""}
                  cursor-pointer group w-[250px] border border-gray-100
                  flex flex-col space-y-1.5 p-3
                `}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold group-hover:text-yellow-500">
                    {list.name}
                  </h4>
                  <p className="text-xs text-gray-700">
                    {list.isPrivate ? "Private" : "Public"}
                  </p>
                </div>

                {list.isDefault && (
                  <p className="text-xs text-gray-500">Default List</p>
                )}

                <p className="text-xs font-medium text-gray-700">
                  {list?.items?.length} Items
                </p>
              </div>
            ))}
          </div>

          {/* PRODUCTS */}
          <div className="flex-1 flex relative  flex-col w-full border-b border-gray-200 pb-1.5">
             {pending && (
                  <div className="absolute bg-gray-50 inset-0 z-10 flex items-center justify-center ">
                       <SpinnerIcon />
                  </div>
             )}
            <div className="w-full border-b border-gray-200 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-md font-bold">{activeList?.name}</h2>
                <p className="text-sm text-gray-500">
                  {activeList?.isPrivate ? "Private" : "Public"}
                </p>
              </div>

              <Btns isDefault={activeList.isDefault} setPending={setPending} hasItems={activeList?.items?.length > 0 } id={activeList?.id} name={activeList?.name} />
            </div>

            {loading ? (
  <WishlistSkeleton />
) : products.length === 0 ? (
  <div className="flex w-full justify-center mt-10">
    <EmptyWishlist />
  </div>
) : (
              <div className="grid mt-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {products.map((product, index: number) => (
                 <MainCard 
                 listId={listId!}
                 key={index}
  product={(product.productId) as unknown as IProduct}
  userId={session?.user.id!}
  isWishlist
  isWished={wishlistedMap.has(
    String((product.productId as any)?._id)
  )}
/>


                ))}
              </div>
            )}
          </div>
        </div>
     </>
   ): (
     <EmptyWishlist />
   )}
        {/* MOBILE LISTS */}
        
      </div>
    </div>
  )
}

export default WishlistClient

