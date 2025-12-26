import { getOrderDetails } from "@/actions/order.actions";
import AmazonPrice from "@/components/shared/AmazonPrice";
import { buildOrderTimeline } from "@/lib/utils";
import { IOrder } from "@/models/order.model";
import Link from "next/link";
import { notFound } from "next/navigation";



 const TrackingPage = async({params}:  {params: Promise<{id:string}>}) => {
  const id = (await params).id
  const res = await getOrderDetails({orderId: id})
  if(!res.success) return notFound()
  const STATUS_ORDER = buildOrderTimeline(res.data?.order as IOrder);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top bar */}
      <div className="bg-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link href="/" className="text-2xl font-extrabold tracking-tight">Amazon</Link>
          </div>
          <div className="text-sm text-right">
            <div className="font-semibold">Une question ?</div>
            <div className="text-xs sm:text-sm">Contactez-nous au <span className="font-bold">08 02 00 77 00</span></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-center text-3xl font-semibold mb-10">Suivre ma commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1" />

          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white p-6 ">
                {res.data?.order.items.map((i,index)=> (
 <div key={index} className="flex items-start gap-4 mb-4">
                  <div className="w-[100px] h-[100px] rounded-md bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                    {/* product image */}
                    <img src={i.thumbnail ?? "https://m.media-amazon.com/images/I/81kfaXIpnRL._AC_UL320_.jpg"} alt={i.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm flex items-center gap-1.5 text-gray-700">Order Total : <AmazonPrice price={res.data?.order.total as number} /></div>
                    <div className="text-sm text-gray-600 mt-2">
                       {i.name}
                    </div>
                  </div>
                </div>
                ))}
               

                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-800 mb-4">Status de la commande :</h3>

                  <div className="relative">
                    {/* vertical dotted line center */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0">
                      <div className="w-px h-full mx-auto bg-[repeating-linear-gradient(180deg,#d1d5db, #d1d5db 4px, transparent 4px, transparent 8px)]" />
                    </div>

                    <div className="space-y-6">
                      {STATUS_ORDER.map((s, idx) => (
                        <div key={s.key} className="flex items-start gap-4">
                          <div className="flex-1 pr-6 text-right">
                            <div className={`${s.active ? "text-teal-600 font-semibold" : "text-gray-500"}`}>{s.label}</div>
                            {s.time && <div className="text-xs text-gray-400 mt-1">{s.time}</div>}
                          </div>

                          <div className="flex items-center justify-center w-8">
                            <div className="relative">
                              <div className={`w-4 h-4 rounded-full ${s.active ? "bg-teal-500 border-4 border-white shadow" : "bg-gray-300"}`} />
                            </div>
                          </div>

                          <div className="flex-1" />
                        </div>
                      ))}
                    </div>

                  </div>

                  <div className="mt-8 text-center">
                    <Link href="/" className="inline-flex font-medium text-sm items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 transition">
                      Continue shopping
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="lg:col-span-1" />
        </div>
      </main>

      <footer className="bg-teal-900 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto px-6 text-center">© 2025 - Amazon</div>
      </footer>
    </div>
  );
};

export default TrackingPage


