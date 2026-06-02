// app/contact/page.jsx
"use client";

import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiUser,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiFacebook,
  FiArrowRight,
  FiCompass,
  FiHeart,
  FiStar,
} from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email",
      value: "hello@cardstudio.com",
      sub: "support@cardstudio.com",
      action: "mailto:hello@cardstudio.com",
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
      iconBg: "bg-gradient-to-r from-rose-500 to-pink-500",
    },
    {
      icon: FiPhone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      sub: "Mon-Fri, 9am-6pm",
      action: "tel:+15551234567",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      icon: FiMapPin,
      title: "Address",
      value: "123 Innovation Street",
      sub: "San Francisco, CA 94105",
      action: "https://maps.google.com",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
    },
    {
      icon: FiClock,
      title: "Hours",
      value: "Monday - Friday",
      sub: "9:00 AM - 6:00 PM",
      action: null,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      iconBg: "bg-gradient-to-r from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/50">
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full blur-3xl opacity-20" />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full px-5 py-2 mb-6 shadow-lg">
            <FiMail className="text-white w-4 h-4" />
            <span className="text-white text-sm font-semibold">GET IN TOUCH</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-slate-900">Let's</span>
            <span className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"> talk</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have a question or want to work with us? Fill out the form and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Contact Cards - Colorful */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${item.bgGradient} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-700 font-medium text-sm">{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
                {item.action && (
                  <a 
                    href={item.action}
                    className={`inline-flex items-center gap-1 text-sm font-medium mt-2 transition-all group-hover:gap-2 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}
                  >
                    Contact Now <FiArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Contact Form - Colorful */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Send us a message</h2>
              <p className="text-white/80 mt-1">Fill out the form and we'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {isSubmitted && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <FiCheckCircle className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-medium">Message sent successfully!</p>
                    <p className="text-emerald-600 text-sm">We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border ${
                      errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-purple-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-200 transition`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-xl border ${
                      errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-purple-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-200 transition`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.message ? 'border-rose-300 bg-rose-50' : 'border-slate-200 focus:border-purple-400'
                  } focus:outline-none focus:ring-2 focus:ring-purple-200 transition resize-none`}
                  placeholder="Tell us about your project or question..."
                />
                {errors.message && (
                  <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <FiSend className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center">
                By submitting, you agree to our <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>

          {/* Map & Social Section - Colorful */}
          <div className="space-y-6">
            
            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FiCompass className="text-white w-5 h-5" />
                  <h3 className="text-white font-semibold">Find us here</h3>
                </div>
              </div>
              
              {/* Map Container */}
              <div className="relative h-80 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg flex items-center justify-center mb-3">
                      <FiMapPin className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-slate-700 font-medium">123 Innovation Street</p>
                    <p className="text-slate-500 text-sm">San Francisco, CA 94105</p>
                    <div className="mt-3 flex gap-2 justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                      <span className="text-xs text-slate-400">Interactive Map</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-md px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white transition">
                  View larger map →
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">📍 Global Headquarters</span>
                  <a href="#" className="text-blue-600 hover:text-cyan-600 font-medium">
                    Get directions →
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours Card - Colorful */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-md">
                  <FiClock className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900">Business Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-purple-100">
                  <span className="text-slate-600">Monday - Friday</span>
                  <span className="font-medium text-slate-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-100">
                  <span className="text-slate-600">Saturday</span>
                  <span className="font-medium text-slate-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Sunday</span>
                  <span className="font-medium text-slate-400">Closed</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-100">
                <p className="text-xs text-purple-600 flex items-center gap-1">
                  <FiHeart className="w-3 h-3" /> 24/7 emergency support for enterprise customers
                </p>
              </div>
            </div>

            {/* Social Links - Colorful */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-rose-100">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <FiStar className="text-rose-500 w-4 h-4" />
                Follow us for updates
              </h3>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                  <FiTwitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                  <FiLinkedin className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                  <FiInstagram className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                  <FiFacebook className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-4">Join 10,000+ followers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}