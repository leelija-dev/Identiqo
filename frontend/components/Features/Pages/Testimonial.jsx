// app/testimonials/page.jsx
"use client";
import Container from "../../Common/Container";
import { useState, useEffect } from "react";
import { 
  FiStar, FiArrowLeft, FiArrowRight, FiHeart, 
  FiUsers, FiTrendingUp, FiMessageCircle, FiCheckCircle,
  FiAward, 
} from "react-icons/fi";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateCard, setAnimateCard] = useState(false);
  const [visibleStats, setVisibleStats] = useState([]);
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "HR Manager",
      company: "TechCorp Solutions",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "CardStudio has completely transformed how we create employee ID cards. The templates are gorgeous and the editor is incredibly intuitive. We saved over 20 hours of design time in the first month!",
      date: "March 15, 2026",
      industry: "Technology"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Operations Director",
      company: "Global Enterprises",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "The bulk generation feature is a lifesaver! We created 500+ ID cards for our new office in under 10 minutes. The print quality is outstanding and the support team is amazing.",
      date: "February 28, 2026",
      industry: "Corporate"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "School Administrator",
      company: "Sunrise International School",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "We needed student ID cards for 500+ students quickly. CardStudio made it so simple! The QR code feature for attendance tracking is genius. Highly recommended for schools!",
      date: "January 20, 2026",
      industry: "Education"
    },
    {
      id: 4,
      name: "David Kim",
      role: "CEO",
      company: "Startup Hub",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "As a startup, we needed professional ID cards without breaking the bank. CardStudio gave us enterprise-grade features at an affordable price. Our team loves the modern designs!",
      date: "December 10, 2025",
      industry: "Startup"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Facility Manager",
      company: "Medical Center",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      rating: 5,
      text: "The security features are top-notch. We use CardStudio for all our medical staff ID cards and access badges. The holographic templates add an extra layer of security.",
      date: "November 5, 2025",
      industry: "Healthcare"
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Event Coordinator",
      company: "Events Pro",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      rating: 4,
      text: "Perfect for event badges! We created custom badges for 1000+ attendees in less than an hour. The templates are customizable and the output is print-ready.",
      date: "October 18, 2025",
      industry: "Events"
    }
  ];

  const featuredTestimonials = testimonials.slice(0, 3);

  const stats = [
    { icon: <FiUsers className="w-6 h-6" />, value: "10,000+", label: "Happy Customers", color: "from-blue-500 to-cyan-500", delay: 0 },
    { icon: <FiStar className="w-6 h-6" />, value: "4.9", label: "Average Rating", color: "from-yellow-500 to-orange-500", delay: 100 },
    { icon: <FiTrendingUp className="w-6 h-6" />, value: "50,000+", label: "Cards Created", color: "from-green-500 to-emerald-500", delay: 200 },
    { icon: <FiMessageCircle className="w-6 h-6" />, value: "98%", label: "Satisfaction Rate", color: "from-purple-500 to-pink-500", delay: 300 },
  ];

  useEffect(() => {
    // Animate stats on mount
    const timeouts = stats.map((_, idx) => {
      const timeout = setTimeout(() => {
        setVisibleStats(prev => [...prev, idx]);
      }, idx * 200);
      return timeout;
    });

    // Animate featured testimonials
    const testTimeouts = featuredTestimonials.map((_, idx) => {
      const timeout = setTimeout(() => {
        setVisibleTestimonials(prev => [...prev, idx]);
      }, idx * 300 + 500);
      return timeout;
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      testTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handlePrev = () => {
    setAnimateCard(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setAnimateCard(false);
    }, 300);
  };

  const handleNext = () => {
    setAnimateCard(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setAnimateCard(false);
    }, 300);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Hero Section with Animation */}
      <section className="relative pt-28 pb-16 px-4 md:px-8 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-10 animate-pulse delay-2000" />
        </div>

        <Container className="max-w-4xl relative z-10">
          {/* Badge with Animation */}
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 px-5 py-2 rounded-full mb-6 shadow-sm animate-fade-in-down">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
            </span>
            <span className="text-pink-600 font-semibold text-sm tracking-wide">
              ❤️ LOVED BY CUSTOMERS
            </span>
          </div>

          {/* Main Heading with Animation */}
          <div className="space-y-3 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="text-slate-900">What our</span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mt-2 animate-gradient">
                customers say
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4 animate-fade-in-up animation-delay-200">
              Join thousands of satisfied customers who trust CardStudio for their ID card needs
            </p>
          </div>
        </Container>
      </section>

      {/* Stats Section with Scroll Animation */}
      <section className="py-12 px-4 md:px-8">
        <Container className="max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 ${
                  visibleStats.includes(idx) ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mx-auto mb-3 animate-bounce-in`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 counter">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Testimonial Slider with Animations */}
      <section className="py-16 px-4 md:px-8">
        <Container className="max-w-5xl">
          <div className="relative">
            {/* Quote Background with Animation */}
            <div className="absolute -top-10 -left-10 text-8xl text-indigo-100/30 font-serif animate-float">
              <FaQuoteLeft />
            </div>
            <div className="absolute -bottom-10 -right-10 text-8xl text-indigo-100/30 font-serif animate-float animation-delay-2000">
              <FaQuoteRight />
            </div>

            {/* Testimonial Card */}
            <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 ${
              animateCard ? 'scale-95 opacity-0 rotate-1' : 'scale-100 opacity-100 rotate-0'
            }`}>
              <div className="grid md:grid-cols-2">
                {/* Left Side - Image & Info */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 text-center">
                  <div className="relative inline-block animate-scale-in">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                      <img 
                        src={currentTestimonial.image} 
                        alt={currentTestimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mt-4 animate-slide-in-right">
                    {currentTestimonial.name}
                  </h3>
                  <p className="text-pink-600 font-medium animate-slide-in-right animation-delay-100">
                    {currentTestimonial.role}
                  </p>
                  <p className="text-slate-500 text-sm animate-slide-in-right animation-delay-200">
                    {currentTestimonial.company}
                  </p>
                  
                  {/* Rating with Animation */}
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`w-5 h-5 ${i < currentTestimonial.rating ? 'text-yellow-400 animate-pulse' : 'text-slate-200'} transition-all delay-${i * 100}`}
                      />
                    ))}
                  </div>
                  
                  {/* Badge */}
                  <div className="inline-block mt-4 px-3 py-1 bg-white rounded-full text-xs text-slate-500 border border-slate-200 hover:scale-105 transition-transform duration-300">
                    {currentTestimonial.industry}
                  </div>
                </div>

                {/* Right Side - Testimonial Text */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 animate-fade-in">
                      <svg className="w-10 h-10 text-pink-300 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed italic animate-fade-in-up">
                      "{currentTestimonial.text}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 animate-fade-in-up animation-delay-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-400">{currentTestimonial.date}</p>
                      <div className="flex gap-1">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                          <FiCheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                          <FiHeart className="w-4 h-4 text-pink-600 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons with Animations */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 flex items-center justify-center shadow-md hover:scale-110 active:scale-95"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAnimateCard(true);
                      setTimeout(() => {
                        setCurrentIndex(idx);
                        setAnimateCard(false);
                      }, 300);
                    }}
                    className={`transition-all duration-500 rounded-full ${
                      currentIndex === idx
                        ? 'w-8 h-2 bg-gradient-to-r from-indigo-600 to-purple-600'
                        : 'w-2 h-2 bg-slate-300 hover:bg-indigo-400 hover:scale-125'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 flex items-center justify-center shadow-md hover:scale-110 active:scale-95"
              >
                <FiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
       </Container>
      </section>

      {/* Featured Testimonials Grid */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-slate-50 to-white">
        <Container className="max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 mb-4 animate-fade-in">
              <FiAward className="text-indigo-600 w-4 h-4" />
              <span className="text-indigo-600 text-xs font-semibold">TOP RATED</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 animate-fade-in-up">
              Featured <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Testimonials</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredTestimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 ${
                  visibleTestimonials.includes(idx) ? 'animate-scale-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                  "{testimonial.text}"
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-indigo-600 font-medium">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section with Animation */}
      <section className="py-20 px-4 md:px-8">
        <Container className="max-w-4xl">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-xl animate-gradient-x">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Ready to join our happy customers?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 animate-fade-in-up animation-delay-200">
              Start creating professional ID cards today
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up animation-delay-400">
              Start Free Trial
            </button>
          </div>
        </Container>
      </section>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .delay-100 {
          transition-delay: 0.1s;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}