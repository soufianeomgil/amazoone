
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import EditAddressForm from "../../../_components/EditAddressForm";
import { getAddressDetails } from "@/actions/address.actions";
import { IAddress } from "@/models/address.model";
import Image from "next/image";

const page = async({params}: {params: Promise<{id:string}>}) => {
  
  const id = (await params).id
  const result = await getAddressDetails({id})
  // vqQ3w74VvmTAt9zbiz
  return (
    <div className="bg-white">
 <div className="container mx-auto px-4 py-8 max-w-[560px] ">
       <Link
                href="/account/addresses"
                className="text-sm text-blue-600 flex items-center gap-1 hover:text-orange-600 hover:underline mb-7 "
              >
                <ChevronLeft size={15} /> <span>Back to your addresses</span>
              </Link>
      

     <h1 className="text-2xl flex items-center gap-1 md:text-3xl font-bold text-gray-800 mb-6">
         <Image width={22} height={22} src="/location.png" alt="location icon" className="w-[22px] object-contain " />  <span>Edit address</span>
      </h1>

  <EditAddressForm address={result.data?.address || {} as IAddress} />
    </div>
    </div>
   
  );
};

export default page;
