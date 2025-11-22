import { ArrowRightLeft, ChevronRight, CreditCard, Package } from "lucide-react";

export const ModePaiment = ({ isMobile }: { isMobile: boolean }) => (
  <div className="bg-gray-100 rounded-md w-full flex flex-col pt-2">
    <h5 className="text-[16px] px-3 text-black font-semibold mb-3">Mode de paiement</h5>
    <div className="flex flex-col">
      <div className="flex items-start px-3 mb-4 gap-1.5">
        <CreditCard />
        <div className="flex flex-col">
          <p className="font-bold text-sm text-black">Paiement par carte bancaire</p>
          <img className="object-contain w-[125px]" src="/cards.png" alt="paiment card" />
        </div>
      </div>

      <div className="flex items-center  transition-all duration-200 border-b border-gray-300 px-3 py-2 justify-between group cursor-pointer hover:bg-secondary">
        <div className="flex items-center gap-1.5">
          <Package />
          <div className="flex flex-col">
            <p className="font-bold text-sm  text-black">Paiement à la livraison</p>
            <p className="font-light text-sm">Paiement en espèce à la livraison</p>
          </div>
        </div>
        {isMobile && <ChevronRight className="" />}
      </div>

      <div className="flex items-center  transition-all duration-200 border-b border-gray-300 px-3 py-2 justify-between group cursor-pointer hover:bg-secondary">
        <div className="flex items-center gap-1.5">
          <ArrowRightLeft />
          <div className="flex flex-col">
            <p className="font-bold text-sm  text-black">Politique de retours</p>
            <p className="font-light text-sm">Note de politique de retour</p>
          </div>
        </div>
        {isMobile && <ChevronRight className="" />}
      </div>
    </div>
  </div>
);