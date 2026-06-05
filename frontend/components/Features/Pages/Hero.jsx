"use client";
import Link from "next/link";

import Container from "@/components/Common/Container";
import { useState, useEffect } from "react";

export default function Hero() {
  const [animatedText, setAnimatedText] = useState({
    badge: false,
    heading: false,
    description: false,
    buttons: false,
    trust: false,
  });

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimatedText(prev => ({ ...prev, badge: true })), 200),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, heading: true })), 400),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, description: true })), 600),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, buttons: true })), 800),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, trust: true })), 1000),
    ];
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Fixed barcode pattern
  const barcodePattern = [4, 8, 12, 6, 10, 14, 5, 9, 11, 7, 13, 8, 6, 10, 12, 4, 9, 11, 7, 13, 8, 6, 10, 14, 5, 9, 11, 7, 13, 8];

  return (
   <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fdf4ff] via-[#eef2ff] to-[#ecfeff] flex items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      {/* Background Blur Effects */}
      <div className="absolute -top-[120px] -right-[120px] w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] bg-indigo-300/20 rounded-full blur-80px" />
      <div className="absolute -bottom-[120px] -left-[120px] w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] bg-purple-300/20 rounded-full blur-80px" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT - Text */}
          <div className="text-left order-1 lg:order-none">
            <div className={`transition-all duration-700 ease-out ${animatedText.badge ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 mb-4 sm:mb-6 shadow-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-indigo-600 font-semibold text-p-xs tracking-wide">
                  ✨ Smart ID Card Creator
                </span>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-100 ease-out ${animatedText.heading ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <h1 className="text-h1-sm sm:text-h1-md md:text-h1-xl lg:text-h1-2xl font-extrabold leading-[1.15] tracking-[-0.02em]">
                Smart Employee
                <span className="block mt-1 sm:mt-2 text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text">
                  ID Card Generator
                </span>
              </h1>
            </div>

            <div className={`transition-all duration-700 delay-200 ease-out ${animatedText.description ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <p className="mt-4 sm:mt-5 md:mt-6 text-slate-600 text-p-xs sm:text-p-sm leading-relaxed max-w-lg">
                50+ premium templates, real-time editing, and instant bulk generation
                for startups, agencies, schools, and enterprise teams.
              </p>
            </div>

            <div className={`transition-all duration-700 delay-300 ease-out ${animatedText.buttons ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2.5 mt-6 sm:mt-7 md:mt-8">
                <Link href="/templates" className="group relative px-5 sm:px-4 md:px-8 py-3 sm:py-2 md:py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm sm:text-xs md:text-base shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto inline-flex items-center justify-center">
                  <span className="relative z-10 flex items-center justify-center gap-1">Explore your cards →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto px-5 sm:px-4 md:px-8 py-3 sm:py-2 md:py-3.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-bold text-sm sm:text-xs md:text-base hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300 inline-flex items-center justify-center">
                  View pricing
                </Link>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-500 ease-out ${animatedText.trust ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-200">
                <div className="text-center sm:text-left">
                  <div className="text-slate-800 text-h4-sm sm:text-h3-xs md:text-h3-sm font-black">10K+</div>
                  <div className="text-slate-500 text-p-xs font-semibold mt-1">HAPPY TEAMS</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-slate-800 text-h4-sm sm:text-h3-xs md:text-h3-sm font-black">4.9</div>
                  <div className="text-slate-500 text-p-xs font-semibold mt-1">⭐ USER RATING</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-slate-800 text-h4-sm sm:text-h3-xs md:text-h3-sm font-black">50K+</div>
                  <div className="text-slate-500 text-p-xs font-semibold mt-1">CARDS CREATED</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - 3 Premium Attractive Cards with Real Photos */}
          <div className="relative flex items-center justify-center min-h-[500px] order-2 lg:order-none mt-8 lg:mt-0">
            
            {/* CARD 1 - LEFT (Premium Gold Card with Photo) */}
            <div className="absolute left-0 z-10 w-56 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-500 hover:z-30 hover:shadow-3xl border border-amber-200">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/10 to-transparent" />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">👑</span>
                  </div>
                  <div>
                    <span className="font-bold text-amber-700 text-p-xs">PREMIUM</span>
                    <div className="text-[10px] text-amber-500">Gold Member</div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-60" />
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl rotate-3">
                      <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&h=200" 
                        alt="Premium Member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-slate-800 text-h4-xs">John Anderson</div>
                  <div className="text-[10px] text-amber-600 mt-1 font-semibold">Elite Member</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Priority Support
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Unlimited Access
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2 - CENTER (Main Premium Glass Card with Real Photo) */}
            <div className="relative z-20 mx-auto w-72 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden card-main">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-3xl" />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-md" />
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                        <span className="text-white text-lg font-bold">B</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-h4-sm">
                        BORCELLE
                      </h3>
                      <p className="text-[10px] text-slate-400">Enterprise Platinum</p>
                    </div>
                  </div>
                  <div className="w-12 h-8 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-indigo-600">RFID</span>
                  </div>
                </div>

                <div className="relative flex justify-center mb-5">
                  <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-2xl opacity-60 animate-pulse" />
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-sm" />
                    <div className="relative w-28 h-28 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/80">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200" 
                        alt="Samira Hadid"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-slate-900 text-h3-xs font-black tracking-tight">SAMIRA HADID</h2>
                  <p className="text-indigo-600 text-p-xs font-semibold mt-1">Senior Creative Director</p>
                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center justify-center gap-2 text-p-xs text-slate-600 bg-gradient-to-r from-indigo-50 to-purple-50 py-2.5 rounded-xl">
                      <span className="text-indigo-500">📧</span> samira.hadid@borcelle.com
                    </div>
                    <div className="flex items-center justify-center gap-2 text-p-xs text-slate-600 bg-gradient-to-r from-indigo-50 to-purple-50 py-2.5 rounded-xl">
                      <span className="text-indigo-500">📱</span> +1 (234) 567-8900
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mb-2">
                    <span>EMP-2024-042</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Active
                    </span>
                    <span>Exp: 12/2026</span>
                  </div>
                  <div className="h-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="flex gap-[2px]">
                      {barcodePattern.map((height, i) => (
                        <div key={i} className="w-[2px] bg-slate-700 rounded-sm" style={{ height: `${height}px` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3 - RIGHT (Premium Rose Gold Card with Photo) */}
            <div className="absolute right-0 z-10 w-56 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-2xl shadow-2xl overflow-hidden transform rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-500 hover:z-30 hover:shadow-3xl border border-rose-200">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-rose-300/10 to-transparent" />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-rose-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div>
                    <span className="font-bold text-rose-600 text-p-xs">EVENT</span>
                    <div className="text-[10px] text-rose-400">VIP Pass</div>
                  </div>
                </div>
                
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-purple-500 rounded-2xl blur-xl opacity-60" />
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl -rotate-3">
                      <img 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200" 
                        alt="Event Speaker"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-slate-800 text-h4-xs">Tech Summit</div>
                  <div className="text-[10px] text-rose-500 mt-1 font-semibold">Keynote Speaker</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 📍 Hall A • Stage 1
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> 📅 Dec 15-17, 2024
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes floatMain {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatMainMobile {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .card-main {
          animation: floatMainMobile 5s ease-in-out infinite;
          position: relative;
        }
        .card-main:hover {
          animation-play-state: paused;
          transform: scale(1.02);
          box-shadow: 0 35px 50px -20px rgba(99, 102, 241, 0.5);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        @media (min-width: 640px) {
          .card-main { animation: floatMain 5s ease-in-out infinite; }
        }
        .blur-80px { filter: blur(80px); }
      `}</style>
    </section>
  );
}