"use client";

import Image from "next/image";
import { ChevronLeft, Phone } from "lucide-react";

// Local asset path provided by you — will be transformed to a URL by the environment.
const HERO_IMG = "/mnt/data/x.jpg";

const STATUS_ORDER = [
  { key: "pending", label: "En attente de confirmation", time: "vendredi 21 novembre 2025 22:41", active: true, color: "#00BFA6" },
  { key: "confirmed", label: "Confirmée", time: "vendredi 21 novembre 2025 22:41", active: true, color: "#00BFA6" },
  { key: "preparing", label: "En préparation", time: "", active: false },
  { key: "shipping", label: "En cours de livraison", time: "", active: false },
  { key: "delivered", label: "Livrée", time: "", active: false },
  { key: "cancelled", label: "Annulée", time: "vendredi 21 novembre 2025 22:43", active: true, color: "#00BFA6" },
];

 const TrackingPage = ({params}:  {params: Promise<{id:string}>}) => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top bar */}
      <div className="bg-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-extrabold tracking-tight">marjanemall</div>
          </div>
          <div className="text-sm text-right">
            <div className="font-semibold">Une question ?</div>
            <div>Contactez-nous au <span className="font-bold">08 02 00 77 00</span></div>
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
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                    {/* product image */}
                    <img src={"https://m.media-amazon.com/images/I/81kfaXIpnRL._AC_UL320_.jpg"} alt="product" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">Commande N° : <span className="font-bold">0026407281</span></div>
                    <div className="text-sm text-gray-600 mt-2">Ecran PC - XIAOMI - A22i - 21,45" - FHD - Dalle VA - 75Hz</div>
                  </div>
                </div>

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
                    <button className="inline-flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 transition">
                      Revenir sur le site
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="lg:col-span-1" />
        </div>
      </main>

      <footer className="bg-teal-900 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto px-6 text-center">© 2025 - marjanemall</div>
      </footer>
    </div>
  );
};

export default TrackingPage
