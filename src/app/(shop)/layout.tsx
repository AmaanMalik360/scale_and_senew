import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster as Sonner } from "../../components/ui/sonner";
import { TooltipProvider } from "../../components/ui/tooltip";
import DashboardWrapper from "../dashboardWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Scales & Sinew — Exotic Leather Wallets, Bags & Card Holders",
    template: "%s | Scales & Sinew",
  },
  description:
    "Premium exotic leather wallets, bags, and card holders crafted for everyday luxury.",
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <DashboardWrapper>{children}</DashboardWrapper>
      <Sonner />
    </div>
  );
}
