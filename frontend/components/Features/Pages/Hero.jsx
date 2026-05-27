"use client";
import Container from "@/components/common/Container";
import { useState, useEffect } from "react";

export default function Hero() {
  const [animatedText, setAnimatedText] = useState({
    badge: false,
    heading: false,
    description: false,
    buttons: false,
    trust: false
  });

  useEffect(() => { 
    // Animate text elements sequentially
    const timers = [
      setTimeout(() => setAnimatedText(prev =>   ({ ...prev, badge: true })), 200),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, heading: true })), 400),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, description: true })), 600),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, buttons: true })), 800),
      setTimeout(() => setAnimatedText(prev => ({ ...prev, trust: true })), 1000),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f9ff] via-white to-[#eef1ff] flex items-center py-16 lg:py-20">
      {/* Background Blur Effects */}
      <div className="absolute top-[-120px] right-[-120px] w-[420px] h-[420px] bg-indigo-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-120px] left-[-120px] w-[420px] h-[420px] bg-purple-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT - Text with Animations */}
          <div className="text-left">
            {/* Badge - Fade Down */}
            <div className={`transition-all duration-700 ease-out ${
              animatedText.badge 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-8'
            }`}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-100 mb-6 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-indigo-600 font-semibold text-sm tracking-wide">
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
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-[-0.04em]">
                <span className="text-slate-900">
                  Smart Employee
                </span>
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
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
              <p className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg">
                50+ premium templates, real-time editing, and instant bulk generation
                for startups, agencies, schools, and enterprise teams.
              </p>
            </div>

            {/* Buttons - Scale Fade */}
            <div className={`transition-all duration-700 delay-300 ease-out ${
              animatedText.buttons 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-90'
            }`}>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10">Create Your Card →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button className="px-8 py-3.5 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300">
                  View Templates
                </button>
              </div> 
            </div>

            {/* Trust Indicators - Staggered Fade Up */}
            <div className={`transition-all duration-700 delay-500 ease-out ${
              animatedText.trust 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              <div className="flex flex-wrap gap-8 mt-10 pt-6 border-t border-slate-200">
                <div className="text-left">
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">HAPPY TEAMS</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    4.9
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">⭐ USER RATING</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-1">CARDS CREATED</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Cards (NO ANIMATIONS, kept exactly as original) */}
          <div className="relative flex items-center justify-center min-h-[550px] md:min-h-[600px]">
            
            {/* BACK LEFT CARD */}
            {/* <div className="absolute z-10 w-72 md:w-80 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 overflow-hidden card-back-left">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <span className="font-bold text-sm">Company Name</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 mx-auto mb-3" />
                <div className="h-3 w-3/4 bg-slate-200 rounded mx-auto mb-2" />
                <div className="h-2 w-1/2 bg-slate-100 rounded mx-auto" />
              </div>
            </div> */}

            {/* BACK RIGHT CARD */}
            {/* <div className="absolute z-10 w-72 md:w-80 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 overflow-hidden card-back-right">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="font-bold text-sm">Tech Corp</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 mx-auto mb-3" />
                <div className="h-3 w-3/4 bg-slate-200 rounded mx-auto mb-2" />
                <div className="h-2 w-1/2 bg-slate-100 rounded mx-auto" />
              </div>
            </div> */}

            {/* FRONT CENTER CARD - Main Large Card */}
            <div className="relative z-20 w-88 md:w-96 bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden card-main">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="p-7">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                      <span className="text-white text-base font-bold">B</span>
                    </div>
                    <h3 className="font-extrabold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      BORCELLE
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-9 h-6 rounded-md bg-gradient-to-br from-slate-200 to-slate-300" />
                    <div className="w-9 h-6 rounded-md bg-gradient-to-br from-slate-200 to-slate-300 ml-1" />
                  </div>
                </div>

                {/* Avatar with Glow */}
                <div className="relative mt-4 flex justify-center">
                  <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-2xl opacity-40" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl shadow-xl ring-4 ring-white">
                    👤
                  </div>
                </div>

                {/* Employee Info */}
                <div className="text-center mt-6">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    SAMIRA HADID
                  </h2>
                  <p className="text-indigo-500 text-base font-semibold mt-1.5">
                    Senior Graphic Designer
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full">
                      <span>📧</span> samira@borcelle.com
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full">
                      <span>📱</span> +1 234 567 890
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>EMP-2024-042</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
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
        @keyframes floatBackLeft {
          0%, 100% {
            transform: translateX(-50%) translateY(-50%) rotate(-12deg) translateX(-40px);
          }
          50% {
            transform: translateX(-50%) translateY(-50%) rotate(-14deg) translateX(-48px);
          }
        }

        @keyframes floatBackRight {
          0%, 100% {
            transform: translateX(-50%) translateY(-50%) rotate(12deg) translateX(40px);
          }
          50% {
            transform: translateX(-50%) translateY(-50%) rotate(14deg) translateX(48px);
          }
        }

        @keyframes floatMain {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .card-back-left {
          animation: floatBackLeft 5s ease-in-out infinite;
        }

        .card-back-right {
          animation: floatBackRight 5.5s ease-in-out infinite;
        }

        .card-main {
          animation: floatMain 6s ease-in-out infinite;
        }

        .card-back-left:hover,
        .card-back-right:hover {
          animation-play-state: paused;
          opacity: 0.9;
        }

        .card-main:hover {
          animation-play-state: paused;
          transform: scale(1.02);
          box-shadow: 0 35px 50px -15px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
}