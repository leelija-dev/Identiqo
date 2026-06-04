// app/about/page.jsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiTarget,
  FiMessageCircle,
  FiArrowRight,
  FiMapPin,
  FiMail,
  FiClock,
  FiUsers,
  FiZap,
  FiShield,
  FiGlobe,
} from "react-icons/fi";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default function AboutPage() {
  const values = [
    { title: "Innovation", desc: "Pushing boundaries in digital ID technology", icon: FiZap, color: "from-indigo-500 to-purple-600" },
    { title: "Security", desc: "Enterprise-grade encryption & protection", icon: FiShield, color: "from-blue-500 to-indigo-600" },
    { title: "User First", desc: "Designed for simplicity and ease", icon: FiHeart, color: "from-emerald-500 to-teal-600" },
    { title: "Global", desc: "Serving businesses worldwide", icon: FiGlobe, color: "from-rose-500 to-orange-600" },
  ];

  const team = [
    { name: "Sarah Johnson", role: "CEO & Founder", icon: "🎯", color: "from-indigo-500 to-purple-600" },
    { name: "Michael Chen", role: "CTO", icon: "⚡", color: "from-blue-500 to-indigo-600" },
    { name: "Emily Rodriguez", role: "Head of Design", icon: "🎨", color: "from-emerald-500 to-teal-600" },
    { name: "David Kim", role: "Product Lead", icon: "📦", color: "from-rose-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute top-20 right-10 w-80 h-80 bg-indigo-200 rounded-full blur-100px opacity-20" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-200 rounded-full blur-100px opacity-20" />
        
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 mb-6 shadow-sm">
              <FiHeart className="text-indigo-500 w-4 h-4" />
              <span className="text-indigo-600 font-semibold">OUR STORY</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-4">
              Creating better
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                digital identities
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
              Simple, secure, and beautiful ID card solutions for modern businesses.
            </p>
            
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Get in touch
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </Container>
      </div>

      {/* Mission Section */}
      <Container>
        <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-100 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <FiTarget className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Our Mission</h2>
          </div>
          <p className="text-slate-600 text-base leading-relaxed pl-14">
            To make professional ID card creation effortless, accessible, and secure for 
            businesses of all sizes. We believe everyone deserves a digital identity they can be proud of.
          </p>
        </div>
      </Container>

      {/* Values Section */}
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">What Drives Us</h2>
          <p className="text-slate-500">Our core values shape everything we do</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-lg transition-all group"
            >
              <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{value.title}</h3>
              <p className="text-slate-500 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Team Section */}
      <Container>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Meet the Team</h2>
          <p className="text-slate-500">The people behind CardStudio</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-lg transition-all"
            >
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center text-3xl mb-4 shadow-md`}>
                {member.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{member.name}</h3>
              <p className="text-indigo-600 font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Testimonial Section */}
      <div className="bg-indigo-50/50 py-12 mb-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <FiMessageCircle className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg italic mb-5">
              "CardStudio has transformed how we manage employee IDs. It's incredibly easy to use 
              and the results look professional."
            </p>
            <div>
              <p className="font-semibold text-slate-800">John Doe</p>
              <p className="text-slate-500">HR Manager, TechCorp</p>
            </div>
          </div>
        </Container>
      </div>

      {/* CTA Section */}
      <Container>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 text-center shadow-xl mb-12">
          <h2 className="text-white text-2xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-indigo-100 mb-6">Join thousands of businesses using CardStudio</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/pricing" 
              className="px-6 py-2.5 bg-white text-indigo-600 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Start free trial
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-2.5 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </Container>

      {/* Contact Info Footer */}
      <div className="border-t border-slate-100 py-8">
        <Container>
          <div className="flex flex-wrap justify-center gap-12 text-center">
            <div>
              <FiMapPin className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-slate-600">123 Innovation St, SF</p>
            </div>
            <div>
              <FiMail className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-slate-600">hello@cardstudio.com</p>
            </div>
            <div>
              <FiClock className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-slate-600">24/7 Support</p>
            </div>
          </div>
        </Container>
      </div>

      <style jsx>{`
        .blur-100px {
          filter: blur(100px);
        }
      `}</style>
    </div>
  );
}