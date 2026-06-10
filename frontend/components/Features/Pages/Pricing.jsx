// app/pricing/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Container from "../../Common/Container";
import SectionTitle from "../../Common/SectionTitle";
import Button from "@/components/Common/Button";  

export default function PricingPage() {
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState("essential");
  const [isYearly, setIsYearly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Typewriter animation states
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  
  // For sliding pill and content animation
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const [contentDirection, setContentDirection] = useState("right");
  const [animating, setAnimating] = useState(false);
  const pricingRef = useRef(null);
  const tierRefs = {
    essential: useRef(null),
    professional: useRef(null),
    enterprise: useRef(null),
  };
  const tiersOrder = ["essential", "professional", "enterprise"];

  // Typewriter animation effect
  useEffect(() => {
    const texts = ["for your team", "for you"];
    const currentText = texts[textIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  const plans = {
    essential: {
      name: "Essential",
      price: "$29",
      priceYearly: "$278",
      note: "billed monthly · cancel anytime",
      noteYearly: "billed yearly · 2 months free",
      features: [
        "Up to 60 employee IDs",
        "12 premium holographic templates",
        "3D card preview & QR codes",
        "Digital & print ready",
        "Email support (48h)",
        "Basic analytics"
      ],
      gradient: "from-emerald-500 to-teal-500",
      lightGradient: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      badgeColor: "bg-emerald-100 text-emerald-700"
    },
    professional: {
      name: "Professional",
      price: "$79",
      priceYearly: "$758",
      note: "billed monthly · save with yearly",
      noteYearly: "billed yearly · save 20% instantly",
      features: [
        "Unlimited employee IDs",
        "40+ holographic & AR templates",
        "Custom 3D card builder",
        "Bulk CSV + REST API / webhooks",
        "24/7 priority support",
        "White-label & SSO ready",
        "Real-time sync"
      ],
      gradient: "from-indigo-600 to-purple-600",
      lightGradient: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
      badgeColor: "bg-indigo-100 text-indigo-700"
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      priceYearly: "Custom",
      note: "tailored for 1k+ employees",
      noteYearly: "dedicated infrastructure",
      features: [
        "Unlimited IDs + advanced security",
        "On-prem / hybrid deployment",
        "Biometric & NFC integration",
        "Dedicated solution architect",
        "99.99% SLA + 24/7 VIP support",
        "Custom compliance & audit logs",
        "SAML / OIDC / SCIM"
      ],
      gradient: "from-amber-500 to-orange-600",
      lightGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      badgeColor: "bg-amber-100 text-amber-700"
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update pill position
  useEffect(() => {
    if (!mounted) return;
    const updatePill = () => {
      const activeRef = tierRefs[currentTier]?.current;
      if (activeRef && activeRef.parentElement) {
        const parentRect = activeRef.parentElement.getBoundingClientRect();
        const btnRect = activeRef.getBoundingClientRect();
        setPillStyle({
          left: btnRect.left - parentRect.left,
          width: btnRect.width,
        });
      }
    };
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [currentTier, mounted]);

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

  const handleTierChange = (tier) => {
    if (tier === currentTier || animating) return;
    
    const oldIndex = tiersOrder.indexOf(currentTier);
    const newIndex = tiersOrder.indexOf(tier);
    const direction = newIndex > oldIndex ? "right" : "left";
    setContentDirection(direction);
    setAnimating(true);
    
    setAnimatePrice(false);
    setTimeout(() => {
      setCurrentTier(tier);
      setAnimatePrice(true);
      setTimeout(() => setAnimating(false), 400);
    }, 200);
  };

  useEffect(() => {
    if (animatePrice) {
      const timer = setTimeout(() => setAnimatePrice(false), 400);
      return () => clearTimeout(timer);
    }
  }, [animatePrice]);

  const handleYearlyToggle = () => setIsYearly(!isYearly);

  const handleCTAClick = () => {
    const planName = currentTier === 'essential' ? 'Essential' : (currentTier === 'professional' ? 'Professional' : 'Enterprise');
    alert(`✨ "${planName}" plan selected. Our ID card team will contact you to set up your employee ID system. (Demo)`);
  };

  const currentPlan = plans[currentTier];
  const displayPrice = isYearly && currentTier !== "enterprise" ? currentPlan.priceYearly : currentPlan.price;
  const displayNote = isYearly && currentTier !== "enterprise" ? currentPlan.noteYearly : currentPlan.note;
  const periodText = currentTier === "enterprise" ? "" : ` / ${isYearly ? 'year' : 'month'}`;

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

  const contentAnimationClass = animating
    ? contentDirection === "right"
      ? "animate-slideOutLeft"
      : "animate-slideOutRight"
    : animatePrice
    ? contentDirection === "right"
      ? "animate-slideInRight"
      : "animate-slideInLeft"
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      
      {/* Animated Background Glows - Mobile Optimized */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-80px animate-pulse" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-r from-emerald-200/15 to-teal-200/15 rounded-full blur-80px animate-pulse delay-1000" />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-gradient-to-r from-amber-200/10 to-orange-200/10 rounded-full blur-80px animate-pulse delay-2000" />
      </div>

      {/* Hidden Decorative Box – scroll revealed - Mobile Responsive */}
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[300px] sm:h-[400px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-120px transition-all duration-1000 ${
        hasScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-32'
      }`} />
      <div className={`fixed left-0 bottom-20 w-[180px] sm:w-[250px] h-[250px] sm:h-[300px] bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-120px transition-all duration-1000 delay-300 ${
        hasScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32'
      }`} />

      {/* Floating Particles - Reduced count for mobile */}
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
        
        {/* Pricing Heading Section - Mobile Optimized */}
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

          {/* Billing Toggle - Mobile Optimized */}
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
        
        {/* Main Split Container - Mobile Responsive Layout */}
        <div
          ref={pricingRef}
          className={`transition-all duration-1000 ${
            hasScrolled ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}
        >
          <div className="flex flex-col lg:flex-row bg-white/80 backdrop-blur-sm border border-blue-500/20 shadow-2xl rounded-3xl sm:rounded-[48px] overflow-hidden w-full transition-all duration-500 hover:shadow-[0_30px_50px_-20px_rgba(0,0,0,0.3)] min-h-[auto] lg:min-h-[580px]">
            
            {/* Left Side - Hero Section - Mobile Optimized */}
            <div className="flex-1 p-6 sm:p-8 md:p-10 lg:p-14 bg-gradient-to-br from-white via-white to-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-center">
              <div className="inline-block bg-gradient-to-r from-indigo-50 to-purple-50 px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-p-xs font-semibold text-indigo-600 w-fit mb-4 sm:mb-6 tracking-wide animate-pulse hover:animate-none transition-all">
                ✦ ID 3.0 PLATFORM
              </div>
              <h2 className="text-slate-800 text-h4-sm sm:text-h3-sm md:text-h3-lg lg:text-h2-xl font-extrabold leading-tight tracking-tight">
                Cards that <br />
                <span className="text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text animate-gradient bg-[length:200%_auto]">
                  flow
                </span> with your team.
              </h2>
              <p className="text-slate-500 text-[12px] sm:text-p-xs md:text-p-sm mt-4 sm:mt-6 leading-relaxed max-w-full lg:max-w-[90%]">
                Employee ID cards with holographic depth, real-time analytics, and API-first infrastructure. Zero hassle, infinite scale.
              </p>
              <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8 flex-wrap">
                {['✓ 14-day guarantee', '✓ SOC2 compliant', '✓ 24/7 support (Pro+)'].map((badge, idx) => (
                  <span 
                    key={idx}
                    className={`text-[10px] sm:text-xs bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-slate-500 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default ${
                      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side - Pricing Configurator - Mobile Optimized */}
            <div className="flex-[1.2] p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-slate-50 to-indigo-50/20 flex flex-col justify-center min-h-[480px] sm:min-h-[500px]">
              
              {/* Tier Options with sliding pill - Mobile Responsive */}
              <div className="relative flex gap-1 sm:gap-2 mb-6 sm:mb-8 bg-slate-100 p-1.5 sm:p-2 rounded-full w-full sm:w-fit border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
                <div
                  className="absolute top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 bg-white rounded-full shadow-md transition-all duration-300 ease-out hidden sm:block"
                  style={{
                    left: pillStyle.left,
                    width: pillStyle.width,
                  }}
                />
                {['essential', 'professional', 'enterprise'].map((tier) => (
                  <button
                    key={tier}
                    ref={tierRefs[tier]}
                    onClick={() => handleTierChange(tier)}
                    className={`relative z-10 flex-1 sm:flex-none px-3 sm:px-5 md:px-7 py-1.5 sm:py-2 rounded-full font-semibold text-[11px] sm:text-p-xs md:text-p-sm transition-colors duration-300 whitespace-nowrap ${
                      currentTier === tier
                        ? 'text-indigo-600 bg-white sm:bg-transparent shadow-sm sm:shadow-none'
                        : 'text-slate-500 hover:text-indigo-500'
                    }`}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </button>
                ))}
              </div>

              {/* Pricing Core with Slide Animation - Mobile Optimized */}
              <div className={`transition-all duration-400 ${contentAnimationClass}`}>
                <div className="relative">
                  {currentTier === "professional" && (
                    <div className="absolute -top-2 -right-2 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
                  )}
                  <div className="text-slate-800 text-h3-sm sm:text-h2-sm md:text-h2-lg font-extrabold tracking-tighter mb-1 relative">
                    {currentTier === "enterprise" ? (
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
                <div className="text-[10px] sm:text-xs text-slate-400 mb-4 sm:mb-6 flex items-center gap-2 flex-wrap">
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-400" />
                  {displayNote}
                </div>

                <ul className="space-y-2 sm:space-y-3 my-4 sm:my-6">
                  {currentPlan.features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start sm:items-center gap-2 sm:gap-3 text-slate-600 text-[11px] sm:text-p-xs font-medium group hover:translate-x-1 transition-all duration-300 cursor-default"
                    >
                      <span className={`w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r ${currentPlan.gradient} rounded-lg flex items-center justify-center text-white font-bold text-[10px] sm:text-xs shadow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-0.5 sm:mt-0`}>
                        ✓
                      </span>
                      <span className="group-hover:text-slate-800 transition-colors duration-300 leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={handleCTAClick}
                  variant="primary"
                  size="lg"
                  className="w-full mt-4 sm:mt-6 text-sm sm:text-base py-2.5 sm:py-3"
                >
                  {currentTier === "enterprise" ? "Contact Sales →" : "Launch ID Suite →"}
                </Button>

                {currentTier === "professional" && (
                  <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-3 sm:mt-4 flex items-center justify-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
                    No credit card required for trial
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

      </Container>

      <style jsx>{`
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-20px); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
          0% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(20px); }
        }
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
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out forwards; }
        .animate-slideOutLeft { animation: slideOutLeft 0.2s ease-in forwards; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; }
        .animate-slideOutRight { animation: slideOutRight 0.2s ease-in forwards; }
        .animate-gradient { background-size: 200% auto; animation: gradient 3s linear infinite; }
        .animate-pulse { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
        .blur-80px { filter: blur(60px); }
        .blur-120px { filter: blur(80px); }
        
        /* Hide scrollbar for mobile tier selector */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (min-width: 640px) {
          .blur-80px { filter: blur(80px); }
          .blur-120px { filter: blur(120px); }
        }
      `}</style>
    </div>
  );
}