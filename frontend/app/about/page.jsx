// app/about/page.jsx
"use client";

import Link from "next/link";
import {
  FiHeart,
  FiUsers,
  FiAward,
  FiGlobe,
  FiMail,
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiArrowRight,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiSmile,
  FiTarget,
  FiEye,
  FiMessageCircle,
} from "react-icons/fi";

export default function AboutPage() {
  const stats = [
    { number: "50K+", label: "Active Users", icon: FiUsers, color: "from-rose-500 to-amber-500" },
    { number: "200+", label: "Companies", icon: FiBriefcase, color: "from-blue-500 to-indigo-500" },
    { number: "98%", label: "Satisfaction", icon: FiSmile, color: "from-emerald-500 to-teal-500" },
    { number: "24/7", label: "Support", icon: FiClock, color: "from-purple-500 to-pink-500" },
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We constantly push boundaries to bring you the latest in digital identification technology.",
      icon: FiZap,
      color: "from-rose-500 to-amber-500",
    },
    {
      title: "Security Focused",
      description: "Your data security is our top priority with enterprise-grade encryption and protection.",
      icon: FiShield,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "User Centric",
      description: "Every feature is designed with our users' needs and experience in mind.",
      icon: FiHeart,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Global Reach",
      description: "Serving businesses worldwide with scalable solutions for every need.",
      icon: FiGlobe,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former tech executive with 15+ years in digital identity solutions.",
      icon: FiStar,
      color: "from-rose-400 to-amber-400",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Security expert and open source contributor with a passion for innovation.",
      icon: FiZap,
      color: "from-blue-400 to-indigo-400",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      bio: "Award-winning designer focused on creating intuitive user experiences.",
      icon: FiHeart,
      color: "from-emerald-400 to-teal-400",
    },
    {
      name: "David Kim",
      role: "Product Lead",
      bio: "Product strategist dedicated to solving real-world business challenges.",
      icon: FiTarget,
      color: "from-purple-400 to-pink-400",
    },
  ];

  const journey = [
    { year: "2020", title: "Founded", description: "CardStudio was born with a vision to simplify digital identification.", icon: FiStar },
    { year: "2021", title: "Launch", description: "Released our first version to 100 beta companies.", icon: FiZap },
    { year: "2022", title: "Growth", description: "Expanded to serve 10,000+ users globally.", icon: FiTrendingUp },
    { year: "2023", title: "Innovation", description: "Launched AI-powered card generation features.", icon: FiShield },
    { year: "2024", title: "Scale", description: "Reached 50,000+ active users worldwide.", icon: FiGlobe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-5 py-2 mb-6 shadow-sm">
              <FiHeart className="text-rose-500 w-4 h-4" />
              <span className="text-rose-600 text-sm font-semibold tracking-wide">OUR STORY</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 tracking-tight leading-tight">
              Revolutionizing
              <span className="block bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Digital Identity
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're on a mission to make professional digital identification accessible, 
              secure, and beautiful for businesses of all sizes.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Get in touch
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/pricing" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-semibold border border-rose-200 hover:bg-rose-50 transition-all"
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-md border border-rose-100 hover:shadow-lg transition-all">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <FiTarget className="text-rose-500 w-4 h-4" />
                <span className="text-rose-600 text-xs font-semibold">OUR MISSION</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Empowering businesses with secure digital identity solutions
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At CardStudio, we believe that every employee deserves a professional digital identity 
                that's both secure and beautiful. Our platform combines cutting-edge technology with 
                intuitive design to make ID card creation effortless.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Since our founding in 2020, we've helped thousands of companies streamline their 
                identification process, saving time and resources while enhancing security.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <FiEye className="text-rose-500 w-5 h-5" />
                  <span className="text-sm text-gray-600">Trusted by 50K+ users</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiShield className="text-amber-500 w-5 h-5" />
                  <span className="text-sm text-gray-600">Enterprise-grade security</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-rose-100 via-amber-100 to-orange-100 rounded-2xl p-8 shadow-lg">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiMessageCircle className="text-rose-500 w-6 h-6" />
                  <h3 className="text-xl font-bold text-gray-800">What our users say</h3>
                </div>
                <p className="text-gray-600 italic mb-4">
                  "CardStudio has transformed how we manage employee IDs. It's incredibly easy to use 
                  and the results look professional."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">John Doe</p>
                    <p className="text-xs text-gray-500">HR Manager, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <FiStar className="text-rose-500 w-4 h-4" />
              <span className="text-rose-600 text-xs font-semibold">OUR VALUES</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              What drives us forward
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our core values shape everything we do, from product development to customer support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-md border border-rose-100 hover:shadow-lg transition-all group">
                  <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <FiTrendingUp className="text-rose-500 w-4 h-4" />
              <span className="text-rose-600 text-xs font-semibold">OUR JOURNEY</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              The road so far
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to serving thousands of businesses worldwide.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-rose-300 via-amber-300 to-orange-300 hidden md:block"></div>
            
            <div className="space-y-8">
              {journey.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6`}>
                    <div className="flex-1 md:text-right">
                      <div className="bg-white rounded-2xl p-6 shadow-md border border-rose-100 hover:shadow-lg transition-all">
                        <div className="inline-flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-rose-500">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <FiUsers className="text-rose-500 w-4 h-4" />
              <span className="text-rose-600 text-xs font-semibold">MEET THE TEAM</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              The people behind CardStudio
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to making digital identification better for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => {
              const Icon = member.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-md border border-rose-100 hover:shadow-lg transition-all group">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-rose-600 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500">{member.bio}</p>
                  
                  <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-rose-50">
                    <button className="text-gray-400 hover:text-rose-500 transition">
                      <FiTwitter className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-rose-500 transition">
                      <FiLinkedin className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-rose-500 transition">
                      <FiGithub className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 rounded-3xl p-12 text-center shadow-xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using CardStudio to create professional digital IDs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/pricing" 
                className="px-8 py-3 bg-white text-rose-600 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Start free trial
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Contact Info */}
      <section className="py-12 border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-3">
                <FiMapPin className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Visit us</h3>
              <p className="text-sm text-gray-500">123 Innovation Street<br />San Francisco, CA 94105</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <FiMail className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Email us</h3>
              <p className="text-sm text-gray-500">hello@cardstudio.com<br />support@cardstudio.com</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <FiClock className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Support hours</h3>
              <p className="text-sm text-gray-500">Monday - Friday: 9am - 6pm<br />24/7 emergency support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}