// app/(your-path)/order-history.tsx  (or wherever you keep it)
import Link from "next/link";
import { DollarSign, ShoppingBag } from "lucide-react";

import Gimini from "./_components/Gimini";
import { getUserOrdersAction } from "@/actions/order.actions";
import { formatDate, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
}

const OrderHistory = async () => {
  const { data, error } = await getUserOrdersAction({});
  console.log(data, "order data");


 const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Echo Dot (5th Gen) | Smart speaker with Alexa | Charcoal',
        price: 49.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.5,
        reviewCount: 23485,
    },
    {
        id: 2,
        name: 'Kindle Paperwhite (16 GB) – Now with a 6.8" display and adjustable warm light',
        price: 139.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.8,
        reviewCount: 104521,
    },
    {
        id: 3,
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
        price: 398.00,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.6,
        reviewCount: 15320,
    },
    {
        id: 4,
        name: 'Apple Watch Series 9 [GPS 45mm] Smartwatch with Midnight Aluminum Case',
        price: 429.00,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.7,
        reviewCount: 7890,
    },
     {
        id: 5,
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker',
        price: 89.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.7,
        reviewCount: 150000,
    },
    {
        id: 6,
        name: 'Logitech MX Master 3S - Wireless Performance Mouse with Ultra-Fast Scrolling',
        price: 99.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.8,
        reviewCount: 25000,
    },
    {
        id: 7,
        name: 'SAMSUNG 32" Odyssey G55A QHD 165Hz 1ms Curved Gaming Monitor',
        price: 349.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.5,
        reviewCount: 9870,
    },
    {
        id: 8,
        name: 'Anker PowerCore 26800 Portable Charger, 26800mAh External Battery with Dual Input Port',
        price: 65.99,
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/615KnbjRmTL._AC_UL400_SR300,400_.jpg',
        rating: 4.6,
        reviewCount: 55432,
    }
];
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="px-3">
             <h2 className="sm:text-2xl  flex items-center gap-2 text-lg font-bold text-black w-full lg:text-left text-center mb-5">
               <ShoppingBag /> vos Commandes
              </h2>
            <p className="text-sm text-gray-500 mt-1">View, track, and manage orders from your account.</p>
          </div>
        </div>

        <div className="w-full px-2 py-5 flex-1">
         

          <div className="flex flex-col space-y-3 w-full">
            {mockProducts?.map((item, orderIndex) => (
              <div className="rounded-lg border border-light_gray" key={item.id ?? orderIndex}>
                <div
                  className="bg-[#f2f2f2] border-b border-gray-200 max-sm:h-auto h-[50px] 
                 flex items-center justify-between rounded-tr-lg rounded-tl-lg"
                >
                  <div className="flex h-full py-[8px] max-sm:px-[4px] max-sm:py-[11px] px-[10px] items-center gap-3">
                    <div>
                      <p className="font-light text-xs text-gray-500 max-sm:hidden ">N°RDcNS6uAKcSOA</p>
                    </div>

                    <div className="border-l max-sm:hidden border-gray-200 h-full" />

                    <div className="flex flex-col max-sm:gap-1">
                      <p className="font-bold text-[#333] lg:text-sm text-xs whitespace-nowrap ">
                        Effectuée le {formatDate("2002/04/30")}
                      </p>

                      <p className="font-light lg:hidden block text-sm text-gray-600 ">
                        <span>Total :</span> {formatDate("2002/04/30")}
                      </p>

                      <div>
                        <p className="font-light text-xs text-gray-500 sm:hidden ">N°RDcNS6uAKcSOA</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:pr-2 pr-1 items-center gap-4">
                    <p className="font-light lg:block hidden text-sm text-gray-600 ">
                      <span>Total :</span> {formatPrice(340)}
                    </p>

                    <Button
                      className="bg-[#FF9900] text-xs font-medium w-[150px]  text-white rounded-lg "
                      type="button"
                    >
                      <DollarSign size={15} />
                      Order Details
                    </Button>
                  </div>
                </div>

                {/* Items */}
                {[0, 1, 2, 3].map((x, idx) => (
                  <div key={idx} className="p-[10px] flex items-center bg-white justify-between ">
                    <div className="flex items-start gap-3">
                      <div className="border border-gray-200  w-[100px] lg:w-[75px] ">
                        <img
                          loading="lazy"
                          className="w-full object-contain h-full"
                          src={"https://m.media-amazon.com/images/I/81ZzlVv6d6L._AC_UL320_.jpg"}
                          alt={"something"}
                        />
                      </div>

                      <div className="flex flex-col gap-[2px]">
                        <div className="flex items-center max-sm:justify-between">
                          <Badge className={`${false ? "bg-red-500 " : "bg-green-500"} text-white `}>Delivered</Badge>

                          <div className="flex items-center gap-1 sm:hidden">
                            <p className="text-gray-500 font-light text-sm">
                              <span>QTY :</span> {2}
                            </p>
                            <span className="text-gray-500">|</span>
                            <h4 className="font-bold text-black text-sm m-0">{formatPrice(530)}</h4>
                          </div>
                        </div>

                        <p className="max-w-[500px] max-sm:max-w-[350px] text-[#333] text-sm font-medium ">
                          Women's Small Satchel Bag Classic Top Handle Purses Fashion Crossbody Handbags with Shoulder
                          Strap
                        </p>

                        <p className="text-gray-500 font-light max-sm:hidden text-sm">
                          <span>QTY :</span> {2}
                        </p>

                        <div className="space-x-1 flex items-center justify-between sm:hidden mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-800">Color:</span> Red
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-800">Size:</span> Small
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-800">Brand:</span> David Jones
                          </p>
                        </div>

                        <h4 className="font-bold text-black max-sm:hidden text-sm m-0">{formatPrice(530)}</h4>
                      </div>

                      <div className="space-y-1 sm:flex flex-col hidden mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">Color:</span> Red
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">Size:</span> Small
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">Brand:</span> David Jones
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Footer actions (desktop) */}
                <div
                  className="flex py-5 px-3 items-center justify-end w-full
                  bg-white shadow border-t border-gray-100 max-sm:hidden gap-3 max-sm:gap-1"
                >
                  <Button
                    asChild
                    className="border border-yellow-500 bg-transparent hover:bg-light_blue text-yellow-500 rounded-lg text-xs font-bold "
                  >
                    <Link href={"/"}>suivi colis</Link>
                  </Button>

                  <Button className="border border-red-700 bg-red-500 hover:bg-light_blue text-white rounded-lg text-xs font-bold ">
                    Annuler la commande
                  </Button>
                </div>

                {/* Footer actions (mobile) */}
                <div className="flex items-center py-3 px-2 w-full sm:hidden gap-2">
                  <Button
                    asChild
                    className="border border-yellow-500 bg-transparent hover:bg-light_blue text-yellow-500 rounded-lg text-xs font-bold "
                  >
                    <Link href={"/"}>suivi colis</Link>
                  </Button>

                  <Button className="border border-yellow-500 bg-red-500 hover:bg-light_blue text-white rounded-lg text-xs font-bold ">
                    Annuler la commande
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="my-5">
            <Pagination page={1} isNext={false} />
          </div> */}
        </div>

        <Gimini />
      </div>
    </div>
  );
};

export default OrderHistory;
