"use client"
import { useState } from 'react';
import { SendVerifyEmail, VerifyEmail } from '@/actions/auth.actions';
import { SpinnerIcon } from '@/components/shared/icons';
import { IUser } from '@/models/user.model';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Props {
  user: IUser 
}

const EmailVerificationBanner = ({user}: Props) => {
  const router = useRouter();
  if (user && user.isVerified) return null;

  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  const handleSendEmailVerification = async () => {
    setLoading(true);
    try {
      const { success, error } = await SendVerifyEmail();
      if (error) {
        toast.error(error.message);
      } else if (success) {
        toast.success("Verification code sent to your email");
        setShowModal(true); // Open the code entry modal
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return toast.error("Please enter the full code");

    setVerifying(true);
    try {
      const { success, error } = await VerifyEmail({email: user.email, code: otp});
      if (error) {
        toast.error(error.message);
      } else if (success) {
        toast.success("Email verified successfully!");
        setShowModal(false);
        router.refresh(); // Update the UI to hide the banner
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <div className="flex my-5 items-start gap-4 p-5 bg-[#FFF0EB] border border-orange-100 rounded-2xl max-w-lg shadow-sm">
        <div className="mt-1 shrink-0">
          <div className="bg-[#E64A19] rounded-full p-1">
            <AlertTriangle className="w-4 h-4 text-white fill-current" strokeWidth={3} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-[#111111] text-lg font-medium leading-tight">
            Confirm your email in case you ever need help with your account
          </p>
          
          <button 
            onClick={handleSendEmailVerification}
            disabled={loading}
            className="bg-[#E60023] hover:bg-[#ad001a] text-white font-semibold py-2.5 cursor-pointer px-6 rounded-lg w-fit transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? <SpinnerIcon /> : "Confirm email"}
          </button>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h3>
              <p className="text-gray-500 mb-8">
                Enter the code we just sent to <span className="font-semibold text-gray-900">{user.email}</span>
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-3xl tracking-[1rem] font-bold py-4 border-2 border-gray-100 rounded-xl focus:border-[#E60023] focus:outline-none transition-colors"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={verifying || otp.length < 4}
                  className="w-full bg-[#111111] hover:bg-black text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {verifying ? <SpinnerIcon  /> : "Verify Account"}
                </button>
              </form>
              
              <button 
                type="button"
                onClick={handleSendEmailVerification}
                className="mt-6 text-sm font-semibold text-[#E60023] hover:underline"
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailVerificationBanner;