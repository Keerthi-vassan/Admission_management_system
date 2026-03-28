import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { InstituteHeader } from "@/components/ui/InstituteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GateKept",
  description: "GateKept is a secure and efficient admission management platform that controls applicant flow from application to acceptance",
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en">
         <body>
            <SessionProvider>
               <InstituteHeader />
               {children}
            </SessionProvider>
         </body>
      </html>
   )
 }