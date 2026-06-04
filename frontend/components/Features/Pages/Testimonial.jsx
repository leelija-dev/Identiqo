// app/testimonials/page.jsx
"use client";
import Container from "../../Common/Container";
import { useState, useEffect } from "react";
import { 
  FiArrowLeft, FiArrowRight, FiHeart, 
  FiUsers, FiTrendingUp, FiMessageCircle, FiCheckCircle,
  FiAward, FiStar
} from "react-icons/fi";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import Button from "@/components/Common/Button";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* SINGLE SECTION - Everything inside */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-80px animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/20 rounded-full blur-80px animate-pulse delay-1000" />
        </div>

        <Container className="relative py-12 sm:py-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-5 py-2 rounded-full mb-6 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-rose-600 font-semibold text-p-xs">❤️ LOVED BY CUSTOMERS</span>
            </div>

            {/* Section Title - Hardcoded to avoid component issues */}
            <div className="text-center">
              <h2 className="text-slate-800 text-h1-md sm:text-h1-lg font-extrabold mb-2">
                What Our{" "}
                <span className="text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text">
                  Customers
                </span>{" "}
                Say
              </h2>
            </div>
            
            <p className="text-slate-500 text-p-sm mt-3 animate-fade-in-up">
              Join thousands of satisfied customers who trust CardStudio
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mx-auto mb-3 shadow-md`}>
                  {stat.icon}
                </div>
                <div className="text-slate-800 text-h4-sm font-bold">{stat.value}</div>
                <div className="text-slate-500 text-p-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Main Testimonial Slider */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Quote Icons */}
              <div className="absolute -top-6 -left-6 text-6xl text-indigo-200/50 font-serif animate-float-1">
                <FaQuoteLeft />
              </div>
              <div className="absolute -bottom-6 -right-6 text-6xl text-indigo-200/50 font-serif animate-float-2">
                <FaQuoteRight />
              </div>

              {/* Testimonial Card */}
              <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 ${
                animateCard ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
              }`}>
                <div className="grid md:grid-cols-2">
                  {/* Left Side - Person Info */}
                  <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-6 sm:p-8 text-center">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                      <img 
                        src={currentTestimonial.image} 
                        alt={currentTestimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-slate-800 text-h4-sm font-bold mt-4">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-rose-600 font-medium text-p-xs">
                      {currentTestimonial.role}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {currentTestimonial.company}
                    </p>
                    <div className="inline-block mt-3 px-3 py-1 bg-white rounded-full text-xs text-slate-500 border border-slate-200">
                      {currentTestimonial.industry}
                    </div>
                  </div>

                  {/* Right Side - Testimonial Text */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <FaQuoteLeft className="w-8 h-8 text-rose-300 opacity-50 mb-4" />
                      <p className="text-slate-700 text-p-sm sm:text-p-md leading-relaxed italic">
                        "{currentTestimonial.text}"
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <p className="text-p-xs text-slate-400">{currentTestimonial.date}</p>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <FiHeart className="w-4 h-4 text-rose-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  onClick={handlePrev}
                  variant="secondary"
                  size="sm"
                  icon={FiArrowLeft}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
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
                      className={`transition-all duration-300 rounded-full ${
                        currentIndex === idx
                          ? 'w-8 h-2 bg-gradient-to-r from-indigo-600 to-purple-600'
                          : 'w-2 h-2 bg-slate-300 hover:bg-indigo-400'
                      }`}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleNext}
                  variant="secondary"
                  size="sm"
                  icon={FiArrowRight}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 sm:p-12 border border-indigo-100 animate-fade-in-up">
              <h3 className="text-slate-800 text-h3-sm font-bold mb-3">
                Ready to create your own success story?
              </h3>
              <p className="text-slate-500 text-p-xs mb-6 max-w-lg mx-auto">
                Join thousands of businesses already using CardStudio
              </p>
              <button
                onClick={() => window.location.href = '/templates'}
                className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-p-xs sm:text-p-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                Start Creating Now →
              </button>
            </div>
          </div>

        </Container>
      </section>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-8px) translateX(-5px); }
        }
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-float-1 {
          animation: float-1 5s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 4.5s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .blur-80px {
          filter: blur(80px);
        }
        .blur-120px {
          filter: blur(120px);
        }
      `}</style>
    </div>
  );
}