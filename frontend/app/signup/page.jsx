"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiUserPlus,
  FiTrendingUp, FiUsers, FiShield, FiAlertCircle
} from "react-icons/fi";
import { FaGoogle, FaMicrosoft, FaStar } from "react-icons/fa";
import Button from '@/components/Common/Button';

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSlidingIn, setIsSlidingIn] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const router = useRouter();

  // Animation on page load - slide in from right
  useEffect(() => {
    // Small delay to trigger animation
    setTimeout(() => setIsSlidingIn(true), 10);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name) newErrors.name = "Full name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      router.push("/");
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    alert(`Signing up with ${provider}`);
  };

  const stats = [
    { icon: <FiUsers className="w-5 h-5" />, value: "10,000+", label: "Active Users" },
    { icon: <FiTrendingUp className="w-5 h-5" />, value: "50,000+", label: "Cards Created" },
    { icon: <FiShield className="w-5 h-5" />, value: "99.99%", label: "Uptime" },
  ];

  const handleSignInClick = () => {
    setIsSlidingOut(true);
    setTimeout(() => {
      router.push("/signin");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 text-p-sm font-medium">Creating account...</p>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Left Side - Premium Brand Section (Fixed - No Animation) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          </div>
          
          <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-100px animate-pulse" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-100px animate-pulse delay-1000" />
          
          <div className="absolute top-1/4 left-1/4 w-48 h-32 bg-white/5 rounded-2xl rotate-12 backdrop-blur-sm border border-white/10" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-36 bg-white/5 rounded-2xl -rotate-6 backdrop-blur-sm border border-white/10" />
          
          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            <div>
              <div className="flex items-center gap-3 mb-20">
                <span className="text-2xl font-bold tracking-tight">IDENTIQO</span>
              </div>
            </div>

            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-p-xs font-medium">Join 10,000+ companies</span>
              </div>

              <h2 className="text-h2-lg font-bold mb-4 leading-tight">
                Start creating ID cards today
              </h2>
              <p className="text-indigo-200 text-p-md mb-8 leading-relaxed">
                Join thousands of businesses using IDENTIQO to create professional 
                employee identification cards in minutes.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-12">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className="text-indigo-300">{stat.icon}</div>
                      <span className="text-h4-sm font-bold">{stat.value}</span>
                    </div>
                    <p className="text-indigo-300 text-p-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 text-p-xs italic leading-relaxed">
                  "The best decision we made! Created 500+ ID cards in minutes. 
                  The templates are beautiful and the support is amazing."
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-p-xs">MK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-p-xs">Michael Kumar</p>
                    <p className="text-indigo-300 text-xs">Operations Manager</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-indigo-300 text-p-xs">
              © 2026 CardStudio. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form with Slide In/Out Effect */}
        <div className={`w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-white transition-all duration-500 ease-in-out ${
          isSlidingOut ? 'animate-slide-left' : ''
        } ${isSlidingIn ? 'animate-slide-right' : 'translate-x-full opacity-0'}`}>
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <span className="text-2xl font-bold text-indigo-600">IDENTIQO</span>
            </div>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUserPlus className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
              <p className="text-slate-500 text-p-xs mt-1">Join us and start creating ID cards</p>
            </div>

            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:shadow-lg hover:border-slate-300 transition-all duration-300 text-p-xs font-medium text-slate-700 bg-white hover:bg-gray-50"
              >
                <FaGoogle className="w-5 h-5" style={{ color: '#4285F4' }} />
                <span>Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin("Microsoft")}
                className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:shadow-lg hover:border-slate-300 transition-all duration-300 text-p-xs font-medium text-slate-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                </svg>
                <span>Microsoft</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-p-xs">
                <span className="px-4 bg-white text-slate-400">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-p-xs font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({...errors, name: ""});
                    }}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all text-p-xs ${
                      errors.name 
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100" 
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-p-xs font-semibold text-slate-700 mb-2">
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
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all text-p-xs ${
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
                <label className="block text-p-xs font-semibold text-slate-700 mb-2">
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
                    placeholder="Create a password"
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all text-p-xs ${
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

              <div>
                <label className="block text-p-xs font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({...errors, confirmPassword: ""});
                    }}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-4 transition-all text-p-xs ${
                      errors.confirmPassword 
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100" 
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
                Create Account
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-p-xs text-slate-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={handleSignInClick}
                className="text-indigo-600 font-semibold hover:text-indigo-700 transition-all duration-300 hover:scale-105 inline-block"
              >
                Sign in
              </button>
            </p>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">✓ 256-bit SSL Secure</span>
                <span className="flex items-center gap-1">✓ GDPR Compliant</span>
                <span className="flex items-center gap-1">✓ 24/7 Support</span>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .blur-100px {
          filter: blur(100px);
        }
        
        /* Slide in from right animation */
        @keyframes slideRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-right {
          animation: slideRight 0.4s ease-out forwards;
        }
        
        /* Slide out to left animation */
        @keyframes slideLeft {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        .animate-slide-left {
          animation: slideLeft 0.3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}