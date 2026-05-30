// app/pricing/page.tsx
"use client";
import Container from "../../Common/Container";
import { useState } from "react";
import { 
  FiCheck, FiZap, FiArrowRight, FiChevronDown
} from "react-icons/fi";

import { useRouter } from "next/navigation";
import { FaRocket, FaCrown } from "react-icons/fa";

// Static data outside component
const PLANS = {
  essential: {
    name: "Essential",
    icon: <FiZap className="w-6 h-6" />,
    price: "$29",
    priceYearly: "$278",
    note: "billed monthly",
    noteYearly: "billed yearly",
    description: "Perfect for small teams",
    features: [
      "Up to 60 employee IDs",
      "12 premium templates",
      "3D card preview",
      "Digital & print ready",
      "Email support"
    ],
    buttonText: "Get Started",
    popular: false,
    gradient: "from-emerald-500 to-teal-500",
    lightGradient: "from-emerald-50 to-teal-50"
  },
  professional: {
    name: "Professional",
    icon: <FaRocket className="w-6 h-6" />,
    price: "$79",
    priceYearly: "$758",
    note: "billed monthly",
    noteYearly: "billed yearly",
    description: "Best for growing businesses",
    features: [
      "Unlimited employee IDs",
      "40+ templates",
      "Custom 3D builder",
      "API access",
      "24/7 priority support"
    ],
    buttonText: "Start Free Trial",
    popular: true,
    gradient: "from-indigo-600 to-purple-600",
    lightGradient: "from-indigo-50 to-purple-50"
  },
  enterprise: {
    name: "Enterprise",
    icon: <FaCrown className="w-6 h-6" />,
    price: "Custom",
    priceYearly: "Custom",
    note: "tailored for 1k+ employees",
    noteYearly: "custom terms",
    description: "For large organizations",
    features: [
      "Unlimited IDs",
      "All templates",
      "On-prem deployment",
      "Dedicated architect",
      "24/7 VIP support"
    ],
    buttonText: "Contact Sales",
    popular: false,
    gradient: "from-amber-500 to-orange-600",
    lightGradient: "from-amber-50 to-orange-50"
  }
};

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
   const router = useRouter();

  const getPrice = (plan) => {
    if (plan.price === "Custom") return "Custom";
    return isYearly ? plan.priceYearly : plan.price;
  };

  const getPeriod = (plan) => {
    if (plan.price === "Custom") return "";
    return isYearly ? "/year" : "/month";
  };

  const getNote = (plan) => {
    if (plan.price === "Custom") return isYearly ? "enterprise plan" : plan.note;
    return isYearly ? plan.noteYearly : plan.note;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* Simple Background - Just one subtle blur, no animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/15 rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Added tablet responsive padding */}
      <section className="relative pt-20 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 text-center">
        <Container className="max-w-4xl mx-auto">
          {/* Badge - No animation */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-indigo-600 font-semibold text-xs sm:text-sm">
              SIMPLE, TRANSPARENT PRICING
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="text-slate-900">Choose the</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              perfect plan
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mt-3 sm:mt-4">
            for your team. Start for free and upgrade when you need more.
          </p>

          {/* Billing Toggle - Simple animation */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 sm:w-16 h-7 sm:h-8 rounded-full transition-colors duration-200"
              style={{ backgroundColor: isYearly ? '#6366F1' : '#CBD5E1' }}
            >
              <span
                className={`absolute top-[3px] sm:top-1 w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full transition-all duration-200 shadow-md ${
                  isYearly ? 'left-[calc(100%-1.4rem)] sm:left-9' : 'left-[3px] sm:left-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly
              <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-green-600 font-semibold bg-green-100 px-1.5 sm:px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </Container>
      </section>

      {/* Pricing Cards - Responsive grid for tablet */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 relative z-10">
        <Container className="max-w-7xl mx-auto">
          {/* 
            Grid responsive breakpoints:
            - Mobile: 1 column (default)
            - Tablet: 2 columns (md:grid-cols-2)
            - Desktop: 3 columns (lg:grid-cols-3)
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`relative rounded-2xl transition-all duration-200 ${
                  plan.popular ? 'md:scale-105 shadow-2xl z-20' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`bg-white h-full rounded-2xl overflow-hidden border ${plan.popular ? 'border-indigo-200' : 'border-slate-100'}`}>
                  {/* Header - Responsive padding */}
                  <div className={`p-4 sm:p-5 md:p-6 text-center bg-gradient-to-br ${plan.lightGradient}`}>
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white shadow-lg mx-auto mb-3 sm:mb-4 transition-transform duration-200 ${
                      hoveredCard === key ? 'scale-105' : ''
                    }`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">{plan.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-500">{plan.description}</p>
                  </div>

                  {/* Price - Responsive font sizes */}
                  <div className="p-4 sm:p-5 md:p-6 text-center border-b border-slate-100">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
                      {getPrice(plan)}
                      <span className="text-sm sm:text-base font-normal text-slate-400">{getPeriod(plan)}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-400 mt-1">{getNote(plan)}</div>
                  </div>

                  {/* Features - Responsive spacing */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="space-y-2 sm:space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 sm:gap-3">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mt-0.5 flex-shrink-0`}>
                            <FiCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button - Responsive */}
                  <div className="p-4 sm:p-5 md:p-6 pt-0">
                    <button
                      onClick={() => alert(`Selected ${plan.name} plan`)}
                      className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                        plan.popular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                          : plan.name === "Essential"
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90'
                      }`}
                    >
                      {plan.buttonText} <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Plans Button */}
          <div className="flex justify-center mt-12 sm:mt-16">
      <button
        onClick={() => router.push("/pricing")}
        className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-200 hover:border-indigo-400 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <span className="text-indigo-600 font-semibold text-sm sm:text-base">
          View All Plans
        </span>

        <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
        </Container>
      </section>
    </div>
  );
}