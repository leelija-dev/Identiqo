"use client";
import Container from "@/components/Common/Container";
import { useState, useRef, useEffect } from "react";
import { 
  FiZap, FiGrid, FiUpload, FiLock, FiShield, FiCloud, FiUsers,
  FiArrowRight, FiCheck, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import { FaPalette, FaStar, FaRobot, FaMagic, FaRocket } from "react-icons/fa";
import { TbTemplate } from "react-icons/tb";
import { BsPrinterFill, BsFillShieldLockFill } from "react-icons/bs";
import { MdQrCodeScanner } from "react-icons/md";
import SectionTitle from "@/components/Common/SectionTitle";

// Feature Card with Read More
const FeatureCard = ({ title, desc, icon, stat, image, color, index, longDesc, benefits }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
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

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10`} />
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 shadow-lg z-20">
            <div className="text-indigo-600">{icon}</div>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 z-20">
            <div className="text-white text-sm font-bold">{stat}</div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed">
            {expanded ? (longDesc || desc) : desc}
          </p>
          
          {expanded && benefits && (
            <div className="mt-4 space-y-2">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-4 h-4 text-yellow-400" />
              ))}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {expanded ? "Less" : "More"} {expanded ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
        
        <div className={`h-1 bg-gradient-to-r ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
      </div>
    </div>
  );
};

// Counter Component
const Counter = ({ target, label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isVisible, target]);

  return (
    <div ref={ref} className="text-center group cursor-pointer">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <div className="text-indigo-600 text-2xl">{icon}</div>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
        {count}{target >= 1000 ? '+' : ''}
      </div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
};

