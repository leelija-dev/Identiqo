// components/Footer.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "../Common/Container";
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub, 
  FaYoutube, FaHeart, FaArrowUp, FaApple, FaGooglePlay 
} from "react-icons/fa";
import { FiMail, FiMapPin, FiPhone, FiSend, FiChevronRight } from "react-icons/fi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      {/* Main Footer Content */}
    <Container>
  <div className="relative py-16">
        
        {/* Top Section - Logo & Social */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
           
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                IDENTIQO
              </h2>
              <p className="text-xs text-slate-400">Create professional ID cards</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6">
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6">
              <FaTwitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6">
              <FaLinkedinIn className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6">
              <FaGithub className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Product Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Product
            </h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Features <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Templates <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Pricing <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">API <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Changelog <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Company
            </h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">About Us <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Blog <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Careers <span className="text-xs bg-indigo-600 px-1.5 py-0.5 rounded-full ml-2">We're hiring!</span></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Press Kit <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Contact <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Resources
            </h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Documentation <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Help Center <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Video Tutorials <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Community <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">Status <FiChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Legal
            </h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Terms of Service</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Cookie Policy</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">GDPR Compliance</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors duration-300">Security</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Subscribe
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Get the latest updates and news
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-lg transition-all"
              >
                <FiSend className={`w-4 h-4 text-white transition-transform ${isHovered ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
              </button>
            </div>
            
            {/* App Store Badges */}
            <div className="mt-6 space-y-2">
              <a href="#" className="flex items-center gap-3 bg-slate-800 rounded-xl p-2 hover:bg-slate-700 transition-colors">
                <FaApple className="w-6 h-6" />
                <div>
                  <div className="text-[10px] text-slate-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 bg-slate-800 rounded-xl p-2 hover:bg-slate-700 transition-colors">
                <FaGooglePlay className="w-6 h-6" />
                <div>
                  <div className="text-[10px] text-slate-400">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-slate-400 text-sm">
                © 2026 IDENTIQO. All rights reserved. Made with{" "}
                <FaHeart className="inline-block w-3 h-3 text-red-500 animate-pulse" /> by IDENTIQO Team
              </p>
            </div>
            
            <div className="flex gap-6">
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms</Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Sitemap</Link>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-indigo-600 rounded-full transition-all duration-300"
            >
              <span className="text-sm text-slate-400 group-hover:text-white">Back to Top</span>
              <FaArrowUp className="w-3 h-3 text-slate-400 group-hover:text-white group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
        </div>
     </Container>


      {/* Trust Badges */}
      <div className="bg-slate-950/50 py-4">
        <Container>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="text-slate-500 text-xs flex items-center gap-1">✓ 256-bit SSL Secure</span>
            <span className="text-slate-500 text-xs flex items-center gap-1">✓ GDPR Compliant</span>
            <span className="text-slate-500 text-xs flex items-center gap-1">✓ 24/7 Support</span>
            <span className="text-slate-500 text-xs flex items-center gap-1">✓ 99.99% Uptime</span>
          </div>
        </Container>
      </div>
    </footer>
  );
}