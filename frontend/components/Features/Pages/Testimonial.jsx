// app/testimonials/page.jsx
"use client";
import Container from "../../Common/Container";
import { useState, useEffect } from "react";
import { 
  FiStar, FiArrowLeft, FiArrowRight, FiHeart, 
  FiUsers, FiTrendingUp, FiMessageCircle, FiCheckCircle
} from "react-icons/fi";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateCard, setAnimateCard] = useState(false);

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

  const stats = [
    { icon: <FiUsers className="w-6 h-6" />, value: "10,000+", label: "Happy Customers", color: "from-blue-500 to-cyan-500" },
    { icon: <FiStar className="w-6 h-6" />, value: "4.9", label: "Average Rating", color: "from-yellow-500 to-orange-500" },
    { icon: <FiTrendingUp className="w-6 h-6" />, value: "50,000+", label: "Cards Created", color: "from-green-500 to-emerald-500" },
    { icon: <FiMessageCircle className="w-6 h-6" />, value: "98%", label: "Satisfaction Rate", color: "from-purple-500 to-pink-500" },
  ];

  const handlePrev = () => {
    setAnimateCard(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setAnimateCard(false);
    }, 200);
  };

  const handleNext = () => {
    setAnimateCard(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setAnimateCard(false);
    }, 200);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 md:px-8 text-center">
        <Container className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 px-5 py-2 rounded-full mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
            </span>
            <span className="text-pink-600 font-semibold text-sm tracking-wide">
              ❤️ LOVED BY CUSTOMERS
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="text-slate-900">What our</span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mt-2">
                customers say
              </span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mt-4">
              Join thousands of satisfied customers who trust CardStudio for their ID card needs
            </p>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 md:px-8">
        <Container className="max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Main Testimonial Slider */}
      <section className="py-16 px-4 md:px-8">
        <Container className="max-w-5xl">
          <div className="relative">
            {/* Quote Background */}
            <div className="absolute -top-10 -left-10 text-8xl text-indigo-100/30 font-serif">
              <FaQuoteLeft />
            </div>
            <div className="absolute -bottom-10 -right-10 text-8xl text-indigo-100/30 font-serif">
              <FaQuoteRight />
            </div>

            {/* Testimonial Card */}
            <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 ${
              animateCard ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}>
              <div className="grid md:grid-cols-2">
                {/* Left Side - Image & Info */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                      <img 
                        src={currentTestimonial.image} 
                        alt={currentTestimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <FiCheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mt-4">{currentTestimonial.name}</h3>
                  <p className="text-pink-600 font-medium">{currentTestimonial.role}</p>
                  <p className="text-slate-500 text-sm">{currentTestimonial.company}</p>
                  
                  {/* Rating */}
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`w-5 h-5 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  
                  {/* Badge */}
                  <div className="inline-block mt-4 px-3 py-1 bg-white rounded-full text-xs text-slate-500 border border-slate-200">
                    {currentTestimonial.industry}
                  </div>
                </div>

                {/* Right Side - Testimonial Text */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="mb-4">
                      <svg className="w-10 h-10 text-pink-300 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed italic">
                      "{currentTestimonial.text}"
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-slate-400">{currentTestimonial.date}</p>
                      <div className="flex gap-1">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <FiCheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                          <FiHeart className="w-4 h-4 text-pink-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 flex items-center justify-center shadow-md"
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
                      }, 200);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      currentIndex === idx
                        ? 'w-8 h-2 bg-indigo-600'
                        : 'w-2 h-2 bg-slate-300 hover:bg-indigo-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 flex items-center justify-center shadow-md"
              >
                <FiArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
       </Container>
      </section>

      {/* Featured Testimonials Grid */}
   
    </div>
  );
}