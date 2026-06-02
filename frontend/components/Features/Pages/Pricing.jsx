// app/pricing/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../../Common/Container";

export default function PricingPage() {
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState("essential");
  const [isYearly, setIsYearly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);

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

  useEffect(() => {
    setAnimatePrice(true);
    const timer = setTimeout(() => setAnimatePrice(false), 400);
    return () => clearTimeout(timer);
  }, [currentTier, isYearly]);

  const handleTierChange = (tier) => {
    setCurrentTier(tier);
  };

  const handleYearlyToggle = () => {
    setIsYearly(!isYearly);
  };

  const handleCTAClick = () => {
    const planName = currentTier === 'essential' ? 'Essential' : (currentTier === 'professional' ? 'Professional' : 'Enterprise');
    alert(`✨ "${planName}" plan selected. Our ID card team will contact you to set up your employee ID system. (Demo)`);
  };

  const currentPlan = plans[currentTier];
  const displayPrice = isYearly && currentTier !== "enterprise" ? currentPlan.priceYearly : currentPlan.price;
  const displayNote = isYearly && currentTier !== "enterprise" ? currentPlan.noteYearly : currentPlan.note;
  const periodText = currentTier === "enterprise" ? "" : ` / ${isYearly ? 'year' : 'month'}`;

  // Floating particles data
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    width: Math.random() * 4 + 1,
    height: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 12 + 6,
    opacity: Math.random() * 0.2 + 0.05,
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      
      {/* Animated Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-r from-emerald-200/15 to-teal-200/15 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-gradient-to-r from-amber-200/10 to-orange-200/10 rounded-full blur-[100px] animate-pulse delay-2000" />
      </div>

      {/* Floating Particles - Client Side Only */}
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

      <Container className="relative z-10 py-12 sm:py-16">
        
        {/* Pricing Heading Section */}
        <div className={`text-center max-w-4xl mx-auto mb-12 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-5 py-2 rounded-full mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 animate-pulse" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-indigo-600 font-semibold text-sm tracking-wide">
              SIMPLE, TRANSPARENT PRICING
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0a2540] mb-4 tracking-tight">
            Choose the perfect
            <span className="bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"> plan</span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#5a6e8a] max-w-2xl mx-auto">
            for your team. Start for free and upgrade when you need more.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium transition-all duration-300 ${!isYearly ? 'text-[#0a2540] scale-105' : 'text-[#5a6e8a]'}`}>
              Monthly
            </span>
            <button
              onClick={handleYearlyToggle}
              className="relative w-16 h-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg group"
              style={{ backgroundColor: isYearly ? '#2563eb' : '#cbdff2' }}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${
                  isYearly ? 'left-[calc(100%-1.75rem)]' : 'left-1'
                } group-hover:scale-105`}
              />
            </button>
            <span className={`text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${isYearly ? 'text-[#0a2540] scale-105' : 'text-[#5a6e8a]'}`}>
              Yearly
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full shadow-sm">
                Save 20%
              </span>
            </span>
          </div>
        </div>
        
        {/* Main Split Container */}
        <div className="flex flex-col lg:flex-row min-h-[60vh] bg-white/80 backdrop-blur-sm border border-blue-500/20 shadow-2xl rounded-[48px] overflow-hidden w-full transition-all duration-500 hover:shadow-[0_30px_50px_-20px_rgba(0,0,0,0.3)]">
          
          {/* Left Side - Hero Section with Entrance Animation */}
          <div className={`flex-1 p-8 sm:p-10 md:p-14 bg-gradient-to-br from-white via-white to-[#fefefe] border-r border-[#e9f0f8] flex flex-col justify-center transition-all duration-700 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            {/* Badge with pulse animation */}
            <div className="inline-block bg-gradient-to-r from-[#eef4ff] to-[#e0edff] px-4 py-1.5 rounded-full text-xs font-semibold text-blue-600 w-fit mb-6 tracking-wide animate-pulse hover:animate-none transition-all">
              ✦ ID 3.0 PLATFORM
            </div>
            
            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-[#0a2540] tracking-tight">
              Cards that <br />
              <span className="bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                flow
              </span> with your team.
            </h2>
            
            {/* Subheading */}
            <p className="text-[#5a6e8a] text-sm sm:text-base mt-6 leading-relaxed max-w-[90%]">
              Employee ID cards with holographic depth, real-time analytics, and API-first infrastructure. Zero hassle, infinite scale.
            </p>
            
            {/* Trust Badges with staggered animation */}
            <div className="flex gap-3 mt-8 flex-wrap">
              {['✓ 14-day guarantee', '✓ SOC2 compliant', '✓ 24/7 support (Pro+)'].map((badge, idx) => (
                <span 
                  key={idx}
                  className={`text-xs bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[#5a6e8a] border border-[#e2edf7] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-default ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right Side - Pricing Configurator */}
          <div className={`flex-[1.2] p-8 sm:p-10 md:p-12 bg-gradient-to-br from-[#fafcff] to-[#f5f9fe] flex flex-col justify-center transition-all duration-700 delay-300 ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            
            {/* Tier Options with animation */}
            <div className="flex gap-2 mb-8 bg-[#f0f3f8] p-2 rounded-full w-fit border border-[#e2edf7] shadow-inner">
              {['essential', 'professional', 'enterprise'].map((tier, idx) => (
                <button
                  key={tier}
                  onClick={() => handleTierChange(tier)}
                  className={`px-4 sm:px-7 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 relative overflow-hidden ${
                    currentTier === tier
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'text-[#5a6e8a] hover:bg-white/50 hover:scale-102'
                  }`}
                >
                  <span className="relative z-10">
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                  </span>
                  {currentTier === tier && (
                    <span className="absolute inset-0 bg-white rounded-full animate-pulse opacity-50" />
                  )}
                </button>
              ))}
            </div>

            {/* Pricing Core with Animation */}
            <div className={`transition-all duration-400 ${animatePrice ? 'animate-fadeSlideUp' : ''}`}>
              {/* Price Display with glow effect */}
              <div className="relative">
                {currentTier === "professional" && (
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
                )}
                <div className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-[#0a2540] mb-1 relative">
                  {currentTier === "enterprise" ? (
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {displayPrice}
                    </span>
                  ) : (
                    <>
                      <span className="bg-gradient-to-r from-[#0a2540] to-[#1a344d] bg-clip-text text-transparent">
                        {displayPrice}
                      </span>
                      <span className="text-base sm:text-lg text-[#5a6e8a] font-normal tracking-normal ml-1">
                        {periodText}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs text-[#8ba0bc] mb-6 flex items-center gap-2">
                <span className="inline-block w-1 h-1 rounded-full bg-[#8ba0bc]" />
                {displayNote}
              </div>

              {/* Features List with staggered animation */}
              <ul className="space-y-3 my-6">
                {currentPlan.features.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-center gap-3 text-sm font-medium text-[#2c3e66] group hover:translate-x-1 transition-all duration-300 cursor-default"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <span className={`w-5 h-5 bg-gradient-to-r ${currentPlan.gradient} rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      ✓
                    </span>
                    <span className="group-hover:text-[#0a2540] transition-colors duration-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button with hover effects */}
              <button
                onClick={handleCTAClick}
                className={`w-full py-4 bg-gradient-to-r ${currentPlan.gradient} text-white rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 mt-6 group overflow-hidden relative`}
              >
                <span className="relative z-10">
                  {currentTier === "enterprise" ? "Contact Sales →" : "Launch ID Suite →"}
                </span>
                <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </button>

              {/* Additional note for professional plan */}
              {currentTier === "professional" && (
                <p className="text-center text-xs text-[#8ba0bc] mt-4 flex items-center justify-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
                  No credit card required for trial
                </p>
              )}
            </div>
          </div>
        </div>

      </Container>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translate(0, 0);
            opacity: 0.05;
          }
          100% {
            transform: translate(20px, -25px);
            opacity: 0.3;
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.4s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}