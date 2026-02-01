"use client"
import { brands, footerCategories } from '@/constants'
import { Facebook, Instagram, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const Footer = () => {
 const pathname = usePathname()
 if(pathname === "/customer/account/sign-up" || pathname === "/customer/account/login") return null
  return (
    <footer className='lg:flex hidden flex-col '>
        <div className='w-full px-4 py-3 bg-[#232f3e] flex  flex-col'>
             <h4 className='text-white font-bold text-[17px] '>Suivez nous</h4>
             <div className='flex items-center mt-2 gap-1'>
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
        <div className='bg-[#131921] px-4 py-6 lg:flex hidden items-start gap-10 '>
            <div>
            <h4 className='text-white font-bold text-[17px]  mb-3 '>categories</h4>
           <ul className='flex flex-col gap-3'>
                {footerCategories.map((item,index)=> (
                     <li className='text-white list-none! hover:underline  text-[13px] font-normal' key={index}>
                         <Link href={`/${item}`}>
                            {item}
                         </Link>
                     </li>
                ))}
           </ul>

            </div>
            <div>
            <h4 className='text-white font-bold text-[17px]  mb-3 '>Découvrez la Marketplace</h4>
           <ul className='flex flex-col gap-3'>
                
                     <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            Engagements
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                             Modes et frais de livraison
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            Politique de Retour
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            Garantie
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            Utiliser un coupon
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            FAQ
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                         Assistance

                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                         Accès espace vendeur
                         </Link>
                      </li>
                     
              
           </ul>

            </div>
            <div>
            <h4 className='text-white font-bold text-[17px]  mb-3 '>Informations légales</h4>
           <ul className='flex flex-col gap-3'>
                
                     <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            CGU/CGV
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            Données personnelles et cookies
                         </Link>
                      </li>
                      <li className='text-white  hover:underline list-none! text-[13px] font-normal'>
                         <Link href={`/engagement}`}>
                            Mentions légales
                         </Link>
                      </li>
                    
                     
           </ul>

            </div>
            <div className='border border-gray-500 h-[200px]'/>
            <div>
            <h4 className='text-white font-bold text-[17px] mb-3 border-gray-300  '>
               Nos engagement
            </h4>
            <div className='grid lg:grid-cols-2 grid-cols-4 gap-7'>
                <div className='flex items-center gap-1'>
                  <Image width={40} height={40} className='w-10 object-contain' src="https://www.marjanemall.ma/images/auth-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Produits 100% <br /> authentiques</p>
                </div>
                <div className='flex items-center gap-1'>
                  <img width={40} height={40}  className='w-10 object-contain' src="https://www.marjanemall.ma/images/morocco-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Livraison partout <br /> au Maroc</p>
                </div>
                <div className='flex items-center gap-1'>
                  <Image width={40} height={40}  className='w-10 object-contain' src="https://www.marjanemall.ma/images/return-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Satisfait ou <br /> remboursé</p>
                </div>
                <div className='flex items-center gap-1'>
                  <Image width={40} height={40} className='w-10 object-contain'
                   src="https://www.marjanemall.ma/images/globe-white.png" alt="" />
                    <p className='text-[13px] text-white font-medium'>Offre nationale et <br /> internationale</p>
                </div>
            </div>
            <div className='mt-4'>
            <h4 className='text-white font-bold text-[17px] mb-3 border-gray-300  '>
               Modes de paiement
            </h4>
              <Image width={150} height={150} className=' object-contain'
               src="https://www.marjanemall.ma/images/cards.png" alt="" />
            </div>
            </div>
        </div>
      
        <div className='bg-[#232f3e] w-full px-4 py-6'>
           <p className='text-white text-[13px] font-normal'><span>© </span>2026 - Omgil - Tous droits réservés.</p>
        </div>
    </footer>
  )
}

export default Footer