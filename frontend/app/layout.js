"use client";

import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Pages where navbar/footer should be hidden
  const hideLayout =
    pathname === "/signin" ||
    pathname === "/signup";

  return (
    <html lang="en">
      <body>
        {!hideLayout && <Navbar />}

        {children}

        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}