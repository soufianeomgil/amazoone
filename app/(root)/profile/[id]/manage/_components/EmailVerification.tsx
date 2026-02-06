"use client"
import { SendVerifyEmail } from '@/actions/auth.actions';
import { SpinnerIcon } from '@/components/shared/icons';
import { IUser } from '@/models/user.model';
import { AlertTriangle } from 'lucide-react'; // Using lucide-react for the icon
import { useState } from 'react';
import { toast } from 'sonner';
interface Props {
  user: IUser 
} 
const EmailVerificationBanner = ({user}:Props) => {
 if(user && user.isVerified) return null
 const [loading,setLoading] = useState<boolean>(false)
 const handleSendEmailVerification = async()=> {
    setLoading(true)
    try {
       const {success, error } = await SendVerifyEmail()
        if(error) {
           toast.error(error.message)
           return
        }else if(success) {
           toast.success("success")
           return
        }
    } catch (error) {
       console.log(error)
    }finally {
       setLoading(false)
    }
 }
  return (
    <div className="flex my-5 items-start gap-4 p-5 bg-[#FFF0EB] border border-transparent rounded-2xl max-w-lg shadow-sm">
      {/* Icon Container */}
      <div className="mt-1 shrink-0">
        <div className="bg-[#E64A19] rounded-full p-1">
          <AlertTriangle className="w-4 h-4 text-white fill-current" strokeWidth={3} />
        </div>
      </div>

      {/* Text and Button Container */}
      <div className="flex flex-col gap-4">
        <p className="text-[#111111] text-lg font-medium leading-tight">
          Confirm your email in case you ever need help with your account
        </p>
        
        <button 
          onClick={handleSendEmailVerification}
          className="bg-[#E60023] hover:bg-[#ad001a] text-white font-semibold py-2.5 cursor-pointer px-4 rounded-lg w-fit transition-colors duration-200"
        >
         {loading ? <SpinnerIcon /> :  "Confirm email"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;