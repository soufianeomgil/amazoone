
import Link from "next/link";
import { Search } from "lucide-react";

import Gimini from "./_components/Gimini";
import WriteReviewBtn from "@/components/shared/clientBtns/WriteReviewBtn";
import { getUserOrdersAction } from "@/actions/order.actions";

// NOTE: Server-side GenAI call should live in /app/api/genai/route.ts (or similar).
// Client calls POST /api/genai with body { question, orders }.



const OrderHistory = async() => {
  const { data, error} = await getUserOrdersAction({})
  console.log(data, "order data")
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Your Orders</h1>
            <p className="text-sm text-gray-500 mt-1">View, track, and manage orders from your account.</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                aria-label="Search orders"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Search all orders"
                type="search"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
            </div>

            {/* <button
              onClick={() => setIsChatOpen((v) => !v)}
              className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg shadow"
              aria-expanded={isChatOpen}
              aria-controls="orders-chat"
            >
              Ask assistant
              <ChevronRight className="w-4 h-4" />
            </button> */}
          </div>
        </div>

        {/* Tabs / Nav */}
        <nav className="flex gap-6 border-b border-gray-200 pb-3 mb-6">
          <Link href="#" className="text-orange-500 border-b-2 border-orange-500 pb-2">Orders</Link>
          <Link href="#" className="text-gray-600 hover:text-orange-500">Buy Again</Link>
          <Link href="#" className="text-gray-600 hover:text-orange-500">Not Yet Shipped</Link>
          <Link href="#" className="text-gray-600 hover:text-orange-500">Cancelled Orders</Link>
        </nav>

        {/* Orders list */}
        <div className="space-y-5">
          {data && data.orders.map((order,index) => (
            <article key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-300">
              <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between gap-3 items-start md:items-center">
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
                  <div>
                    <div className="text-xs text-gray-500">ORDER PLACED</div>
                    <div className="font-medium">"</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">TOTAL</div>
                    <div className="font-medium">${order.total.toFixed(2)}</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">SHIP TO</div>
                    <div className="text-blue-600 hover:underline cursor-pointer font-medium"></div>
                  </div>
                </div>

                <div className="text-sm text-right">
                  <div className="text-xs text-gray-500">ORDER #</div>
                  <div className="font-mono text-sm">{order._id as string}</div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {order.status === "DELIVERED" ? `Delivered ${order.deliveredAt}` : order.status}
                    </h3>
                    <div className="text-sm text-gray-500"> {order.items.length} item{order.items.length > 1 ? "s" : ""}</div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item,index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <img src={item.productId?.thumbnail?.url} alt={item.name} className="w-24 h-24 object-contain border-gray-100 rounded-md bg-white border" />

                        <div className="flex-1 min-w-0">
                          <Link href="#" className="text-base font-medium text-orange-600 hover:underline line-clamp-2">
                            {item.name}
                          </Link>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button className="px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-700 text-sm hover:bg-orange-100">
                              Buy it again
                            </button>

                            <button className="px-3 py-1 rounded-md bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50">
                              View your item
                            </button>

                          <WriteReviewBtn />
                            
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className=" md:pl-6 md:pt-0 pt-4">
                  <div className="flex flex-col gap-2">
                    <button className="w-full text-left px-4 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-sm">
                      Track package
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-sm">
                      Archive order
                    </button>
                    <button className="w-full text-left px-4 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-sm">
                      Order details
                    </button>
                  </div>
                </aside>
              </div>
            </article>
          ))}
        </div>

        {/* Floating Chat CTA */}
      <Gimini />
      </div>
    </div>
  );
};

export default OrderHistory;
