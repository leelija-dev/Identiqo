// app/login/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, 
  FiGithub, FiTwitter, FiFacebook, FiApple, FiBriefcase,
  FiTrendingUp, FiUsers, FiShield, FiAlertCircle
} from "react-icons/fi";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    alert(`Signing in with ${provider}`);
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
            <p className="text-slate-600 font-medium">Signing you in...</p>
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
                <span className="text-sm font-medium">Trusted by 10,000+ companies</span>
              </div>

              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Create professional ID cards
              </h2>
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                The modern way to manage employee identification. Beautiful templates, 
                real-time editing, and enterprise-grade security.
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
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
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

        {/* Right Side - Login Form */}
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

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-200">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setErrors({});
                }}
                className={`pb-3 px-2 text-base font-semibold transition-all duration-300 ${
                  activeTab === "login"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setErrors({});
                }}
                className={`pb-3 px-2 text-base font-semibold transition-all duration-300 ${
                  activeTab === "signup"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Create Account
              </button>
            </div>

            {activeTab === "login" ? (
              <>
                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => handleSocialLogin("Google")}
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                  >
                    <FaGoogle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-slate-600">Google</span>
                  </button>
                  <button
                    onClick={() => handleSocialLogin("Microsoft")}
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
                    <span className="px-4 bg-white text-slate-400">Or continue with email</span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({...errors, email: ""});
                        }}
                        placeholder="hello@cardstudio.com"
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                          errors.email 
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100" 
                            : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
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
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({...errors, password: ""});
                        }}
                        placeholder="Enter your password"
                        className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all ${
                          errors.password 
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100" 
                            : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Sign in
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              // Sign Up Form - Now redirects to /signup page
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBriefcase className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Create your account</h3>
                <p className="text-slate-500 mb-6">Get started with CardStudio today</p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  Create Account <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Sign Up Link at bottom (when on login tab) */}
            {activeTab === "login" && (
              <p className="text-center text-sm text-slate-600 mt-6">
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("signup")}
                  className="text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Create account
                </button>
              </p>
            )}

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">✓ 256-bit SSL Secure</span>
                <span className="flex items-center gap-1">✓ GDPR Compliant</span>
                <span className="flex items-center gap-1">✓ 24/7 Support</span>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}