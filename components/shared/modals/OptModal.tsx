"use client"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  AlertDialog,
 
  AlertDialogContent,
 
  AlertDialogFooter,
 

} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
interface OptInputProps {
    open: boolean;
    setOpen: (v:boolean)=> void
    phoneNumber:string
}
const OptModal = ({open,setOpen,phoneNumber}: OptInputProps) => {
  return (
    <AlertDialog open={open} onOpenChange={()=> setOpen(false)} >
       
        <AlertDialogContent className="bg-white">
          <div onClick={()=> setOpen(false)} className="absolute w-[30px] h-[30px] m-3 bg-gray-100 rounded-full flex items-center justify-center top-0 right-0"> 
             <X /> 
          </div>
          <div>
              <img src="https://glovoapp.com/_next/static/media/sms-balloon.c6564b8f.svg" alt="whatsapp" />
              <h2 className="font-bold text-black text-2xl">Enter the code</h2>
              <p className="text-gray-800 text-sm font-medium">Insert the 4-digit code that we sent via Whatsapp to +212{phoneNumber}</p>
          </div>
                <InputOTP pattern={REGEXP_ONLY_DIGITS_AND_CHARS} maxLength={6}>
  <InputOTPGroup className="space-x-2.5">
    <InputOTPSlot className="border-2 h-14! w-14! border-gray-200 rounded-lg " index={0} />
    <InputOTPSlot className="border-2 h-14! w-14!  border-gray-200 rounded-lg " index={1} />
    <InputOTPSlot  className="border-2 h-14! w-14! border-gray-200 rounded-lg " index={2} />
    <InputOTPSlot className="border-2 h-14! w-14! border-gray-200 rounded-lg " index={3} />
  </InputOTPGroup>
  
 
    
 
</InputOTP>
 <AlertDialogFooter className="flex items-center w-full flex-row!">
          <Button variant="secondary"  className="bg-yellow-primary text-white text-sm font-medium w-[150px]" type="button">
             Resend code
          </Button>
          <Button variant={"default"} type="button" className="bg-blue-primary text-white text-sm font-medium w-[150px]">
             Valider
          </Button>
        </AlertDialogFooter>
        </AlertDialogContent>
     
    </AlertDialog>
  )
}

export default OptModal