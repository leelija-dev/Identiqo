// app/blog/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiArrowRight,
  FiBookmark,
  FiGrid,
  FiList,
  FiEye,
  FiZap,
  FiCompass,
  FiPenTool,
  FiCode,
  FiBriefcase,
  FiBookOpen,
} from "react-icons/fi";
import Button from "@/components/Common/Button";
import { 
  CategoryPillsSkeleton, 
  FeaturedPostSkeleton, 
  BlogCardSkeleton 
} from "@/components/Common/Skeleton";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleViewModeChange = (mode) => {
    if (mode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setTimeout(() => setIsTransitioning(false), 300);
    }, 200);
  };

  const categories = [
    { id: "all", name: "All Categories", count: 24, icon: FiCompass, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: "design", name: "Design", count: 8, icon: FiPenTool, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "development", name: "Development", count: 10, icon: FiCode, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "business", name: "Business", count: 4, icon: FiBriefcase, color: "text-amber-600", bg: "bg-amber-50" },
    { id: "tutorials", name: "Tutorials", count: 2, icon: FiBookOpen, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const featuredPost = {
    id: "featured",
    title: "The Future of Digital Identity: Trends to Watch in 2025",
    excerpt: "Explore how digital identity is evolving and what it means for businesses and individuals. From biometric authentication to blockchain-based verification and AI-powered security.",
    author: "Sarah Johnson",
    authorRole: "Senior Editor",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    category: "Design",
    likes: 234,
    comments: 45,
    views: "2.5k",
  };

  const posts = [
    {
      id: 1,
      title: "10 Tips for Creating Professional ID Cards",
      excerpt: "Learn the best practices for designing professional employee ID cards that look great and function perfectly in any organization.",
      author: "Mike Chen",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "design",
      likes: 156,
      comments: 23,
      views: "1.2k",
      tags: ["Design Tips", "ID Cards", "Best Practices"],
    },
    {
      id: 2,
      title: "How to Implement Secure QR Code Verification",
      excerpt: "A comprehensive guide to adding secure QR code verification to your employee identification system with best security practices.",
      author: "Emily Rodriguez",
      date: "Dec 5, 2024",
      readTime: "10 min read",
      category: "development",
      likes: 289,
      comments: 34,
      views: "3.1k",
      tags: ["Security", "QR Code", "Verification"],
    },
    {
      id: 3,
      title: "The ROI of Digital Employee IDs for Modern Businesses",
      excerpt: "Discover how switching to digital employee IDs can save your company time and money while improving security and efficiency.",
      author: "David Kim",
      date: "Nov 28, 2024",
      readTime: "7 min read",
      category: "business",
      likes: 167,
      comments: 19,
      views: "890",
      tags: ["Business", "ROI", "Digital Transformation"],
    },
    {
      id: 4,
      title: "Getting Started with Bulk Card Generation",
      excerpt: "Step-by-step tutorial on generating hundreds of employee cards at once using CSV upload and automation tools.",
      author: "Lisa Wang",
      date: "Nov 20, 2024",
      readTime: "5 min read",
      category: "tutorials",
      likes: 98,
      comments: 12,
      views: "567",
      tags: ["Tutorial", "Bulk Generation", "CSV"],
    },
    {
      id: 5,
      title: "Customizing Templates for Your Brand Identity",
      excerpt: "Learn how to customize CardStudio templates to perfectly match your company's brand guidelines and visual identity.",
      author: "Alex Turner",
      date: "Nov 15, 2024",
      readTime: "9 min read",
      category: "design",
      likes: 145,
      comments: 18,
      views: "1.1k",
      tags: ["Branding", "Templates", "Customization"],
    },
    {
      id: 6,
      title: "API Integration: Automating Card Creation",
      excerpt: "How to use our REST API to automatically generate and manage employee cards from your existing systems.",
      author: "Chris Martin",
      date: "Nov 10, 2024",
      readTime: "12 min read",
      category: "development",
      likes: 234,
      comments: 31,
      views: "2.3k",
      tags: ["API", "Automation", "Integration"],
    },
  ];

  const handleLike = (postId) => {
    setLikedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleBookmark = (postId) => {
    setBookmarkedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const filteredPosts = posts.filter(
    (post) =>
      (selectedCategory === "all" || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const getCategoryStyles = (category) => {
    const styles = {
      design: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", gradient: "from-blue-500 to-indigo-500" },
      development: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", gradient: "from-emerald-500 to-teal-500" },
      business: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", gradient: "from-amber-500 to-orange-500" },
      tutorials: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", gradient: "from-purple-500 to-pink-500" },
    };
    return styles[category] || styles.design;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const gridVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const listVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 via-white to-purple-100/30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 shadow-sm border border-slate-100"
            >
              <FiZap className="text-indigo-500 w-4 h-4" />
              <span className="text-indigo-600 text-sm font-semibold tracking-wide">INSIGHTS & IDEAS</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-h1-sm sm:text-h1-md lg:text-h1-xl font-bold text-slate-800 mb-3 tracking-tight"
            >
              Stories from
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent block">
                the ID studio
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-p-xs sm:text-p-sm text-slate-500 max-w-xl mx-auto"
            >
              Expert insights on digital identification, design trends, and the future of workplace credentials
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-md mx-auto mt-6"
            >
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-p-xs"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        {/* Category Pills */}
        {isLoading ? (
          <CategoryPillsSkeleton />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-2 justify-center mb-8"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 text-sm ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-200"
                      : `${category.bg} ${category.color} hover:shadow-sm border border-slate-100`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-xs ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                    {category.count}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Content - Full width */}
          <div className="lg:col-span-12">
            
            {/* View Toggle with Animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center mb-6"
            >
              <p className="text-slate-500 text-p-xs">
                Showing <span className="font-semibold text-slate-700">{filteredPosts.length}</span> articles
              </p>
              <div className="flex gap-2 bg-slate-100 rounded-xl p-1">
                <Button
                  onClick={() => handleViewModeChange("grid")}
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  icon={FiGrid}
                >
                  Grid View
                </Button>
                <Button
                  onClick={() => handleViewModeChange("list")}
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  icon={FiList}
                >
                  List View
                </Button>
              </div>
            </motion.div>
            
            {/* Featured Post */}
            {isLoading ? (
              <FeaturedPostSkeleton viewMode={viewMode} />
            ) : (
              searchTerm === "" && selectedCategory === "all" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-10"
                >
                  {viewMode === "grid" ? (
                    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden">
                      <div className="relative h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            Featured
                          </span>
                          <span className="text-sm text-indigo-600 font-medium">{featuredPost.category}</span>
                        </div>
                        
                        <h2 className="text-h3-sm sm:text-h3-lg font-bold text-slate-800 mb-2 leading-tight">
                          <Link href={`/blog/${featuredPost.id}`} className="hover:text-indigo-600 transition-colors">
                            {featuredPost.title}
                          </Link>
                        </h2>
                        
                        <p className="text-slate-600 text-p-xs mb-4 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <FiCalendar className="w-4 h-4 text-indigo-400" />
                              <span>{featuredPost.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FiClock className="w-4 h-4 text-purple-400" />
                              <span>{featuredPost.readTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FiEye className="w-4 h-4 text-slate-400" />
                              <span>{featuredPost.views}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleLike(featuredPost.id)}
                              className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors"
                            >
                              <FiHeart className={`w-4 h-4 ${likedPosts[featuredPost.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                              <span className="text-sm">{featuredPost.likes + (likedPosts[featuredPost.id] ? 1 : 0)}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors">
                              <FiMessageCircle className="w-4 h-4" />
                              <span className="text-sm">{featuredPost.comments}</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                              {featuredPost.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-p-xs">{featuredPost.author}</p>
                              <p className="text-xs text-slate-500">{featuredPost.authorRole}</p>
                            </div>
                          </div>
                          
                          <Link 
                            href={`/blog/${featuredPost.id}`}
                            className="inline-flex items-center gap-2 text-p-xs font-medium text-indigo-600 hover:text-indigo-700 hover:gap-3 transition-all"
                          >
                            Read full article
                            <FiArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden">
                      <div className="relative h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
                      <div className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                Featured
                              </span>
                              <span className="text-sm text-indigo-600 font-medium">{featuredPost.category}</span>
                            </div>
                            
                            <h2 className="text-h3-sm font-bold text-slate-800 mb-2 leading-tight">
                              <Link href={`/blog/${featuredPost.id}`} className="hover:text-indigo-600 transition-colors">
                                {featuredPost.title}
                              </Link>
                            </h2>
                            
                            <p className="text-slate-600 text-p-xs mb-3 leading-relaxed line-clamp-2">
                              {featuredPost.excerpt}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <FiCalendar className="w-4 h-4 text-indigo-400" />
                                <span>{featuredPost.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <FiClock className="w-4 h-4 text-purple-400" />
                                <span>{featuredPost.readTime}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <FiEye className="w-4 h-4 text-slate-400" />
                                <span>{featuredPost.views}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleLike(featuredPost.id)}
                                  className="flex items-center gap-1 text-slate-500 hover:text-rose-500 transition-colors"
                                >
                                  <FiHeart className={`w-4 h-4 ${likedPosts[featuredPost.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                                  <span>{featuredPost.likes + (likedPosts[featuredPost.id] ? 1 : 0)}</span>
                                </button>
                                <button className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors">
                                  <FiMessageCircle className="w-4 h-4" />
                                  <span>{featuredPost.comments}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="font-semibold text-slate-800 text-p-xs">{featuredPost.author}</p>
                                <p className="text-xs text-slate-500">{featuredPost.authorRole}</p>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                                {featuredPost.author.charAt(0)}
                              </div>
                            </div>
                            <Link 
                              href={`/blog/${featuredPost.id}`}
                              className="inline-flex items-center gap-2 text-p-xs font-medium text-indigo-600 hover:text-indigo-700 hover:gap-3 transition-all"
                            >
                              Read full article
                              <FiArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            )}

            {/* Posts with Animated Transition between Grid and List */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-5"}>
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <BlogCardSkeleton key={idx} viewMode={viewMode} />
                    ))}
                  </div>
                </motion.div>
              ) : filteredPosts.length > 0 ? (
                <motion.div
                  key={viewMode}
                  variants={viewMode === "grid" ? gridVariants : listVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-5"}
                  >
                    {filteredPosts.map((post) => {
                      const catStyle = getCategoryStyles(post.category);
                      return (
                        <motion.article
                          key={post.id}
                          variants={itemVariants}
                          whileHover={{ y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden"
                        >
                          <div className={`h-0.5 bg-gradient-to-r ${catStyle.gradient}`}></div>
                          <div className="p-5">
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-3.5 h-3.5" />
                                <span>{post.date}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <FiClock className="w-3.5 h-3.5" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-h4-sm font-bold text-slate-800 mb-2 leading-snug">
                              <Link href={`/blog/${post.id}`} className="hover:text-indigo-600 transition-colors">
                                {post.title}
                              </Link>
                            </h3>
                            
                            <p className="text-slate-600 text-p-xs mb-3 line-clamp-2">
                              {post.excerpt}
                            </p>
                            
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold">
                                  {post.author.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-slate-600">{post.author}</span>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <motion.button 
                                  onClick={() => handleLike(post.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                  <FiHeart className={`w-4 h-4 ${likedPosts[post.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                                </motion.button>
                                <motion.button 
                                  onClick={() => handleBookmark(post.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-slate-400 hover:text-amber-600 transition-colors"
                                >
                                  <FiBookmark className={`w-4 h-4 ${bookmarkedPosts[post.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 bg-white rounded-xl border border-slate-100"
                >
                  <div className="text-5xl mb-3">📚</div>
                  <h3 className="text-h4-md font-semibold text-slate-700 mb-1">No articles found</h3>
                  <p className="text-slate-500 text-p-xs">Try adjusting your search or browse by category</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!isLoading && filteredPosts.length === posts.length && filteredPosts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center gap-2 mt-10"
              >
                {[1, 2, 3].map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-p-xs transition-all ${
                      page === 1
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}