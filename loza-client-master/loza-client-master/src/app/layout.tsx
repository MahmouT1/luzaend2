import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { Toaster } from "react-hot-toast";
import { Providers } from "../utils/Provider";
import GoogleAuthHandler from "@/components/GoogleAuthHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LUZA - Luxury Clothing Store",
  description:
    "Discover luxury fashion at LUZA. Premium leather jackets, puffer jackets, vests, and accessories.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GoogleAuthHandler />
          <Toaster
            toastOptions={{
              style: {
                background: "rgb(51 65 85)",
                color: "#fff",
                zIndex: 9999999,
              },
            }}
          />
          <div className="flex flex-col min-h-screen overflow-x-hidden">
            <Navbar />
            <main className="pt-14 sm:pt-16 md:pt-20 flex-1 w-full">{children}</main>
            <div className="relative z-20 w-full">
              <Footer />
            </div>
          </div>
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
