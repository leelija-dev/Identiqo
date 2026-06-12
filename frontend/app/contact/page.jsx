// app/contact/page.jsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Common/Button";
import { FiMail, FiPhone, FiMapPin, FiSend, FiNavigation, FiShare2, FiClock } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block mb-4">
              <span className="text-xs font-medium tracking-wider text-purple-600 uppercase bg-purple-50 px-4 py-1.5 rounded-full">
                Get in Touch
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-4">
              Let's work{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                together
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear about it. 
              Fill out the form and I'll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Contact Cards - Using Button component for links */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-purple-100"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <FiMail className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
            <Button
              href="mailto:debasmita@example.com"
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700"
            >
              debasmita@example.com
            </Button>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-purple-100"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <FiPhone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Phone</h3>
            <Button
              href="tel:+15551234567"
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700"
            >
              +1 (555) 123-4567
            </Button>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-purple-100"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <FiMapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Location</h3>
            <p className="text-slate-500 text-sm">San Francisco, CA</p>
          </motion.div>
        </div>

        {/* Main Contact Section - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Send a message</h2>
              <p className="text-slate-500">Fill out the form and I'll respond within 24 hours.</p>
              <div className="w-12 h-0.5 bg-purple-600 mt-3" />
            </div>

            {isSubmitted && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-purple-800 font-medium">✓ Message sent successfully!</p>
                <p className="text-purple-600 text-sm">I'll get back to you shortly.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition bg-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition bg-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none transition resize-none bg-white"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                loading={isSubmitting}
                icon={FiSend}
                className="shadow-sm"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              <p className="text-xs text-slate-400 text-center">
                I respect your privacy. Your information is safe with me.
              </p>
            </form>
          </motion.div>

          {/* Right Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">I'll review your message</p>
                    <p className="text-sm text-slate-500">Typically within 24 hours</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Schedule a call</p>
                    <p className="text-sm text-slate-500">Let's discuss your project</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Start creating</p>
                    <p className="text-sm text-slate-500">Bring your ideas to life</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response Time */}
            <div className="mt-6 bg-purple-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <FiClock className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-slate-800">Quick response</h3>
              </div>
              <p className="text-slate-600 text-sm">
                I aim to respond to all inquiries within 24 hours. For urgent matters, 
                feel free to reach out via phone.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Map Section with Real Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-purple-100">
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Find me here</h3>
                  <p className="text-slate-500 text-sm mt-1">Visit my workspace or send mail</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    href="https://maps.google.com/?q=San+Francisco+CA"
                    variant="secondary"
                    size="sm"
                    icon={FiNavigation}
                    className="rounded-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Directions
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={FiShare2}
                    className="rounded-lg"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'CardStudio Location',
                          text: 'Check out CardStudio in San Francisco!',
                          url: 'https://maps.google.com/?q=San+Francisco+CA',
                        });
                      }
                    }}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Real Google Maps Container */}
            <div className="relative w-full h-[400px] bg-gradient-to-br from-purple-100 to-indigo-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555017613!2d-122.5200!3d37.7577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-b-xl"
                title="Office Location Map - San Francisco"
              ></iframe>
              
              {/* Overlay pin indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative">
                  <div className="w-6 h-6 bg-purple-600 rounded-full animate-ping absolute"></div>
                  <div className="w-6 h-6 bg-purple-600 rounded-full relative flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Address Details Below Map */}
            <div className="p-6 bg-purple-50/30">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Studio Address</p>
                    <p className="text-slate-500 text-xs">123 Creative Street</p>
                    <p className="text-slate-500 text-xs">San Francisco, CA 94105</p>
                    <p className="text-slate-500 text-xs">United States</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FiPhone className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Call Direct</p>
                    <p className="text-slate-500 text-xs">+1 (555) 123-4567</p>
                    <p className="text-slate-500 text-xs">Mon-Fri, 9am - 6pm PST</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FiMail className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Email Me</p>
                    <p className="text-slate-500 text-xs">debasmita@example.com</p>
                    <p className="text-slate-500 text-xs">Response within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}