
import {
  Dialog,
  DialogContent,
  DialogTitle,
  
} from "@/components/ui/dialog"

// TODO: CREATE A FORM FOR ADDING ADDRESS USING SHADCN + ZOD


import AddAddressForm from "@/app/(root)/account/_components/AddAddressForm";

export function AddAddressModal({open,setOpen,redirect = false}: {
    open: boolean;
    setOpen: (v:boolean) => void;
    redirect?: boolean
}) {
  return (
    <Dialog   onOpenChange={setOpen} open={open}>
      <form>
        
        <DialogContent  className="sm:max-w-[550px] overflow-y-scroll h-[90%] border border-gray-300! shadow bg-white">
        
         <DialogTitle className="hidden">Add a new Address Delivery</DialogTitle>
  

          <AddAddressForm redirect={redirect} />
       
         
        </DialogContent>
      </form>
    </Dialog>
  )
}
