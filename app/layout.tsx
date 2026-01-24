
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
import { GoogleAnalytics } from '@next/third-parties/google'
import PageView from "@/components/analytics/PageView";

const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'OMGIL | Premium Shopping',
  description: 'Find amazing products at OMGIL.',
  icons: {
    icon: "/favicon.ico",
    other: [{ sizes: '32x32', url: "/favicon.ico" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  initServer();
  console.log(process.env.NEXT_PUBLIC_GA_ID , "GOOGLE GA4")
  return (
    <html lang="en">
      <body className={`${roboto.className} ${poppins.className} antialiased`}>
        {/* 1. Google Analytics Component (Handles G-P939Q23VXL internally) */}
       <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
        <PageView />
        <StoreProvider>
          <SessionProvider session={session}>
            <main className="min-h-screen w-full">
              <SyncCart />
              {children}
              <Toaster richColors position="top-center" />
              <ConfirmModal />
              <SpeedInsights />
            </main>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}