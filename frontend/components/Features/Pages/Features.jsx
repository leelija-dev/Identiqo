"use client";
import Container from "@/components/Common/Container";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  FiZap, FiGrid, FiUpload, FiLock, FiGlobe, 
  FiSmartphone, FiShield, FiCloud, FiUsers, FiTrendingUp,
  FiArrowRight, FiCheck, FiChevronDown, FiChevronUp, FiStar
} from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";
import { BsPrinterFill, BsFillShieldLockFill } from "react-icons/bs";
import { FaMagic, FaRocket, FaPalette, FaStar, FaGem, FaCrown } from "react-icons/fa";
import { TbTemplate } from "react-icons/tb";
import SectionTitle from "@/components/Common/SectionTitle";

// Helper component that only renders particles on client
const ParticleEffect = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => {
        // Generate random values only on client-side
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDuration = Math.random() * 3 + 2;
        const randomDelay = Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ x: randomX * 6, y: randomY * 4 }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
            }}
            style={{ left: `${randomX}%`, top: `${randomY}%` }}
          />
        );
      })}
    </div>
  );
};

// Enhanced Feature Card with 3D Tilt and Advanced Animations
const FeatureCard = ({ feature, index }) => {
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setTimeout(() => {
        if (contentRef.current) setHeight(contentRef.current.scrollHeight);
      }, 10);
    } else setHeight(0);
  }, [expanded, feature.longDescription, feature.benefits]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !mounted) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXVal = ((y - centerY) / centerY) * 5;
    const rotateYVal = ((x - centerX) / centerX) * 5;
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
    setGlowPosition({ x: x, y: y });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: mounted ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : undefined,
        transition: "transform 0.1s ease-out",
      }}
      className="relative group"
    >
      {/* Animated glow effect that follows cursor - only on client */}
      {mounted && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle 150px at ${glowPosition.x}px ${glowPosition.y}px, rgba(99,102,241,0.15), transparent)`,
          }}
        />
      )}
      
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-100 hover:border-indigo-200 transition-all duration-500 h-full flex flex-col">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:via-indigo-500/20 transition-all duration-700 pointer-events-none" />
        
        <motion.div 
          className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg mb-5`}
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
        >
          {feature.icon}
        </motion.div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {feature.title}
        </h3>

        <p className="text-slate-500 leading-relaxed text-sm flex-grow">
          {feature.desc}
        </p>

        <motion.div 
          className="overflow-hidden"
          animate={{ height: expanded ? height : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ marginTop: expanded ? '16px' : '0px' }}
        >
          <div ref={contentRef}>
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.longDescription || "Advanced tools with intuitive dashboard, real-time analytics, and priority support included."}
              </p>
              {feature.benefits && (
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <motion.li 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 text-sm text-indigo-600"
                    >
                      <FiCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full inline-flex">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <FaStar className="w-3 h-3" />
                </motion.div>
                <span>Premium feature included</span>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-3"
            >
              {expanded ? "Less" : "More"} {expanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </motion.div>

        <div className="border-t border-slate-100 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <motion.div 
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                {feature.stat}
              </motion.div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                {feature.statLabel}
              </div>
            </div>
            <motion.button
              onClick={() => setExpanded(!expanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-all duration-200 border border-slate-200 hover:border-indigo-200"
            >
              <span>{expanded ? "Show less" : "Read more"}</span>
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FiChevronDown className="w-4 h-4" />
              </motion.span>
            </motion.button>
          </div>
        </div>
        
        <div className={`h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mt-4 rounded-full`} />
      </div>
    </motion.div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, label, icon }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const numericValue = parseInt(value.replace(/,/g, '').replace('+', ''));
          let start = 0;
          const duration = 2000;
          const increment = numericValue / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else setCount(Math.floor(start));
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);
  
  const displayValue = value.includes('Rating') ? value : count.toLocaleString() + (value.includes('+') ? '+' : '');
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group text-center px-6 py-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/60 hover:bg-white/60 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-center gap-2 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
        {icon}
        <span>{displayValue}</span>
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </motion.div>
  );
};

export default function Features() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const filters = [
    { id: "all", label: "All Features", icon: <FiGrid className="w-4 h-4" /> },
    { id: "design", label: "Design", icon: <FaPalette className="w-4 h-4" /> },
    { id: "workflow", label: "Workflow", icon: <FiZap className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <FiShield className="w-4 h-4" /> },
  ];

  const features = [
    { 
      id: 1, icon: <TbTemplate className="w-8 h-8" />, title: "50+ Premium Templates", 
      desc: "Professionally designed templates for every industry - corporate, education, healthcare, events, and more.", 
      color: "from-purple-500 to-pink-500", stat: "5000+", statLabel: "Downloads", category: "design",
      longDescription: "Includes print-ready CMYK profiles, layered PSD templates, and editable vector files for corporate branding.",
      benefits: ["Regular new template additions", "Fully customizable layouts", "Industry-specific designs"]
    },
    { 
      id: 2, icon: <FiZap className="w-8 h-8" />, title: "Real-Time Editing", 
      desc: "See changes instantly as you type. No waiting, no refreshing - just smooth, real-time updates.", 
      color: "from-blue-500 to-cyan-500", stat: "0ms", statLabel: "Latency", category: "workflow",
      longDescription: "Collaborative editing with cursor tracking, live preview, and auto-save every 2 seconds.",
      benefits: ["Multi-user collaboration", "Instant preview updates", "Auto-save functionality"]
    },
    { 
      id: 3, icon: <FiUpload className="w-8 h-8" />, title: "Bulk Generation", 
      desc: "Create hundreds of ID cards at once with CSV import. Perfect for large teams and organizations.", 
      color: "from-green-500 to-emerald-500", stat: "1000+", statLabel: "Cards/Min", category: "workflow",
      longDescription: "Upload your CSV/Excel, map fields, and auto-generate batch of cards with personalized photos.",
      benefits: ["CSV/Excel import support", "Automatic photo matching", "Error reporting & validation"]
    },
    { 
      id: 4, icon: <FiLock className="w-8 h-8" />, title: "Bank-Grade Security", 
      desc: "Your data never leaves your device. 100% client-side encryption for complete privacy.", 
      color: "from-red-500 to-orange-500", stat: "256-bit", statLabel: "Encryption", category: "security",
      longDescription: "End-to-end encrypted, no data stored on servers. SOC2 Type II certified.",
      benefits: ["Client-side encryption", "Zero data retention", "GDPR compliant"]
    },
    { 
      id: 5, icon: <BsPrinterFill className="w-8 h-8" />, title: "Print Ready Output", 
      desc: "Optimized for all major card printers including Evolis, Zebra, Fargo, and Magicard.", 
      color: "from-indigo-500 to-purple-500", stat: "99.9%", statLabel: "Compatibility", category: "workflow",
      longDescription: "Supports dual-sided printing, magnetic stripe encoding, and smart card encoding.",
      benefits: ["Universal printer support", "Automatic color calibration", "Bleed & margin guides"]
    },
    { 
      id: 6, icon: <FiGlobe className="w-8 h-8" />, title: "No Account Needed", 
      desc: "Start creating immediately. No sign-up, no email required - just pure design freedom.", 
      color: "from-teal-500 to-green-500", stat: "0", statLabel: "Sign-ups", category: "security",
      longDescription: "No registration wall, fully anonymous usage. GDPR compliant by design.",
      benefits: ["Instant access", "Privacy focused", "No hidden costs"]
    },
    { 
      id: 7, icon: <FiSmartphone className="w-8 h-8" />, title: "Mobile Responsive", 
      desc: "Create and edit ID cards on any device - desktop, tablet, or mobile phone.", 
      color: "from-yellow-500 to-orange-500", stat: "100%", statLabel: "Responsive", category: "design",
      longDescription: "Touch-optimized UI, supports drag and drop on mobile, works offline via PWA mode.",
      benefits: ["Touch-optimized controls", "Offline mode available", "Cross-device sync"]
    },
    { 
      id: 8, icon: <MdQrCodeScanner className="w-8 h-8" />, title: "QR Codes & Barcodes", 
      desc: "Generate dynamic QR codes and barcodes for access control and digital verification.", 
      color: "from-pink-500 to-rose-500", stat: "Instant", statLabel: "Generation", category: "design",
      longDescription: "Dynamic QR codes with embed data, custom error correction, and scannable barcode types.",
      benefits: ["Multiple barcode formats", "Customizable QR designs", "Real-time scanning test"]
    },
    { 
      id: 9, icon: <FaPalette className="w-8 h-8" />, title: "Custom Branding", 
      desc: "Add your logo, brand colors, and custom fonts. White-label ready for agencies.", 
      color: "from-violet-500 to-purple-500", stat: "Unlimited", statLabel: "Brands", category: "design",
      longDescription: "Upload brand kit, generate style guides, export white-labeled designs for your clients.",
      benefits: ["Custom font upload", "Brand kit storage", "White-label export"]
    },
    { 
      id: 10, icon: <FaMagic className="w-8 h-8" />, title: "AI-Powered Design", 
      desc: "Smart layout suggestions and automatic alignment for perfect card designs every time.", 
      color: "from-amber-500 to-orange-500", stat: "AI", statLabel: "Powered", category: "design",
      longDescription: "AI background removal, smart color palette generator, and font pairing suggestions.",
      benefits: ["Auto background removal", "Smart color harmony", "Intelligent spacing"]
    },
    { 
      id: 11, icon: <FiCloud className="w-8 h-8" />, title: "Cloud Backup", 
      desc: "Automatic cloud saves with version history. Never lose your work again.", 
      color: "from-sky-500 to-blue-500", stat: "Auto", statLabel: "Backup", category: "workflow",
      longDescription: "Version history up to 30 days, one-click restore, encrypted cloud sync across devices.",
      benefits: ["30-day version history", "One-click restore", "Cross-device sync"]
    },
    { 
      id: 12, icon: <FiUsers className="w-8 h-8" />, title: "Team Collaboration", 
      desc: "Invite team members to collaborate on card designs with role-based access.", 
      color: "from-indigo-500 to-blue-500", stat: "Unlimited", statLabel: "Members", category: "workflow",
      longDescription: "Role-based permissions, real-time commenting, audit logs, and SSO integration.",
      benefits: ["Role-based access control", "Real-time commenting", "SSO integration"]
    },
  ];

  const filteredFeatures = activeFilter === "all" ? features : features.filter(f => f.category === activeFilter);

  const stats = [
    { value: "10,000+", label: "Happy Customers", icon: <FiUsers className="w-5 h-5" /> },
    { value: "4.9 Rating", label: "⭐ Rating", icon: <FaStar className="w-5 h-5" /> },
    { value: "50,000+", label: "Cards Created", icon: <TbTemplate className="w-5 h-5" /> },
  ];

  // Don't render animated background until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-x-hidden">
        {/* Static fallback while mounting */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-100/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl" />
        </div>
        
        {/* Rest of your content without animations */}
        <div className="relative pt-28 pb-20 px-4 md:px-8 overflow-hidden">
          <Container className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-5 py-2.5 rounded-full mb-6 shadow-sm">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              <span className="text-indigo-600 font-semibold text-sm tracking-wide">✨ POWERFUL FEATURES</span>
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
          </Container>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-x-hidden">
      {/* Animated Background Elements */}
      <motion.div style={{ y: backgroundY }} className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-100/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Hero Section with Parallax */}
      <section className="relative pt-28 pb-20 px-4 md:px-8 overflow-hidden">
        <Container className="text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 px-5 py-2.5 rounded-full mb-6 shadow-sm"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-indigo-600 rounded-full" />
            <span className="text-indigo-600 font-semibold text-sm tracking-wide">✨ POWERFUL FEATURES</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.04em] leading-[1.1] mb-6"
          >
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300%">
              Advanced Features
            </span>
            <span className="block mt-2 bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
              Simple Experience
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed"
          >
            No design skills required. Our intuitive editor puts professional results at your fingertips.
            Trusted by over 10,000+ businesses worldwide.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {stats.map((stat, idx) => (
              <AnimatedCounter key={idx} value={stat.value} label={stat.label} icon={stat.icon} />
            ))}
          </div>
        </Container>
      </section>

      {/* Filter Tabs with Sliding Indicator */}
      <section className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-white/40 py-4 px-4 md:px-8">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-sm ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white/80 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50"
                }`}
              >
                {filter.icon}
                {filter.label}
              </motion.button>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Grid with AnimatePresence */}
      <section className="py-16 px-4 md:px-8">
        <Container>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredFeatures.map((feature, index) => (
                <FeatureCard key={feature.id} feature={feature} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
          
          {filteredFeatures.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="text-6xl mb-4 animate-bounce">🔍</div>
              <p className="text-slate-400 text-lg">No features found in this category</p>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/40 via-transparent to-purple-50/40 pointer-events-none" />
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 px-5 py-2 rounded-full">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                  <FaGem className="w-4 h-4 text-indigo-500" />
                </motion.div>
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
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 360 }}
                    >
                      <FiCheck className="w-4 h-4 text-emerald-600" />
                    </motion.div>
                    <div>
                      <h4 className="text-slate-800 font-semibold">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FaRocket className="w-6 h-6" />, title: "Lightning Fast", desc: "Generate cards in seconds", color: "from-purple-500 to-pink-500" },
                { icon: <FiShield className="w-6 h-6" />, title: "Secure", desc: "Bank-grade encryption", color: "from-blue-500 to-cyan-500" },
                { icon: <FiUsers className="w-6 h-6" />, title: "Team Ready", desc: "Collaborate with your team", color: "from-green-500 to-emerald-500" },
                { icon: <FiTrendingUp className="w-6 h-6" />, title: "Scalable", desc: "Grow with your business", color: "from-orange-500 to-red-500" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-xl p-5 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                  >
                    <div className="text-white">{item.icon}</div>
                  </motion.div>
                  <h4 className="text-slate-800 font-bold text-lg">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Enhanced CTA Section with Particle Effect */}
      <section className="py-16 px-4 md:px-8 mb-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 text-center shadow-2xl overflow-hidden group"
          >
            {/* Particle effect - only renders on client */}
            <ParticleEffect />
            
            <div className="relative z-10">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Ready to create professional ID cards?
              </motion.h3>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ businesses already creating stunning ID cards in minutes
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 group/btn"
              >
                Start Creating Now
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                  <FiArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
              <p className="text-indigo-200 text-sm mt-6">
                ✨ No credit card required • Free forever plan available
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
}