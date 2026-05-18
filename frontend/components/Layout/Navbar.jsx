
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Container from "../Common/Container";

export default function NavbarMinimal() {
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };  

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/mygallery" },
    { name: "Templates", href: "/templates" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-xl transition-all duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
       <Container>
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-20">
            
            {/* Logo */}
            <Link
              href="/"
              className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-black tracking-tight text-slate-900 transition-all duration-300 hover:scale-105 hover:text-indigo-600"
            >
              IDENTIQO
            </Link>

            {/* Desktop Menu - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 2xl:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-xs xl:text-sm 2xl:text-base font-medium text-slate-600 transition-all duration-300 hover:text-indigo-600 group whitespace-nowrap"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                  <span className="absolute inset-0 rounded-md opacity-0 blur-md bg-indigo-100 transition-all duration-300 group-hover:opacity-100 -z-10"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Buttons */}   
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
               <Link
    href="/signin"
    className="relative overflow-hidden text-xs xl:text-sm 2xl:text-base font-medium text-slate-600 transition-all duration-300 hover:text-indigo-600 whitespace-nowrap"
  >
    <span className="relative z-10">
      Sign In
    </span>
  </Link>

              <button className="group relative overflow-hidden rounded-lg xl:rounded-lg bg-indigo-600 px-2.5 py-1.5 sm:px-3 sm:py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 text-xs xl:text-sm 2xl:text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-indigo-300 whitespace-nowrap">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <span className="relative z-10">
                  Start Free Trial
                </span>
              </button>
            </div>

            {/* Tablet Menu Button - Shows on md to lg */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <button className="text-xs font-medium text-slate-600 hover:text-indigo-600">
                Sign In
              </button>
              <button className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700">
                Start Free
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-1.5 transition-all duration-300 hover:bg-slate-100 active:scale-95"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Button - Shows on small devices */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-lg p-1.5 transition-all duration-300 hover:bg-slate-100 active:scale-95"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </Container>

        {/* Mobile Menu (0-768px) */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-slate-100 bg-white/95 backdrop-blur-xl px-3 sm:px-4 py-3 sm:py-4 space-y-1 sm:space-y-2">
          <Container>
            {/* All navigation links for mobile/tablet */}
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-slate-600 transition-all duration-300 hover:bg-indigo-50 hover:translate-x-2 hover:text-indigo-600"
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Action Buttons */}
            <div className="border-t border-slate-100 pt-3 sm:pt-4 mt-2 space-y-2 sm:space-y-3">
              <button className="w-full rounded-lg py-2 sm:py-2 text-sm sm:text-base text-slate-600 transition-all duration-300 hover:bg-slate-100 hover:text-indigo-600">
                Sign In
              </button>

              <button className="w-full rounded-lg sm:rounded-lg bg-indigo-600 py-2 sm:py-2 text-sm sm:text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-700">
                Start Free Trial
              </button>
            </div>
          </Container>
        </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-12 sm:h-14 md:h-16 lg:h-20"></div>
    </>
  );
}