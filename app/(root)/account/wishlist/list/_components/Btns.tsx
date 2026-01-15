"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

import { CircleCheck, Edit, HeartMinus } from "lucide-react";
import { DotsVerticalIcon, TrashIcon } from "@/components/shared/icons";
import EditWishlistModal from "@/components/shared/modals/EditWishlistModel";
import { deleteWishlistAction, EmptyWishlistAction, setDefaultWishlistAction } from "@/actions/savedList.actions";
import { toast } from "sonner";
import { useConfirmStore } from "@/lib/store/confirm.store";
import Image from "next/image";

const Btns = ({name,id,isDefault,hasItems,setPending}: {name:string,setPending:(v:boolean)=> void,id:string,isDefault:boolean,hasItems:boolean}) => {
  const [publicSharing, setPublicSharing] = useState(false);
  const [open,setOpen] = useState(false)
  const handleEmptyWishlist = async()=> {
    setPending(true)
     try {
       const {error,success} = await EmptyWishlistAction({id})
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
     const {error,success} =  await deleteWishlistAction({id})
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
     const {error,success} =  await setDefaultWishlistAction({id})
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="px-3 sm:w-[120px] cursor-pointer max-sm:rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-100 text-gray-600">
             <DotsVerticalIcon  />
            <span className="max-sm:hidden">More</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[320px] bg-white  ">
          {/* Edit */}
          <DropdownMenuItem onClick={()=> setOpen(true)} className="flex border-b  border-gray-100 items-center gap-2 cursor-pointer">
            <Edit color="#00afaa" size={16} />
            Edit
          </DropdownMenuItem>

          {/* Public sharing toggle */}
          <DropdownMenuItem
  onSelect={(e) => e.preventDefault()}
  className="flex border-b border-gray-100 items-center justify-between"
>
  <div className="flex flex-col">
    <span className="text-sm">Public sharing</span>
    <span className="text-xs text-gray-500">
      {publicSharing ? "Anyone can view" : "Only you"}
    </span>
  </div>

  <Switch
    checked={publicSharing}
    onCheckedChange={setPublicSharing}
    className="
      data-[state=unchecked]:bg-gray-300
      data-[state=checked]:bg-[hsl(178,100%,34%)]
    "
  />
</DropdownMenuItem>
 
   {!isDefault && (
     <DropdownMenuItem onClick={handleSwitchDefault} className="flex items-center border-b border-gray-100 gap-2 text-gray-700 cursor-pointer">
           
            <CircleCheck color="gray" size={16} />
            Make this default wishlist
          </DropdownMenuItem>
   )}

         
 {hasItems ? (
 <DropdownMenuItem onClick={handleEmpty} className="flex items-center gap-2 text-gray-700 cursor-pointer">
           
            <HeartMinus color="gray" size={16} />
            Empty wishlist
          </DropdownMenuItem>
            ): (
               <DropdownMenuItem onClick={handleDelete} className="flex items-center gap-2 text-red-500! cursor-pointer">
           
            <TrashIcon  />
            Delete
          </DropdownMenuItem>
            )}
          {/* Empty wishlist */}
         
        </DropdownMenuContent>
      </DropdownMenu>
      <EditWishlistModal id={id} name={name} open={open} setOpen={setOpen} />
    </div>
  );
};

export default Btns;
