// app/blog/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiTag,
  FiTrendingUp,
  FiMail,
  FiArrowRight,
  FiBookmark,
  FiUser,
  FiGrid,
  FiList,
  FiEye,
  FiThumbsUp,
  FiStar,
  FiAward,
  FiZap,
  FiSmile,
} from "react-icons/fi";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [viewMode, setViewMode] = useState("grid");

  const categories = [
    { id: "all", name: "All Articles", count: 24, icon: FiStar, color: "bg-rose-100 text-rose-600" },
    { id: "design", name: "Design", count: 8, icon: FiZap, color: "bg-blue-100 text-blue-600" },
    { id: "development", name: "Development", count: 10, icon: FiThumbsUp, color: "bg-emerald-100 text-emerald-600" },
    { id: "business", name: "Business", count: 4, icon: FiTrendingUp, color: "bg-amber-100 text-amber-600" },
    { id: "tutorials", name: "Tutorials", count: 2, icon: FiAward, color: "bg-purple-100 text-purple-600" },
  ];

  const featuredPost = {
    id: "featured",
    title: "The Future of Digital Identity: Trends to Watch in 2024",
    excerpt: "Explore how digital identity is evolving and what it means for businesses and individuals in the coming years. From biometric authentication to blockchain-based verification.",
    author: "Sarah Johnson",
    authorRole: "Senior Editor",
    date: "December 15, 2024",
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
      date: "December 10, 2024",
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
      date: "December 5, 2024",
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
      date: "November 28, 2024",
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
      date: "November 20, 2024",
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
      date: "November 15, 2024",
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
      excerpt: "How to use our REST API to automatically generate and manage employee cards from your existing systems and workflows.",
      author: "Chris Martin",
      date: "November 10, 2024",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      
      {/* Hero Section with Soft Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-amber-100 to-orange-100">
        <div className="absolute inset-0 bg-white/40"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-rose-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-5 py-2 mb-6 shadow-sm">
              <FiSmile className="text-rose-500 w-4 h-4" />
              <span className="text-rose-600 text-sm font-semibold tracking-wide">WELCOME TO OUR BLOG</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 tracking-tight leading-tight">
              Stories & ideas
              <span className="block bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                from our team
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Expert advice on digital identification, design trends, and workplace innovation
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-400 text-lg" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-full border-0 bg-white/80 backdrop-blur-sm shadow-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-rose-50 border border-rose-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
                <span className={`text-xs ${selectedCategory === category.id ? "text-rose-100" : "text-gray-400"}`}>
                  ({category.count})
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-gray-700">{filteredPosts.length}</span> articles
              </p>
              <div className="flex gap-2 bg-white rounded-lg border border-rose-100 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "grid" 
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm" 
                      : "text-gray-400 hover:text-rose-500"
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "list" 
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm" 
                      : "text-gray-400 hover:text-rose-500"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Featured Post */}
            {searchTerm === "" && selectedCategory === "all" && (
              <div className="mb-12">
                <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-rose-100">
                  <div className="relative h-1 bg-gradient-to-r from-rose-400 via-amber-400 to-orange-400"></div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                      <span className="text-sm text-rose-600 font-medium">{featuredPost.category}</span>
                    </div>
                    
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                      <Link href={`/blog/${featuredPost.id}`} className="hover:text-rose-600 transition-colors">
                        {featuredPost.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-4 h-4 text-rose-400" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4 text-amber-400" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiEye className="w-4 h-4 text-orange-400" />
                          <span>{featuredPost.views} views</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLike(featuredPost.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-rose-500 transition"
                        >
                          <FiHeart className={`w-4 h-4 ${likedPosts[featuredPost.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span className="text-sm">{featuredPost.likes + (likedPosts[featuredPost.id] ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-amber-600 transition">
                          <FiMessageCircle className="w-4 h-4" />
                          <span className="text-sm">{featuredPost.comments}</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-rose-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-amber-400 flex items-center justify-center text-white font-bold shadow-sm">
                          {featuredPost.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{featuredPost.author}</p>
                          <p className="text-xs text-gray-500">{featuredPost.authorRole}</p>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/blog/${featuredPost.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:gap-3 transition-all"
                      >
                        Read more
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Grid/List */}
            {filteredPosts.length > 0 ? (
              <div className={viewMode === "grid" ? "grid sm:grid-cols-2 gap-6" : "space-y-6"}>
                {filteredPosts.map((post) => (
                  <article key={post.id} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-rose-50">
                    <div className={`h-1 bg-gradient-to-r ${
                      post.category === 'design' ? 'from-blue-400 to-indigo-400' :
                      post.category === 'development' ? 'from-emerald-400 to-teal-400' :
                      post.category === 'business' ? 'from-amber-400 to-orange-400' :
                      'from-purple-400 to-pink-400'
                    }`}></div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-rose-400" />
                          <span>{post.date}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FiClock className="w-3 h-3 text-amber-400" />
                          <span>{post.readTime}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <FiEye className="w-3 h-3 text-orange-400" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-3 leading-snug">
                        <Link href={`/blog/${post.id}`} className="hover:text-rose-600 transition">
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-rose-50">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-200 to-amber-200 flex items-center justify-center text-rose-700 text-xs font-bold">
                            {post.author.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-gray-600">{post.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className="flex items-center gap-1 text-gray-400 hover:text-rose-500 transition"
                          >
                            <FiHeart className={`w-3.5 h-3.5 ${likedPosts[post.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="text-xs">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                          </button>
                          <button 
                            onClick={() => handleBookmark(post.id)}
                            className="text-gray-400 hover:text-amber-600 transition"
                          >
                            <FiBookmark className={`w-3.5 h-3.5 ${bookmarkedPosts[post.id] ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-rose-50">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or browse by category</p>
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length === posts.length && filteredPosts.length > 0 && (
              <div className="flex justify-center gap-2 mt-12">
                <button className="px-4 py-2 border border-rose-200 rounded-lg text-gray-600 hover:bg-rose-50 transition">
                  Previous
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg shadow-sm">1</button>
                <button className="px-4 py-2 border border-rose-200 rounded-lg text-gray-600 hover:bg-rose-50 transition">
                  2
                </button>
                <button className="px-4 py-2 border border-rose-200 rounded-lg text-gray-600 hover:bg-rose-50 transition">
                  3
                </button>
                <button className="px-4 py-2 border border-rose-200 rounded-lg text-gray-600 hover:bg-rose-50 transition">
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Author Profile Card */}
            <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 rounded-2xl p-6 text-center border border-rose-100">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center mb-4 shadow-md">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">CardStudio Team</h3>
              <p className="text-rose-600 text-sm mb-4">Sharing insights since 2020</p>
              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <div className="font-bold text-xl text-gray-800">24</div>
                  <div className="text-gray-500 text-xs">Articles</div>
                </div>
                <div>
                  <div className="font-bold text-xl text-gray-800">2.5k+</div>
                  <div className="text-gray-500 text-xs">Subscribers</div>
                </div>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FiMail className="w-5 h-5 text-rose-500" />
                Weekly Newsletter
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Get the best articles delivered to your inbox every week
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-rose-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
                <button className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white px-4 py-3 rounded-xl font-medium text-sm hover:shadow-md transition">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-rose-500" />
                Trending
              </h3>
              <div className="space-y-4">
                {posts.slice(0, 4).map((post, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <div className="flex gap-3">
                      <div className="text-2xl font-bold text-rose-200 w-8">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <Link href={`/blog/${post.id}`} className="font-medium text-gray-700 hover:text-rose-600 transition text-sm line-clamp-2">
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{post.date}</span>
                          <span className="text-xs text-gray-400">{post.views} views</span>
                        </div>
                      </div>
                    </div>
                    {idx < 3 && <div className="mt-3 border-b border-rose-50"></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["Design", "Development", "Security", "Tutorial", "Business", "API", "QR Code", "Branding", "Tips"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 text-sm rounded-lg hover:bg-rose-100 hover:text-rose-700 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}