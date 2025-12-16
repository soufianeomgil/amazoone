"use client";

import { addItemToListAction } from "@/actions/savedList.actions";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store";
import { IProduct } from "@/models/product.model";
import { ISavedItem, ISavedList } from "@/models/savedList.model";

import { Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import AddToListModal from "../modals/AddToListModel";
import CreateListModal from "../modals/CreateListModal";





export default function AddToListButton({ data,product }: {data: ISavedList[], product: IProduct}) {
  const [open, setOpen] = useState(false);

  console.log(data, "your shit")
  
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [openModel,setOpenModel] = useState(false)
  const [openCreateListModel,setOpenCreateListModel] = useState(false)
  const [item,setItem] = useState<ISavedItem>()
  const [listName,setListName] = useState("")
  // optional selected state for accessibility / keyboard navigation
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current) return;
      if (btnRef.current?.contains(e.target as Node)) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // keyboard navigation

   const selectedVariantIndex = useSelector(
     (state: RootState) => state.product.selectedVariant[product?._id as string]
   );
   const selectedVariant = product?.variants?.[selectedVariantIndex ?? 0] || null;

  async function handleAddToList(list:ISavedList) {
    console.log(list, 'list item')
     try {
        const { error, data, success } = await addItemToListAction({
           
            productId: String(product._id),
            listId: String(list.id),
            variant: selectedVariant ?? undefined,
            variantId: String(selectedVariant?._id ?? selectedVariant?.sku ?? ""),
            priceSnapshot: product.basePrice,
            thumbnail: product.thumbnail.url,
            note: ""
        })
       
        if(error) {
          return toast.error(error.message)
        }else if(success) {
           setItem(data?.item)
           setListName(data?.list.name as string)
            setOpenModel(true)
           
            
        }
     } catch (error) {
        console.log(error)
     }
   
  }

  // create new list
  async function handleCreateList(e?: React.FormEvent) {
     try {
      
     } catch (error) {
        console.log(error)
     }
  }

  // UI pieces
  return (
    <div className="relative inline-block w-full border-t pt-5 border-gray-300 ">
      <Button
      type="button"
       
         className="
        w-full appearance-none
        rounded-xl
        border border-gray-300
        bg-gray-50
        flex-1
        px-4 py-3
        text-sm text-gray-900
        transition
        focus:bg-white
        focus:border-orange-400
        focus:ring-2 focus:ring-orange-200
        outline-none
      "
      ref={btnRef}  onClick={() => { setOpen((o) => !o); setHighlightIndex(-1); }} 
        aria-haspopup="true"
        aria-expanded={open}
      >
        Add to List
       {data &&  <svg
          className={`w-4 h-4 ml-2 transform shrink-0 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>} 
      </Button>

      {open && data && (
        <div
          ref={panelRef}
          className="absolute right-0 z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg"
          role="menu"
          aria-orientation="vertical"
        >
           
             <div className="flex flex-col ">
            {data.map((list,index) => (
                <button onClick={() => handleAddToList(list)} className={`flex ${index === 0 ? "bg-blue-50" : ""}
                 items-center p-2 hover:bg-[#f6f6f6] w-full cursor-pointer gap-2`} key={index}>
                     <div>
                        <img className="object-contain" src="https://www.amazon.com/hz/wishlist/listimage?listId=L956MFXM7DWD&listType=WishList&redirect=true" alt="" />
                     </div>
                     <div className="flex text-left! flex-col">
                       <p className="text-xs font-medium text-black">
                         {list.name}
                       </p>
                       <p className="text-xs text-gray-400 font-normal  ">
                         {list.isPrivate ? "Private" : "Public"}
                       </p>
                     </div>
                </button>
            ))}
          </div>
          
         
          <div onClick={() => setOpenCreateListModel(true)} className="border-t cursor-pointer flex p-2.5 items-center gap-2.5 border-gray-300">
              <Plus size={16} color="gray" />
              <p className="text-blue-600 font-medium text-xs hover:underline hover:text-blue-950 ">Create List</p>
          </div>
          {/* Header with product preview */}
         
          {/* bottom actions */}
         
        </div>
      )}
      <CreateListModal open={openCreateListModel} setOpen={setOpenCreateListModel} />
      <AddToListModal listName={listName} item={item} open={openModel}  setOpen={setOpenModel}   />
    </div>
  );
}


