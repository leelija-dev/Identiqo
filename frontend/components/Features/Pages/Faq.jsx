// app/faq/page.jsx
"use client";

import { useState } from "react";
import Container from "../../Common/Container";
import SectionTitle from "@/components/Common/SectionTitle";
import {
  FiSearch,
  FiChevronDown,
  FiMessageCircle,
  FiHelpCircle,
  FiMail,
  FiPhone,
  FiAward,
  FiShield,
  FiZap,
  FiUsers,
  FiBookOpen,
  FiVideo,
  FiDownload,
  FiChevronRight,
} from "react-icons/fi";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Questions", icon: FiHelpCircle },
    { id: "general", name: "General", icon: FiAward },
    { id: "security", name: "Security", icon: FiShield },
    { id: "features", name: "Features", icon: FiZap },
  ];

  const faqs = [
    {
      question: "What is CardStudio?",
      answer: "CardStudio is a modern ID card creation platform that helps businesses design and generate professional employee ID cards in minutes. No design skills required!",
      category: "general",
      popular: true,
    },
    {
      question: "Do I need design experience?",
      answer: "Not at all! CardStudio comes with 200+ ready-made templates and an intuitive drag-and-drop editor. Anyone can create beautiful ID cards regardless of their design background.",
      category: "general",
      popular: true,
    },
    {
      question: "Can I export cards for printing?",
      answer: "Yes! You can export high-quality PNG, JPEG, and PDF files optimized for professional printing. We support 300 DPI resolution for crystal clear prints.",
      category: "features",
      popular: false,
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely! We use bank-level 256-bit encryption to protect your data. Your information is never shared with third parties and we comply with GDPR regulations.",
      category: "security",
      popular: true,
    },
    {
      question: "Can I add QR codes?",
      answer: "Yes! Dynamic QR codes can be added to any card design instantly. You can encode employee details, contact information, or custom URLs that update automatically.",
      category: "features",
      popular: false,
    },
    {
      question: "Do you support bulk generation?",
      answer: "Yes! Upload CSV or Excel files and generate hundreds of employee cards in one click. Perfect for organizations with multiple team members.",
      category: "features",
      popular: true,
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise plans.",
      category: "general",
      popular: false,
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. No hidden fees or long-term contracts required.",
      category: "general",
      popular: false,
    },
    {
      question: "Do you offer custom templates?",
      answer: "Yes! Our design team can create custom branded templates for your organization. Contact our sales team for a personalized quote.",
      category: "features",
      popular: false,
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const popularFaqs = faqs.filter(faq => faq.popular);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* SINGLE CONTAINER - Everything inside */}
      <Container className="relative py-12">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 px-5 py-2 rounded-full mb-6">
            <FiHelpCircle className="text-indigo-600" />
            <span className="text-indigo-600 text-sm font-semibold">KNOWLEDGE BASE</span>
          </div>

          <SectionTitle
            title="How can we"
            subtitle="help you?"
          />

          <p className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto">
            Find answers to common questions about CardStudio, features, pricing, and more.
          </p>

          {/* Search Bar */}
          

          {/* Popular Tags */}
         
        </div>

      
      
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Side - Categories */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FiBookOpen className="text-indigo-600" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeCategory === category.id
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border-l-4 border-indigo-600"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span className="flex-1 text-left font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Help Card */}
            <div className="mt-6 relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-5">
                  <FiMessageCircle className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                <p className="text-indigo-100 text-sm mb-6">Our support team is here to help 24/7.</p>
                <button className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-all hover:scale-105">
                  Contact Support
                </button>
                <div className="flex items-center justify-center gap-3 text-xs text-indigo-200 mt-4">
                  <span className="flex items-center gap-1"><FiMail /> support@cardstudio.com</span>
                  <span className="flex items-center gap-1"><FiPhone /> Live Chat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - FAQ Accordion */}
          <div className="lg:col-span-8">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <FiHelpCircle className="text-6xl text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700">No results found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or browse by category</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                      openIndex === index
                        ? "border-indigo-200 shadow-lg shadow-indigo-100/50"
                        : "border-slate-100 hover:border-indigo-100 hover:shadow-md"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                          openIndex === index
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                            : "bg-indigo-50 text-indigo-600"
                        }`}>
                          <FiHelpCircle className="text-base" />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 pr-4">{faq.question}</h3>
                      </div>
                      <div className={`transition-all duration-300 flex-shrink-0 ${openIndex === index ? "rotate-180" : ""}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                          <FiChevronDown className="text-sm" />
                        </div>
                      </div>
                    </button>

                    <div className={`transition-all duration-300 overflow-hidden ${
                      openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}>
                      <div className="px-5 pb-5 pl-16">
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                          {faq.popular && (
                            <div className="mt-3">
                              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                                Popular Question
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Help Banner */}
            <div className="mt-6 bg-gradient-to-r from-slate-100 to-indigo-50 rounded-2xl p-5 text-center border border-slate-200">
              <p className="text-slate-700">
                Can't find what you're looking for? 
                <button className="text-indigo-600 font-semibold ml-2 hover:underline">
                  Contact our support team →
                </button>
              </p>
            </div>
          </div>

        </div>
      </Container>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}