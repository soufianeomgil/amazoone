"use client"

import React, { useState } from "react" // 1. Import useState
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
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { VerifyEmail } from "@/actions/auth.actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OptInputProps {
  open: boolean
  setOpen: (v: boolean) => void
  email: string
}

const OptModal = ({ open, setOpen, email }: OptInputProps) => {
  const router = useRouter()
  // 2. Create state to hold the OTP value
  const [otpValue, setOtpValue] = useState("")
  const [loading, setLoading] = useState(false)

  const handleEmailVerificationCode = async () => {
    if (otpValue.length < 6) return // Don't submit if incomplete

    setLoading(true)
    try {
      const response = await VerifyEmail({
        email: email,
        code: otpValue, // 3. Pass the state value here
      })

      if (response.success) {
        setOpen(false)
        toast.success("Your account has been verified successfuly")
        router.replace("/")
        return
        // Handle success (e.g., redirect or toast)
      }else if(response.error) {
         toast.error(response.error.message)
         return;
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
      <AlertDialogTitle className="hidden"></AlertDialogTitle>
      <AlertDialogContent className="bg-white">
        <div
          onClick={() => setOpen(false)}
          className="absolute w-[30px] h-[30px] m-3 bg-gray-100 rounded-full flex items-center justify-center top-0 right-0 cursor-pointer"
        >
          <X />
        </div>
        <div>
          <img
            src="https://glovoapp.com/_next/static/media/sms-balloon.c6564b8f.svg"
            alt="whatsapp"
          />
          <h2 className="font-bold text-black text-2xl">Enter the code</h2>
          <p className="text-gray-800 text-sm font-medium">
            Insert the 4-digit code that we sent via Whatsapp to {email}
          </p>
        </div>

        {/* 4. Bind value and onChange to the state */}
        <InputOTP
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          maxLength={6} // Match your 4-digit logic
        >
          <InputOTPGroup className="space-x-2.5">
            <InputOTPSlot className="border-2 h-14 w-14 border-gray-200 rounded-lg" index={0} />
            <InputOTPSlot className="border-2 h-14 w-14 border-gray-200 rounded-lg" index={1} />
            <InputOTPSlot className="border-2 h-14 w-14 border-gray-200 rounded-lg" index={2} />
            <InputOTPSlot className="border-2 h-14 w-14 border-gray-200 rounded-lg" index={3} />
            <InputOTPSlot className="border-2 h-14 w-14 border-gray-200 rounded-lg" index={4} />
            <InputOTPSlot className="border-2 h-14 w-14 border-gray-200 rounded-lg" index={5} />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter className="flex items-center w-full flex-row!">
          <Button
            variant="secondary"
            className="bg-yellow-primary text-white text-sm font-medium w-[150px]"
            type="button"
          >
            Resend code
          </Button>
          <Button
            onClick={handleEmailVerificationCode}
            disabled={loading || otpValue.length < 4}
            variant={"default"}
            type="button"
            className="bg-blue-primary text-white text-sm font-medium w-[150px]"
          >
            {loading ? "Chargement..." : "Valider"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default OptModal