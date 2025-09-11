import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProviderWrapper from "@/lib/sessionWrapper";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Inter } from 'next/font/google';
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Eats Store",
  description: "Eat The Best from Eats Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${inter.className}`}
      >
        <SessionProviderWrapper>
          <Navigation/>
          {children}
          <Footer/>
          </SessionProviderWrapper>
      </body>
    </html>
  );
}
