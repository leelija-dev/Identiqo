// app/pricing/page.jsx
"use client";
import Container from "../../Common/Container";
import { useState, useEffect } from "react";
import { 
  FiCheck, FiZap, FiUsers, FiShield, FiCloud, FiHeadphones, 
  FiTrendingUp, FiStar, FiDollarSign, FiArrowRight, FiLock,
  FiCreditCard, FiMessageCircle, FiBriefcase, FiClock
} from "react-icons/fi";
import { FaCrown, FaGem, FaRocket, FaChartLine } from "react-icons/fa";
import { MdSecurity, MdVerified } from "react-icons/md";
import { BsShieldLockFill, BsFillStarFill } from "react-icons/bs";

export default function Pricing() {
  const [currentTier, setCurrentTier] = useState("professional");
  const [isYearly, setIsYearly] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animatePrice, setAnimatePrice] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setMounted(true);
    // Generate random positions only on client side
    const newParticles = [...Array(20)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    setAnimatePrice(true);
    const timer = setTimeout(() => setAnimatePrice(false), 400);
    return () => clearTimeout(timer);
  }, [currentTier, isYearly]);

  const plans = {
    essential: {
      name: "Essential",
      icon: <FiZap className="w-6 h-6" />,
      price: "$29",
      priceYearly: "$278",
      note: "billed monthly",
      noteYearly: "billed yearly · 2 months free",
      description: "Perfect for small teams and startups",
      features: [
        "Up to 60 employee IDs",
        "12 premium holographic templates",
        "3D card preview & QR codes",
        "Digital & print ready",
        "Email support (48h)",
        "Basic analytics"
      ],
      buttonText: "Get Started",
      popular: false,
      gradient: "from-emerald-500 to-teal-500",
      lightGradient: "from-emerald-50 to-teal-50",
      accent: "emerald"
    },
    professional: {
      name: "Professional",
      icon: <FaRocket className="w-6 h-6" />,
      price: "$79",
      priceYearly: "$758",
      note: "billed monthly",
      noteYearly: "billed yearly · save 20%",
      description: "Best for growing businesses and teams",
      features: [
        "Unlimited employee IDs",
        "40+ holographic & AR templates",
        "Custom 3D card builder",
        "Bulk CSV + REST API / webhooks",
        "24/7 priority support",
        "White-label & SSO ready",
        "Real-time sync"
      ],
      buttonText: "Start Free Trial",
      popular: true,
      gradient: "from-indigo-600 to-purple-600",
      lightGradient: "from-indigo-50 to-purple-50",
      accent: "indigo"
    },
    enterprise: {
      name: "Enterprise",
      icon: <FaCrown className="w-6 h-6" />,
      price: "Custom",
      priceYearly: "Custom",
      note: "tailored for 1k+ employees",
      noteYearly: "dedicated infrastructure",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited IDs + advanced security",
        "On-prem / hybrid deployment",
        "Biometric & NFC integration",
        "Dedicated solution architect",
        "99.99% SLA + 24/7 VIP support",
        "Custom compliance & audit logs",
        "SAML / OIDC / SCIM"
      ],
      buttonText: "Contact Sales",
      popular: false,
      gradient: "from-amber-500 to-orange-600",
      lightGradient: "from-amber-50 to-orange-50",
      accent: "amber"
    }
  };

  const getPrice = (plan) => {
    if (plan.price === "Custom") return "Custom";
    return isYearly ? plan.priceYearly : plan.price;
  };

  const getPeriod = (plan) => {
    if (plan.price === "Custom") return "";
    return isYearly ? "/year" : "/month";
  };

  const getNote = (plan) => {
    if (plan.price === "Custom") return isYearly ? "enterprise · custom terms" : plan.note;
    return isYearly ? plan.noteYearly : plan.note;
  };

  const faqs = [
    { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
    { q: "Is there a free trial?", a: "Yes, all paid plans come with a 14-day free trial. No credit card required." },
    { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans." },
    { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no hidden fees." },
  ];

  const comparisonRows = [
    { feature: "Employee IDs limit", essential: "Up to 60", professional: "Unlimited", enterprise: "Unlimited" },
    { feature: "Templates available", essential: "12", professional: "40+", enterprise: "All + Custom" },
    { feature: "Export formats", essential: "PNG", professional: "PNG, PDF", enterprise: "All formats" },
    { feature: "QR Codes", essential: "Basic", professional: "Dynamic", enterprise: "Custom" },
    { feature: "Team collaboration", essential: "—", professional: "5 members", enterprise: "Unlimited" },
    { feature: "API access", essential: "—", professional: "—", enterprise: "Full REST API" },
    { feature: "Support", essential: "Email (48h)", professional: "Priority chat", enterprise: "24/7 dedicated" },
    { feature: "White-label", essential: "—", professional: "✓", enterprise: "Full white-label" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-x-hidden">
      
      {/* Animated Background Elements - Fixed positions (no random on server) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        
        {/* Floating Particles - Only render on client side to avoid hydration mismatch */}
        {mounted && particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-float"
            style={{
              top: particle.top,
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 md:px-8 text-center">
      <Container className="max-w-4xl">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-5 py-2 rounded-full mb-6 shadow-sm animate-bounce-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-indigo-600 font-semibold text-sm tracking-wide">
              ✨ SIMPLE, TRANSPARENT PRICING
            </span>
          </div>

          {/* Main Heading - IMPROVED */}
          <div className="space-y-3 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="text-slate-900">Choose the</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mt-1">
                perfect plan
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-3">
              for your team. Start for free and upgrade when you need more.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-10 animate-fade-up animation-delay-400">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="group relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none hover:scale-105"
              style={{ backgroundColor: isYearly ? '#6366F1' : '#CBD5E1' }}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${
                  isYearly ? 'left-9' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly
              <span className="ml-2 text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full animate-pulse">
                Save 20%
              </span>
            </span>
          </div>
       </Container>
      </section>

      {/* Pricing Cards - COLORFUL NOW */}
      <section className="py-12 px-4 md:px-8 relative z-10">
        <Container className="max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(plans).map(([key, plan], idx) => (
              <div
                key={key}
                className={`relative rounded-2xl transition-all duration-500 hover:-translate-y-3 ${
                  plan.popular ? 'scale-105 shadow-2xl z-20' : 'shadow-lg hover:shadow-xl'
                }`}
                style={{ animationDelay: `${idx * 200}ms` }}
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg animate-bounce-slow">
                      🔥 MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Card Border Glow on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${plan.gradient} opacity-0 transition-opacity duration-500 blur-xl -z-10 ${
                  hoveredCard === key ? 'opacity-50' : ''
                }`} />

                <div className={`bg-white h-full rounded-2xl overflow-hidden border ${plan.popular ? 'border-indigo-200 shadow-xl' : 'border-slate-100'}`}>
                  {/* Card Header - COLORFUL BACKGROUND */}
                  <div className={`p-6 text-center bg-gradient-to-br ${plan.lightGradient}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white shadow-lg mx-auto mb-4 transition-transform duration-300 ${
                      hoveredCard === key ? 'scale-110 rotate-6' : ''
                    }`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="p-6 text-center border-b border-slate-100">
                    <div className={`text-5xl font-extrabold text-slate-900 transition-all duration-300 ${
                      animatePrice ? 'scale-110 text-indigo-600' : ''
                    }`}>
                      {getPrice(plan)}
                      <span className="text-base font-normal text-slate-400">{getPeriod(plan)}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{getNote(plan)}</div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 group/item transition-all duration-300 hover:translate-x-1">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mt-0.5 transition-transform duration-300 group-hover/item:scale-110`}>
                            <FiCheck className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => alert(`✨ "${plan.name}" plan selected. Our team will contact you.`)}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl'
                          : plan.name === "Essential"
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-200 hover:shadow-xl'
                      }`}
                    >
                      {plan.buttonText} <FiArrowRight className="w-4 h-4" />
                    </button>
                    {plan.name === "Professional" && (
                      <p className="text-xs text-center text-slate-400 mt-3">14-day free trial • Cancel anytime</p>
                    )}
                    {plan.name === "Essential" && (
                      <p className="text-xs text-center text-slate-400 mt-3">No credit card required</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

     

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.5; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}