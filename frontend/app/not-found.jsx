// app/not-found.jsx
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden px-4 py-12">
      {/* Subtle floating orb */}
      <div className="absolute top-20 left-10 w-36 h-36 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-2xl animate-float-1" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto text-center animate-fade-in-up">
        {/* Two‑layer card container */}
        <div className="relative w-72 h-44 mb-8">
          {/* Back card – completely hidden until revealed */}
          <div className="back-card absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-300"
               style={{ opacity: 0, transform: 'scale(0.5)' }}>
            <p className="text-h1-md font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              404 Not Found
            </p>
          </div>

          {/* Front card wrapper */}
          <div className="card-wrapper absolute inset-0">
            {/* Intact front card – now shows 404 directly */}
            <div className="card absolute inset-0 bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-2xl border border-slate-300 overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600" />
              <div className="p-5 flex items-center justify-center h-full">
                <p className="text-h1-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  404 Not Found
                </p>
              </div>
            </div>

            {/* Left broken half (hidden until break) */}
            <div className="broken-left absolute top-0 left-0 w-1/2 h-full overflow-hidden opacity-0">
              <div className="w-[200%] h-full bg-gradient-to-b from-white to-slate-50 rounded-l-2xl shadow-2xl border border-slate-300">
                <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <div className="p-5 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-slate-200/80 border border-slate-300 flex items-center justify-center text-2xl">⚠️</div>
                  <div className="text-left">
                    <p className="text-a-xs font-bold text-text-slate-800">System Error</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right broken half */}
            <div className="broken-right absolute top-0 right-0 w-1/2 h-full overflow-hidden opacity-0">
              <div className="w-[200%] h-full bg-gradient-to-b from-white to-slate-50 rounded-r-2xl shadow-2xl border border-slate-300 -translate-x-1/2">
                <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600" />
                <div className="p-5 flex items-center gap-5 translate-x-1/2">
                  <div className="w-14 h-14 rounded-full bg-slate-200/80 border border-slate-300 flex items-center justify-center text-2xl">❌</div>
                  <div className="text-left">
                    <p className="text-a-xs font-bold text-text-slate-800">Not Found</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Giant 404 (after reveal) */}
       

        <p className="text-p-xs text-text-slate-700 mb-8 max-w-md mx-auto opacity-0 animate-revealText">
          This page doesn't exist. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-revealButtons">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-a-xs"
          >
            ← Back to Home
          </Link>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white border border-border-gray-300 text-text-slate-700 font-semibold shadow-sm hover:shadow-md hover:border-indigo-400 hover:text-indigo-600 transition-all text-a-xs"
          >
            Browse Templates
          </Link>
        </div>
      </div>

      <style jsx>{`
        .back-card {
          will-change: transform, opacity;
          animation: revealBackCard 0.5s ease-out forwards;
          animation-delay: 1.4s;
        }
        .card {
          will-change: transform;
          animation: cardFall 1.2s ease-in forwards;
        }
        .broken-left {
          will-change: transform;
          animation: breakLeft 0.6s ease-out forwards;
          animation-delay: 1.2s;
        }
        .broken-right {
          will-change: transform;
          animation: breakRight 0.6s ease-out forwards;
          animation-delay: 1.2s;
        }
        .animate-reveal404 {
          will-change: opacity;
          animation: reveal 0.5s ease-out forwards;
          animation-delay: 1.8s;
          opacity: 0;
        }
        .animate-revealText {
          will-change: opacity;
          animation: reveal 0.5s ease-out forwards;
          animation-delay: 2s;
          opacity: 0;
        }
        .animate-revealButtons {
          will-change: opacity;
          animation: reveal 0.5s ease-out forwards;
          animation-delay: 2.2s;
          opacity: 0;
        }

        @keyframes cardFall {
          0% { transform: translateY(-120%) rotate(0deg); opacity: 1; }
          60% { transform: translateY(15%) rotate(0deg); opacity: 1; }
          100% { transform: translateY(0%) rotate(0deg); opacity: 1; }
        }
        @keyframes breakLeft {
          0% { opacity: 1; transform: translateX(0) rotate(0deg); }
          100% { opacity: 1; transform: translateX(-70%) rotate(-20deg); }
        }
        @keyframes breakRight {
          0% { opacity: 1; transform: translateX(0) rotate(0deg); }
          100% { opacity: 1; transform: translateX(70%) rotate(20deg); }
        }
        @keyframes revealBackCard {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes reveal {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}