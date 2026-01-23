import { getOrderDetails } from '@/actions/order.actions'
import { auth } from '@/auth'
import Alert from '@/components/shared/Alert'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { CreditCard, CheckCircle2, Phone, MapPin, Package, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const OrderSuccessPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id
    const { data, error } = await getOrderDetails({ orderId: id })
    const session = await auth()

    if (error) {
        return (
            <section className='w-full bg-gray-50 min-h-screen py-10'>
                <div className='max-w-4xl mx-auto px-4'>
                    <Alert message={error.message} />
                </div>
            </section>
        )
    }

    return (
        <section className='w-full bg-[#f8fafc] min-h-screen'>
            {/* Header / Navbar */}
            <div className="bg-teal-900 text-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="transition-opacity hover:opacity-80">
                        <Image
                            src="/ij.png"
                            alt="OMGIL Logo"
                            priority
                            height={40}
                            width={90}
                            className="h-[35px] md:h-[45px] w-auto object-contain invert"
                        />
                    </Link>
                    <div className="text-sm text-right hidden sm:block">
                        <div className="font-medium opacity-80">Une question ?</div>
                        <div className="font-bold text-teal-400">07 15 12 04 95</div>
                    </div>
                </div>
            </div>

            {/* Payment Method Banner */}
            <div className='bg-teal-50 border-b border-teal-100 py-3'>
                <div className='flex items-center justify-center gap-2 text-teal-700'>
                    <CreditCard size={20} />
                    <p className='font-bold uppercase tracking-wide text-sm'>Paiement à la livraison</p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Success Message Section */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="bg-green-100 p-3 rounded-full mb-4">
                        <CheckCircle2 className="text-green-600 h-10 w-10" />
                    </div>
                    <h1 className='text-2xl md:text-3xl font-bold text-slate-900 mb-2'>Merci pour votre commande !</h1>
                    <p className="text-slate-600 max-w-lg">
                        Votre commande <span className="font-bold text-slate-900">#{data?.order?.id.slice(-8).toUpperCase()}</span> a été enregistrée. 
                        Un email de confirmation vous a été envoyé à {session?.user.email}.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-slate-800">
                                    <Package size={18} />
                                    <span>Articles commandés</span>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                    {data?.order.items.length} {data?.order.items.length === 1 ? 'article' : 'articles'}
                                </span>
                            </div>
                            
                            <div className="divide-y divide-slate-100">
                                {data?.order.items.map((item, index) => (
                                    <div key={index} className="p-4 md:p-6 flex gap-4 md:gap-6">
                                        <div className="h-24 w-24 flex-shrink-0 bg-slate-50 rounded-lg border border-slate-100 p-1">
                                            <img 
                                                className='w-full h-full object-contain' 
                                                src={item.thumbnail ?? ""} 
                                                alt={item.name} 
                                            />
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-1 line-clamp-2">
                                                {item.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
                                                <p>Vendu par: <span className="text-slate-700 font-medium">{(item.productId as any).brand}</span></p>
                                                <p>Quantité: <span className="text-slate-700 font-medium">{item.quantity}</span></p>
                                            </div>
                                            <p className="text-lg font-bold text-teal-600 mt-auto">
                                                {formatPrice(item.unitPrice)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors text-sm font-medium py-2">
                            <ArrowLeft size={16} />
                            Continuer mes achats
                        </Link>
                    </div>

                    {/* Right Column: Shipping & Summary */}
                    <div className="space-y-6">
                        {/* Shipping Address Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                                <MapPin size={18} className="text-teal-600" />
                                <span>Détails de livraison</span>
                            </div>
                            <div className="space-y-1 text-slate-600 text-sm">
                                <p className="font-bold text-slate-900">Mr. {data?.order.shippingAddress.name}</p>
                                <p>{data?.order.shippingAddress.addressLine1}</p>
                                <p>{data?.order.shippingAddress.city}, {data?.order.shippingAddress.zipCode}</p>
                                <div className="flex items-center gap-2 pt-2 text-slate-900">
                                    <Phone size={14} />
                                    <span className="font-medium">+212 {data?.order.shippingAddress.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-slate-900 rounded-xl shadow-lg text-white p-6">
                            <h3 className="font-bold text-lg mb-4 border-b border-slate-700 pb-2">Récapitulatif</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between opacity-80">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(data?.order.subtotal! - 15)}</span>
                                </div>
                                <div className="flex justify-between opacity-80">
                                    <span>Frais de livraison</span>
                                    <span>15,00 Dh</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-700">
                                    <span>Total à payer</span>
                                    <span className="text-teal-400">{formatPrice(data?.order.total!)}</span>
                                </div>
                            </div>
                            <p className="text-[10px] mt-4 opacity-50 italic text-center">
                                Payable en espèces à la réception de votre colis.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-slate-100 text-slate-500 py-8 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-6 text-center text-sm font-medium">
                    © 2026 Omgil Marketplace. Tous droits réservés.
                </div>
            </footer>
        </section>
    )
}

export default OrderSuccessPage