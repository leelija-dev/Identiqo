"use client";

import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/signin" || pathname === "/signup"|| pathname === "/dashboard" || pathname === "/customize"; 
  const hideFooter =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/dashboard" ||
    pathname === "/customize";

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {!hideNavbar && <Navbar />}
        {children}
        {!hideFooter && <Footer />}

        <Script
          src={process.env.NEXT_PUBLIC_WIDGET_URL || "http://localhost:8080/widget.js"}
          data-chatbot-id={process.env.NEXT_PUBLIC_CHATBOT_ID || "cb_rwKieLIA16dhWAy2"}
          data-api-url={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/v1"}
          data-color="#6366f1"
          data-position="bottom-right"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
