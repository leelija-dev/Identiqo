// components/Common/Skeleton.jsx
"use client";

import { memo } from "react";

const Skeleton = ({ className = "", variant = "rectangular", width, height, circle = false }) => {
  const baseClasses = "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]";
  
  const getVariantClasses = () => {
    if (variant === "circular" || circle) {
      return "rounded-full";
    }
    if (variant === "rounded") {
      return "rounded-2xl";
    }
    return "rounded-lg";
  };

  const styles = {
    width: width || "100%",
    height: height || "auto",
  };

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={styles}
    />
  );
};

// Card Skeleton for Templates
export const TemplateCardSkeleton = memo(({ orientation = "landscape" }) => {
  const isLandscape = orientation === "landscape";
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Card Preview Area */}
      <div className={`relative ${isLandscape ? 'aspect-[550/348]' : 'aspect-[350/550]'} bg-slate-100`}>
        {/* Gradient bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
        
        {/* Profile circle skeleton */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Skeleton 
            variant="circular" 
            width={isLandscape ? 60 : 80} 
            height={isLandscape ? 60 : 80} 
            className="mx-auto"
          />
        </div>
        
        {/* Name skeleton */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32">
          <Skeleton width="100%" height={16} className="mx-auto" />
        </div>
        
        {/* Role skeleton */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-24">
          <Skeleton width="100%" height={12} className="mx-auto" />
        </div>
        
        {/* Bottom bar skeleton */}
        <div className="absolute bottom-3 left-4 right-4">
          <Skeleton width="100%" height={6} />
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton width={80} height={12} />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="circular" width={28} height={28} />
          </div>
        </div>
      </div>
    </div>
  );
});

// Simple Card Skeleton for Gallery/Grid view
export const SimpleCardSkeleton = memo(({ orientation = "landscape" }) => {
  const isLandscape = orientation === "landscape";
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className={`${isLandscape ? 'aspect-[550/348]' : 'aspect-[350/550]'} bg-slate-100 relative`}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 space-y-3">
          <Skeleton variant="circular" width={isLandscape ? 50 : 70} height={isLandscape ? 50 : 70} className="mx-auto" />
          <Skeleton width="80%" height={14} className="mx-auto" />
          <Skeleton width="60%" height={10} className="mx-auto" />
        </div>
      </div>
      
      <div className="p-3">
        <Skeleton width="70%" height={12} className="mx-auto" />
      </div>
    </div>
  );
});

// List View Skeleton
export const ListCardSkeleton = memo(() => {
  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="flex gap-4">
        <Skeleton width={80} height={80} variant="rounded" className="flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="90%" height={12} />
          <Skeleton width="40%" height={10} />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>
    </div>
  );
});

// Loading Grid for Templates Page
export const TemplateGridSkeleton = memo(({ count = 6, orientation = "landscape" }) => {
  const isLandscape = orientation === "landscape";
  const gridCols = isLandscape 
    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
    : "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4";
  
  return (
    <div className={`grid gap-6 sm:gap-8 ${gridCols}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <TemplateCardSkeleton key={idx} orientation={orientation} />
      ))}
    </div>
  );
});

// Sidebar Skeleton
export const SidebarSkeleton = memo(() => {
  return (
    <aside className="fixed md:relative top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white/80 backdrop-blur-sm border-r border-slate-200 py-6 overflow-y-auto z-40">
      <div className="mb-8">
        <div className="px-5 pb-3">
          <Skeleton width={100} height={12} />
        </div>
        <div className="space-y-2 px-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-2.5">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton width={100} height={16} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <div className="px-5 pb-3">
          <Skeleton width={80} height={12} />
        </div>
        <div className="px-5">
          <Skeleton width="100%" height={42} className="rounded-xl" />
        </div>
      </div>
    </aside>
  );
});

// ============= BLOG SKELETONS =============

// Blog Card Skeleton
export const BlogCardSkeleton = memo(({ viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton width={60} height={16} className="rounded-full" />
              <Skeleton width={40} height={12} />
            </div>
            <Skeleton width="80%" height={24} />
            <Skeleton width="100%" height={40} />
            <div className="flex gap-4">
              <Skeleton width={80} height={14} />
              <Skeleton width={80} height={14} />
              <Skeleton width={60} height={14} />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <div className="text-right space-y-1">
                <Skeleton width={80} height={12} />
                <Skeleton width={60} height={10} />
              </div>
              <Skeleton variant="circular" width={40} height={40} />
            </div>
            <Skeleton width={100} height={16} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="h-0.5 bg-gradient-to-r from-slate-200 to-slate-300" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton width={60} height={12} />
          <Skeleton width={40} height={12} />
        </div>
        <Skeleton width="90%" height={20} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="100%" height={16} />
        <div className="flex gap-2">
          <Skeleton width={60} height={20} className="rounded-full" />
          <Skeleton width={80} height={20} className="rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton width={80} height={12} />
          </div>
          <div className="flex gap-2">
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
});

// Featured Post Skeleton
export const FeaturedPostSkeleton = memo(({ viewMode = "grid" }) => {
  if (viewMode === "list") {
    return (
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100 mb-10">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="relative h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton width={70} height={20} className="rounded-full" />
                <Skeleton width={50} height={16} />
              </div>
              <Skeleton width="90%" height={28} />
              <Skeleton width="100%" height={48} />
              <div className="flex gap-4">
                <Skeleton width={100} height={14} />
                <Skeleton width={100} height={14} />
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <div className="text-right space-y-1">
                  <Skeleton width={100} height={14} />
                  <Skeleton width={80} height={12} />
                </div>
                <Skeleton variant="circular" width={40} height={40} />
              </div>
              <Skeleton width={120} height={16} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100 mb-10">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative h-1 bg-gradient-to-r from-slate-200 to-slate-300" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton width={80} height={20} className="rounded-full" />
          <Skeleton width={60} height={16} />
        </div>
        <Skeleton width="95%" height={32} />
        <Skeleton width="100%" height={48} />
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Skeleton width={100} height={14} />
            <Skeleton width={100} height={14} />
          </div>
          <div className="flex gap-3">
            <Skeleton width={60} height={14} />
            <Skeleton width={60} height={14} />
          </div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div>
              <Skeleton width={120} height={14} />
              <Skeleton width={80} height={12} />
            </div>
          </div>
          <Skeleton width={100} height={16} />
        </div>
      </div>
    </div>
  );
});

// Category Pills Skeleton
export const CategoryPillsSkeleton = memo(() => {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} width={100} height={36} className="rounded-full" />
      ))}
    </div>
  );
});

// Grid Skeleton for Blog (multiple cards)
export const BlogGridSkeleton = memo(({ count = 6, viewMode = "grid" }) => {
  return (
    <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-5"}>
      {Array.from({ length: count }).map((_, idx) => (
        <BlogCardSkeleton key={idx} viewMode={viewMode} />
      ))}
    </div>
  );
});

export default Skeleton;