export default function Features() {
  const [filter, setFilter] = useState("all");
  const [hoveredFilter, setHoveredFilter] = useState(null);

  const features = [
    {
      title: "Premium Templates",
      desc: "500+ professionally designed templates for every industry",
      longDesc: "Access our extensive library of 500+ professionally crafted templates designed by experts. Perfect for corporate ID cards, student IDs, event badges, membership cards, and more.",
      benefits: ["Corporate & business ID cards", "Student & education ID cards", "Event & conference badges", "Membership & loyalty cards"],
      icon: <TbTemplate className="w-6 h-6" />,
      stat: "500+",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=400&fit=crop",
      color: "from-purple-500 to-pink-500",
      category: "design"
    },
    {
      title: "AI Design Assistant",
      desc: "Smart AI that suggests perfect layouts and colors",
      longDesc: "Our AI analyzes your brand identity and automatically suggests the perfect color schemes, font combinations, and layout arrangements that match your style.",
      benefits: ["Smart color palette generation", "AI-powered font pairing", "Automatic layout suggestions", "Brand consistency checker"],
      icon: <FaRobot className="w-6 h-6" />,
      stat: "98%",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      color: "from-blue-500 to-cyan-500",
      category: "design"
    },
    {
      title: "Bulk Generation",
      desc: "Create thousands of cards in minutes with CSV import",
      longDesc: "Upload your data via CSV or Excel and generate hundreds of personalized ID cards instantly. Perfect for schools, corporations, and events.",
      benefits: ["CSV & Excel file support", "Automatic data mapping", "Bulk photo upload", "Error detection & reporting"],
      icon: <FiUpload className="w-6 h-6" />,
      stat: "10K+",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      color: "from-green-500 to-emerald-500",
      category: "auto"
    },
    {
      title: "Bank Security",
      desc: "256-bit encryption - your data never leaves your device",
      longDesc: "Military-grade encryption ensures your sensitive data remains private. We never store your personal information on our servers.",
      benefits: ["End-to-end encryption", "Zero-knowledge architecture", "GDPR compliant", "No data retention policy"],
      icon: <FiLock className="w-6 h-6" />,
      stat: "256-bit",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
      color: "from-red-500 to-orange-500",
      category: "security"
    },
    {
      title: "Universal Printing",
      desc: "Optimized for all major card printers",
      longDesc: "Compatible with Evolis, Zebra, Fargo, Magicard, and 50+ other card printers. Get perfect prints every time with auto color calibration.",
      benefits: ["50+ printer compatibility", "Auto color calibration", "Dual-sided printing support", "Bleed & margin guides"],
      icon: <BsPrinterFill className="w-6 h-6" />,
      stat: "50+",
      image: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?w=600&h=400&fit=crop",
      color: "from-indigo-500 to-purple-500",
      category: "auto"
    },
    {
      title: "QR & Barcodes",
      desc: "Dynamic QR codes and barcodes for access control",
      longDesc: "Generate dynamic QR codes, Code128, PDF417, and DataMatrix barcodes. Perfect for access control, attendance tracking, and digital verification.",
      benefits: ["Multiple barcode formats", "Dynamic QR code generation", "Real-time scanning test", "Custom QR design options"],
      icon: <MdQrCodeScanner className="w-6 h-6" />,
      stat: "Instant",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&h=400&fit=crop",
      color: "from-yellow-500 to-orange-500",
      category: "design"
    },
    {
      title: "Team Collaboration",
      desc: "Invite team members and work together",
      longDesc: "Collaborate with your team in real-time. Assign roles, leave comments, and work simultaneously on card designs.",
      benefits: ["Unlimited team members", "Role-based access control", "Real-time commenting", "Design approval workflow"],
      icon: <FiUsers className="w-6 h-6" />,
      stat: "∞",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
      color: "from-pink-500 to-rose-500",
      category: "auto"
    },
    {
      title: "Cloud Backup",
      desc: "Auto-save with version history - never lose work",
      longDesc: "Automatic cloud backups every 5 minutes with 30-day version history. One-click restore to any previous version of your design.",
      benefits: ["30-day version history", "One-click restore", "Cross-device sync", "Automatic backups"],
      icon: <FiCloud className="w-6 h-6" />,
      stat: "30d",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
      color: "from-teal-500 to-green-500",
      category: "security"
    },
    {
      title: "Live Preview",
      desc: "See changes instantly as you design",
      longDesc: "Zero-lag real-time preview with instant updates. See exactly how your card will look while you design, with WYSIWYG technology.",
      benefits: ["Real-time updates", "WYSIWYG editor", "Mobile preview mode", "Print preview option"],
      icon: <FiZap className="w-6 h-6" />,
      stat: "0ms",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      color: "from-violet-500 to-purple-500",
      category: "design"
    }
  ];

  const filtered = filter === "all" ? features : features.filter(f => f.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      
      {/* SINGLE MAIN SECTION - Everything inside this ONE section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <Container className="relative py-12">
          {/* Hero Section inside main section */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 px-5 py-2 rounded-full mb-6 shadow-sm animate-bounce">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-indigo-600 font-semibold text-sm">✨ Trusted by 10,000+ businesses</span>
            </div>

                  <SectionTitle
              title=" Powerful Features"
              subtitle="Simple Experience"
            />

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Everything you need to create professional ID cards in one intuitive platform.
              No design skills required.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="group px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
                Start Creating Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-3 bg-white text-gray-700 rounded-full font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-200">
                Watch Demo
              </button>
            </div>
          </div>

        

          {/* Filter Buttons - STICKY inside main section */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md rounded-xl py-3 mb-8 shadow-sm">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { id: "all", label: "All Features", icon: <FiGrid className="w-4 h-4" /> },
                { id: "design", label: "Design", icon: <FaPalette className="w-4 h-4" /> },
                { id: "auto", label: "Automation", icon: <FiZap className="w-4 h-4" /> },
                { id: "security", label: "Security", icon: <FiShield className="w-4 h-4" /> }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id)}
                  onMouseEnter={() => setHoveredFilter(btn.id)}
                  onMouseLeave={() => setHoveredFilter(null)}
                  className={`relative px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                    filter === btn.id
                      ? "text-white"
                      : "text-gray-600 hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50"
                  }`}
                >
                  {filter === btn.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 animate-gradient bg-[length:200%_200%]" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {btn.icon}
                    {btn.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid inside main section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filtered.map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} />
            ))}
          </div>
          
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-bounce">🔍</div>
              <p className="text-gray-400 text-lg">No features found in this category</p>
            </div>
          )}

          {/* CTA Section inside main section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-ping" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-ping delay-700" />
            </div>
            
            <div className="relative z-10">
              <FaRocket className="w-16 h-16 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to create your first ID card?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ businesses already creating stunning ID cards in minutes
              </p>
              <button className="group/btn px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2">
                Start Creating Free
                <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <p className="text-indigo-200 text-sm mt-6">
                ✨ No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </Container>
      </section>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.2;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          } 
        }
        
        .animate-ping {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}