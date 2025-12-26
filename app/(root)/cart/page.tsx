import { getAuthenticatedUserCart } from "@/actions/cart.actions";
import { getUserSaveForLaterItems } from "@/actions/saveForLater.actions";
import { getCurrentUser } from "@/actions/user.actions";
import { auth } from "@/auth";
import AddressCard from "@/components/cards/AddressCard";
import CartItemComponent from "./_component/CartItem";
import { MoveToCartBtn } from "@/components/shared/clientBtns/MoveToCartBtn";
import Link from "next/link";
import CheckoutBox from "./_component/CheckoutBox";
import { Button } from "@/components/ui/button";
import EmptyCart from "@/components/shared/Empty";
import SoldWith from "./_component/SoldWith";

const page = async () => {
  // Authorize & fetch resources in parallel
      const session = await auth()
      const userId = session?.user?.id || ''
      const result = await getAuthenticatedUserCart({userId: userId})
      const res = await getCurrentUser()
      const {data,error} = await getUserSaveForLaterItems({})
      console.log(data?.items, "data items")
      console.log('error:', error)
  
  const totalQty = result?.data?.qty ?? 0;
  

  // UI-level booleans
  const hasCartItems = Array.isArray(result?.data?.userCart?.items) && result.data.userCart.items.length > 0;
  const hasSavedItems = Array.isArray(data?.items) && data.items.length > 0;

  return (
    <div className="w-full bg-inherit">
 <div className="max-w-7xl overflow-hidden mx-auto sm:p-4">
      {hasCartItems ? (
        <>
          <h1 className="text-2xl max-sm:p-5 mb-7 font-semibold">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-x-6">
            {/* Left/main column */}
            <div className="lg:col-span-3 ">
              <div className="flex flex-col gap-6">
                {/* Address (only if user present) */}
                {userId && <AddressCard {...({ user: res.data?.user } as any)} />}

                {/* Cart items card */}
                <section className="bg-white p-4 rounded-md shadow-sm">
                  <div className="flex justify-between items-baseline pb-2">
                    <h2 className="text-lg font-bold">Products ({totalQty})</h2>
                  </div>

                  <hr className="my-3" />

                  <div className="space-y-4">
                    {result?.data?.userCart.items.map((item: any,index) => (
                      <CartItemComponent
                        key={index}
                        userId={res.data?.user?._id ?? null}
                        item={item}
                      />
                    ))}
                  </div>
                </section>

                {/* Saved-for-later area */}
                {hasSavedItems && (
 <section className="bg-white  sm:p-4 shadow-sm">
                  {/* <h3 className="sm:text-xl text-lg font-bold pb-3">Your Items</h3> */}

                  <div className="flex flex-col gap-3 mt-1">
                    <div className="text-gray-900 font-bold px-4 pt-2
                 sm:text-lg text-base">
                      Saved for later ({data?.items?.length} items)
                    </div>

                    <div className="sm:border border-gray-200 sm:p-3 rounded">
                      {hasSavedItems ? (
                        <div className="grid grid-cols-1  p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                          {/* MoveToCartBtn component expects data prop (client component) */}
                          <MoveToCartBtn data={data} />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          You have no items saved for later.{" "}
                          <Link href="/" className="text-blue-600 hover:underline">
                            Continue shopping.
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
                )}
                <SoldWith title="Frequently bought with items in your cart" />
              </div>
            </div>

            {/* Right/checkout column */}
            <aside className="lg:col-span-1 max-lg:mt-3 ">
              {/* sticky top-24 */}
              <div className=" space-y-4">
                {/* Desktop */}
                <div className="hidden lg:block">
                  <CheckoutBox user={res.data?.user ?? null} 
                    // @ts-ignore
                  data={result?.data?.userCart} />
                </div>

                {/* Mobile */}
                <div className="lg:hidden">
                
                  <CheckoutBox user={res.data?.user ?? null} isMobile
                    // @ts-ignore
                   data={result?.data?.userCart} />
                </div>

                {/* Optional: quick link to saved for later if cart empty but saved items exist */}
                {!hasCartItems && hasSavedItems && (
                  <div className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-semibold">Saved for later</h4>
                    <p className="text-sm text-gray-600">You can move saved items back to your cart.</p>
                    <Link href="/saved-for-later" className="mt-2 inline-block">
                      <Button variant="outline">View saved items</Button>
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </>
      ) : hasSavedItems ? (
        // No cart items but has saved items
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-bold">Your Amazon Cart is empty</h2>
            <p className="text-sm text-gray-700">
              Check your Saved for later items below or{" "}
              <Link href="/" className="text-blue-700 hover:underline">
                continue shopping.
              </Link>
            </p>
          </div>

          <div className="bg-white sm:p-4 rounded-md shadow-sm">
            <h3 className="sm:text-xl text-lg font-bold pb-3">Saved for later ({data.items.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <MoveToCartBtn data={data} />
            </div>
          </div>
        </div>
      ) : (
        // Nothing in cart and nothing saved
        <EmptyCart message="Your cart is empty — explore our products and add something you like!" />
      )}
      {/* <SoldWith title="Frequently bought with items in your cart" /> */}
    </div>
    </div>
   
  );
};

export default page;
