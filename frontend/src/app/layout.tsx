import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import AuthProvider from "@/app/providers/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import { ReservationProvider } from "@/contexts/ReservationContext";
import { GlobalCheckoutTimer } from "@/components/common/GlobalCheckoutTimer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booker",
  description: "Created by Gian Luca Caravone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5efe1] text-xs sm:text-sm`}
      >
        <AuthProvider>
          <CartProvider>
            <ReservationProvider>
              <Navbar />
              {children}
              <Footer />
              <GlobalCheckoutTimer />
            </ReservationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
