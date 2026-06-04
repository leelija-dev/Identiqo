// components/common/Navbar.jsx

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Button from "@/components/Common/Button";
import Container from "../Common/Container";

export default function NavbarMinimal() {
  const pathname = usePathname();
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

  // Function to check if link is active
  const isActive = (href) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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
              className="text-h4-sm sm:text-h3-xs md:text-h2-sm font-black tracking-tight text-slate-900 transition-all duration-300 hover:scale-105 hover:text-indigo-600"
            >
              IDENTIQO
            </Link>

            {/* Desktop Menu - Hidden on mobile/tablet */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 2xl:gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative text-p-xs xl:text-p-sm font-medium text-slate-600 transition-all duration-300 hover:text-indigo-600 group whitespace-nowrap py-2"
                  >
                    {link.name}
                    {/* Underline indicator - always visible on active page */}
                    <span 
                      className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                    {/* Blur effect on hover */}
                    <span className="absolute inset-0 rounded-md opacity-0 blur-md bg-indigo-100 transition-all duration-300 group-hover:opacity-100 -z-10"></span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Button - Attractive Sign In Button with Icon */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              <Button
                href="/login"
                variant="primary"
                size="md"
                className="whitespace-nowrap"
                icon={FiLogIn}
              >
                Sign In
              </Button>
            </div>

            {/* Tablet Menu Button - Shows on md to lg */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-1.5 transition-all duration-300 hover:bg-slate-100 active:scale-95"
              >
                {isOpen ? (
                  <HiXMark className="w-5 h-5 transition-transform duration-300" />
                ) : (
                  <HiBars3 className="w-5 h-5 transition-transform duration-300" />
                )}
              </button>
            </div>

            {/* Mobile Menu Button - Shows on small devices */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden rounded-lg p-1.5 transition-all duration-300 hover:bg-slate-100 active:scale-95"
            >
              {isOpen ? (
                <HiXMark className="w-5 h-5 transition-transform duration-300" />
              ) : (
                <HiBars3 className="w-5 h-5 transition-transform duration-300" />
              )}
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile Menu Overlay - Slides from RIGHT side */}
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
        
        {/* Sidebar Menu - RIGHT SIDE */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl transition-all duration-500 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <Link
                href="/" 
                onClick={() => setIsOpen(false)}
                className="text-h4-sm font-black tracking-tight text-slate-900"
              >
                IDENTIQO
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Navigation Links with active indicator */}
            <div className="flex-1 overflow-y-auto py-4">
              {navLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-p-sm transition-all duration-300 ${
                      active 
                        ? "bg-indigo-50 text-indigo-600 font-semibold border-r-4 border-indigo-600" 
                        : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Menu Footer - Attractive Sign In Button with Icon */}
            <div className="border-t border-slate-100 p-4">
              <Button
                href="/login"
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-12 sm:h-14 md:h-16 lg:h-20"></div>
    </>
  );
}