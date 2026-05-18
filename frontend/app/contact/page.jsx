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
    },
    {
      icon: FiPhone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      sub: "Mon-Fri, 9am-6pm",
      action: "tel:+15551234567",
    },
    {
      icon: FiMapPin,
      title: "Address",
      value: "123 Innovation Street",
      sub: "San Francisco, CA 94105",
      action: "https://maps.google.com",
    },
    {
      icon: FiClock,
      title: "Hours",
      value: "Monday - Friday",
      sub: "9:00 AM - 6:00 PM",
      action: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-5 py-2 mb-6">
            <FiMail className="text-blue-600 w-4 h-4" />
            <span className="text-blue-700 text-sm font-semibold">GET IN TOUCH</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Let's talk
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question or want to work with us? Fill out the form and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                  <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-700 font-medium text-sm">{item.value}</p>
                <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                {item.action && (
                  <a 
                    href={item.action}
                    className="inline-flex items-center gap-1 text-blue-600 text-xs font-medium mt-2 hover:gap-2 transition"
                  >
                    Contact <FiArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
              <p className="text-gray-500 mt-1">Fill out the form and we'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <FiCheckCircle className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-600 text-sm">We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-200 transition`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                    } focus:outline-none focus:ring-2 focus:ring-blue-200 transition`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-3 py-3 rounded-lg border ${
                    errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                  } focus:outline-none focus:ring-2 focus:ring-blue-200 transition resize-none`}
                  placeholder="Tell us about your project or question..."
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our privacy policy.
              </p>
            </form>
          </div>

          {/* Map & Social Section */}
          <div className="space-y-6">
            
            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FiCompass className="text-white w-5 h-5" />
                  <h3 className="text-white font-semibold">Find us here</h3>
                </div>
              </div>
              
              {/* Map Container */}
              <div className="relative h-80 bg-gray-200">
                {/* Static Map Preview */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white shadow-lg flex items-center justify-center mb-3">
                      <FiMapPin className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-700 font-medium">123 Innovation Street</p>
                    <p className="text-gray-500 text-sm">San Francisco, CA 94105</p>
                    <p className="text-gray-400 text-xs mt-2">📍 Interactive Map Loaded Here</p>
                  </div>
                </div>
                
                {/* Map overlay with location marker */}
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md px-3 py-1.5 text-xs font-medium text-gray-700">
                  View larger map →
                </div>
              </div>
              
              {/* Map Footer */}
              <div className="px-6 py-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">📍 Global Headquarters</span>
                  <a href="#" className="text-blue-600 hover:underline text-sm">
                    Get directions
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiClock className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">📞 24/7 emergency support available for enterprise customers</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Follow us</h3>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <FiTwitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <FiLinkedin className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <FiInstagram className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <FiFacebook className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}