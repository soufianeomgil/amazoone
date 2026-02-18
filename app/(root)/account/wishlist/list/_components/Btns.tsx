"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";



import EditWishlistModal from "@/components/shared/modals/EditWishlistModel";

import { toast } from "sonner";
import { useConfirmStore } from "@/lib/store/confirm.store";
import Image from "next/image";
import WishlistMoreMenu from "./DropdownSheet";
import { deleteSavedListAction, emptySavedListItemsAction, setDefaultSavedListAction } from "@/actions/savedList.actions";

const Btns = ({name,id,isDefault,hasItems,setPending}: {name:string,setPending: (v:boolean) => void, id:string,isDefault:boolean,hasItems:boolean}) => {
  const [publicSharing, setPublicSharing] = useState(false);
  const [open,setOpen] = useState(false)
  const handleEmptyWishlist = async()=> {
    setPending(true)
     try {
       const {error,success} = await emptySavedListItemsAction({listId:id})
       if(error) {
         toast.error(error.message)
         return;
       }else if(success) {
         toast.success("Success")
         return
       }
     } catch (error) {
        console.log(error)
     }finally {
      setPending(false)
     }
  }
  const handleDeleteWishlist = async(id:string)=> {
    setPending(true)
     try {
     const {error,success} =  await deleteSavedListAction({listId:id,soft: true})
     if(error) {
        toast.error(error.message)
        return
     }else if(success) {
       return toast.success('Wishlist has been deleted')
     }
     } catch (error) {
       console.log(error)
     }finally {
        setPending(false)
     }
  }
  const confirm = useConfirmStore((s) => s.confirm)
  const handleEmpty = async()=> {
   const ok = await confirm({
  title: "Empty wishlist",
  description: "All saved items will be removed.",
  confirmText: "Empty",
});
    if(!ok) return;
    await handleEmptyWishlist()
  }
  const handleDelete = async () => {
  const ok = await confirm({
    title: "Delete wishlist",
    description: "This will permanently remove the wishlist.",
    confirmText: "Delete",
    destructive: true,
  });

  if (!ok) return;

  await handleDeleteWishlist(id)
};
  const handleSwitchToDefaultWishlist = async()=> {
    setPending(true)
     try {
     const {error,success} =  await setDefaultSavedListAction({listId:id})
     if(error) {
        toast.error(error.message)
        return
     }else if(success) {
       return toast.success('Success')
     }
     } catch (error) {
       console.log(error)
     }finally  {
       setPending(false)
     }
  }
  const handleSwitchDefault = async()=> {
     const ok = await confirm({
  title: "Make default wishlist?",
  description: "This will replace your current default wishlist.",
  confirmText: "Make default",
  destructive: false,
});

if (ok) {
  await handleSwitchToDefaultWishlist();
}

  }
  return (
    <div className="flex items-center gap-3">
      {/* Share */}
      <Button
        variant="outline"
        className="px-3 sm:w-[120px] cursor-pointer flex items-center justify-center max-sm:rounded-full border border-gray-100 py-1 text-sm text-gray-700"
      >
        <Image width={16} height={16} src="/share.png" alt="share icon" className="sm:mr-2 h-4 w-4" />
        <span className="max-sm:hidden">Share</span>
      </Button>

      {/* More dropdown */}
      <WishlistMoreMenu 
        setOpen={setOpen}
        publicSharing={publicSharing}
        setPublicSharing={setPublicSharing}
        isDefault={isDefault}
        hasItems={hasItems}
        handleSwitchDefault={handleSwitchDefault}
        handleEmpty={handleEmpty}
        handleDelete={handleDelete}  />
      <EditWishlistModal id={id} name={name} open={open} setOpen={setOpen} />
    </div>
  );
};

export default Btns;
