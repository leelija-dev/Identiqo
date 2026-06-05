// app/contact/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section - Premium */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
        {/* Decorative Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4">
              <span className="text-xs font-medium tracking-wider text-indigo-600 uppercase bg-indigo-50 px-4 py-1.5 rounded-full">
                Contact Us
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-800 mb-4">
              Let's start a{" "}
              <span className="font-semibold bg-gradient-to-r from-indigo-600 to-slate-800 bg-clip-text text-transparent">
                conversation
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">
              Whether you have a question about our platform or need assistance, 
              our team is ready to help you create exceptional ID solutions.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Three Column Contact Cards - Premium */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Card 1 - Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group text-center"
          >
            <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Email Us</h3>
              <p className="text-slate-500 text-sm mb-3">Our team typically responds within hours</p>
              <a href="mailto:hello@cardstudio.com" className="text-indigo-600 font-medium hover:text-indigo-700 transition">
                hello@cardstudio.com
              </a>
            </div>
          </motion.div>

          {/* Card 2 - Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group text-center"
          >
            <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Call Us</h3>
              <p className="text-slate-500 text-sm mb-3">Mon-Fri, 9am - 6pm PST</p>
              <a href="tel:+15551234567" className="text-indigo-600 font-medium hover:text-indigo-700 transition">
                +1 (555) 123-4567
              </a>
            </div>
          </motion.div>

          {/* Card 3 - Office */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group text-center"
          >
            <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-5 group-hover:bg-indigo-600 transition-colors duration-300">
                <svg className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Visit Us</h3>
              <p className="text-slate-500 text-sm mb-3">Global headquarters</p>
              <p className="text-indigo-600 font-medium">San Francisco, CA</p>
            </div>
          </motion.div>
        </div>

        {/* Main Contact Section - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Send a message</h2>
              <p className="text-slate-500">Fill out the form and we'll respond within 24 hours.</p>
              <div className="w-12 h-px bg-indigo-600 mt-4" />
            </div>

            {isSubmitted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <p className="text-emerald-800 font-medium">✓ Message sent successfully</p>
                <p className="text-emerald-600 text-sm">We'll get back to you shortly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition bg-slate-50/30"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition bg-slate-50/30"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition bg-slate-50/30"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition bg-slate-50/30"
                    placeholder="Your company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition resize-none bg-slate-50/30"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              <p className="text-xs text-slate-400 text-center">
                By submitting, you agree to our Privacy Policy and Terms of Service.
              </p>
            </form>
          </motion.div>

          {/* Right Side - Premium Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Why Choose Us */}
            <div className="bg-slate-50 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Why choose CardStudio</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Fast response time</p>
                    <p className="text-sm text-slate-500">Average 4-hour response for enterprise</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Dedicated support team</p>
                    <p className="text-sm text-slate-500">Technical experts ready to assist</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Custom solutions</p>
                    <p className="text-sm text-slate-500">Tailored for enterprise needs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="border border-slate-100 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Frequently asked</h3>
              <div className="space-y-5">
                <div>
                  <p className="font-medium text-slate-800 mb-1">How quickly do you respond?</p>
                  <p className="text-sm text-slate-500">We respond within 24 hours, often sooner for enterprise inquiries.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-800 mb-1">Do you offer custom solutions?</p>
                  <p className="text-sm text-slate-500">Yes, we provide custom ID solutions for enterprise clients.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-800 mb-1">Is there a free trial?</p>
                  <p className="text-sm text-slate-500">Start with a 14-day free trial, no credit card required.</p>
                </div>
              </div>
              <Link href="/faq" className="inline-block mt-6 text-indigo-600 text-sm font-medium hover:text-indigo-700 transition">
                View all FAQs →
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Map Section - Minimal */}
        <div className="mt-20 pt-8 border-t border-slate-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">Visit our headquarters</h3>
              <p className="text-slate-500 mb-4">Come say hello at our office in the heart of San Francisco.</p>
              <div className="space-y-2">
                <p className="text-slate-700">📍 123 Innovation Street</p>
                <p className="text-slate-700">San Francisco, CA 94105</p>
                <p className="text-slate-700">United States</p>
              </div>
            </div>
            <div className="bg-slate-100 rounded-xl h-48 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 mx-auto flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600">Interactive map preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">10,000+</div>
              <p className="text-sm text-slate-500">Active customers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">99.9%</div>
              <p className="text-sm text-slate-500">Satisfaction rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">24/7</div>
              <p className="text-sm text-slate-500">Support available</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">50+</div>
              <p className="text-sm text-slate-500">Countries served</p>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}