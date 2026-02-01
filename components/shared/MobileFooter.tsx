"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { brands, footerCategories } from "@/constants"
import Link from "next/link"
import { Button } from "../ui/button"
import { Facebook, Instagram, Youtube } from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"
  
  export default function MobileFooter() {
    const pathname = usePathname()
    if(pathname === "/customer/account/sign-up" || pathname === "/customer/account/login") return null
    return (
        <footer className="w-full px-4 py-3 bg-[#232F3E] lg:hidden flex gap-5 flex-col">
              <Accordion type="single" collapsible >
        <AccordionItem value="item-1">
          <AccordionTrigger className="no-underline!  text-white font-medium text-[15px] ">categories</AccordionTrigger>
          <AccordionContent className="no-focus">
               <ul className='flex flex-col gap-3'>
                              {footerCategories.map((item,index)=> (
                                   <li className='text-white  hover:underline list-none text-[13px] font-normal' key={index}>
                                       <Link href={`/${item}`}>
                                          {item}
                                       </Link>
                                   </li>
                              ))}
                              </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="no-underline!  text-white font-medium text-[15px] ">Découvrez la Marketplace</AccordionTrigger>
          <AccordionContent className="no-focus">
          <ul className='flex flex-col gap-3'>
                
                <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                       Engagements
                    </Link>
                 </li>
                 <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                        Modes et frais de livraison
                    </Link>
                 </li>
                 <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                       Politique de Retour
                    </Link>
                 </li>
                 <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                       Garantie
                    </Link>
                 </li>
                 <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                       Utiliser un coupon
                    </Link>
                 </li>
                 <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                       FAQ
                    </Link>
                 </li>
                 <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                    Assistance

                    </Link>
                 </li>
                 <li className='text-white  hover:underline list-none text-[13px] font-normal'>
                    <Link href={`/engagement}`}>
                    Accès espace vendeur
                    </Link>
                 </li>
                
         
      </ul>
          </AccordionContent>
        </AccordionItem>
       
      </Accordion>
      
                           <div>
           
            <div className='grid max-sm:grid-cols-2 grid-cols-4 gap-7'>
                <div className='flex items-center gap-1'>
                  <Image width={40} height={40} className='w-10 object-contain' src="https://www.marjanemall.ma/images/auth-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Produits 100% <br /> authentiques</p>
                </div>
                <div className='flex items-center gap-1'>
                  <img width={40} height={40}  className='w-10 object-contain' src="https://www.marjanemall.ma/images/morocco-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Livraison partout <br /> au Maroc</p>
                </div>
                <div className='flex items-center gap-1'>
                  <Image  width={40} height={40} className='w-10 object-contain' src="https://www.marjanemall.ma/images/return-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Satisfait ou <br /> remboursé</p>
                </div>
                <div className='flex items-center gap-1'>
                  <Image width={40} height={40} className='w-10 object-contain' src="https://www.marjanemall.ma/images/globe-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Hand made <br /> crafted</p>
                </div>
            </div>
            <div className='mt-7'>
            <h4 className='text-white font-bold text-[17px] mb-3 border-gray-300  '>
               Modes de paiement
            </h4>
             <Image width={150} height={150} className=' object-contain'
                            src="https://www.marjanemall.ma/images/cards.png" alt="" />
            </div>
            </div>
            <div className="flex items-center py-3 justify-between">
                 <p className="text-[12px] text-white font-normal">© 2026 Omgil.</p>
                  <div className='flex items-center gap-1'>
                                 <Link target='_blank' href="https://www.youtube.com" className='flex items-center justify-center border-2 w-[45px] h-[45px] rounded-full border-white'>
                                   <Youtube color='white' size={20} />
                                 </Link>
                                 
                                 <Link target='_blank' href="https://www.instagram.com" className='flex items-center justify-center border-2 w-[45px] h-[45px] rounded-full border-white'>
                                   <Instagram color='white' size={20} />
                                 </Link>
                                 <Link target='_blank' href="https://www.facebook.com" className='flex items-center justify-center border-2 w-[45px] h-[45px] rounded-full border-white'>
                                   <Facebook color='white' size={20} />
                                 </Link>
                              </div>
            </div>
        </footer>
   
    )
  }
  