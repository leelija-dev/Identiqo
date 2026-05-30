"use client";
import Container from "@/components/Common/Container";
import { useState, useRef, useEffect } from "react";
import { 
  FiZap, FiGrid, FiUpload, FiLock, FiGlobe, 
  FiSmartphone, FiShield, FiCloud, FiUsers, FiTrendingUp,
  FiArrowRight, FiCheck, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { 
  MdQrCodeScanner
} from "react-icons/md";
import { 
  BsPrinterFill
} from "react-icons/bs";
import { 
  FaMagic, FaRocket, FaPalette, FaStar, FaGem
} from "react-icons/fa";
import { TbTemplate } from "react-icons/tb";

// Feature Card Component with WORKING sliding animation
const FeatureCard = ({ feature, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Update height when expanded changes or content changes
  useEffect(() => {
    if (expanded && contentRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        if (contentRef.current) {
          const scrollHeight = contentRef.current.scrollHeight;
          setHeight(scrollHeight);
        }
      }, 10);
    } else {
      setHeight(0);
    }
  }, [expanded, feature.longDescription, feature.benefits]);

  return (
    <div
      ref={cardRef}
      className={`group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-100/80 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:via-indigo-500/10 transition-all duration-700 pointer-events-none" />
      
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
        {feature.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-slate-500 leading-relaxed text-sm">
        {feature.desc}
      </p>

      {/* SLIDING CONTENT - This will definitely work */}
      <div 
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ 
          height: `${height}px`,
          opacity: expanded ? 1 : 0,
          marginTop: expanded ? '16px' : '0px'
        }}
      >
        <div ref={contentRef}>
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <p className="text-slate-600 text-sm leading-relaxed">
              {feature.longDescription || "Advanced tools with intuitive dashboard, real-time analytics, and priority support included. Perfect for businesses of all sizes looking to create professional ID cards effortlessly."}
            </p>
            {feature.benefits && (
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-indigo-600">
                    <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full inline-flex">
              <FaStar className="w-3 h-3" />
              <span>Premium feature included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Stat and Read More Button */}
      <div className="border-t border-slate-100 pt-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {feature.stat}
            </div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              {feature.statLabel}
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-all duration-200 border border-slate-200 hover:border-indigo-200 group/btn"
          >
            <span>{expanded ? "Show less" : "Read more"}</span>
            <span className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              <FiChevronDown className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Features() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredStat, setHoveredStat] = useState(null);

  const filters = [
    { id: "all", label: "All Features", icon: <FiGrid className="w-4 h-4" /> },
    { id: "design", label: "Design", icon: <FaPalette className="w-4 h-4" /> },
    { id: "workflow", label: "Workflow", icon: <FiZap className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <FiShield className="w-4 h-4" /> },
  ];

  const features = [
    { 
      id: 1, 
      icon: <TbTemplate className="w-8 h-8" />, 
      title: "50+ Premium Templates", 
      desc: "Professionally designed templates for every industry - corporate, education, healthcare, events, and more.", 
      color: "from-purple-500 to-pink-500", 
      stat: "5000+", 
      statLabel: "Downloads", 
      category: "design",
      longDescription: "Includes print-ready CMYK profiles, layered PSD templates, and editable vector files for corporate branding. Each template is crafted by professional designers and optimized for all major card printers.",
      benefits: ["Regular new template additions", "Fully customizable layouts", "Industry-specific designs"]
    },
    { 
      id: 2, 
      icon: <FiZap className="w-8 h-8" />, 
      title: "Real-Time Editing", 
      desc: "See changes instantly as you type. No waiting, no refreshing - just smooth, real-time updates.", 
      color: "from-blue-500 to-cyan-500", 
      stat: "0ms", 
      statLabel: "Latency", 
      category: "workflow",
      longDescription: "Collaborative editing with cursor tracking, live preview, and auto-save every 2 seconds. Zero latency experience with WebSocket technology for seamless teamwork.",
      benefits: ["Multi-user collaboration", "Instant preview updates", "Auto-save functionality"]
    },
    { 
      id: 3, 
      icon: <FiUpload className="w-8 h-8" />, 
      title: "Bulk Generation", 
      desc: "Create hundreds of ID cards at once with CSV import. Perfect for large teams and organizations.", 
      color: "from-green-500 to-emerald-500", 
      stat: "1000+", 
      statLabel: "Cards/Min", 
      category: "workflow",
      longDescription: "Upload your CSV/Excel, map fields, and auto-generate batch of cards with personalized photos and barcodes. Advanced data validation and error handling included.",
      benefits: ["CSV/Excel import support", "Automatic photo matching", "Error reporting & validation"]
    },
    { 
      id: 4, 
      icon: <FiLock className="w-8 h-8" />, 
      title: "Bank-Grade Security", 
      desc: "Your data never leaves your device. 100% client-side encryption for complete privacy.", 
      color: "from-red-500 to-orange-500", 
      stat: "256-bit", 
      statLabel: "Encryption", 
      category: "security",
      longDescription: "End-to-end encrypted, no data stored on servers. SOC2 Type II certified infrastructure with regular third-party security audits.",
      benefits: ["Client-side encryption", "Zero data retention", "GDPR compliant"]
    },
    { 
      id: 5, 
      icon: <BsPrinterFill className="w-8 h-8" />, 
      title: "Print Ready Output", 
      desc: "Optimized for all major card printers including Evolis, Zebra, Fargo, and Magicard.", 
      color: "from-indigo-500 to-purple-500", 
      stat: "99.9%", 
      statLabel: "Compatibility", 
      category: "workflow",
      longDescription: "Supports dual-sided printing, magnetic stripe encoding, and smart card encoding (MIFARE/Desfire). Automatic DPI optimization for crisp, professional results.",
      benefits: ["Universal printer support", "Automatic color calibration", "Bleed & margin guides"]
    },
    { 
      id: 6, 
      icon: <FiGlobe className="w-8 h-8" />, 
      title: "No Account Needed", 
      desc: "Start creating immediately. No sign-up, no email required - just pure design freedom.", 
      color: "from-teal-500 to-green-500", 
      stat: "0", 
      statLabel: "Sign-ups", 
      category: "security",
      longDescription: "No registration wall, fully anonymous usage. GDPR compliant by design. Start designing in seconds with zero commitment.",
      benefits: ["Instant access", "Privacy focused", "No hidden costs"]
    },
    { 
      id: 7, 
      icon: <FiSmartphone className="w-8 h-8" />, 
      title: "Mobile Responsive", 
      desc: "Create and edit ID cards on any device - desktop, tablet, or mobile phone.", 
      color: "from-yellow-500 to-orange-500", 
      stat: "100%", 
      statLabel: "Responsive", 
      category: "design",
      longDescription: "Touch-optimized UI, supports drag and drop on mobile, works offline via PWA mode. Seamless experience across all screen sizes.",
      benefits: ["Touch-optimized controls", "Offline mode available", "Cross-device sync"]
    },
    { 
      id: 8, 
      icon: <MdQrCodeScanner className="w-8 h-8" />, 
      title: "QR Codes & Barcodes", 
      desc: "Generate dynamic QR codes and barcodes for access control and digital verification.", 
      color: "from-pink-500 to-rose-500", 
      stat: "Instant", 
      statLabel: "Generation", 
      category: "design",
      longDescription: "Dynamic QR codes with embed data, custom error correction, and scannable barcode types (Code128, PDF417, DataMatrix). Real-time preview and validation.",
      benefits: ["Multiple barcode formats", "Customizable QR designs", "Real-time scanning test"]
    },
    { 
      id: 9, 
      icon: <FaPalette className="w-8 h-8" />, 
      title: "Custom Branding", 
      desc: "Add your logo, brand colors, and custom fonts. White-label ready for agencies.", 
      color: "from-violet-500 to-purple-500", 
      stat: "Unlimited", 
      statLabel: "Brands", 
      category: "design",
      longDescription: "Upload brand kit, generate style guides, export white-labeled designs for your clients. Custom font upload and brand asset management included.",
      benefits: ["Custom font upload", "Brand kit storage", "White-label export"]
    },
    { 
      id: 10, 
      icon: <FaMagic className="w-8 h-8" />, 
      title: "AI-Powered Design", 
      desc: "Smart layout suggestions and automatic alignment for perfect card designs every time.", 
      color: "from-amber-500 to-orange-500", 
      stat: "AI", 
      statLabel: "Powered", 
      category: "design",
      longDescription: "AI background removal, smart color palette generator, and font pairing suggestions. Machine learning algorithms optimize layouts automatically.",
      benefits: ["Auto background removal", "Smart color harmony", "Intelligent spacing"]
    },
    { 
      id: 11, 
      icon: <FiCloud className="w-8 h-8" />, 
      title: "Cloud Backup", 
      desc: "Automatic cloud saves with version history. Never lose your work again.", 
      color: "from-sky-500 to-blue-500", 
      stat: "Auto", 
      statLabel: "Backup", 
      category: "workflow",
      longDescription: "Version history up to 30 days, one-click restore, encrypted cloud sync across devices. Automatic backups every 5 minutes.",
      benefits: ["30-day version history", "One-click restore", "Cross-device sync"]
    },
    { 
      id: 12, 
      icon: <FiUsers className="w-8 h-8" />, 
      title: "Team Collaboration", 
      desc: "Invite team members to collaborate on card designs with role-based access.", 
      color: "from-indigo-500 to-blue-500", 
      stat: "Unlimited", 
      statLabel: "Members", 
      category: "workflow",
      longDescription: "Role-based permissions, real-time commenting, audit logs, and SSO integration. Perfect for design teams and enterprises.",
      benefits: ["Role-based access control", "Real-time commenting", "SSO integration"]
    },
  ];

  const getFilteredFeatures = () => {
    if (activeFilter === "all") return features;
    return features.filter(f => f.category === activeFilter);
  };

  const stats = [
    { value: "10,000+", label: "Happy Customers", icon: <FiUsers className="w-5 h-5" /> },
    { value: "4.9", label: "⭐ Rating", icon: <FaStar className="w-5 h-5" /> },
    { value: "50,000+", label: "Cards Created", icon: <TbTemplate className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-100/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl" />
        
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/50 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl animate-bounce delay-700" />

        <Container className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-5 py-2.5 rounded-full mb-6 shadow-sm">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            <span className="text-indigo-600 font-semibold text-sm tracking-wide">
              ✨ POWERFUL FEATURES
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.1] mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Advanced Features
            </span>
            <span className="block mt-2 bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
              Simple Experience
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
            No design skills required. Our intuitive editor puts professional results at your fingertips.
            Trusted by over 10,000+ businesses worldwide.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group text-center px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 hover:bg-white/60 transition-all duration-300 hover:scale-105 cursor-pointer"
                onMouseEnter={() => setHoveredStat(idx)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="flex items-center justify-center gap-2 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {stat.icon}
                  <span>{stat.value}</span>
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-white/40 py-4 px-4 md:px-8">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-sm ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 scale-105"
                    : "bg-white/80 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50"
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
      <section className="py-16 px-4 md:px-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredFeatures().map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
          
          {getFilteredFeatures().length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 text-lg">No features found in this category</p>
            </div>
          )}
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 md:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/40 via-transparent to-purple-50/40 pointer-events-none" />
        
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 px-5 py-2 rounded-full">
                <FaGem className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600 text-sm font-bold tracking-wide">✨ WHY CHOOSE US</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                More than just an
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  ID card maker
                </span>
              </h2>
              
              <p className="text-slate-500 text-lg leading-relaxed">
                We combine powerful design tools with enterprise-grade security to deliver the best ID card creation experience.
              </p>
              
              <div className="space-y-5">
                {[
                  { title: "No design skills needed", desc: "Intuitive drag-and-drop editor for everyone" },
                  { title: "Export in multiple formats", desc: "PNG, PDF, SVG, and print-ready formats" },
                  { title: "24/7 Customer Support", desc: "Get help whenever you need it" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">
                      <FiCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-semibold">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: <FaRocket className="w-5 h-5" />, title: "Lightning Fast", desc: "Generate cards in seconds", color: "from-purple-500 to-pink-500" },
                { icon: <FiShield className="w-5 h-5" />, title: "Secure", desc: "Bank-grade encryption", color: "from-blue-500 to-cyan-500" },
                { icon: <FiUsers className="w-5 h-5" />, title: "Team Ready", desc: "Collaborate with your team", color: "from-green-500 to-emerald-500" },
                { icon: <FiTrendingUp className="w-5 h-5" />, title: "Scalable", desc: "Grow with your business", color: "from-orange-500 to-red-500" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 border border-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h4 className="text-slate-800 font-bold text-lg">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 mb-12">
        <Container>
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-700" />
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to create professional ID cards?
              </h3>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of teams using our platform to create stunning ID cards in minutes
              </p>
              <button className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2 group/btn">
                Start Creating Now
                <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <p className="text-indigo-200 text-sm mt-6">
                ✨ No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
