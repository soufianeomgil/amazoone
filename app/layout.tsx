import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/components/shared/StoreProvider";
import SyncCart from "@/components/shared/SyncCart"
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { initServer } from "@/lib/init";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import { SpeedInsights } from "@vercel/speed-insights/next"
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const roboto  = Roboto({
  weight: ["300","400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300","400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

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
  initServer();
//  if(!session) {
//     redirect("/sign-up")
//  }
   
  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${poppins.className} antialiased`}
      >
        <script
  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
  async
/>
        <StoreProvider>
     <SessionProvider session={session}>
        <main className="min-h-screen w-full">
           {/* <Header /> */}
            <SyncCart />
           {children}
            <Toaster richColors position="top-center" />
            <ConfirmModal />
            <SpeedInsights />
            <GoogleAnalytics />
        </main>
         
      </SessionProvider>
      </StoreProvider>
      </body>
    </html>
  );
}
