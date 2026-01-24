import type { Metadata } from "next";

import "@/app/globals.css"
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getAuthenticatedUserCart } from "@/actions/cart.actions";
import { auth } from "@/auth";
import MobileFooter from "@/components/shared/MobileFooter";
import WhatsAppSupport from "@/components/shared/WhatsappSupport";
import { getSavedListsCountAction } from "@/actions/savedList.actions";
import { GoogleAnalytics } from "@next/third-parties/google";



export const metadata: Metadata = {
  title: 'OMGIL | Premium Shopping',
  description: 'Find amazing products at OMGIL.',
  // This section handles your brand identity in the browser tab
 icons: {
   
    icon: "/favicon.ico",
     other: [
    { sizes: '32x32',url: "/favicon.ico"}
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const res = await getSavedListsCountAction();
  const total = res?.data?.totalItems ?? 0;
  const result = await getAuthenticatedUserCart({userId: session?.user?.id as string})
  return (
    
        <main className="min-h-screen w-full">
           <Header totalWishQty={total} qty={result.data?.qty} session={session}  />
  {children}
   <WhatsAppSupport />
   <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
  <Footer />
  <MobileFooter />
       
        </main>
      
     
  );
}
