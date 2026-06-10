"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import SectionTitle from "../../Common/SectionTitle";

export default function FeatureFlow() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [particles, setParticles] = useState([]);

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Initialize particles on client-side only
  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    // Generate particles
    const newParticles = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      xMove: Math.random() * 100 - 50
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      id: "01",
      title: "Smart ID Templates",
      description: "50+ professionally designed templates for corporate, healthcare, and events. Fully customizable with your branding.",
      gradient: "from-orange-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop",
      stats: "50+",
      statLabel: "Templates",
      details: ["Corporate IDs", "Student Cards", "Employee Badges", "Visitor Passes"],
      color: "#f97316"
    },
    {
      id: "02",
      title: "Real-Time Editing",
      description: "See changes instantly as you type. Drag-and-drop interface with live preview. No design skills needed!",
      gradient: "from-pink-500 to-purple-500",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=400&fit=crop",
      stats: "0ms",
      statLabel: "Latency",
      details: ["Live Preview", "Drag & Drop", "Auto-Save", "Undo/Redo"],
      color: "#ec4899"
    },
    {
      id: "03",
      title: "Bulk Generation",
      description: "Create hundreds of ID cards at once with CSV/Excel import. Perfect for large organizations and teams.",
      gradient: "from-purple-500 to-indigo-500",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      stats: "1000+",
      statLabel: "Cards/Min",
      details: ["CSV Import", "Auto Photo Match", "Batch Processing", "Error Validation"],
      color: "#a855f7"
    },
    {
      id: "04",
      title: "Security Features",
      description: "QR codes, barcodes, holograms, and magnetic stripe encoding. Bank-grade encryption for data protection.",
      gradient: "from-indigo-500 to-blue-500",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
      stats: "256-bit",
      statLabel: "Encryption",
      details: ["QR Codes", "Holograms", "UV Printing", "Encryption"],
      color: "#6366f1"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 overflow-hidden" ref={containerRef}>
      
      {/* Animated Background Particles - Fixed for SSR */}
      {dimensions.width > 0 && (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-orange-200/50 rounded-full"
              initial={{
                x: particle.x,
                y: particle.y,
              }}
              animate={{
                y: [particle.y, particle.y - 100],
                x: particle.x + particle.xMove,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-200 px-4 py-1.5 rounded-full mb-6 shadow-sm"
            >
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-orange-600 text-xs font-medium">Professional ID Card Solution</span>
            </motion.div>
            
            <SectionTitle
              title="Employee ID Card"
              subtitle="Specifications & Features"
            />
            
            <motion.p 
              className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Create professional employee ID cards in minutes. No design skills required.
              Trusted by 10,000+ companies worldwide.
            </motion.p>

            {/* Hero CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -12px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold text-sm shadow-lg transition-all"
              >
                Start Creating Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "#f97316", color: "#f97316" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-semibold text-sm shadow-sm transition-all"
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Timeline */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Center Line with Glow */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500 hidden md:block rounded-full" 
               style={{ height: "calc(100% - 120px)", top: "60px" }}>
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500 rounded-full"
              style={{ height: lineHeight }}
            />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full" />
          </div>

          {/* Features */}
          {features.map((feature, index) => (
            <FeatureNode 
              key={feature.id}
              feature={feature}
              index={index}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 shadow-2xl overflow-hidden group"
          >
            {/* Animated Background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-5xl mb-4"
              >
                🎫
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to create your ID cards?
              </h2>
              <p className="text-slate-300 text-sm mb-8">
                Start creating professional employee ID cards today
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                Start Creating Free
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
              <p className="text-slate-400 text-xs mt-4">No credit card required • Free forever plan</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Individual Feature Component with Enhanced Animations
function FeatureNode({ feature, index, isEven }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col md:flex-row items-center gap-8 mb-24 last:mb-0 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Center Node with Pulse */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden md:block">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
          className="relative"
        >
          {/* Outer Ring */}
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 opacity-30"
          />
          {/* Core */}
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg flex items-center justify-center z-10">
            <span className="text-white text-xs font-bold">{feature.id}</span>
          </div>
        </motion.div>
      </div>

      {/* Image Box with 3D Hover */}
      <div className="w-full md:w-[45%]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: isEven ? -15 : 15 }}
          animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="relative group cursor-pointer"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
            
            {/* Shine Effect on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />
          </div>
          
          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
          
          {/* Caption */}
          <motion.div 
            className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-lg px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          >
            <p className="text-white text-xs text-center font-medium">{feature.title}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Content Box with Stagger Animation - FIXED UNDERLINE */}
      <div className={`w-full md:w-[45%] ${isEven ? 'md:text-right' : ''}`}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
        >
          {/* Big Number Background */}
          <motion.div 
            className={`text-7xl md:text-8xl font-black absolute ${isEven ? 'right-0' : 'left-0'} top-0 md:top-[-40px] select-none`}
            animate={{ opacity: isHovered ? 0.1 : 0.05 }}
            transition={{ duration: 0.3 }}
            style={{ color: feature.color }}
          >
            {feature.id}
          </motion.div>
          
          {/* Title with Separate Underline - FIXED: No line through text */}
          <div className={`mb-5 ${isEven ? 'md:flex md:flex-col md:items-end' : ''}`}>
            <h2 className={`text-2xl md:text-3xl font-bold text-slate-800 relative inline-block ${isEven ? 'md:text-right' : ''}`}>
              {feature.title}
            </h2>
            {/* Separate underline div - positioned completely below the text */}
            <div className={`mt-2 ${isEven ? 'md:flex md:justify-end' : ''}`}>
              <motion.div 
                className={`h-[3px] bg-gradient-to-r ${feature.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={isInView ? { width: '60px' } : {}}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className={`${isEven ? 'md:clear-both' : ''}`}>
            <p className={`text-slate-500 text-sm leading-relaxed mb-4 ${isEven ? 'md:text-right' : ''}`}>
              {feature.description}
            </p>
            
            {/* Animated Tags */}
            <div className={`flex flex-wrap gap-2 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
              {feature.details.map((detail, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.4 + (i * 0.05) }}
                  whileHover={{ scale: 1.05, backgroundColor: "#f1f5f9" }}
                  className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                >
                  {detail}
                </motion.span>
              ))}
            </div>
            
            {/* Stats Card with Hover Effect */}
            <motion.div 
              className={`inline-flex items-center gap-3 px-3 py-2 bg-white rounded-xl shadow-md border border-slate-100 ${isEven ? 'md:justify-end' : ''}`}
              whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
                animate={{ scale: isHovered ? 1.1 : 1 }}
              >
                {feature.stats}
              </motion.div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="text-xs text-slate-500">{feature.statLabel}</div>
            </motion.div>
          </div>
          
          {/* Mobile Node */}
          <div className="md:hidden flex justify-start mt-5">
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center shadow-md"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white text-xs font-bold">{feature.id}</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}