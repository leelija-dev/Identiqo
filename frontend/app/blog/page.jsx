// app/blog/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Common/Button";
import { 
  FiSearch, FiCalendar, FiClock, FiArrowRight, FiEye, 
  FiTrendingUp,  FiTag, FiHeart, 
  FiShare2, FiBookmark, FiChevronRight, FiZap
} from "react-icons/fi";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPost, setHoveredPost] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: "all", name: "All Articles", count: 12, icon: "📚", color: "from-gray-500 to-gray-600" },
    { id: "design", name: "Design", count: 4, icon: "🎨", color: "from-blue-500 to-cyan-500" },
    { id: "technology", name: "Technology", count: 5, icon: "💻", color: "from-green-500 to-emerald-500" },
    { id: "security", name: "Security", count: 3, icon: "🔒", color: "from-purple-500 to-pink-500" },
  ];

  const featuredPost = {
    id: "featured",
    title: "The Future of Digital Identity: What's Coming in 2025",
    excerpt: "From biometric authentication to blockchain-based verification, discover the trends shaping the future of digital identification and how your business can stay ahead of the curve in this comprehensive guide.",
    author: "Sarah Johnson",
    role: "Industry Expert",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Technology",
    image: "🔮",
    likes: 1245,
    comments: 89,
  };

  const popularPosts = [
    { id: 1, title: "10 Tips for Creating Professional ID Cards", views: "12.5k", date: "Dec 10, 2024", trending: true },
    { id: 2, title: "How to Implement Secure QR Code Systems", views: "8.2k", date: "Dec 5, 2024", trending: false },
    { id: 3, title: "The ROI of Digital Employee IDs", views: "6.8k", date: "Nov 28, 2024", trending: true },
    { id: 4, title: "Getting Started with Bulk Card Generation", views: "5.1k", date: "Nov 20, 2024", trending: false },
  ];

  const posts = [
    {
      id: 1,
      title: "10 Tips for Creating Professional Employee ID Cards",
      excerpt: "Learn the best practices for designing ID cards that employees will actually want to carry and use every day, with real-world examples and case studies.",
      author: "Mike Chen",
      avatar: "MC",
      date: "Dec 10, 2024",
      readTime: "6 min",
      category: "design",
      views: "1.2k",
      likes: 156,
      comments: 23,
      featured: false,
    },
    {
      id: 2,
      title: "How to Implement Secure QR Code Verification Systems",
      excerpt: "A comprehensive guide to adding secure QR code verification to your employee identification system, including encryption best practices and implementation tips.",
      author: "Emily Rodriguez",
      avatar: "ER",
      date: "Dec 5, 2024",
      readTime: "10 min",
      category: "technology",
      views: "3.1k",
      likes: 289,
      comments: 45,
      featured: true,
    },
    {
      id: 3,
      title: "The ROI of Digital Employee IDs for Modern Businesses",
      excerpt: "Discover how switching to digital employee IDs can save your company time and money, with detailed cost analysis and success stories from leading companies.",
      author: "David Kim",
      avatar: "DK",
      date: "Nov 28, 2024",
      readTime: "7 min",
      category: "security",
      views: "890",
      likes: 167,
      comments: 12,
      featured: false,
    },
    {
      id: 4,
      title: "Getting Started with Bulk Card Generation",
      excerpt: "Step-by-step tutorial on generating hundreds of employee cards at once using CSV upload, including template mapping and data validation techniques.",
      author: "Lisa Wang",
      avatar: "LW",
      date: "Nov 20, 2024",
      readTime: "5 min",
      category: "technology",
      views: "567",
      likes: 98,
      comments: 8,
      featured: false,
    },
    {
      id: 5,
      title: "Customizing Templates for Your Brand Identity",
      excerpt: "Learn how to customize templates to perfectly match your company's brand guidelines, with advanced CSS techniques and design principles.",
      author: "Alex Turner",
      avatar: "AT",
      date: "Nov 15, 2024",
      readTime: "9 min",
      category: "design",
      views: "1.1k",
      likes: 145,
      comments: 19,
      featured: false,
    },
    {
      id: 6,
      title: "API Integration: Automating Card Creation",
      excerpt: "How to use our REST API to automatically generate and manage employee cards, with code examples in Python, JavaScript, and Ruby.",
      author: "Chris Martin",
      avatar: "CM",
      date: "Nov 10, 2024",
      readTime: "12 min",
      category: "technology",
      views: "2.3k",
      likes: 234,
      comments: 34,
      featured: false,
    },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      (selectedCategory === "all" || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const featuredPosts = posts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Hero Section - Modern Redesign */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <Container className="relative py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <FiZap className="w-4 h-4 text-yellow-400" />
                <span className="text-white/90 text-sm font-medium">Knowledge Base</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Insights from the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  ID Studio
                </span>
              </h1>
              <p className="text-white/80 text-lg lg:text-xl mb-10 max-w-2xl mx-auto">
                Expert insights on digital identification, design trends, and workplace credentials
              </p>
              
              {/* Enhanced Search Bar */}
              <div className="relative max-w-lg mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles, tutorials, guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent shadow-xl"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-500">⌘</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-500">K</span>
                </div>
              </div>
              
              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === cat.id
                        ? "bg-white text-indigo-600 shadow-lg scale-105"
                        : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,127.62,107.08,170.7,85.32,214.06,63.48,267.88,58.82,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <Container className="py-12 lg:py-16">
        
        {/* Featured Post Section - Enhanced */}
        {!isLoading && searchTerm === "" && selectedCategory === "all" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative grid lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-xl">
                <div className="p-8 lg:p-10">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                      Featured Article
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FiHeart className="w-3 h-3" /> {featuredPost.likes} likes
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        SJ
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{featuredPost.author}</p>
                        <p className="text-xs">{featuredPost.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                  <Link href={`/blog/${featuredPost.id}`}>
                    <Button
                      variant="primary"
                      size="lg"
                      icon={FiArrowRight}
                      iconPosition="right"
                      className="rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      Read Full Article
                    </Button>
                  </Link>
                </div>
                <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]"></div>
                  <div className="text-9xl transform transition-transform duration-500 group-hover:scale-110">
                    {featuredPost.image}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all" ? "Latest Articles" : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
                </p>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Posts Grid - Modern Card Design */}
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredPost(post.id)}
                      onMouseLeave={() => setHoveredPost(null)}
                      className="group bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              post.category === 'design' ? 'bg-blue-50 text-blue-700' :
                              post.category === 'technology' ? 'bg-green-50 text-green-700' :
                              'bg-orange-50 text-orange-700'
                            }`}>
                              {categories.find(c => c.id === post.category)?.icon} {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiCalendar className="w-3 h-3" />
                                {post.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3 h-3" />
                                {post.readTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                              <FiBookmark className="w-4 h-4 text-gray-400 hover:text-indigo-600" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                              <FiShare2 className="w-4 h-4 text-gray-400 hover:text-indigo-600" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                          <Link href={`/blog/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {post.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{post.author}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <FiEye className="w-3 h-3" />
                                  {post.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiHeart className="w-3 h-3" />
                                  {post.likes} likes
                                </span>
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/blog/${post.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group"
                          >
                            Read more
                            <FiChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                      
                      {/* Animated Border on Hover */}
                      <div className={`h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ${hoveredPost === post.id ? 'opacity-100' : 'opacity-0'}`}></div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or browse by category</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Modern Redesign */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Popular Posts - Enhanced */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-5 pb-2 border-b border-gray-100">
                <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <FiTrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Trending Now</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, index) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                    <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-xl transition-all">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2 text-sm mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiEye className="w-3 h-3" />
                            {post.views} views
                          </span>
                          {post.trending && (
                            <span className="flex items-center gap-1 text-orange-500">
                              <FiZap className="w-3 h-3" />
                              Trending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter - Enhanced Design */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full filter blur-3xl"></div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Subscribe to Newsletter</h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Get the latest insights and tutorials delivered to your inbox weekly
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder:text-indigo-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  />
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
                  >
                    Subscribe Now →
                  </Button>
                </div>
                <p className="text-indigo-200 text-xs mt-3 text-center">
                  No spam, unsubscribe anytime
                </p>
              </div>
            </div>

            {/* Categories Widget */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                <FiTag className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Explore Topics</h3>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category.id
                        ? "bg-indigo-200 text-indigo-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-center border border-green-100">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Trusted by 10,000+ businesses</p>
              <p className="text-xs text-gray-600">Join our community of innovators</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Newsletter CTA */}
   
    </div>
  );
}