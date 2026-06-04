// components/Common/Button.jsx
"use client";

import Link from "next/link";
import { forwardRef } from "react";

const Button = forwardRef(({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  className = "",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}, ref) => {
  
  // Variant styles
  const variants = {
    // Primary gradient button
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95",
    
    // Secondary outline button
    secondary: "bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30",
    
    // Gradient outline button
    outline: "bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent",
    
    // Danger/Delete button
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-md hover:shadow-lg",
    
    // Success button
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md hover:shadow-lg",
    
    // Warning button
    warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-lg",
    
    // Ghost button (no background)
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-indigo-600",
    
    // Dark button
    dark: "bg-slate-800 text-white hover:bg-slate-700 shadow-md hover:shadow-lg",
    
    // Social button (Google, Microsoft, etc.)
    social: "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:shadow-md",
  };
  
  // Size styles
  const sizes = {
    xs: "px-3 py-1.5 text-p-xs rounded-lg",
    sm: "px-4 py-2 text-p-xs rounded-lg",
    md: "px-5 py-2.5 text-p-xs rounded-xl",
    lg: "px-6 py-3 text-p-sm rounded-xl",
    xl: "px-8 py-3.5 text-p-sm rounded-2xl",
  };
  
  // Icon size mapping
  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };
  
  // Base classes
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 whitespace-nowrap";
  
  // Width class
  const widthClass = fullWidth ? "w-full" : "";
  
  // Disabled class
  const disabledClass = disabled || loading ? "opacity-60 cursor-not-allowed hover:scale-100" : "";
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`;
  
  // Loading spinner
  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
  
  // Icon element
  const IconElement = Icon && !loading && (
    <Icon className={`${iconSizes[size]} transition-transform duration-300 ${iconPosition === "left" ? "group-hover:translate-x-0.5" : "group-hover:-translate-x-0.5"}`} />
  );
  
  // Content with loading state
  const content = (
    <>
      {loading ? <LoadingSpinner /> : iconPosition === "left" && IconElement}
      {children}
      {!loading && iconPosition === "right" && IconElement}
    </>
  );
  
  // Render as Link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={`group ${combinedClasses}`}
        {...props}
      >
        {content}
      </Link>
    );
  }
  
  // Render as button
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group ${combinedClasses}`}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";

export default Button;