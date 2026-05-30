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
    // Animate text elements sequentially
    const timers = [
      setTimeout(() => setAnimatedText(prev => ({ ...prev, badge: true })), 200),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, heading: true })), 400),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, description: true })), 600),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, buttons: true })), 800),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, trust: true })), 1000),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f9ff] via-white to-[#eef1ff] flex items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      {/* Background Blur Effects - Responsive sizes */}
      <div className="absolute top-[-120px] right-[-120px] w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] bg-indigo-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] lg:w-[420px] lg:h-[420px] bg-purple-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT - Text with Animations */}
          <div className="text-left order-1 lg:order-none"> 
            {/* Badge - Fade Down */}
            <div className={`transition-all duration-700 ease-out ${
              animatedText.badge 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-8'
            }`}>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 mb-4 sm:mb-6 shadow-sm">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-indigo-600 font-semibold text-xs sm:text-sm tracking-wide">
                  ✨ Smart ID Card Creator
                </span>
              </div>
            </div>

            {/* Heading - Fade Left to Right */}
            <div className={`transition-all duration-700 delay-100 ease-out ${
              animatedText.heading 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-10'
            }`}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.15] sm:leading-[1.1] lg:leading-[1.05] tracking-[-0.02em] sm:tracking-[-0.03em] lg:tracking-[-0.04em]">
                <span className="text-slate-900">
                  Smart Employee  
                </span>
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  ID Card Generator
                </span>
              </h1>
            </div>

            {/* Description - Fade Right to Left */}
            <div className={`transition-all duration-700 delay-200 ease-out ${
              animatedText.description 
                ? 'opacity-100 translate-x-0'  
                : 'opacity-0 translate-x-10'
            }`}>
              <p className="mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed max-w-lg">
                50+ premium templates, real-time editing, and instant bulk generation
                for startups, agencies, schools, and enterprise teams.
              </p>
            </div>

            {/* Buttons - Scale Fade - SMALLER ON TABLET */}
            <div className={`transition-all duration-700 delay-300 ease-out ${
              animatedText.buttons 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-90'
            }`}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2.5 mt-6 sm:mt-7 md:mt-8">
                <Link href="/customize" className="group relative px-5 sm:px-4 md:px-8 py-3 sm:py-2 md:py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm sm:text-xs md:text-base shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto inline-flex items-center justify-center">
                  <span className="relative z-10 flex items-center justify-center gap-1">
                    Customize your card
                    <span className="sm:hidden md:inline">→</span>
                    <span className="hidden sm:inline md:hidden">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link href="/templates" className="w-full sm:w-auto px-5 sm:px-4 md:px-8 py-3 sm:py-2 md:py-3.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-bold text-sm sm:text-xs md:text-base hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300 inline-flex items-center justify-center">
                  View Templates
                </Link>
              </div>
            </div>

            {/* Trust Indicators - Staggered Fade Up */}
            <div className={`transition-all duration-700 delay-500 ease-out ${
              animatedText.trust 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-200">
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">HAPPY TEAMS</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    4.9
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">⭐ USER RATING</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">CARDS CREATED</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Cards (Responsive) */}
          <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] xl:min-h-[600px] order-2 lg:order-none mt-8 lg:mt-0">
            
            {/* FRONT CENTER CARD - Main Large Card */}
            <div className="relative z-20 w-72 sm:w-80 md:w-88 lg:w-96 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden card-main">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="p-5 sm:p-6 md:p-7">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-xs sm:text-sm md:text-base font-bold">B</span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg md:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      BORCELLE
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-7 h-5 sm:w-8 sm:h-5 md:w-9 md:h-6 rounded-md bg-gradient-to-br from-slate-200 to-slate-300" />
                    <div className="w-7 h-5 sm:w-8 sm:h-5 md:w-9 md:h-6 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 ml-1" />
                  </div>
                </div>

                {/* Avatar with Glow */}
                <div className="relative mt-3 sm:mt-4 flex justify-center">
                  <div className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-2xl opacity-40" />
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl shadow-xl ring-4 ring-white">
                    👤
                  </div>
                </div>

                {/* Employee Info */}
                <div className="text-center mt-4 sm:mt-5 md:mt-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    SAMIRA HADID
                  </h2>
                  <p className="text-indigo-500 text-sm sm:text-base font-semibold mt-1 sm:mt-1.5">
                    Senior Graphic Designer
                  </p>
                  <div className="mt-3 sm:mt-4 flex flex-col items-center gap-2 text-xs sm:text-sm text-slate-500">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <span className="text-sm sm:text-base">📧</span> samira@borcelle.com
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                      <span className="text-sm sm:text-base">📱</span> +1 234 567 890
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap justify-between items-center gap-2 text-[8px] sm:text-[9px] md:text-[10px] font-mono text-slate-400">
                    <span>EMP-2024-042</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Active
                    </span>
                    <span>Valid: 12/2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Card Floating Animations */}
      <style jsx>{`
        @keyframes floatMain {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes floatMainMobile {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .card-main {
          animation: floatMainMobile 6s ease-in-out infinite;
        }

        .card-main:hover {
          animation-play-state: paused;
          transform: scale(1.02);
          box-shadow: 0 25px 40px -12px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
        }

        /* Responsive Animation Adjustments */
        @media (min-width: 640px) {
          .card-main {
            animation: floatMain 6s ease-in-out infinite;
          }
        }
      `}</style>
    </section>
  );
}
