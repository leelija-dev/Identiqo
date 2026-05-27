// app/signup/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser, 
  FiBriefcase, FiCheck, FiTrendingUp, FiUsers, FiShield,
  FiGithub, FiTwitter, FiFacebook, FiApple
} from "react-icons/fi";
import { FaGoogle, FaMicrosoft, FaStar } from "react-icons/fa";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || name.length < 2) {
      alert("Please enter your full name");
      return;
    }
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      alert("Please agree to the Terms of Service");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleSocialSignup = (provider) => {
    alert(`Signing up with ${provider}`);
  };

  const stats = [
    { icon: <FiUsers className="w-5 h-5" />, value: "10,000+", label: "Active Users" },
    { icon: <FiTrendingUp className="w-5 h-5" />, value: "50,000+", label: "Cards Created" },
    { icon: <FiShield className="w-5 h-5" />, value: "99.99%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Creating your account...</p>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Left Side - Premium Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
          {/* Abstract Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          
          {/* Animated Cards Background */}
          <div className="absolute top-1/4 left-1/4 w-48 h-32 bg-white/5 rounded-2xl rotate-12 backdrop-blur-sm border border-white/10" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-36 bg-white/5 rounded-2xl -rotate-6 backdrop-blur-sm border border-white/10" />
          
          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-3 mb-20">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold">C</span>
                </div>
                <span className="text-2xl font-bold tracking-tight">CardStudio</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Join 10,000+ companies</span>
              </div>

              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Start creating professional ID cards today
              </h2>
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                No credit card required. Free forever plan available.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="text-indigo-300">{stat.icon}</div>
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-indigo-300 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm italic leading-relaxed">
                  "CardStudio transformed our ID card process. We created 500+ cards 
                  in under 10 minutes. The templates are stunning and the support is amazing."
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sarah Johnson</p>
                    <p className="text-indigo-300 text-xs">HR Director, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-indigo-300 text-sm">
              © 2026 CardStudio. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CardStudio
                </span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an account</h1>
              <p className="text-slate-500">Start your free trial today</p>
            </div>

            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleSocialSignup("Google")}
                className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
              >
                <FaGoogle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-slate-600">Google</span>
              </button>
              <button
                onClick={() => handleSocialSignup("Microsoft")}
                className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
              >
                <FaMicrosoft className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-slate-600">Microsoft</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400">Or sign up with email</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@cardstudio.com"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div> 
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="text-sm text-slate-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-indigo-600 hover:text-indigo-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Create free account
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link href="/signin" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Sign in
              </Link>
            </p>

            {/* Features List */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">✓ 14-day free trial</span>
                <span className="flex items-center gap-1">✓ No credit card required</span>
                <span className="flex items-center gap-1">✓ Cancel anytime</span>
              </div>
            </div>

            {/* Free Plan Badge */}
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                <FiCheck className="w-3 h-3" />
                Free forever plan available
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
