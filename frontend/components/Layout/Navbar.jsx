"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/templates" },

    { name: "Gallery", href: "/gallery" },
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
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  <span className="absolute inset-0 rounded-md opacity-0 blur-md bg-indigo-100 transition-all duration-300 group-hover:opacity-100 -z-10"></span>
                </Link>
              ))}
            </div>

            {/* Desktop Button - Attractive Sign In Button with Icon */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              <Link
                href="/signin"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-xs xl:text-sm 2xl:text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-300 whitespace-nowrap flex items-center gap-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <FiLogIn className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                <span className="relative z-10">
                  Sign In
                </span>
              </Link>
            </div>

            {/* Tablet Menu Button - Shows on md to lg */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <Link
                href="/signin"
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-1.5"
              >
                <FiLogIn className="w-3 h-3" />
                Sign In
              </Link>
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
      </nav>

      {/* Mobile Menu Overlay - Slides from left */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sidebar Menu */}
        <div
          className={`absolute top-0 left-0 bottom-0 w-80 bg-white shadow-2xl transition-all duration-500 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-xl font-black tracking-tight text-slate-900"
              >
                IDENTIQO
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Navigation Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-base text-slate-600 transition-all duration-300 hover:bg-indigo-50 hover:text-indigo-600"
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Menu Footer - Attractive Sign In Button with Icon */}
            <div className="border-t border-slate-100 p-4">
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <FiLogIn className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-12 sm:h-14 md:h-16 lg:h-20"></div>
    </>
  );
}