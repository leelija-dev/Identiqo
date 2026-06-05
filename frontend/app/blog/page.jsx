// app/blog/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiSearch, FiCalendar, FiClock, FiArrowRight, FiEye, FiTrendingUp,  FiBookOpen } from "react-icons/fi";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: "all", name: "All", count: 12 },
    { id: "design", name: "Design", count: 4 },
    { id: "technology", name: "Technology", count: 5 },
    { id: "security", name: "Security", count: 3 },
  ];

  const featuredPost = {
    id: "featured",
    title: "The Future of Digital Identity: What's Coming in 2025",
    excerpt: "From biometric authentication to blockchain-based verification, discover the trends shaping the future of digital identification and how your business can stay ahead.",
    author: "Sarah Johnson",
    role: "Industry Expert",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Technology",
    image: "🔮",
  };

  const popularPosts = [
    { id: 1, title: "10 Tips for Creating Professional ID Cards", views: "12.5k", date: "Dec 10, 2024" },
    { id: 2, title: "How to Implement Secure QR Code Systems", views: "8.2k", date: "Dec 5, 2024" },
    { id: 3, title: "The ROI of Digital Employee IDs", views: "6.8k", date: "Nov 28, 2024" },
    { id: 4, title: "Getting Started with Bulk Card Generation", views: "5.1k", date: "Nov 20, 2024" },
  ];

  const posts = [
    {
      id: 1,
      title: "10 Tips for Creating Professional Employee ID Cards",
      excerpt: "Learn the best practices for designing ID cards that employees will actually want to carry and use every day.",
      author: "Mike Chen",
      date: "Dec 10, 2024",
      readTime: "6 min",
      category: "design",
      views: "1.2k",
      likes: 156,
    },
    {
      id: 2,
      title: "How to Implement Secure QR Code Verification Systems",
      excerpt: "A comprehensive guide to adding secure QR code verification to your employee identification system.",
      author: "Emily Rodriguez",
      date: "Dec 5, 2024",
      readTime: "10 min",
      category: "technology",
      views: "3.1k",
      likes: 289,
    },
    {
      id: 3,
      title: "The ROI of Digital Employee IDs for Modern Businesses",
      excerpt: "Discover how switching to digital employee IDs can save your company time and money.",
      author: "David Kim",
      date: "Nov 28, 2024",
      readTime: "7 min",
      category: "security",
      views: "890",
      likes: 167,
    },
    {
      id: 4,
      title: "Getting Started with Bulk Card Generation",
      excerpt: "Step-by-step tutorial on generating hundreds of employee cards at once using CSV upload.",
      author: "Lisa Wang",
      date: "Nov 20, 2024",
      readTime: "5 min",
      category: "technology",
      views: "567",
      likes: 98,
    },
    {
      id: 5,
      title: "Customizing Templates for Your Brand Identity",
      excerpt: "Learn how to customize templates to perfectly match your company's brand guidelines.",
      author: "Alex Turner",
      date: "Nov 15, 2024",
      readTime: "9 min",
      category: "design",
      views: "1.1k",
      likes: 145,
    },
    {
      id: 6,
      title: "API Integration: Automating Card Creation",
      excerpt: "How to use our REST API to automatically generate and manage employee cards.",
      author: "Chris Martin",
      date: "Nov 10, 2024",
      readTime: "12 min",
      category: "technology",
      views: "2.3k",
      likes: 234,
    },
  ];

  const filteredPosts = posts.filter(
    (post) =>
      (selectedCategory === "all" || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-indigo-50 via-white to-white pt-16 pb-12 border-b border-indigo-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-100 rounded-full">
              <span className="text-indigo-700 text-sm font-medium">Our Blog</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Insights from the
              <span className="text-indigo-600"> ID Studio</span>
            </h1>
            <p className="text-gray-500 text-lg mb-8">
              Expert insights on digital identification, design trends, and workplace credentials
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        
        {/* Featured Post Section */}
        {!isLoading && searchTerm === "" && selectedCategory === "all" && (
          <div className="mb-16">
            <div className="grid lg:grid-cols-2 gap-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl overflow-hidden">
              <div className="p-8 lg:p-10">
                <div className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full mb-4">
                  Featured Article
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <Link 
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all"
                >
                  Read Article
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-200">
                <div className="text-9xl">{featuredPost.image}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            
            {/* Categories */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                    <span className="ml-1 text-xs opacity-70">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiEye className="w-4 h-4" />
                          {post.views}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          post.category === 'design' ? 'bg-blue-100 text-blue-700' :
                          post.category === 'technology' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      <Link 
                        href={`/blog/${post.id}`}
                        className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                      >
                        Read more →
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-1">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or browse by category</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            
            {/* Popular Posts */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-5">
                <FiTrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Popular Posts</h3>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                    <div className="flex gap-3 hover:bg-white p-2 rounded-lg transition-all">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiBookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2 text-sm">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FiEye className="w-3 h-3" />
                            {post.views} views
                          </span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-indigo-100 text-sm mb-4">
                Get the latest insights delivered to your inbox
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg mb-3 text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
              <button className="w-full px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
              <p className="text-indigo-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
            </div>

            {/* Categories */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === category.id
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-400">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* CTA Section */}
      <div className="bg-gray-900 mt-16">
        <Container className="py-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to transform your ID system?
            </h2>
            <p className="text-gray-400 mb-6">
              Join thousands of businesses using CardStudio
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/pricing" 
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/contact" 
                className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}