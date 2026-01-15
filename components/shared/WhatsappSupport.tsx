"use client"

import { MessageCircle} from "lucide-react"
import { usePathname } from "next/navigation"
import { WhatsappIcon } from "react-share"

export default function WhatsAppSupport() {
  const pathname = usePathname()
  if(pathname.includes('complete-profile')) return null
  const phoneNumber = "+212715120495" // ⚠️ replace with your WhatsApp number
  const message = encodeURIComponent(
    "السلام عليكم، بغيت نعرف معلومات على واحد المنتج 🙏"
  )

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 
        bg-green-500 hover:bg-green-600 text-white 
        px-4 py-3 rounded-full shadow-lg 
        transition-all duration-300"
    >
      <WhatsappIcon className="rounded-full" size={30} />
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="text-sm font-semibold">WhatsApp</span>
        <span className="text-[11px] opacity-90">Support en ligne</span>
      </div>
    </a>
  )
}
