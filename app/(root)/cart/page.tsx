
import { CartItemComponent } from './_component/CartItem';
import { CheckoutBox } from './_component/CheckoutBox';
import { auth } from '@/auth';
import { getAuthenticatedUserCart } from '@/actions/cart.actions';

import EmptyCart from '@/components/shared/Empty';

import AddressCard from '@/components/cards/AddressCard';
import { getCurrentUser } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
// TODO: ADD BELOW USER SAVED LIST



const page = async() => {

   const session = await auth()
    
     const userId = session?.user.id || "";

     const result = await getAuthenticatedUserCart({userId})
     const res = await getCurrentUser()
   
    return (
        <div className='max-w-7xl mx-auto p-4'>
            {result.data && result.data.userCart.items.length > 0 ? (
                <>
 <h1 className="text-2xl mb-7 font-semibold">Shopping Cart</h1>
   <div className=" grid grid-cols-1  lg:grid-cols-4 lg:gap-x-4">
           {/* Desktop Layout */}
           <div className='lg:col-span-3 h-fit order-2 lg:order-1!'>
            <div className='flex flex-col gap-5'>
                {userId &&  <AddressCard />}
           
           <div className=" ">
              <div className=" bg-white p-4 rounded-md shadow-sm">
               
                 <div className="flex justify-between items-baseline pb-2 ">
                    <h1 className="text-lg font-bold">
                         Produits ({result.data?.qty})
                    </h1>
                    {/* <span className="text-sm text-gray-500">Price</span> */}
                </div>
              
                <hr/>
                {  result.data?.userCart.items.map((item:any, key: number) => (
                    <CartItemComponent key={key} userId={res.data?.user?._id as string | null} item={item} />
                ))}
                
            </div>
           </div>
             <div className=" ">
              <div className=" bg-white p-4 rounded-md shadow-sm">
               
                 <div className=" pb-2 ">
                    <h1 className="sm:text-xl text-lg font-bold">
                        Your Items
                    </h1>
                    {/* <span className="text-sm text-gray-500">Price</span> */}
                </div>
              
               <div className='flex flex-col mt-3 gap-2.5 '>
                   <h3 className="text-blue-700 font-bold  sm:text-lg text-base  ">Saved for later (5 items)</h3>
                   <div className='border border-gray-500 p-3 '>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                 {/* {products.map((product) => (
                                   <ProductCard onQuickViewClick={()=> handleQuickView(product)} key={product.id} product={product} />
                                 ))} */}
                                 {[0,1,2,3,4].map((_,index) => (
                                   <div className='flex flex-col border border-gray-300 p-2.5 gap-2.5' key={index}>
                                        <div className='w-full flex items-center justify-center '>
                                             <img src="https://m.media-amazon.com/images/I/71oiOtOHqDL._AC_AA220_.jpg" alt="product name" />
                                        </div>
                                        <article>
                                             <p className='line-clamp-2 text-gray-800 text-sm font-medium '>Studded Hobo Bags for Women Soft Vegan Leather Studded Shoulder Handbag Slouchy Tote Purses</p>
                                             <span className="text-xs font-normal text-gray-800">100+ bought in past month</span>
                                             <p className="text-xs font-normal text-green-800">InStock</p>
                                             <p className='text-gray-900 font-bold text-xs mt-1.5 '>Color: <span className='text-gray-700 font-normal '>Black</span></p>
                                             <Button type='button' className="border mt-2.5 cursor-pointer bg-transparent hover:bg-gray-100 text-gray-700 font-medium text-sm border-gray-500 rounded-full w-full">
                                                 Move to cart
                                             </Button>
                                             <div className='flex flex-col mt-3 gap-1.5'>
                                                     <button type='button' className="  cursor-pointer  w-fit bg-transparent hover:underline text-blue-600 font-medium text-xs ">
                                                 Delete
                                             </button>
                                              <button type='button' className="  cursor-pointer w-fit bg-transparent hover:underline text-blue-600 font-medium text-xs ">
                                                 Add to list
                                             </button>
                                              
                                             </div>
                                        </article>
                                   </div>
                                 ))}
                               </div>
                   </div>
               </div>
               
                
            </div>
           </div>
            </div>

           </div>
          
            <div className="lg:col-span-1 order-1 max-lg:order-2! max-sm:mt-5 lg:order-2!">
                <div className="hidden lg:block">
                  <CheckoutBox  user={res.data?.user || null} data={result.data?.userCart} />
                </div>
                <div className="lg:hidden">
                    <CheckoutBox user={res.data?.user || null} isMobile  data={result.data?.userCart} />
                </div>
            </div>
        </div>
                </>
            ): (
                 <EmptyCart />
            )}
            
        </div>
     
    );
};

export default page