// app/pricing/page.jsx
"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Container from "../../Common/Container";
import SectionTitle from "../../Common/SectionTitle";
import Button from "@/components/Common/Button";
import { plansApi, unwrapListResponse } from "@/lib/api";
import {
  buildPlansForDisplay,
  getDisplayPlan,
  getAvailableTiers,
  TIER_ORDER,
} from "@/lib/pricingUtils";

export default function PricingPage() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [apiPlans, setApiPlans] = useState([]);
  const pricingRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await plansApi.list();
        if (!cancelled) {
          setApiPlans(unwrapListResponse(data));
        }
      } catch (error) {
        if (!cancelled) {
          setApiPlans([]);
        }
      } finally {
        if (!cancelled) {
          setPlansLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const plans = useMemo(() => buildPlansForDisplay(apiPlans, isYearly ? 'yearly' : 'monthly'), [apiPlans, isYearly]);
  const availableTiers = useMemo(() => getAvailableTiers(plans), [plans]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasScrolled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (pricingRef.current) observer.observe(pricingRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  const handleYearlyToggle = () => {
    setIsYearly((prev) => !prev);
  };

  const handleCTAClick = (tier) => {
    if (tier === "enterprise") {
      router.push("/contact");
      return;
    }
    router.push("/signup");
  };

  const hasPlans = availableTiers.length > 0;

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    width: Math.random() * 3 + 1,
    height: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 12 + 6,
    opacity: Math.random() * 0.15 + 0.03,
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      
      {/* Animated Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-80px animate-pulse" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-r from-emerald-200/15 to-teal-200/15 rounded-full blur-80px animate-pulse delay-1000" />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-gradient-to-r from-amber-200/10 to-orange-200/10 rounded-full blur-80px animate-pulse delay-2000" />
      </div>

      {/* Hidden Decorative Box – scroll revealed */}
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[300px] sm:h-[400px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-120px transition-all duration-1000 ${
        hasScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'
      }`} />
      <div className={`fixed left-0 bottom-20 w-[180px] sm:w-[250px] h-[250px] sm:h-[300px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-120px transition-all duration-1000 delay-300 ${
        hasScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32'
      }`} />

      {/* Floating Particles */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-indigo-400/20"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `floatParticle ${particle.duration}s infinite alternate ease-in-out`,
                animationDelay: `${particle.delay}s`, 
                opacity: particle.opacity
              }}
            />
          ))}
        </div>
      )}

      <Container className="relative z-10 py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        
        {/* Pricing Heading Section */}
        <div className={`text-center max-w-4xl mx-auto mb-8 sm:mb-12 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-sm animate-fade-in-up">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 animate-pulse" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-indigo-500" />
            </span>
            <span className="text-indigo-600 font-semibold text-[10px] sm:text-p-xs tracking-wide">
              SIMPLE, TRANSPARENT PRICING
            </span>
          </div>

          <SectionTitle
            title="Choose the perfect plan"
            subtitle="for your team"
          />
          
          <p className="text-slate-500 text-p-xs sm:text-p-sm max-w-2xl mx-auto mt-3 sm:mt-4 px-4 animate-fade-in-up">
            Start for free and upgrade when you need more.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 animate-fade-in-up">
            <span className={`text-[11px] sm:text-p-xs font-medium transition-all duration-300 ${!isYearly ? 'text-slate-800 scale-105' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={handleYearlyToggle}
              className="relative w-14 sm:w-16 h-7 sm:h-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg group"
              style={{ backgroundColor: isYearly ? '#2563eb' : '#cbdff2' }}
            >
              <span
                className={`absolute top-1 w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full transition-all duration-300 shadow-md ${
                  isYearly ? 'left-[calc(100%-1.5rem)] sm:left-[calc(100%-1.75rem)]' : 'left-1'
                } group-hover:scale-105`}
              />
            </button>
            <span className={`text-[11px] sm:text-p-xs font-medium transition-all duration-300 flex items-center gap-1 sm:gap-1.5 ${isYearly ? 'text-slate-800 scale-105' : 'text-slate-500'}`}>
              Yearly
              <span className="text-[9px] sm:text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 sm:px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                Save 20%
              </span>
            </span>
          </div>
        </div>
        
        {/* Pricing Cards Grid */}
        <div
          ref={pricingRef}
          className={`transition-all duration-1000 ${
            hasScrolled ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}
        >
          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-blue-500/20 shadow-2xl rounded-3xl p-6 sm:p-8 animate-pulse">
                  <div className="h-10 w-40 bg-slate-200 rounded-full mb-4" />
                  <div className="h-12 w-32 bg-slate-200 rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-full" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-5/6" />
                  </div>
                  <div className="h-12 w-full bg-slate-200 rounded-xl mt-6" />
                </div>
              ))}
            </div>
          ) : !hasPlans ? (
            <div className="text-center text-slate-500 py-12">
              <p className="text-p-sm font-medium">No subscription plans are available yet.</p>
              <p className="text-p-xs mt-2">Plans are managed from the admin dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {availableTiers.map((tier) => {
                const currentPlan = plans[tier];
                const display = getDisplayPlan(currentPlan, isYearly);
                const displayPrice = display?.price ?? '';
                const displayNote = display?.note ?? '';
                const periodText = display?.periodText ?? '';
                
                return (
                  <div
                    key={tier}
                    className="bg-white/80 backdrop-blur-sm border border-blue-500/20 shadow-2xl rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_30px_50px_-20px_rgba(0,0,0,0.3)] hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="relative">
                      {tier === "professional" && (
                        <div className="absolute -top-2 -right-2 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
                      )}
                      <h3 className="text-slate-800 text-h4-sm sm:text-h3-sm font-bold mb-2">
                        {currentPlan?.name || tier.charAt(0).toUpperCase() + tier.slice(1)}
                      </h3>
                      <div className="text-slate-800 text-h3-sm sm:text-h2-sm md:text-h2-lg font-extrabold tracking-tighter mb-1 relative">
                        {currentPlan?.isCustom ? (
                          <span className="text-transparent bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text">
                            {displayPrice}
                          </span>
                        ) : (
                          <>
                            {displayPrice}
                            <span className="text-slate-500 text-[11px] sm:text-p-xs md:text-p-sm font-normal tracking-normal ml-1">
                              {periodText}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 mb-4 sm:mb-6 flex items-center gap-2 flex-wrap min-h-[20px]">
                      <span className="inline-block w-1 h-1 rounded-full bg-slate-400" />
                      {displayNote}
                    </div>

                    <ul className="space-y-2 sm:space-y-3 flex-grow">
                      {(currentPlan?.features ?? []).map((feature, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-start sm:items-center gap-2 sm:gap-3 text-slate-600 text-[11px] sm:text-p-xs font-medium group hover:translate-x-1 transition-all duration-300 cursor-default"
                        >
                          <span className={`w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${currentPlan?.gradient ?? ''} rounded-lg flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-0.5 sm:mt-0`}>
                            ✓
                          </span>
                          <span className="group-hover:text-slate-800 transition-colors duration-300 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 sm:mt-8">
                      <Button
                        onClick={() => handleCTAClick(tier)}
                        variant="primary"
                        size="lg"
                        className="w-full text-sm sm:text-base py-2.5 sm:py-3"
                      >
                        {tier === "enterprise" ? "Contact Sales →" : "Launch ID Suite →"}
                      </Button>

                      {tier === "professional" && (
                        <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-3 sm:mt-4 flex items-center justify-center gap-1">
                          <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
                          No credit card required for trial
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </Container>

      <style jsx>{`
        @keyframes floatParticle {
          0% { transform: translate(0, 0); opacity: 0.05; }
          100% { transform: translate(15px, -20px); opacity: 0.25; }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-gradient { background-size: 200% auto; animation: gradient 3s linear infinite; }
        .animate-pulse { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
        .blur-80px { filter: blur(60px); }
        .blur-120px { filter: blur(80px); }
        
        @media (min-width: 640px) {
          .blur-80px { filter: blur(80px); }
          .blur-120px { filter: blur(120px); }
        }
      `}</style>
    </div>
  );
}