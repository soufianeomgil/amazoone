
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CheckoutClient from "./_components/CheckoutClient";

import { getAuthenticatedUserCart } from "@/actions/cart.actions";
import { auth } from "@/auth";
import { ICart } from "@/models/cart.model";
import { redirect } from "next/navigation";
import { gaEvent } from "@/lib/analytics/ga";


const Checkout= async() => {
  const session = await auth()
  if(!session) redirect("/login?checkout=true")
 const result = await getAuthenticatedUserCart({userId: session?.user.id as string})
   if(result.data?.qty === 0) redirect("/cart")
    gaEvent("begin_checkout", { currency: "MAD", value: result.data?.qty, items:result.data?.userCart.items });

  return (
    <div className="w-full">
      <div className="bg-white shadow px-4 flex items-center gap-3 py-5">
        <Link href="/cart" className="rounded-full w-[45px] h-[45px] bg-transparent flex items-center justify-center hover:bg-[hsl(180,69%,97%)] ">
          <ArrowLeft size={17} />
        </Link>
        <h1 className="sm:text-2xl text-base font-semibold text-gray-800">Paiement</h1>
      </div>
       
     <CheckoutClient  userId={session.user.id} cartItems={result.data?.userCart as ICart} />
    </div>
  );
};

export default Checkout;
