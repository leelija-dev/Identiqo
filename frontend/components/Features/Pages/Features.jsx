
"use client";
import Container from "@/components/common/Container";
import { useState } from "react";
import { 
  FiZap, FiGrid, FiUpload, FiLock, FiPrinter, FiGlobe, 
  FiSmartphone, FiShield, FiCloud, FiUsers, FiStar, FiTrendingUp,
  FiDownload, FiEye, FiEdit
} from "react-icons/fi";
import { 
  MdQrCodeScanner, MdSpeed, MdSecurity, MdCloudUpload 
} from "react-icons/md";
import { 
  BsPrinterFill, BsShieldLockFill, BsGrid3X3GapFill 
} from "react-icons/bs";
import { 
  FaMagic, FaRocket, FaPalette, FaRegGem, FaLayerGroup, FaCrown 
} from "react-icons/fa";
import { TbTemplate, TbBrandGoogleAnalytics } from "react-icons/tb";

export default function Features() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Features", icon: <FiGrid className="w-4 h-4" /> },
    { id: "design", label: "Design", icon: <FaPalette className="w-4 h-4" /> },
    { id: "workflow", label: "Workflow", icon: <FiZap className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <FiShield className="w-4 h-4" /> },
  ];

  const features = {
    all: [
      { id: 1, icon: <TbTemplate className="w-8 h-8" />, title: "50+ Premium Templates", desc: "Professionally designed templates for every industry - corporate, education, healthcare, events, and more.", color: "from-purple-500 to-pink-500", stat: "5000+", statLabel: "Downloads", category: "design" },
      { id: 2, icon: <FiZap className="w-8 h-8" />, title: "Real-Time Editing", desc: "See changes instantly as you type. No waiting, no refreshing - just smooth, real-time updates.", color: "from-blue-500 to-cyan-500", stat: "0ms", statLabel: "Latency", category: "workflow" },
      { id: 3, icon: <FiUpload className="w-8 h-8" />, title: "Bulk Generation", desc: "Create hundreds of ID cards at once with CSV import. Perfect for large teams and organizations.", color: "from-green-500 to-emerald-500", stat: "1000+", statLabel: "Cards/Min", category: "workflow" },
      { id: 4, icon: <FiLock className="w-8 h-8" />, title: "Bank-Grade Security", desc: "Your data never leaves your device. 100% client-side encryption for complete privacy.", color: "from-red-500 to-orange-500", stat: "256-bit", statLabel: "Encryption", category: "security" },
      { id: 5, icon: <BsPrinterFill className="w-8 h-8" />, title: "Print Ready Output", desc: "Optimized for all major card printers including Evolis, Zebra, Fargo, and Magicard.", color: "from-indigo-500 to-purple-500", stat: "99.9%", statLabel: "Compatibility", category: "workflow" },
      { id: 6, icon: <FiGlobe className="w-8 h-8" />, title: "No Account Needed", desc: "Start creating immediately. No sign-up, no email required - just pure design freedom.", color: "from-teal-500 to-green-500", stat: "0", statLabel: "Sign-ups", category: "security" },
      { id: 7, icon: <FiSmartphone className="w-8 h-8" />, title: "Mobile Responsive", desc: "Create and edit ID cards on any device - desktop, tablet, or mobile phone.", color: "from-yellow-500 to-orange-500", stat: "100%", statLabel: "Responsive", category: "design" },
      { id: 8, icon: <MdQrCodeScanner className="w-8 h-8" />, title: "QR Codes & Barcodes", desc: "Generate dynamic QR codes and barcodes for access control and digital verification.", color: "from-pink-500 to-rose-500", stat: "Instant", statLabel: "Generation", category: "design" },
      { id: 9, icon: <FaPalette className="w-8 h-8" />, title: "Custom Branding", desc: "Add your logo, brand colors, and custom fonts. White-label ready for agencies.", color: "from-violet-500 to-purple-500", stat: "Unlimited", statLabel: "Brands", category: "design" },
      { id: 10, icon: <FaMagic className="w-8 h-8" />, title: "AI-Powered Design", desc: "Smart layout suggestions and automatic alignment for perfect card designs every time.", color: "from-amber-500 to-orange-500", stat: "AI", statLabel: "Powered", category: "design" },
      { id: 11, icon: <FiCloud className="w-8 h-8" />, title: "Cloud Backup", desc: "Automatic cloud saves with version history. Never lose your work again.", color: "from-sky-500 to-blue-500", stat: "Auto", statLabel: "Backup", category: "workflow" },
      { id: 12, icon: <FiUsers className="w-8 h-8" />, title: "Team Collaboration", desc: "Invite team members to collaborate on card designs with role-based access.", color: "from-indigo-500 to-blue-500", stat: "Unlimited", statLabel: "Members", category: "workflow" },
    ]
  };

  const getFilteredFeatures = () => {
    if (activeFilter === "all") return features.all;
    return features.all.filter(f => f.category === activeFilter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 md:px-8 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-3xl" />

       <Container className="text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 px-5 py-2.5 rounded-full mb-6 shadow-sm">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            <span className="text-indigo-600 font-semibold text-sm tracking-wide">
              ✨ POWERFUL FEATURES
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">
            Everything you need to
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mt-2">
              create perfect ID cards
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            No design skills required. Our intuitive editor puts professional results at your fingertips.
            Trusted by over 10,000+ businesses worldwide.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">10,000+</div>
              <div className="text-sm text-slate-500 mt-1">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">4.9</div>
              <div className="text-sm text-slate-500 mt-1">⭐ Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">50,000+</div>
              <div className="text-sm text-slate-500 mt-1">Cards Created</div>
            </div>
          </div>
       </Container>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 md:px-8">
       <Container>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-8 px-4 md:px-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredFeatures().map((feature, index) => (
              <div
                key={feature.id}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 leading-relaxed mb-4">
                  {feature.desc}
                </p>

                {/* Divider */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {feature.stat}
                      </div>
                      <div className="text-xs font-medium text-slate-400">
                        {feature.statLabel}
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 md:px-8">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-6">
                <span className="text-indigo-600 text-sm font-semibold">✨ WHY CHOOSE US</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                More than just an
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> ID card maker</span>
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                We combine powerful design tools with enterprise-grade security to deliver the best ID card creation experience.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-semibold">No design skills needed</h4>
                    <p className="text-slate-400 text-sm">Intuitive drag-and-drop editor for everyone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-semibold">Export in multiple formats</h4>
                    <p className="text-slate-400 text-sm">PNG, PDF, SVG, and print-ready formats</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-slate-800 font-semibold">24/7 Customer Support</h4>
                    <p className="text-slate-400 text-sm">Get help whenever you need it</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                  <FaRocket className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-slate-800 font-semibold mb-1">Lightning Fast</h4>
                <p className="text-slate-400 text-xs">Generate cards in seconds</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                  <FiShield className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-slate-800 font-semibold mb-1">Secure</h4>
                <p className="text-slate-400 text-xs">Bank-grade encryption</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-slate-800 font-semibold mb-1">Team Ready</h4>
                <p className="text-slate-400 text-xs">Collaborate with your team</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-3">
                  <FiTrendingUp className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-slate-800 font-semibold mb-1">Scalable</h4>
                <p className="text-slate-400 text-xs">Grow with your business</p>
              </div>
            </div>
          </div>
          </Container>
      </section>

      {/* Testimonial Section */}

      {/* CTA Section */}
    
    </div>
  );
}