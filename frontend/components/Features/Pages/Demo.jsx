'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Demo() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400;
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
          const scrollAmount = window.innerWidth < 768 ? 300 : 400;
          scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
        setTimeout(checkScroll, 500);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <>
      {/* Ambient background effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] md:w-[800px] h-[200px] sm:h-[300px] md:h-[400px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-[250px] sm:w-[400px] md:w-[600px] h-[150px] sm:h-[200px] md:h-[300px] bg-cyan-600/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 sm:px-5 py-8 sm:py-10 md:py-12 font-opensans">
        
        {/* Decorative top element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        
        <div className="container mx-auto max-w-[1350px] w-full">
          
          {/* Title Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-2">
            <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-[10px] sm:text-xs font-montserrat font-semibold tracking-wider uppercase border border-cyan-500/20">
              Premium Templates Collection
            </div>
            <h1 className="font-montserrat font-bold text-2xl sm:text-3xl md:text-4xl text-white mb-2 sm:mb-3 leading-tight px-2">
              Rich ID Card Templates in{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Drawtify ID
              </span>
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Free Online Card Maker • Professional Designs
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
              
              {/* Left Arrow - Hidden on mobile */}
              <button 
                onClick={() => scroll('left')}
                className={`absolute left-0 sm:left-2 z-30 p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 hidden sm:block
                  ${canScrollLeft 
                    ? 'bg-gray-800 text-gray-300 hover:text-cyan-400 hover:scale-110 hover:shadow-cyan-500/20 opacity-0 group-hover:opacity-100 border border-gray-700' 
                    : 'bg-gray-900 text-gray-600 cursor-not-allowed opacity-0 border border-gray-800'
                  }`}
                aria-label="Previous"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Cards Container */}
              <div className="container mx-auto px-2 sm:px-4">
                <div 
                  ref={scrollContainerRef}
                  onScroll={checkScroll}
                  className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto py-4 sm:py-6 scroll-smooth scrollbar-hide px-1"
                >
                  
                  {/* ========== CARD 1: Executive Dark ========== */}
                  <div className="flex-shrink-0">
                    <div className="group/card relative w-[200px] sm:w-[220px] md:w-[240px] h-[300px] sm:h-[330px] md:h-[360px] bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1529] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_rgba(0,180,216,0.3)] transition-all duration-700 hover:-translate-y-2 cursor-pointer border border-white/5">
                      
                      <div className="absolute inset-0 opacity-20 group-hover/card:opacity-40 transition-opacity duration-700">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `
                            radial-gradient(circle at 20% 80%, #00b4d8 1px, transparent 1px),
                            radial-gradient(circle at 80% 20%, #cc9966 1px, transparent 1px)
                          `,
                          backgroundSize: '30px 30px'
                        }} />
                      </div>
                      
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00b4d8] via-[#cc9966] to-[#00b4d8] transform origin-left scale-x-0 group-hover/card:scale-x-100 transition-transform duration-700" />
                      
                      <div className="relative z-10 flex flex-col items-center pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6">
                        <div className="mb-1">
                          <h3 className="font-montserrat font-bold text-xs sm:text-sm tracking-[0.2em] text-[#00b4d8] group-hover/card:tracking-[0.3em] transition-all duration-500">
                            VERTEX
                          </h3>
                        </div>
                        <span className="text-[6px] sm:text-[7px] text-gray-500 font-light tracking-widest uppercase">
                          Enterprise Solutions
                        </span>
                      </div>

                      <div className="relative z-10 flex justify-center mb-3 sm:mb-4 md:mb-5">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-[#00b4d8] to-[#cc9966] rounded-full opacity-0 group-hover/card:opacity-100 blur-md transition-all duration-700 animate-spin-slow" />
                          <div className="relative w-[75px] h-[75px] sm:w-[85px] sm:h-[85px] md:w-[100px] md:h-[100px] rounded-full p-[2px] sm:p-[3px] bg-gradient-to-br from-[#00b4d8] to-[#cc9966] group-hover/card:rotate-180 transition-transform duration-1000">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10">
                              <div 
                                className="w-full h-full grayscale group-hover/card:grayscale-0 transition-all duration-700 scale-110 group-hover/card:scale-100"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 text-center px-4 sm:px-6">
                        <h2 className="font-montserrat font-bold text-sm sm:text-base md:text-lg text-white mb-1 group-hover/card:text-[#00b4d8] transition-colors duration-500">
                          Alexander Chen
                        </h2>
                        <div className="inline-block px-2 sm:px-3 py-1 bg-white/5 rounded-full border border-white/10 group-hover/card:border-[#00b4d8]/30 transition-all duration-500">
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 group-hover/card:text-[#cc9966] transition-colors duration-500 font-medium">
                            Chief Executive Officer
                          </p>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="w-14 sm:w-16 md:w-20 h-3 sm:h-4 md:h-5 opacity-70 group-hover/card:opacity-100 transition-opacity duration-500"
                              style={{
                                backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1.5px, transparent 1.5px, transparent 4px)'
                              }}
                            />
                            <p className="text-[5px] sm:text-[6px] md:text-[7px] text-gray-500 tracking-wider">VRT-2024-0891</p>
                          </div>
                          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg border border-white/10 group-hover/card:border-white/30 transition-all duration-500 flex items-center justify-center">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                              style={{
                                backgroundImage: `
                                  linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
                                  linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)
                                `,
                                backgroundSize: '5px 5px',
                                backgroundPosition: '0 0, 2.5px 2.5px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========== CARD 2: Neon Lime ========== */}
                  <div className="flex-shrink-0">
                    <div className="group/card relative w-[280px] sm:w-[340px] md:w-[380px] h-[200px] sm:h-[220px] md:h-[240px] bg-gradient-to-br from-black via-gray-900 to-black rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_rgba(118,255,3,0.3)] transition-all duration-700 hover:-translate-y-2 cursor-pointer border border-gray-800">
                      
                      <div className="absolute inset-0 opacity-10 group-hover/card:opacity-20 transition-opacity duration-700"
                        style={{
                          backgroundImage: 'linear-gradient(#76ff03 1px, transparent 1px), linear-gradient(90deg, #76ff03 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }}
                      />
                      
                      <div className="absolute inset-1 rounded-xl sm:rounded-2xl border border-[#76ff03]/20 group-hover/card:border-[#76ff03]/50 transition-all duration-500" />
                      
                      <div className="relative z-10 flex items-center h-full p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col items-center gap-2 sm:gap-3 pr-3 sm:pr-4 md:pr-6 border-r border-[#76ff03]/20">
                          <div className="bg-black/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-1 sm:py-2 border border-[#76ff03]/20">
                            <div className="text-[#76ff03] font-montserrat font-bold text-[8px] sm:text-[9px] md:text-[10px] tracking-widest text-center">
                              NEON<span className="text-white">LABS</span>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute -inset-1 bg-[#76ff03] rounded-full opacity-0 group-hover/card:opacity-100 blur-md transition-all duration-500" />
                            <div className="relative w-[55px] h-[65px] sm:w-[65px] sm:h-[75px] md:w-[75px] md:h-[85px] rounded-lg sm:rounded-xl overflow-hidden border-2 border-[#76ff03]/30 group-hover/card:border-[#76ff03] transition-all duration-500">
                              <div 
                                className="w-full h-full grayscale group-hover/card:grayscale-0 transition-all duration-700"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between h-full pl-3 sm:pl-4 md:pl-6">
                          <div>
                            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#76ff03] rounded-full animate-pulse shadow-lg shadow-[#76ff03]/50" />
                              <span className="text-[6px] sm:text-[7px] md:text-[8px] text-[#76ff03] tracking-widest uppercase">Active</span>
                            </div>
                            <h2 className="font-montserrat font-bold text-lg sm:text-xl md:text-2xl text-white mb-1 group-hover/card:text-[#76ff03] transition-colors duration-500">
                              Maya Rodriguez
                            </h2>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-medium">Creative Director</p>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="w-20 sm:w-24 md:w-28 h-4 sm:h-5 md:h-6 opacity-80 group-hover/card:opacity-100 transition-opacity duration-500"
                                style={{
                                  backgroundImage: 'repeating-linear-gradient(90deg, #76ff03 0px, #76ff03 2px, transparent 2px, transparent 5px)'
                                }}
                              />
                              <p className="text-[5px] sm:text-[6px] md:text-[7px] text-gray-500 mt-1 tracking-wider">NL-2024-0456</p>
                            </div>
                            <div className="text-[5px] sm:text-[6px] md:text-[7px] text-gray-500 text-right leading-relaxed">
                              Clearance: Level 5<br />
                              Valid: 12/2025
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========== CARD 3: Royal Gold ========== */}
                  <div className="flex-shrink-0">
                    <div className="group/card relative w-[200px] sm:w-[220px] md:w-[240px] h-[300px] sm:h-[330px] md:h-[360px] bg-gradient-to-br from-[#1a1a1a] via-[#2d1f0e] to-[#1a1a1a] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_rgba(204,153,102,0.3)] transition-all duration-700 hover:-translate-y-2 cursor-pointer border border-[#cc9966]/10">
                      
                      <div className="absolute inset-0 opacity-30 group-hover/card:opacity-50 transition-opacity duration-700"
                        style={{
                          backgroundImage: `
                            radial-gradient(circle at 30% 40%, #cc9966 0.5px, transparent 0.5px),
                            radial-gradient(circle at 70% 60%, #ffd700 0.5px, transparent 0.5px),
                            radial-gradient(circle at 50% 80%, #cc9966 0.5px, transparent 0.5px)
                          `,
                          backgroundSize: '25px 25px'
                        }}
                      />
                      
                      <div className="absolute inset-2 rounded-xl sm:rounded-2xl border border-[#cc9966]/10 group-hover/card:border-[#cc9966]/40 transition-all duration-500" />
                      
                      <div className="relative z-10 flex flex-col items-center h-full pt-6 sm:pt-7 md:pt-8">
                        <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 transform group-hover/card:scale-125 group-hover/card:rotate-12 transition-all duration-500 drop-shadow-lg">
                          👑
                        </div>
                        
                        <h3 className="font-cinzel font-bold text-xs sm:text-sm text-[#cc9966] tracking-[0.3em] mb-1">
                          ROYALE
                        </h3>
                        <span className="text-[6px] sm:text-[7px] text-[#cc9966]/40 tracking-widest uppercase mb-4 sm:mb-5 md:mb-6">
                          Elite Membership
                        </span>

                        <div className="relative mb-3 sm:mb-4 md:mb-5">
                          <div className="absolute -inset-1 bg-gradient-to-r from-[#cc9966] to-[#ffd700] rounded-full opacity-0 group-hover/card:opacity-100 blur transition-all duration-500" />
                          <div className="relative w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] rounded-full p-[2px] bg-gradient-to-br from-[#cc9966] to-[#ffd700]">
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                              <div 
                                className="w-full h-full grayscale group-hover/card:grayscale-0 transition-all duration-700"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <h2 className="font-cinzel font-bold text-sm sm:text-base md:text-lg text-[#cc9966] mb-1 group-hover/card:text-[#ffd700] transition-colors duration-500">
                          Isabella Moretti
                        </h2>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-[#cc9966]/50 font-medium">Diamond Tier</p>

                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 bg-gradient-to-t from-[#cc9966]/5 to-transparent">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="w-12 sm:w-14 md:w-16 h-3 sm:h-4 opacity-70 group-hover/card:opacity-100 transition-opacity duration-500"
                                style={{
                                  backgroundImage: 'repeating-linear-gradient(90deg, #cc9966 0px, #cc9966 1.5px, transparent 1.5px, transparent 4px)'
                                }}
                              />
                              <p className="text-[5px] sm:text-[6px] text-[#cc9966]/30 tracking-widest mt-1">ROY-2024-0001</p>
                            </div>
                            <div className="text-[#cc9966]/50 text-lg sm:text-xl md:text-2xl group-hover/card:scale-110 group-hover/card:text-[#ffd700] transition-all duration-500">
                              ◆
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========== CARD 4: Tech Blue ========== */}
                  <div className="flex-shrink-0">
                    <div className="group/card relative w-[280px] sm:w-[340px] md:w-[380px] h-[200px] sm:h-[220px] md:h-[240px] bg-gradient-to-br from-[#0a1628] via-[#0f2444] to-[#0a1628] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_rgba(0,119,182,0.3)] transition-all duration-700 hover:-translate-y-2 cursor-pointer border border-[#0077b6]/10">
                      
                      <div className="absolute inset-0 opacity-5 group-hover/card:opacity-15 transition-opacity duration-700"
                        style={{
                          backgroundImage: `
                            linear-gradient(90deg, #0077b6 1px, transparent 1px),
                            linear-gradient(#0077b6 1px, transparent 1px)
                          `,
                          backgroundSize: '40px 40px'
                        }}
                      />
                      
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent animate-pulse" />
                      
                      <div className="relative z-10 flex items-center h-full p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col items-center gap-2 sm:gap-3 pr-3 sm:pr-4 md:pr-6 border-r border-[#0077b6]/20">
                          <div className="text-center">
                            <div className="text-[#00b4d8] font-montserrat font-bold text-xl sm:text-2xl md:text-[28px] leading-none mb-1 group-hover/card:scale-110 transition-transform duration-500 drop-shadow-lg drop-shadow-cyan-500/30">
                              Q
                            </div>
                            <div className="text-[5px] sm:text-[6px] text-[#00b4d8]/40 tracking-[0.3em]">QUANTUM</div>
                          </div>
                          
                          <div className="relative">
                            <div className="relative w-[55px] h-[60px] sm:w-[60px] sm:h-[68px] md:w-[70px] md:h-[75px] rounded-lg overflow-hidden border border-[#0077b6]/20 group-hover/card:border-[#00b4d8] transition-all duration-500">
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/40 to-transparent z-10" />
                              <div 
                                className="w-full h-full grayscale group-hover/card:grayscale-0 transition-all duration-700"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between h-full pl-3 sm:pl-4 md:pl-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <div className="px-1.5 sm:px-2 py-0.5 bg-[#00b4d8]/10 rounded border border-[#00b4d8]/20">
                                <span className="text-[6px] sm:text-[7px] text-[#00b4d8] tracking-wider">LEVEL 9</span>
                              </div>
                            </div>
                            <h2 className="font-montserrat font-bold text-lg sm:text-xl md:text-2xl text-white mb-1">
                              Dr. James Kim
                            </h2>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 font-medium">Lead Research Scientist</p>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="flex gap-1">
                                {[...Array(4)].map((_, i) => (
                                  <div key={i} className="w-1 sm:w-1.5 h-3 sm:h-4 bg-[#00b4d8]/40 rounded-full group-hover/card:bg-[#00b4d8] transition-all duration-300 shadow-lg shadow-cyan-500/20"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                  />
                                ))}
                              </div>
                              <p className="text-[5px] sm:text-[6px] md:text-[7px] text-gray-500 mt-1 tracking-wider">QTM-2024-0789</p>
                            </div>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border border-[#00b4d8]/20 rounded group-hover/card:border-[#00b4d8]/50 transition-all duration-500"
                              style={{
                                backgroundImage: `
                                  linear-gradient(45deg, #00b4d8 25%, transparent 25%, transparent 75%, #00b4d8 75%, #00b4d8),
                                  linear-gradient(45deg, #00b4d8 25%, transparent 25%, transparent 75%, #00b4d8 75%, #00b4d8)
                                `,
                                backgroundSize: '6px 6px sm:7px 7px md:8px 8px',
                                backgroundPosition: '0 0, 3px 3px sm:3.5px 3.5px md:4px 4px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========== CARD 5: Frost Glass ========== */}
                  <div className="flex-shrink-0">
                    <div className="group/card relative w-[200px] sm:w-[220px] md:w-[240px] h-[300px] sm:h-[330px] md:h-[360px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] transition-all duration-700 hover:-translate-y-2 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01]" />
                      
                      <div className="relative z-10 flex flex-col items-center h-full pt-7 sm:pt-8 md:pt-10">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center mb-3 sm:mb-4 group-hover/card:rotate-12 transition-transform duration-500 shadow-lg border border-white/10">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-lg shadow-lg shadow-purple-500/20" />
                        </div>
                        
                        <h3 className="font-montserrat font-bold text-xs sm:text-sm text-white/80 tracking-[0.2em] mb-1">
                          CRYSTAL
                        </h3>
                        <span className="text-[6px] sm:text-[7px] text-white/30 tracking-widest uppercase mb-4 sm:mb-5 md:mb-6">
                          Premium Access
                        </span>

                        <div className="relative mb-3 sm:mb-4 md:mb-5">
                          <div className="relative w-[70px] h-[70px] sm:w-[78px] sm:h-[78px] md:w-[85px] md:h-[85px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-2 border-white/10 group-hover/card:border-white/30 transition-all duration-500">
                            <div 
                              className="w-full h-full grayscale group-hover/card:grayscale-0 transition-all duration-700"
                              style={{
                                backgroundImage: "url('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            />
                          </div>
                        </div>

                        <h2 className="font-montserrat font-bold text-sm sm:text-base md:text-lg text-white/90 mb-1">
                          Emma Williams
                        </h2>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] text-white/40 font-medium">Creative Lead</p>

                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 bg-white/[0.02] backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="w-12 sm:w-14 md:w-16 h-3 sm:h-4 opacity-40 group-hover/card:opacity-70 transition-opacity duration-500"
                                style={{
                                  backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1.5px, transparent 1.5px, transparent 4px)'
                                }}
                              />
                              <p className="text-[5px] sm:text-[6px] text-white/20 tracking-wider mt-1">CRY-2024-0321</p>
                            </div>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/5 flex items-center justify-center group-hover/card:bg-white/10 transition-all duration-500 border border-white/10">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-cyan-400 to-purple-400 shadow-lg shadow-purple-500/20" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ========== CARD 6: Sunset Gradient ========== */}
                  <div className="flex-shrink-0">
                    <div className="group/card relative w-[280px] sm:w-[340px] md:w-[380px] h-[200px] sm:h-[220px] md:h-[240px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_rgba(244,114,182,0.3)] transition-all duration-700 hover:-translate-y-2 cursor-pointer border border-white/10"
                      style={{
                        background: 'linear-gradient(135deg, #2d1b2e, #3d1f2e, #2d1b3e, #3d1f2e)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 3s ease infinite'
                      }}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                      
                      <div className="absolute inset-0 opacity-20 group-hover/card:opacity-40 transition-opacity duration-500"
                        style={{
                          backgroundImage: 'radial-gradient(circle at 30% 40%, #f093fb 1px, transparent 1px), radial-gradient(circle at 70% 60%, #ff6b6b 1px, transparent 1px)',
                          backgroundSize: '50px 50px'
                        }}
                      />
                      
                      <div className="relative z-10 flex items-center h-full p-3 sm:p-4 md:p-6">
                        <div className="flex flex-col items-center gap-2 sm:gap-3 pr-3 sm:pr-4 md:pr-6 border-r border-white/20">
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl mb-1 group-hover/card:scale-125 transition-transform duration-500 drop-shadow-lg">🌅</div>
                            <div className="text-[6px] sm:text-[7px] text-pink-300/80 tracking-[0.3em] font-montserrat">SUNSET</div>
                          </div>
                          
                          <div className="relative">
                            <div className="relative w-[55px] h-[65px] sm:w-[60px] sm:h-[72px] md:w-[70px] md:h-[80px] rounded-lg sm:rounded-xl overflow-hidden shadow-lg border-2 border-pink-400/20 group-hover/card:border-pink-400/60 transition-all duration-500">
                              <div 
                                className="w-full h-full group-hover/card:scale-110 transition-transform duration-700"
                                style={{
                                  backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')",
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between h-full pl-3 sm:pl-4 md:pl-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <span className="text-[6px] sm:text-[7px] text-pink-300/80 tracking-widest border border-pink-400/20 px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-sm">
                                ELITE
                              </span>
                            </div>
                            <h2 className="font-cinzel font-bold text-lg sm:text-xl md:text-2xl text-white mb-1 drop-shadow-lg">
                              Luna Martinez
                            </h2>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-pink-200/80 font-medium drop-shadow">Brand Ambassador</p>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div className="text-[5px] sm:text-[6px] md:text-[7px] text-pink-200/50 leading-relaxed drop-shadow">
                              ID: SUN-2024-0012<br />
                              Division: Global
                            </div>
                            <div className="text-pink-300/40 text-sm sm:text-base md:text-lg group-hover/card:rotate-45 group-hover/card:text-pink-300/80 transition-all duration-500">
                              ✦
                            </div>
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
                className={`absolute right-0 sm:right-2 z-30 p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 hidden sm:block
                  ${canScrollRight 
                    ? 'bg-gray-800 text-gray-300 hover:text-purple-400 hover:scale-110 hover:shadow-purple-500/20 opacity-0 group-hover:opacity-100 border border-gray-700' 
                    : 'bg-gray-900 text-gray-600 cursor-not-allowed opacity-0 border border-gray-800'
                  }`}
                aria-label="Next"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Mobile swipe indicator */}
            <div className="flex justify-center mt-4 sm:hidden">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <div className="w-6 h-1.5 rounded-full bg-cyan-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="text-center mb-6 sm:mb-8">
            <div className="container mx-auto max-w-[700px] px-4">
              <p className="text-xs sm:text-sm leading-relaxed text-gray-500">
                Using a powerful and easy-to-use free ID card maker, you can create unique 
                customized greeting cards in a short time. Just like a professional designer, 
                fully demonstrate your creativity.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="container mx-auto px-4">
              <button className="group/btn relative overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-montserrat font-bold text-xs sm:text-sm px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 border border-white/10 w-full sm:w-auto"
               onClick={() => router.push("/templates")}>
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
      `}</style>
    </>
  );
}