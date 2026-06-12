// app/about/page.jsx
"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Button from "@/components/Common/Button";
import {
  FiHeart,
  FiTarget,
  FiArrowRight,
  FiMapPin,
  FiMail,
  FiClock,
  FiZap,
  FiShield,
  FiGlobe,
  FiAward,
  FiTrendingUp,
  FiCloud,
  FiStar,
  FiPlay,
  FiBriefcase,
  FiCpu,
  FiLayers,
  FiCompass,
} from "react-icons/fi"; 


const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const ROTATING_VALUES_COUNT = 6;

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(2);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotating values carousel
  const rotatingValues = [
    { icon: FiZap, title: "Innovation", desc: "Pushing boundaries in digital ID tech", color: "#8b5cf6" },
    { icon: FiShield, title: "Security", desc: "Bank-grade encryption always", color: "#3b82f6" },
    { icon: FiHeart, title: "Empathy", desc: "Designed for real people", color: "#10b981" },
    { icon: FiGlobe, title: "Global", desc: "Serving 50+ countries", color: "#f59e0b" },
    { icon: FiCpu, title: "AI-Powered", desc: "Smart templates that adapt", color: "#ec4899" },
    { icon: FiCloud, title: "Cloud Native", desc: "99.99% uptime guaranteed", color: "#06b6d4" },
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", icon: "👩‍💼", gradient: "from-rose-400 to-pink-400", quote: "Empowering digital identities worldwide", expertise: "Leadership & Vision" },
    { name: "Michael Chen", role: "CTO", icon: "👨‍💻", gradient: "from-blue-400 to-cyan-400", quote: "Building secure, scalable systems", expertise: "Security Architecture" },
    { name: "Emily Rodriguez", role: "Creative Director", icon: "🎨", gradient: "from-purple-400 to-indigo-400", quote: "Design that inspires trust", expertise: "Visual Identity" },
    { name: "David Kim", role: "Product Lead", icon: "📊", gradient: "from-emerald-400 to-teal-400", quote: "Making complexity simple", expertise: "Product Strategy" },
    { name: "Lisa Wang", role: "AI Research", icon: "🤖", gradient: "from-orange-400 to-red-400", quote: "Intelligence at your fingertips", expertise: "Machine Learning" },
    { name: "Marcus Brown", role: "Customer Success", icon: "🤝", gradient: "from-indigo-400 to-purple-400", quote: "Your success is our mission", expertise: "Client Relations" },
  ];

  const milestones = [
    { year: "2020", title: "Genesis", desc: "Born from a vision to revolutionize ID cards", icon: FiCompass, impact: "Started with 3 founders" },
    { year: "2021", title: "Ascension", desc: "Reached 1,000+ businesses milestone", icon: FiTrendingUp, impact: "1000% growth" },
    { year: "2022", title: "Evolution", desc: "Launched AI-powered template engine", icon: FiCpu, impact: "500k IDs created" },
    { year: "2023", title: "Expansion", desc: "Global presence across 50+ countries", icon: FiGlobe, impact: "Enterprise ready" },
    { year: "2024", title: "Innovation", desc: "Next-gen holographic AR technology", icon: FiAward, impact: "Industry first" },
  ];

  const stats = [
    { value: "50K+", label: "Active Businesses", icon: FiBriefcase, trend: "+120% YoY", color: "from-indigo-500 to-purple-500" },
    { value: "2.5M+", label: "ID Cards Created", icon: FiLayers, trend: "+300% YoY", color: "from-blue-500 to-cyan-500" },
    { value: "99.99%", label: "Uptime SLA", icon: FiCloud, trend: "Guaranteed", color: "from-emerald-500 to-teal-500" },
    { value: "4.96", label: "Customer Rating", icon: FiStar, trend: "From 5,000+ reviews", color: "from-rose-500 to-orange-500" },
  ];

  const [currentRotatingIndex, setCurrentRotatingIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRotatingIndex((prev) => (prev + 1) % ROTATING_VALUES_COUNT);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentValue = rotatingValues[currentRotatingIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      
      {/* Animated Grid Background - Light Theme */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'%238b5cf6\' fill-opacity=\'0.02\' d=\'M10 10 L90 10 L90 90 L10 90 Z\'/%3E%3C/svg%3E')] opacity-30" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-50/20 to-transparent" />
      </div>

      {/* Floating Particles - Light Theme */}
      <div className="fixed inset-0 pointer-events-none">
        {mounted && [...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-300/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -30, 30, -30],
              x: [null, 20, -20, 20],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section - Split Screen Layout Light */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity, y }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </motion.div>

        <Container>
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Column - Animated Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-200 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-purple-600 text-sm font-semibold tracking-wide">REIMAGINING IDENTITY</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
                Creating better
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  digital identities
                </span>
              </h1>
              
              <p className="text-slate-500 text-base sm:text-lg mb-8 leading-relaxed">
                Simple, secure, and beautiful ID card solutions trusted by 50,000+ businesses worldwide.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  href="/pricing"
                  variant="primary"
                  size="lg"
                  icon={FiArrowRight}
                  iconPosition="right"
                  className="rounded-full shadow-lg hover:shadow-xl"
                >
                  Start Creating Now
                </Button>
                
                <Button
                  href="/contact"
                  variant="secondary"
                  size="lg"
                  icon={FiPlay}
                  className="rounded-full bg-white border-slate-200 hover:border-purple-300"
                >
                  See Demo
                </Button>
              </div>

              {/* Rotating Value Badge - Light */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center gap-3"
              >
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-sm">Powered by</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRotatingIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-purple-200 shadow-sm"
                  >
                    <currentValue.icon className="w-4 h-4" style={{ color: currentValue.color }} />
                    <span className="text-sm text-slate-600">{currentValue.title}</span>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Right Column - 3D Stats Card Light */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-xl">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-2xl opacity-60" />
                
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all"
                    >
                      <div className={`w-10 h-10 mx-auto rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 shadow-md`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                      <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                      <div className="text-[10px] text-emerald-600 mt-1">{stat.trend}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Trusted by 5,000+ companies worldwide</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Mission & Vision - Diagonal Split Light */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent" />
        
        <Container>
          <div className="grid md:grid-cols-2 gap-8 relative">
            {/* Mission - Floating Card Light */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <FiTarget className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
                </div>
                <p className="text-slate-600 text-base leading-relaxed pl-14">
                  To revolutionize professional ID card creation by making it effortless, accessible, 
                  and highly secure for businesses of all sizes. We believe everyone deserves a digital 
                  identity they can be proud of.
                </p>
              </div>
            </motion.div>

            {/* Vision - Floating Card Light */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                    <FiGlobe className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
                </div>
                <p className="text-slate-600 text-base leading-relaxed pl-14">
                  To become the global standard for digital identification, empowering millions of 
                  organizations with smart, sustainable, and stunning ID solutions that evolve with 
                  modern workplace needs.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Values - Interactive Bento Grid Light */}
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">What Makes Us Different</h2>
          <p className="text-slate-500 text-lg">Our core values that drive innovation every day</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rotatingValues.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-pink-200/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-300 transition-all shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform">
                    <value.icon className="w-6 h-6" style={{ color: value.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{value.title}</h3>
                    <p className="text-slate-500 text-sm">{value.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Timeline - Horizontal Scrolling Journey Light */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-transparent to-pink-50/50" />
        
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">Our Journey</h2>
            <p className="text-slate-500 text-lg">A timeline of innovation and growth</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 hidden md:block" />
            
            <div className="grid md:grid-cols-5 gap-6">
              {milestones.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-300 transition-all h-full shadow-md">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-md">
                      <milestone.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-purple-600 font-bold text-sm mb-2">{milestone.year}</div>
                    <h3 className="text-slate-800 font-bold text-lg mb-2">{milestone.title}</h3>
                    <p className="text-slate-500 text-sm mb-3">{milestone.desc}</p>
                    <div className="text-xs text-emerald-600 font-medium">{milestone.impact}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Team - Card Carousel Style Light */}
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">Meet the Visionaries</h2>
          <p className="text-slate-500 text-lg">The passionate team behind CardStudio</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-pink-200/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-300 transition-all text-center shadow-md">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${member.gradient} flex items-center justify-center text-4xl mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  {member.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{member.name}</h3>
                <p className="text-purple-600 font-semibold text-sm mb-2">{member.role}</p>
                <p className="text-slate-500 text-xs italic mb-3">"{member.quote}"</p>
                <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                  {member.expertise}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Testimonial - Full Screen Impact Light */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-transparent to-pink-50/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
        
        <Container>
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-10 shadow-xl border border-slate-200"
            >
              <div className="text-7xl mb-6 text-purple-400">“</div>
              <p className="text-slate-700 text-2xl sm:text-3xl md:text-4xl leading-tight mb-8 font-light">
                CardStudio has completely transformed how we manage employee IDs. 
                The AI-powered templates save us hours of design time, and our team 
                loves the professional results.
              </p>
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <div className="text-slate-800 font-bold text-lg">Sarah Chen</div>
              <div className="text-purple-600">HR Director, TechCorp Global</div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* CTA - 3D Glass Morphism Light - NOW USING BUTTON COMPONENT */}
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-3xl p-12 text-center border border-purple-200 shadow-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Ready to Transform Your ID System?
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Join 50,000+ businesses already using CardStudio to create stunning employee IDs
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                href="/pricing"
                variant="primary"
                size="lg"
                icon={FiArrowRight}
                iconPosition="right"
                className="rounded-full shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                className="rounded-full bg-white border-slate-200 hover:border-purple-300"
              >
                Talk to Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Footer Contact - Light */}
      <div className="border-t border-slate-200 py-8 bg-white/50">
        <Container>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center">
            <div className="flex items-center gap-3 text-slate-500 hover:text-purple-600 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Visit Us</p>
                <p className="text-xs">123 Innovation St, SF</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-500 hover:text-purple-600 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <FiMail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Email Us</p>
                <p className="text-xs">hello@cardstudio.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-500 hover:text-purple-600 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">24/7 Support</p>
                <p className="text-xs">Always here to help</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .blur-3xl {
          filter: blur(64px);
        }
      `}</style>
    </div>
  );
}