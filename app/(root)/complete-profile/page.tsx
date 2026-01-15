// "use client"
// import { Button } from '@/components/ui/button'
// import { User } from 'lucide-react'
// import React, { useState } from 'react'

// const page = () => {
//   const [gender,setGender] = useState<'male' | "female">("male")
//   return (
//     <div className="bg-white w-full py-7">
//         <div className='shadow border max-w-[500px] items-center justify-center mx-auto border-gray-100 rounded-lg gap-4 flex flex-col px-3 py-4 '>
//              <div className="w-[65px] h-[65px] rounded-full border-2 border-[#0aafaa] flex items-center justify-center  ">
//                 <User size={45} className='font-bold' color='#0aafaa' />
//              </div>
//              <div className="flex flex-col space-y-1.5">
//                 <h2 className='font-bold text-xl text-black '>Finish setting up your account</h2>
//                <p className="text-gray-500 font-medium text-sm ">
//                   We need a few details to enable deliveries and Cash on Delivery.
//                </p>
//              </div>
               
//                 <div className="flex items-center  gap-4">
//                     <Button className="bg-[#0aafaa] h-10 cursor-pointer rounded-lg text-white w-[100px] "  type="button" >
//                         Male
//                     </Button>
//                      <span className='border-r h-[35px] border-gray-400 w-px' />
//                     <Button className="bg-[#0aafaa] h-10 cursor-pointer rounded-lg text-white w-[100px] "   type="button" >
//                       Female
//                     </Button>
//                </div>
//                <div className="flex items-center w-full gap-2">
//                     <input className='input_styles' placeholder='Full Name' type="text" />
//                     <input className='input_styles' placeholder='Phone Number'  type="number" />
//                </div>

//                 <input disabled={true} className='input_styles disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-50 ' value={"soufianeowner@gmail.com"} type="text" />
//                 <Button className='w-full  bg-[#0aafaa] cursor-pointer text-white rounded-lg '>
//                     Finaliser mon compte
//                 </Button>
//         </div>
//     </div>
//   )
// }

// export default page

"use client"

import { completeProfile } from "@/actions/auth.actions"
import { SpinnerIcon } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

const CompleteProfilePage = () => {
  const [gender, setGender] = useState<"male" | "female">("female")
  const [pending,setPending] = useState(false)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const router = useRouter()
  const canSubmit = fullName.trim().length > 2 && phone.trim().length >= 9 && gender !== null && !pending
  const handleSubmit = async()=> {
    setPending(true)
     try {
       const { error , success } = await completeProfile({gender,fullName,phoneNumber:phone})
       if(error) {
         toast.error(error.message)
         return
       }else if(success) {
         toast.success("profile has been completed")
         router.replace("/")
         return
       }
     } catch (error) {
        console.log(error)
     }finally {
       setPending(false)
     }
  }
  return (
    <div className="bg-white w-full py-10">
      <div className="shadow border max-w-[500px] mx-auto border-gray-100 rounded-lg gap-5 flex flex-col px-4 py-6">

        {/* Step indicator */}
        {/* <span className="text-xs font-medium text-gray-500 text-center">
          Step 1 of 2 — Profile
        </span> */}

        {/* Icon */}
        <div className="w-[65px] h-[65px] rounded-full border-2 border-[#0aafaa] flex items-center justify-center mx-auto">
          <User size={42} color="#0aafaa" />
        </div>

        {/* Title */}
        <div className="flex flex-col space-y-1 text-center">
          <h2 className="font-bold text-xl text-black">
            Finish setting up your account
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            We need a few details to enable deliveries and Cash on Delivery.
          </p>
        </div>

        {/* Gender (optional) */}
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            onClick={() => setGender("male")}
            variant={gender === "male" ? "default" : "outline"}
            className={`h-10 w-[100px] ${
              gender === "male" ? "bg-[#0aafaa] text-white" : ""
            }`}
          >
            Male
          </Button>

          <Button
            type="button"
            onClick={() => setGender("female")}
            variant={gender === "female" ? "default" : "outline"}
            className={`h-10 w-[100px] ${
              gender === "female" ? "bg-[#0aafaa] text-white" : ""
            }`}
          >
            Female
          </Button>
        </div>

        {/* <p className="text-xs text-gray-400 text-center">
          Optional — helps us personalize your experience
        </p> */}

        {/* Name + Phone */}
        <div className="flex flex-col w-full gap-3">
          <input
            className="input_styles"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div className="flex gap-2 items-center">
            <span className="px-3 py-2 border rounded-md text-sm bg-gray-50 text-gray-600">
              +212
            </span>
            <input
              className="input_styles flex-1"
              placeholder="6XX XXX XXX"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <p className="text-xs text-gray-400">
            Used for delivery & Cash on Delivery confirmation
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <input
            disabled
            className="input_styles disabled:cursor-not-allowed disabled:text-gray-400 disabled:bg-gray-50"
            value="soufianeowner@gmail.com"
          />
          <span className="text-xs text-gray-400">
            Connected via Google — you can change this later
          </span>
        </div>

        {/* CTA */}
        <Button
          disabled={!canSubmit} 
          onClick={handleSubmit}
          type="button"
          className="w-full bg-[#0aafaa] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
         {pending ? <SpinnerIcon />: "Continuer vers la livraison"}  
        </Button>
      </div>
    </div>
  )
}

export default CompleteProfilePage
