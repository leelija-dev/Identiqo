// app/features/page.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import Container from "@/components/Common/Container";

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef([]);
  const leftScrollRef = useRef(null);
  const featureContainerRef = useRef(null);
  const [isStickyActive, setIsStickyActive] = useState(false);

  const features = [
    {
      id: "state1",
      title: "Exploded Variable Mapping",
      description: "Break identity structures apart dynamically. Link layout objects safely to live employee tracking metadata vectors without breaking absolute container logic parameters.",
      cardState: "state1"
    },
    {
      id: "state2",
      title: "Ultra‑Precision Vector Engine",
      description: "Pass your rendering layers through physical mathematical grids. Generate crisp vector output files optimized perfectly for enterprise laser printing devices.",
      cardState: "state2"
    },
    {
      id: "state3",
      title: "Asymmetric Batch Pipeline",
      description: "Compile complex identity volumes concurrently. Cascade card generations through independent browser process clusters with near‑zero UI frame degradation.",
      cardState: "state3"
    }
  ];

  // Observe when feature container enters viewport to activate sticky
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyActive(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    if (featureContainerRef.current) {
      observer.observe(featureContainerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Update active index based on scroll inside left panel
  useEffect(() => {
    const handleScroll = () => {
      if (!leftScrollRef.current) return;
      const container = leftScrollRef.current;
      const scrollTop = container.scrollTop;
      const sections = sectionRefs.current;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section) continue;
        if (scrollTop >= section.offsetTop - 24) {
          if (activeIndex !== i) setActiveIndex(i);
          break;
        }
      }
    };

    const container = leftScrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex]);

  const activeFeature = features[activeIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* Hero Section Preview */}
      <div className="h-[60vh] flex items-center justify-center text-center border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-5 py-2 rounded-full mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 animate-pulse" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-indigo-600 font-semibold text-sm tracking-wide">
              POWERFUL FEATURES
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4">
            Everything you need
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
              to create stunning ID cards
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Scroll down to explore our powerful capabilities
          </p>
        </div>
      </div>

      {/* Sticky Feature Section */}
      <div
        ref={featureContainerRef}
        className={`w-full bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 transition-all duration-300 ${
          isStickyActive ? "sticky top-0 h-screen overflow-hidden" : ""
        }`}
      >
        <div className="h-full w-full">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 h-full items-center">
              
              {/* LEFT: Scrollable text panels */}
              <div className="h-full flex items-center">
                <div
                  ref={leftScrollRef}
                  className="overflow-y-auto h-[70vh] lg:h-[80vh] pr-4 lg:pr-8 custom-scrollbar"
                >
                  <div className="flex flex-col gap-20 pb-10">
                    {features.map((feature, idx) => (
                      <div
                        ref={(el) => (sectionRefs.current[idx] = el)}
                        key={feature.id}
                        className={`story-node transition-all duration-500 pl-8 border-l-2 ${
                          activeIndex === idx
                            ? "opacity-100 translate-x-0 border-indigo-500"
                            : "opacity-40 -translate-x-5 border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-indigo-500 text-sm font-mono mb-3">
                          <span>0{idx + 1}</span>
                          <span className="w-8 h-px bg-indigo-300"></span>
                          <span>0{features.length}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800 mb-3">
                          {feature.title}
                        </h2>
                        <p className="text-slate-600 text-base leading-relaxed max-w-md">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: 3D Card (stays visible, changes animation) */}
              <div className="hidden lg:block">
                <div className="w-full rounded-3xl bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-xl flex items-center justify-center perspective-2000 relative overflow-hidden" style={{ height: "450px" }}>
                  
                  {/* Card clones for batch effect (state3 only) */}
                  <div
                    className={`absolute w-[320px] h-[200px] rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeFeature.cardState === "state3"
                        ? "opacity-60 translate-y-6 -translate-z-20 rotate-x-[45deg] -rotate-y-[15deg] rotate-z-[35deg]"
                        : "opacity-0 translate-y-0 rotate-0"
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  />
                  <div
                    className={`absolute w-[320px] h-[200px] rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      activeFeature.cardState === "state3"
                        ? "opacity-30 -translate-y-6 -translate-z-40 rotate-x-[45deg] -rotate-y-[15deg] rotate-z-[35deg]"
                        : "opacity-0 translate-y-0 rotate-0"
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  />

                  {/* Main Card */}
                  <div
                    className={`relative w-[320px] h-[200px] rounded-2xl bg-gradient-to-br from-white to-slate-50 border shadow-xl transition-all duration-800 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${
                      activeFeature.cardState === "state1"
                        ? "rotate-x-[25deg] -rotate-y-[30deg] rotate-z-[10deg] shadow-[-20px_30px_60px_rgba(0,0,0,0.15)]"
                        : activeFeature.cardState === "state2"
                        ? "rotate-x-0 rotate-y-0 rotate-z-0 scale-105 border-emerald-400 bg-emerald-50/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                        : "rotate-x-[45deg] -rotate-y-[15deg] rotate-z-[35deg] -translate-y-12"
                    }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Vector grid overlay (state2) */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-opacity duration-400 pointer-events-none ${
                        activeFeature.cardState === "state2" ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        backgroundImage: `linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)`,
                        backgroundSize: "15px 15px",
                      }}
                    />

                    {/* Blueprint tags (state1) */}
                    <div
                      className={`absolute -left-8 -top-6 bg-indigo-500 text-white text-[11px] font-bold px-2 py-1 rounded shadow-md transition-all duration-600 whitespace-nowrap ${
                        activeFeature.cardState === "state1"
                          ? "opacity-100 translate-x-[-40px] translate-y-[-20px] translate-z-16"
                          : "opacity-0 translate-x-0 translate-y-0"
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      // MAC‑ADDR‑LOC
                    </div>
                    <div
                      className={`absolute right-2 bottom-14 bg-indigo-500 text-white text-[11px] font-bold px-2 py-1 rounded shadow-md transition-all duration-600 ${
                        activeFeature.cardState === "state1"
                          ? "opacity-100 translate-x-[180px] translate-y-[100px] translate-z-20"
                          : "opacity-0 translate-x-0 translate-y-0"
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      // SYS‑TXT‑NODE
                    </div>

                    {/* Card content */}
                    <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-1.5 bg-slate-400 rounded-full" />
                        <div className="w-8 h-6 border border-slate-300 rounded-md" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold tracking-wider text-indigo-500 mb-1">
                          SECURE OPERATOR
                        </div>
                        <div className="font-display text-lg font-bold text-slate-800">
                          Morgan Vance
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Section - Pricing Preview */}
      <div className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Ready to get started?
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8">
              Choose the perfect plan for your team and start creating professional ID cards today.
            </p>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              View Pricing →
            </button>
          </div>
        </Container>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 4px;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        .rotate-x-\\[25deg\\] {
          transform: rotateX(25deg);
        }
        .-rotate-y-\\[30deg\\] {
          transform: rotateY(-30deg);
        }
        .rotate-z-\\[10deg\\] {
          transform: rotateZ(10deg);
        }
        .rotate-x-\\[45deg\\] {
          transform: rotateX(45deg);
        }
        .-rotate-y-\\[15deg\\] {
          transform: rotateY(-15deg);
        }
        .rotate-z-\\[35deg\\] {
          transform: rotateZ(35deg);
        }
        .translate-z-16 {
          transform: translateZ(16px);
        }
        .translate-z-20 {
          transform: translateZ(20px);
        }
        .-translate-z-20 {
          transform: translateZ(-20px);
        }
        .-translate-z-40 {
          transform: translateZ(-40px);
        }
        .transform-gpu {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        @media (max-width: 1024px) {
          .story-node {
            border-left: none !important;
            padding-left: 0 !important;
            background: white;
            border-radius: 24px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
          }
          .overflow-y-auto {
            height: auto !important;
            overflow-y: visible !important;
          }
          .sticky {
            position: relative !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
}