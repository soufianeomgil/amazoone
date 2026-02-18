import { getAuthenticatedUserCart } from "@/actions/cart.actions";
import { getUserSaveForLaterItems } from "@/actions/saveForLater.actions";
import { getCurrentUser } from "@/actions/user.actions";
import { auth } from "@/auth";

import CartClient from "./_component/CartClient";
import { IProduct, IVariant } from "@/models/product.model";
interface UserCartElement {
     qty:number;
     userCart: {
      items: [
        {
          productId: IProduct,
          quantity: number,
          variantId?: string;
          variant: IVariant
        },
      ],
     }
}

const page = async () => {
  // Authorize & fetch resources in parallel
      const session = await auth()
      const userId = session?.user?.id || ''
      const result = await getAuthenticatedUserCart({userId: userId})
      const res = await getCurrentUser()
      const {data,error} = await getUserSaveForLaterItems({})
     
  
 

  return (
    <CartClient userData={res.data?.user} userId={session?.user.id || ""} savedItems={data?.items || []}
    isAuthenticated={session?.user.id !== ""}
     data={result.data as unknown as  UserCartElement || undefined} />
   
  );
};

export default page;