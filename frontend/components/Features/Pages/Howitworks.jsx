// components/Features/Pages/Howitworks.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Howitworks() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Changed to false initially
  const [isMuted, setIsMuted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [progressWidth, setProgressWidth] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Track if user has started
  const welcomeSpokenRef = useRef(false);

  const steps = [
    {
      id: 1,
      title: "Choose Your Template",
      subtitle: "Select from premium designs",
      description: "Browse our collection of professionally crafted employee card templates",
      longDesc: "Each template is designed by industry experts with attention to detail, typography, and color psychology. Perfect for modern workplaces.",
      voiceText: "Step 1: Choose Your Template. Browse our collection of professionally crafted employee card templates. Each design is made by industry experts.",
      icon: "🎨",
      gradient: "from-indigo-500 to-purple-600",
      lightGradient: "from-indigo-50 to-purple-50",
      stats: "10+ Templates",
      action: "Browse Templates"
    },
    {
      id: 2,
      title: "Add Employee Details",
      subtitle: "Fill in the information",
      description: "Input employee data with our intelligent form system",
      longDesc: "Smart fields auto-validate and format information. Add profile photos, contact details, job titles, and departmental info seamlessly.",
      voiceText: "Step 2: Add Employee Details. Input employee data with our smart form system. It auto-validates and formats all information for you.",
      icon: "✏️",
      gradient: "from-blue-500 to-cyan-600",
      lightGradient: "from-blue-50 to-cyan-50",
      stats: "Smart Fields",
      action: "Start Editing"
    },
    {
      id: 3,
      title: "Customize Design",
      subtitle: "Make it yours",
      description: "Personalize colors, fonts, and layout elements",
      longDesc: "Real-time customization with unlimited color combinations, font pairings, and layout options. Match your brand identity perfectly.",
      voiceText: "Step 3: Customize Design. Personalize colors, fonts, and layouts in real-time. Match your brand identity perfectly with unlimited combinations.",
      icon: "🎨",
      gradient: "from-orange-500 to-red-600",
      lightGradient: "from-orange-50 to-red-50",
      stats: "Unlimited Combos",
      action: "Customize Now"
    },
    {
      id: 4,
      title: "Export & Share",
      subtitle: "Ready to use",
      description: "Download high-quality cards or share instantly",
      longDesc: "Export in multiple formats including PDF, PNG, SVG. Share via email, Slack, or get a shareable link. Integrates with your HR systems.",
      voiceText: "Step 4: Export and Share. Download your cards in PDF, PNG, or SVG format. Share via email, Slack, or get a shareable link for your team.",
      icon: "🚀",
      gradient: "from-green-500 to-teal-600",
      lightGradient: "from-green-50 to-teal-50",
      stats: "Multiple Formats",
      action: "Export Now"
    }
  ];

  const [cardData, setCardData] = useState({
    name: "Sarah Johnson",
    role: "Senior UX Designer",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 234-7890",
    location: "San Francisco, CA",
    department: "Product Design",
    employeeId: "EMP-2024-001",
    joinDate: "Jan 2024",
    avatar: "👩‍💻",
    status: "Active",
    skills: ["UX Research", "Prototyping", "User Testing"]
  });

  const [editData, setEditData] = useState({ ...cardData });

  // Voice narration function
  const speakText = (text) => {
    if (isMuted) return;
    
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    // Select a female voice if available
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => voice.name.includes('Google UK English Female') || voice.name.includes('Samantha') || voice.name.includes('Female'));
      if (femaleVoice) utterance.voice = femaleVoice;
    };
    
    setVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Auto-play animation with voice (only when playing)
  useEffect(() => {
    let interval;
    if (isPlaying && hasStarted) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % steps.length;
          setProgressWidth(((next + 1) / steps.length) * 100);
          return next;
        });
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasStarted, steps.length]);

  // Speak when step changes (only if playing and started)
  useEffect(() => {
    if (isPlaying && hasStarted && !isMuted) {
      speakText(steps[currentStep].voiceText);
    }
  }, [currentStep, isPlaying, hasStarted, isMuted]);

  // Typing animation
  useEffect(() => {
    if (hasStarted) {
      setTypedText("");
      let i = 0;
      const text = steps[currentStep].description;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setTypedText(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [currentStep, steps, hasStarted]);

  // Update progress on step change
  useEffect(() => {
    setProgressWidth(((currentStep + 1) / steps.length) * 100);
  }, [currentStep]);

  const handleStepClick = (index) => {
    setCurrentStep(index);
    if (!hasStarted) { 
      setHasStarted(true);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
      speakText(steps[currentStep].voiceText);
    } else if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(steps[currentStep].voiceText);
    }
  };

  const handleMuteToggle = () => {
    if (!isMuted) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (isPlaying && hasStarted) {
      speakText(steps[currentStep].voiceText);
    }
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
    }
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrevious = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPlaying(true);
    }
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const handleEditToggle = () => {
    setIsEditing(true);
    setTimeout(() => {
      const element = document.getElementById('edit-name');
      if (element) element.focus();
    }, 100);
  };

  const handleSaveEdit = () => {
    setCardData({ ...editData });
    setIsEditing(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden font-sans">
      
      {/* Decorative Background Elements */}
     

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative pt-4">
            <div className="absolute right-0 top-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMuteToggle}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 text-2xl text-gray-700 shadow-lg hover:bg-gray-100 transition-all"
              >
                {isMuted ? "🔇" : "🔊"}
              </motion.button>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                How It Works
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create stunning employee cards in minutes with our seamless 4-step workflow
              </p>
            </div>
          </div>
        </motion.div>

        {/* Welcome Overlay - Show play button if not started */}
        {!hasStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <span className="text-6xl">🎬</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
              <p className="text-gray-600 mb-8">Watch our interactive tutorial with voice narration</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                <span className="text-2xl">▶</span>
                Start Tutorial
              </motion.button>
              <p className="text-sm text-gray-400 mt-6">Voice narration will guide you through each step</p>
            </div>
          </motion.div>
        )}

        {/* Main Content - Only show after start */}
        {hasStarted && (
          <>
            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="absolute -top-4 left-0 right-0 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Step Timeline */}
              <div className="flex justify-between mb-8 pt-6">
                {steps.map((step, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className="relative flex-1 text-center group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`relative z-10 w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                      currentStep === index 
                        ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg shadow-purple-300/50` 
                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600"
                    }`}>
                      {step.icon}
                      {currentStep === index && (
                        <motion.div 
                          layoutId="activeStep"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-50 -z-10"
                          style={{ background: step.gradient }}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                    </div>
                    <div className="mt-2">
                      <p className={`text-xs font-medium transition-colors duration-300 ${
                        currentStep === index ? "text-gray-800" : "text-gray-400"
                      }`}>
                        STEP {index + 1}
                      </p>
                      <p className={`text-xs font-semibold transition-colors duration-300 hidden md:block ${
                        currentStep === index ? "text-gray-800" : "text-gray-400"
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="relative min-h-[550px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                  >
                    <div className="grid lg:grid-cols-2 gap-0">
                      
                      {/* Left Side - Content */}
                      <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
                        <motion.div
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mb-4"
                        >
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${currentStepData.gradient} text-white mb-3 shadow-sm`}>
                            {currentStepData.stats}
                          </span>
                          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                            {currentStepData.title}
                          </h2>
                          <p className="text-gray-600 text-base mb-2">{currentStepData.subtitle}</p>
                          <div className="h-14">
                            <p className="text-gray-600 text-sm">
                              {typedText}
                              <span className="inline-block w-0.5 h-4 bg-purple-500 ml-1 animate-pulse"></span>
                            </p>
                          </div>
                          <p className="text-gray-500 text-xs mt-3 leading-relaxed">
                            {currentStepData.longDesc}
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-2 mt-4"
                        >
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                            <span>Intuitive drag-and-drop interface</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                            <span>Real-time preview updates</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
                            <span>Cloud sync & team collaboration</span>
                          </div>
                        </motion.div>

                        <motion.button
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.05, x: 5 }}
                          className={`mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${currentStepData.gradient} text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all`}
                        >
                          {currentStepData.action}
                          <span className="text-lg">→</span>
                        </motion.button>
                      </div>

                      {/* Right Side - Live Demo Card */}
                      <div className="relative bg-gray-50 p-6 lg:p-8 flex items-center justify-center border-l border-gray-100">
                        <div className="relative w-full max-w-sm">
                          {/* Employee Card */}
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{ delay: 0.3, type: "spring", duration: 0.6 }}
                            className="relative group"
                            whileHover={{ y: -5 }}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            {/* Card Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition duration-500"></div>
                            
                            {/* Main Card */}
                            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                              {/* Card Header */}
                              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 relative">
                                <div className="absolute inset-0 bg-white/10"></div>
                                <div className="flex justify-between items-center">
                                  <span className="text-white text-xs font-mono">EMPLOYEE CARD</span>
                                  <span className="text-white/80 text-xs">{cardData.employeeId}</span>
                                </div>
                              </div>
                              
                              {/* Card Body */}
                              <div className="p-5">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-3xl shadow-md">
                                    {cardData.avatar}
                                  </div>
                                  <div className="flex-1">
                                    {isEditing && currentStep === 1 ? (
                                      <input
                                        id="edit-name"
                                        type="text"
                                        value={editData.name}
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        className="text-base font-bold text-gray-800 bg-purple-50 border border-purple-300 rounded px-2 py-1 w-full"
                                        onBlur={handleSaveEdit}
                                      />
                                    ) : (
                                      <h3 
                                        className="text-base font-bold text-gray-800 cursor-pointer hover:text-purple-600 transition"
                                        onClick={handleEditToggle}
                                      >
                                        {cardData.name}
                                        {currentStep === 1 && (
                                          <span className="ml-1 text-xs text-purple-500">✎</span>
                                        )}
                                      </h3>
                                    )}
                                    <p className="text-purple-600 font-semibold text-xs">{cardData.role}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                      <span className="text-xs text-gray-500">{cardData.status}</span>
                                    </div>
                                  </div>
                                </div>
                                
                              
                                
                                <div className="mt-3 pt-2 border-t border-gray-100">
                                  <div className="flex flex-wrap gap-1.5">
                                    {cardData.skills.map((skill, idx) => (
                                      <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Card Footer */}
                            
                            </div>
                            
                            {/* Tooltip */}
                            <AnimatePresence>
                              {showTooltip && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
                                >
                                  Click to edit card ✨
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between mt-6 px-4">
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    className="bg-gray-100 rounded-full p-2.5 text-gray-700 hover:bg-gray-200 transition-all text-lg"
                  >
                    ⏮
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlayPause}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-3 text-white shadow-lg hover:shadow-xl transition-all text-lg"
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="bg-gray-100 rounded-full p-2.5 text-gray-700 hover:bg-gray-200 transition-all text-lg"
                  >
                    ⏭
                  </motion.button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">0{currentStep + 1}</span>
                  <div className="flex gap-1">
                    {steps.map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleStepClick(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentStep === index ? "w-6 bg-gradient-to-r from-indigo-500 to-purple-600" : "w-1.5 bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm">0{steps.length}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button whileHover={{ scale: 1.05 }} className="text-gray-500 hover:text-gray-700 text-lg">
                    ⛶
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Voice Narration Indicator */}
            {!isMuted && isPlaying && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg px-3 py-1.5 flex items-center gap-2 border border-gray-200 z-50"
              >
                <div className="relative">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-xs text-gray-700">Voice narration active</span>
              </motion.div>
            )}
          </>
        )}

        {/* Feature Highlights - Only show after start */}
     
        {/* CTA Section - Only show after start */}
        {hasStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 pb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-6 py-3 rounded-full font-semibold text-base overflow-hidden shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-white flex items-center gap-2">
                Start Creating Now 🚀
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </motion.button>
            <p className="text-gray-400 text-xs mt-3">No credit card required • Free forever</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}