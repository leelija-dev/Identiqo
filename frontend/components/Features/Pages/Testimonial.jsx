"use client";
import Container from "../../Common/Container";
import { useState, useEffect } from "react";
import { 
  FiArrowLeft, FiArrowRight, FiHeart, 
   FiCheckCircle,
   FiStar
} from "react-icons/fi";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";


export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateCard, setAnimateCard] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "HR Manager",
      company: "TechCorp Solutions",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      text: "CardStudio has completely transformed how we create employee ID cards. The templates are gorgeous and the editor is incredibly intuitive. We saved over 20 hours of design time in the first month!",
      date: "March 15, 2026",
      industry: "Technology",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Operations Director",
      company: "Global Enterprises",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      text: "The bulk generation feature is a lifesaver! We created 500+ ID cards for our new office in under 10 minutes. The print quality is outstanding and the support team is amazing.",
      date: "February 28, 2026",
      industry: "Corporate",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "School Administrator",
      company: "Sunrise International School",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      text: "We needed student ID cards for 500+ students quickly. CardStudio made it so simple! The QR code feature for attendance tracking is genius. Highly recommended for schools!",
      date: "January 20, 2026",
      industry: "Education",
      rating: 5
    },
    {
      id: 4,
      name: "David Kim",
      role: "CEO",
      company: "Startup Hub",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      text: "As a startup, we needed professional ID cards without breaking the bank. CardStudio gave us enterprise-grade features at an affordable price. Our team loves the modern designs!",
      date: "December 10, 2025",
      industry: "Startup",
      rating: 5
    }, 
    {
      id: 5,
      name: "Lisa Thompson",
      role: "Facility Manager",
      company: "Medical Center",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      text: "The security features are top-notch. We use CardStudio for all our medical staff ID cards and access badges. The holographic templates add an extra layer of security.",
      date: "November 5, 2025",
      industry: "Healthcare",
      rating: 5
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Event Coordinator",
      company: "Events Pro",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      text: "Perfect for event badges! We created custom badges for 1000+ attendees in less than an hour. The templates are customizable and the output is print-ready.",
      date: "October 18, 2025",
      industry: "Events",
      rating: 5
    }
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

  const goToSlide = (idx) => {
    setAnimateCard(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setAnimateCard(false);
    }, 300);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="min-h-50vh bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* SINGLE SECTION - Everything inside */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-80px animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/20 rounded-full blur-80px animate-pulse delay-1000" />
        </div>

<Container className="relative py-8 sm:py-10">
          
          {/* Header */}
          <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-5 py-2 rounded-full mb-6 animate-fade-in-up hover:shadow-md hover:scale-105 transition-all duration-300 cursor-default group">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-rose-600 font-semibold text-sm tracking-wide group-hover:tracking-wider transition-all duration-300">❤️ LOVED BY CUSTOMERS</span>
            </div>

            <div className="text-center animate-fade-in-up delay-100">
              <h2 className="text-slate-800 text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
                What Our{" "}
                <span className="text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text animate-gradient bg-[length:200%_auto]">
                  Customers
                </span>{" "}
                Say
              </h2>
            </div>
            
            <p className="text-slate-500 text-base sm:text-lg mt-4 animate-fade-in-up delay-200">
              Join thousands of satisfied customers who trust CardStudio
            </p>
          </div>

          {/* Main Testimonial Slider */}
          <div className={`max-w-5xl mx-auto transition-all duration-1000 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}>
            <div className="relative">
              {/* Quote Icons */}
              <div className="absolute -top-6 -left-6 text-6xl text-indigo-200/50 font-serif animate-float-1 hidden sm:block">
                <FaQuoteLeft />
              </div>
              <div className="absolute -bottom-6 -right-6 text-6xl text-indigo-200/50 font-serif animate-float-2 hidden sm:block">
                <FaQuoteRight />
              </div>

              {/* Testimonial Card */}
              <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] ${
                animateCard ? 'scale-95 opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'
              }`}>
                <div className="grid md:grid-cols-2">
                  {/* Left Side - Person Info */}
                  <div className="bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 p-6 sm:p-8 md:p-10 text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-200/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-200/20 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative z-10">
                      <div className="relative inline-block">
                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full blur-md opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto relative hover:scale-105 transition-transform duration-500">
                          <img 
                            src={currentTestimonial.image} 
                            alt={currentTestimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      {/* Rating Stars */}
                      <div className="flex justify-center gap-1 mt-4">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <FiStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      
                      <h3 className="text-slate-800 text-xl sm:text-2xl font-bold mt-3">
                        {currentTestimonial.name}
                      </h3>
                      <p className="text-indigo-600 font-semibold text-sm">
                        {currentTestimonial.role}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {currentTestimonial.company}
                      </p>
                      <div className="inline-block mt-3 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs text-slate-600 border border-slate-200 hover:shadow-md transition-all duration-300">
                        {currentTestimonial.industry}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Testimonial Text */}
                  <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <FaQuoteLeft className="w-8 h-8 text-rose-300 opacity-50 mb-4" />
                      <p className="text-slate-700 text-base sm:text-lg leading-relaxed italic">
                        "{currentTestimonial.text}"
                      </p>
                    </div>
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-400">{currentTestimonial.date}</p>
                        <div className="flex gap-2">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 hover:scale-110 transition-all duration-300 cursor-pointer">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center hover:bg-rose-200 hover:scale-110 transition-all duration-300 cursor-pointer">
                            <FiHeart className="w-4 h-4 text-rose-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-4 mt-8">
                {/* Prev Button - Simple Tailwind */}
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
                  aria-label="Previous testimonial"
                >
                  <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                </button>
                
                {/* Dot Indicators */}
                <div className="flex gap-2.5 items-center mx-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`transition-all duration-500 rounded-full ${
                        currentIndex === idx
                          ? 'w-10 h-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-300/50'
                          : 'w-2.5 h-2.5 bg-slate-300 hover:bg-indigo-400 hover:scale-125'
                      }`}
                      aria-label={`Go to testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
                
                {/* Next Button - Simple Tailwind */}
                <button
                  onClick={handleNext}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
                  aria-label="Next testimonial"
                >
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </div>
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
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .blur-80px {
          filter: blur(80px);
        }
      `}</style>
    </div>
  );
}