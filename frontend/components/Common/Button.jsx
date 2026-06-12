// components/Common/Button.jsx
"use client";

import Link from "next/link";
import { forwardRef, Fragment } from "react";
import { motion } from "framer-motion";

const Button = forwardRef(({
  // Content
  children,
  icon: Icon,
  iconPosition = "left",
  
  // Variants
  variant = "primary",
  size = "md",
  
  // Actions
  href,
  onClick,
  type = "button",
  
  // Styling
  className = "",
  fullWidth = false,
  
  // States
  disabled = false,
  loading = false,
  
  // Animations
  animated = true,
  ripple = true,
  
  // Accessibility
  ariaLabel,
  
  // Rest props
  ...props
}, ref) => {
  
  // ============================================================================
  // Variant Styles (using your Tailwind config)
  // ============================================================================
  const variants = {
    // Standard variants
    primary: "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-95",
    secondary: "bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 hover:shadow-md",
    outline: "bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-indigo-500/25",
    danger: "bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-md hover:shadow-lg hover:shadow-rose-500/25 hover:scale-[1.02] active:scale-95",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-95",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-95",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-indigo-600 hover:scale-[1.02] active:scale-95",
    dark: "bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg hover:shadow-slate-900/25 hover:scale-[1.02] active:scale-95",
    social: "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:shadow-md hover:scale-[1.02] active:scale-95 hover:text-indigo-600",
    info: "bg-gradient-to-r from-sky-500 to-blue-500 text-white hover:from-sky-600 hover:to-blue-600 shadow-md hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.02] active:scale-95",
    
    // Pricing page specific variants
    tier: "relative z-10 flex-1 sm:flex-none px-3 sm:px-5 md:px-7 py-1.5 sm:py-2 rounded-full font-semibold text-[11px] sm:text-p-xs md:text-p-sm transition-all duration-300 whitespace-nowrap text-slate-500 hover:text-indigo-500 hover:bg-white/50",
    tierActive: "relative z-10 flex-1 sm:flex-none px-3 sm:px-5 md:px-7 py-1.5 sm:py-2 rounded-full font-semibold text-[11px] sm:text-p-xs md:text-p-sm transition-all duration-300 whitespace-nowrap text-indigo-600 bg-white sm:bg-transparent shadow-sm sm:shadow-none",
    toggle: "relative w-14 sm:w-16 h-7 sm:h-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg group",
  };
  
  // ============================================================================
  // Size Styles (responsive using your Tailwind breakpoints)
  // ============================================================================
  const sizes = {
    xs: "px-2.5 py-1.5 text-xs rounded-lg gap-1.5",
    sm: "px-3.5 py-2 text-p-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-p-xs rounded-xl gap-2",
    lg: "px-6 py-3 text-p-sm rounded-xl gap-2.5",
    xl: "px-8 py-3.5 text-p-md rounded-2xl gap-3",
  };
  
  // ============================================================================
  // Icon Sizes
  // ============================================================================
  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };
  
  // ============================================================================
  // Loading Spinner Sizes (responsive)
  // ============================================================================
  const spinnerSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };
  
  // ============================================================================
  // Base Classes
  // ============================================================================
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 ease-out inline-flex items-center justify-center gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled || loading ? "cursor-not-allowed" : "";
  
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`;
  
  // ============================================================================
  // Loading Spinner (with responsive size)
  // ============================================================================
  const LoadingSpinner = () => (
    <svg className={`${spinnerSizes[size]} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
  
  // ============================================================================
  // Ripple Effect Handler (improved)
  // ============================================================================
  const handleRipple = (event) => {
    if (!ripple || disabled || loading) return;
    
    const button = event.currentTarget;
    const rippleElement = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    rippleElement.className = "absolute rounded-full bg-white/30 pointer-events-none animate-ripple";
    rippleElement.style.width = `${size}px`;
    rippleElement.style.height = `${size}px`;
    rippleElement.style.left = `${x}px`;
    rippleElement.style.top = `${y}px`;
    
    // Only set styles if not already set by className
    if (!button.style.position || button.style.position === 'static') {
      button.style.position = 'relative';
    }
    if (button.style.overflow !== 'hidden') {
      button.style.overflow = 'hidden';
    }
    
    button.appendChild(rippleElement);
    
    setTimeout(() => {
      rippleElement.remove();
    }, 600);
  };
  
  // ============================================================================
  // External Link Handler
  // ============================================================================
  const isExternalLink = href && (href.startsWith('http') || href.startsWith('//'));
  const linkProps = isExternalLink ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};
  
  // ============================================================================
  // Icon Element with improved animations (removed double animations)
  // ============================================================================
  const IconElement = Icon && !loading && (
    <div className="inline-flex">
      <Icon className={`${iconSizes[size]} transition-all duration-300 ${iconPosition === "left" ? "group-hover:-translate-x-0.5 group-hover:scale-110" : "group-hover:translate-x-0.5 group-hover:scale-110"}`} />
    </div>
  );
  
  // ============================================================================
  // Button Content
  // ============================================================================
  const content = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && iconPosition === "left" && IconElement}
      <motion.span
        initial={{ opacity: 0, y: loading ? 10 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {!loading && iconPosition === "right" && IconElement}
    </>
  );
  
  // ============================================================================
  // Animation Variants
  // ============================================================================
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } },
    tap: { scale: 0.98, transition: { duration: 0.1, ease: "easeIn" } },
  };
  
  // ============================================================================
  // Render as Link
  // ============================================================================
  if (href) {
    const linkContent = (
      <Link
        href={href}
        className={`group ${combinedClasses}`}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        onClick={ripple ? handleRipple : undefined}
        {...linkProps}
        {...props}
      >
        {content}
      </Link>
    );
    
    if (animated) {
      return (
        <motion.div
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          {linkContent}
        </motion.div>
      );
    }
    
    return linkContent;
  }
  
  // ============================================================================
  // Render as Button
  // ============================================================================
  const buttonContent = (
    <button
      ref={ref}
      type={type}
      onClick={(e) => {
        if (ripple) handleRipple(e);
        if (onClick) onClick(e);
      }}
      disabled={disabled || loading}
      className={`group ${combinedClasses}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={loading}
      {...props}
    >
      {content}
    </button>
  );
  
  if (animated) {
    return (
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        {buttonContent}
      </motion.div>
    );
  }
  
  return buttonContent;
});

Button.displayName = "Button";

export default Button;