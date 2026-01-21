import type { Metadata } from "next";

import "@/app/globals.css"
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getAuthenticatedUserCart } from "@/actions/cart.actions";
import { auth } from "@/auth";
import MobileFooter from "@/components/shared/MobileFooter";
import WhatsAppSupport from "@/components/shared/WhatsappSupport";



export const metadata: Metadata = {
  title: 'OMGIL | Premium Shopping',
  description: 'Find amazing products at OMGIL.',
  // This section handles your brand identity in the browser tab
  icons: {
    icon: "/app/favicon.png", // Standard
    shortcut: '/app/favicon.png',
    apple: '/apple-icon.png', // For iPhone home screens
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/icon.png',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  const result = await getAuthenticatedUserCart({userId: session?.user?.id as string})
  return (
    
        <main className="min-h-screen w-full">
           <Header qty={result.data?.qty} session={session} isAuthenticated={session?.user !== null} />
  {children}
   <WhatsAppSupport />
  <Footer />
  <MobileFooter />
       
        </main>
      
     
  );
}
