// app/pricing/page.j
"use client";
import Container from "../../Common/Container";
import { useState } from "react";
import { 
  FiCheck, FiZap, FiArrowRight 
} from "react-icons/fi";
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

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 text-center">
        <Container className="max-w-4xl">
          {/* Badge - No animation */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-5 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-indigo-600 font-semibold text-sm">
              SIMPLE, TRANSPARENT PRICING
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
            <span className="text-slate-900">Choose the</span>
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              perfect plan
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-3">
            for your team. Start for free and upgrade when you need more.
          </p>

          {/* Billing Toggle - Simple animation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 rounded-full transition-colors duration-200"
              style={{ backgroundColor: isYearly ? '#6366F1' : '#CBD5E1' }}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-200 shadow-md ${
                  isYearly ? 'left-9' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly
              <span className="ml-2 text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4 relative z-10">
        <Container className="max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(PLANS).map(([key, plan]) => (
              <div
                key={key}
                className={`relative rounded-2xl transition-all duration-200 ${
                  plan.popular ? 'scale-105 shadow-2xl z-20' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`bg-white h-full rounded-2xl overflow-hidden border ${plan.popular ? 'border-indigo-200' : 'border-slate-100'}`}>
                  {/* Header */}
                  <div className={`p-6 text-center bg-gradient-to-br ${plan.lightGradient}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white shadow-lg mx-auto mb-4 transition-transform duration-200 ${
                      hoveredCard === key ? 'scale-105' : ''
                    }`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="p-6 text-center border-b border-slate-100">
                    <div className="text-5xl font-extrabold text-slate-900">
                      {getPrice(plan)}
                      <span className="text-base font-normal text-slate-400">{getPeriod(plan)}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{getNote(plan)}</div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mt-0.5 flex-shrink-0`}>
                            <FiCheck className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => alert(`Selected ${plan.name} plan`)}
                      className={`w-full py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                          : plan.name === "Essential"
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:opacity-90'
                      }`}
                    >
                      {plan.buttonText} <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}