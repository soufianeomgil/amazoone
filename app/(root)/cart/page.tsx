
import { CartItemComponent } from './_component/CartItem';
import { CheckoutBox } from './_component/CheckoutBox';
import { auth } from '@/auth';
import { getAuthenticatedUserCart } from '@/actions/cart.actions';

import EmptyCart from '@/components/shared/Empty';

import AddressCard from '@/components/cards/AddressCard';
import { getCurrentUser } from '@/actions/user.actions';
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
                    <CartItemComponent key={key} item={item} />
                ))}
                
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