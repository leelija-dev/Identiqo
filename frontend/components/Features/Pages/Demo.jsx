'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Demo() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      // On mobile, scroll by exactly one card width
      let scrollAmount;
      if (isMobile) {
        const cardWidth = 280; // Card width on mobile
        scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      } else {
        scrollAmount = window.innerWidth < 768 ? 300 : 400;
      }
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 500);
    }
  };

  // Auto-play
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          let scrollAmount;
          if (isMobile) {
            const cardWidth = 280;
            scrollAmount = cardWidth;
          } else {
            scrollAmount = window.innerWidth < 768 ? 300 : 400;
          }
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        setTimeout(checkScroll, 500);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, isMobile]);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <>
      {/* Ambient background effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[550px] md:w-[850px] h-[250px] sm:h-[350px] md:h-[450px] bg-purple-600/8 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[300px] sm:w-[450px] md:w-[650px] h-[180px] sm:h-[250px] md:h-[350px] bg-cyan-600/8 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[250px] sm:w-[400px] h-[250px] bg-pink-600/5 rounded-full blur-[90px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c0c12] to-[#0a0a0f] flex flex-col items-center justify-center px-4 sm:px-5 py-8 sm:py-10 md:py-12 overflow-hidden">
        
        {/* Decorative top element */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20" />
        
        <div className="container mx-auto max-w-[1350px] w-full relative z-10">
          
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-2">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-cyan-300 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-cyan-400/30 backdrop-blur-sm shadow-lg">
              ✨ Premium Templates Collection ✨
            </div>
            <h1 className="font-bold text-2xl sm:text-3xl md:text-5xl text-white mb-2 sm:mb-3 leading-tight px-2 tracking-tight">
              Rich ID Card Templates in{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Drawtify ID
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-light tracking-wide">
              Free Online Card Maker • 200+ Professional Designs • Instant Customization
            </p>
          </div>

          {/* Carousel Section */}
          <section className="relative mb-8 sm:mb-10 md:mb-12">
            <div 
              className="flex items-center justify-center w-full relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
            >
              
              {/* Left Arrow - Hidden on mobile, visible on tablet/desktop */}
              <button 
                onClick={() => scroll('left')}
                className={`absolute left-0 sm:-left-3 z-30 p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 hidden sm:flex items-center justify-center backdrop-blur-md
                  ${canScrollLeft 
                    ? 'bg-black/50 text-gray-300 hover:text-cyan-400 hover:scale-110 hover:shadow-cyan-500/30 border border-white/10 opacity-0 group-hover:opacity-100' 
                    : 'bg-black/30 text-gray-600 cursor-not-allowed opacity-0 border border-gray-800'
                  }`}
                aria-label="Previous"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Cards Container - Mobile optimized */}
              <div className="container mx-auto px-2 sm:px-4 overflow-hidden">
                <div 
                  ref={scrollContainerRef}
                  onScroll={checkScroll}
                  className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto py-4 sm:py-6 scroll-smooth scrollbar-hide px-1 snap-x snap-mandatory"
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth'
                  }}
                >
                  
                  {/* CARD 1: Modern Minimalist - Mobile optimized */}
                  <div className="flex-shrink-0 snap-start" style={{ width: 'calc(100vw - 32px)', maxWidth: '300px', margin: '0 auto' }}>
                    <div className="group/card relative w-full h-[380px] sm:h-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,180,216,0.4)] transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                      
                      {/* Gradient Border Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ padding: '1px', mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
                      
                      <div className="relative z-10 h-full flex flex-col p-5">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-xs font-semibold text-cyan-400 tracking-wider">PREMIUM</div>
                            <div className="text-[10px] text-gray-500 mt-1">Executive Edition</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover/card:opacity-60 transition-opacity duration-500" />
                            <div className="relative w-24 h-24 rounded-full ring-4 ring-white/10 overflow-hidden">
                              <div 
                                className="w-full h-full"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold text-white mb-1">Alexander Chen</h2>
                          <p className="text-xs text-gray-400">Chief Executive Officer</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] text-cyan-400 border border-white/10">
                            ID: VRT-2024-0891
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <div className="text-[10px] text-gray-500">Department</div>
                            <div className="text-xs text-white font-semibold">Executive</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-500">Valid Until</div>
                            <div className="text-xs text-white font-semibold">12/2026</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: Tech Innovation */}
                  <div className="flex-shrink-0 snap-start" style={{ width: 'calc(100vw - 32px)', maxWidth: '300px', margin: '0 auto' }}>
                    <div className="group/card relative w-full h-[380px] sm:h-[400px] bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(0,255,255,0.3)] transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                      
                      {/* Tech Pattern */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #00ffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, #00ffff 1px, transparent 1px, transparent 20px)'
                      }} />
                      
                      <div className="relative z-10 h-full flex flex-col p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-xs font-semibold text-cyan-400 tracking-wider">QUANTUM</div>
                            <div className="text-[10px] text-gray-500 mt-1">Tech Series</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                            <div className="w-3 h-3 bg-cyan-400 rounded-sm animate-pulse" />
                          </div>
                        </div>

                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-0 group-hover/card:opacity-70 transition-opacity duration-500" />
                            <div className="relative w-24 h-24 rounded-full ring-4 ring-cyan-500/20 overflow-hidden">
                              <div 
                                className="w-full h-full"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold text-white mb-1">Maya Rodriguez</h2>
                          <p className="text-xs text-gray-400">CTO & Tech Lead</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-cyan-500/10 rounded-full text-[10px] text-cyan-400 border border-cyan-500/20">
                            ID: QTM-2024-0789
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <div className="text-[10px] text-gray-500">Clearance</div>
                            <div className="text-xs text-white font-semibold">Level 9</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-500">Projects</div>
                            <div className="text-xs text-white font-semibold">47 Completed</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Luxury Gold */}
                  <div className="flex-shrink-0 snap-start" style={{ width: 'calc(100vw - 32px)', maxWidth: '300px', margin: '0 auto' }}>
                    <div className="group/card relative w-full h-[380px] sm:h-[400px] bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(255,215,0,0.3)] transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                      
                      {/* Gold Dust Effect */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 40%, #ffd700 1px, transparent 1px), radial-gradient(circle at 80% 70%, #ffd700 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                      }} />
                      
                      <div className="relative z-10 h-full flex flex-col p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-xs font-semibold text-amber-400 tracking-wider">ROYALE</div>
                            <div className="text-[10px] text-gray-500 mt-1">Elite Access</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <span className="text-amber-400 text-lg">👑</span>
                          </div>
                        </div>

                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full blur-xl opacity-0 group-hover/card:opacity-70 transition-opacity duration-500" />
                            <div className="relative w-24 h-24 rounded-full ring-4 ring-amber-500/20 overflow-hidden">
                              <div 
                                className="w-full h-full"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold text-white mb-1">Isabella Moretti</h2>
                          <p className="text-xs text-gray-400">Diamond Member</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-amber-500/10 rounded-full text-[10px] text-amber-400 border border-amber-500/20">
                            ID: ROY-2024-0001
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <div className="text-[10px] text-gray-500">Tier</div>
                            <div className="text-xs text-amber-400 font-semibold">Diamond</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-500">Points</div>
                            <div className="text-xs text-white font-semibold">284,500</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 4: Glassmorphism */}
                  <div className="flex-shrink-0 snap-start" style={{ width: 'calc(100vw - 32px)', maxWidth: '300px', margin: '0 auto' }}>
                    <div className="group/card relative w-full h-[380px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.15)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      
                      <div className="relative z-10 h-full flex flex-col p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-xs font-semibold text-white/80 tracking-wider">CRYSTAL</div>
                            <div className="text-[10px] text-gray-400 mt-1">Premium Access</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                            <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full" />
                          </div>
                        </div>

                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-purple-400 rounded-full blur-xl opacity-0 group-hover/card:opacity-40 transition-opacity duration-500" />
                            <div className="relative w-24 h-24 rounded-full ring-4 ring-white/20 overflow-hidden">
                              <div 
                                className="w-full h-full"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold text-white mb-1">Emma Williams</h2>
                          <p className="text-xs text-gray-400">Creative Director</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] text-white/80 border border-white/20">
                            ID: CRY-2024-0321
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <div className="text-[10px] text-gray-400">Projects</div>
                            <div className="text-xs text-white font-semibold">128 Done</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-400">Rating</div>
                            <div className="text-xs text-white font-semibold">4.9 ★</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 5: Vibrant Sunset */}
                  <div className="flex-shrink-0 snap-start" style={{ width: 'calc(100vw - 32px)', maxWidth: '300px', margin: '0 auto' }}>
                    <div className="group/card relative w-full h-[380px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(244,114,182,0.4)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #2d1b2e, #3d1f2e, #2d1b3e)',
                        backgroundSize: '200% 200%',
                        animation: 'gradientShift 6s ease infinite'
                      }}>
                      
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'radial-gradient(circle at 30% 40%, #f093fb 1px, transparent 1px)',
                        backgroundSize: '25px 25px'
                      }} />
                      
                      <div className="relative z-10 h-full flex flex-col p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-xs font-semibold text-pink-300 tracking-wider">SUNSET</div>
                            <div className="text-[10px] text-gray-400 mt-1">Creative Studio</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                            <span className="text-pink-400 text-lg">✨</span>
                          </div>
                        </div>

                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-0 group-hover/card:opacity-70 transition-opacity duration-500" />
                            <div className="relative w-24 h-24 rounded-full ring-4 ring-pink-500/20 overflow-hidden">
                              <div 
                                className="w-full h-full"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold text-white mb-1">Luna Martinez</h2>
                          <p className="text-xs text-pink-200">Brand Ambassador</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-pink-500/10 rounded-full text-[10px] text-pink-300 border border-pink-500/20">
                            ID: SUN-2024-0012
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <div className="text-[10px] text-gray-400">Region</div>
                            <div className="text-xs text-white font-semibold">Global</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-400">Campaigns</div>
                            <div className="text-xs text-white font-semibold">32 Active</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD 6: Dark Premium */}
                  <div className="flex-shrink-0 snap-start" style={{ width: 'calc(100vw - 32px)', maxWidth: '300px', margin: '0 auto' }}>
                    <div className="group/card relative w-full h-[380px] sm:h-[400px] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(118,255,3,0.3)] transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-white/5">
                      
                      {/* Cyber Grid */}
                      <div className="absolute inset-0 opacity-5 group-hover/card:opacity-10 transition-opacity duration-500" style={{
                        backgroundImage: 'linear-gradient(#76ff03 1px, transparent 1px), linear-gradient(90deg, #76ff03 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }} />
                      
                      <div className="relative z-10 h-full flex flex-col p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-xs font-semibold text-[#76ff03] tracking-wider">NEON</div>
                            <div className="text-[10px] text-gray-500 mt-1">Tech Elite</div>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-[#76ff03]/10 flex items-center justify-center border border-[#76ff03]/20">
                            <div className="w-2 h-2 bg-[#76ff03] rounded-full animate-pulse" />
                          </div>
                        </div>

                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#76ff03] to-cyan-400 rounded-full blur-xl opacity-0 group-hover/card:opacity-70 transition-opacity duration-500" />
                            <div className="relative w-24 h-24 rounded-full ring-4 ring-[#76ff03]/20 overflow-hidden">
                              <div 
                                className="w-full h-full"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-center mb-4">
                          <h2 className="text-xl font-bold text-white mb-1">Dr. James Kim</h2>
                          <p className="text-xs text-gray-400">Lead Scientist</p>
                          <div className="mt-2 inline-block px-3 py-1 bg-[#76ff03]/10 rounded-full text-[10px] text-[#76ff03] border border-[#76ff03]/20">
                            ID: NEO-2024-0567
                          </div>
                        </div>

                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/10">
                          <div>
                            <div className="text-[10px] text-gray-500">Lab</div>
                            <div className="text-xs text-white font-semibold">Quantum</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-gray-500">Patents</div>
                            <div className="text-xs text-white font-semibold">23</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Arrow - Hidden on mobile */}
              <button 
                onClick={() => scroll('right')}
                className={`absolute right-0 sm:-right-3 z-30 p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 hidden sm:flex items-center justify-center backdrop-blur-md
                  ${canScrollRight 
                    ? 'bg-black/50 text-gray-300 hover:text-purple-400 hover:scale-110 hover:shadow-purple-500/30 border border-white/10 opacity-0 group-hover:opacity-100' 
                    : 'bg-black/30 text-gray-600 cursor-not-allowed opacity-0 border border-gray-800'
                  }`}
                aria-label="Next"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Mobile swipe indicator - Enhanced */}
            <div className="flex justify-center mt-4 sm:hidden gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <div className="w-8 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
            </div>
            
            {/* Mobile scroll hint */}
            <div className="text-center mt-3 sm:hidden">
              <p className="text-[10px] text-gray-500 animate-pulse">← Swipe to explore →</p>
            </div>
          </section>

          {/* Description Section */}
          <section className="text-center mb-6 sm:mb-8">
            <div className="container mx-auto max-w-[720px] px-4">
              <p className="text-xs sm:text-sm leading-relaxed text-gray-400 font-light tracking-wide">
                Using a powerful and easy-to-use free ID card maker, you can create unique 
                customized greeting cards in a short time. Just like a professional designer, 
                fully demonstrate your creativity.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="container mx-auto px-4">
              <button 
                className="group/btn relative overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold text-xs sm:text-sm px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-1 active:scale-95 transition-all duration-300 border border-white/20 w-full sm:w-auto shadow-lg"
                onClick={() => router.push("/templates")}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Choose a Free ID Card Templates
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-2xl" />
              </button>
            </div>
          </section>

        </div>
      </section>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-start {
          scroll-snap-align: start;
        }
        .snap-mandatory {
          scroll-snap-type: x mandatory;
        }
      `}</style>
    </>
  );
}