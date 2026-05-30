"use client";

import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Pages where navbar should be hidden
  const hideNavbar =
    pathname === "/signin" ||
    pathname === "/signup";

  // Pages where footer should be hidden
  const hideFooter =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/customize";

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {!hideNavbar && <Navbar />}

        {children}

        {!hideFooter && <Footer />}
      </body>
    </html>
  );
}
