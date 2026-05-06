import type { Metadata } from "next";
import { Geist_Mono, Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import {
  AdminAuthProvider,
  AuthProvider,
  CartProvider,
  WishlistProvider,
} from "@/components/shared";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Theni Store",
  description: "Fresh groceries, offers, and essentials from Theni Store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f7f8f3] text-[#171717]">
        <AdminAuthProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <AppShell>{children}</AppShell>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
