// app/dashboard/templates/page.jsx
"use client";

import { getAccessToken } from "@/lib/auth";
import { useState, useEffect } from 'react';
import {
    FiGrid,
    FiList,
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiChevronLeft,
    FiChevronRight,
    FiPackage,
    FiTag,
    FiBriefcase,
    FiLayers,
    FiStar,
    FiUser,
    FiCalendar,
    FiPhone,
    FiMail,
    FiHash,
} from 'react-icons/fi';

const API_BASE_URL = process.env.BACKEND_API_BASE_URL || 'http://localhost:8000/web-api/api';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [selectedOrientation, setSelectedOrientation] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTemplates, setTotalTemplates] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [categories, setCategories] = useState([]);
    const [industries, setIndustries] = useState([]);

    // Fetch templates from API
    const fetchTemplates = async (page = 1) => {
        try {
            setLoading(true);
            
            const params = new URLSearchParams({
                page: page,
                search: searchTerm,
            });

            if (selectedCategory !== 'all') {
                params.append('category', selectedCategory);
            }
            if (selectedIndustry !== 'all') {
                params.append('industry', selectedIndustry);
            }
            if (selectedOrientation !== 'all') {
                params.append('orientation', selectedOrientation);
            }

            const url = `${API_BASE_URL}/card-templetes/?${params.toString()}`;
            
            console.log('Fetching templates from:', url);

            const token = getAccessToken();
            if (!token) {
                throw new Error('No access token found');
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please login again.');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error ${response.status}`);
            }

            const data = await response.json();

            if (data.status) {
                setTemplates(data.data || []);
                setTotalPages(data.total_pages || 1);
                setTotalTemplates(data.count || 0);
                setCurrentPage(data.current_page || page);
                
                const uniqueCategories = [...new Set(data.data.map(t => t.category).filter(Boolean))];
                const uniqueIndustries = [...new Set(data.data.map(t => t.industry).filter(Boolean))];
                setCategories(uniqueCategories);
                setIndustries(uniqueIndustries);
            } else {
                throw new Error(data.message || 'Failed to fetch templates');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching templates:', err);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTemplates(currentPage);
    }, [currentPage, selectedCategory, selectedIndustry, selectedOrientation]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTemplates(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchTemplates(currentPage);
        setIsRefreshing(false);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Render template card in grid mode - Full ID Card Data
    const renderGridCard = (template) => (
        <div
            key={template.id}
            className="bg-white rounded-3xl shadow border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-700 hover:-translate-y-1"
        >
            {/* Template Preview */}
            <div className="relative h-80 w-80 bg-gray-500 overflow-hidden">
                <iframe
                    srcDoc={template.html_content}
                    className="w-full h-full transform bg-gray-300 scale-140 origin-center"
                    sandbox="allow-scripts"
                    title={template.name}
                />

                {/* Premium badge */}
                {template.is_premium && (
                    <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-400 text-white text-xs font-medium rounded-full shadow-md">
                            <FiStar className="w-3 h-3" />
                            Premium
                        </span>
                    </div>
                )}
            </div>

            {/* Full ID Card Data */}
            <div className="p-4 space-y-3 bg-gray-200">
                {/* Company Name */}
                <div >
                    <h3 className="font-bold bg-gray-200 text-lg uppercase tracking-wider">
                        {template.name || 'COMPANY NAME'}
                    </h3>
                </div>

                

                
            </div>
        </div>
    );

    // Render template card in list mode - Full ID Card Data
    // const renderListCard = (template) => (
    //     <div
    //         key={template.id}
    //         className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md transition-shadow"
    //     >
    //         <div className="flex p-4 gap-6">
    //             {/* Thumbnail */}
    //             <div className="w-40 h-40 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
    //                 <iframe
    //                     srcDoc={template.html_content}
    //                     className="w-full h-full border-0 transform scale-[0.35] origin-top-left"
    //                     sandbox="allow-scripts"
    //                     title={template.name}
    //                 />
    //             </div>

    //             {/* Full ID Card Data */}
    //             <div className="flex-1 min-w-0 space-y-2">
    //                 {/* Company Name */}
    //                 <h3 className="font-bold text-gray-800 text-xl uppercase tracking-wider">
    //                     {template.name || 'COMPANY NAME'}
    //                 </h3>

    //                 {/* Name */}
    //                 <p className="text-gray-700 font-medium">
    //                     {template.employee_name || 'Your Name'}
    //                 </p>

    //                 {/* ID */}
    //                 <div className="flex items-center gap-2 text-gray-600">
    //                     <FiHash className="w-4 h-4 text-gray-400" />
    //                     <span className="font-mono">{template.employee_id || '123456789'}</span>
    //                 </div>

    //                 {/* DOB */}
    //                 <div className="flex items-center gap-2 text-gray-600">
    //                     <FiCalendar className="w-4 h-4 text-gray-400" />
    //                     <span>DOB: {template.dob || '00-00-00'}</span>
    //                 </div>

    //                 {/* Phone */}
    //                 <div className="flex items-center gap-2 text-gray-600">
    //                     <FiPhone className="w-4 h-4 text-gray-400" />
    //                     <span>Phone: {template.phone || '000 123 456 7890'}</span>
    //                 </div>

    //                 {/* Email */}
    //                 <div className="flex items-center gap-2 text-gray-600">
    //                     <FiMail className="w-4 h-4 text-gray-400" />
    //                     <span className="text-sm truncate">Email: {template.email || '00-00-0000'}</span>
    //                 </div>

    //                 {/* Meta */}
    //                 <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
    //                     <span className="text-xs text-gray-500">{template.category || 'Organization'}</span>
    //                     <span className="text-xs text-gray-500">{template.industry || 'employee'}</span>
    //                     <span className="text-xs text-gray-400 font-mono">ID: {template.external_id || template.id || '001'}</span>
    //                     {template.is_premium && (
    //                         <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-400 text-white text-xs font-medium rounded-full">
    //                             <FiStar className="w-3 h-3" />
    //                             Premium
    //                         </span>
    //                     )}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );

    if (loading && templates.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading templates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-rose-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Templates</h3>
                    <p className="text-gray-500">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Card Templates</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Browse and explore all available card templates
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className={`p-2 bg-white rounded-lg shadow-sm border border-gray-200/50 hover:bg-gray-50 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
                    >
                        <FiRefreshCw className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Templates</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{totalTemplates}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FiLayers className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Categories</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{categories.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <FiTag className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Industries</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{industries.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                            <FiBriefcase className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Premium</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {templates.filter(t => t.is_premium).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FiStar className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search templates by name, category, or industry..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                        <select
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                        >
                            <option value="all">All Industries</option>
                            {industries.map(ind => (
                                <option key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</option>
                            ))}
                        </select>
                        <select
                            value={selectedOrientation}
                            onChange={(e) => setSelectedOrientation(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                        >
                            <option value="all">All Orientations</option>
                            <option value="portrait">Portrait</option>
                            <option value="landscape">Landscape</option>
                            <option value="square">Square</option>
                        </select>
                        <button className="px-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl hover:bg-gray-100 transition">
                            <FiFilter className="w-5 h-5 text-gray-500" />
                        </button> */}
                        {/* View mode toggle */}
                        {/* <div className="flex rounded-xl overflow-hidden border border-gray-200/50">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            >
                                <FiGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            >
                                <FiList className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Templates Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
                {templates.length > 0 ? (
                    templates.map(template => (
                        viewMode === 'grid' 
                            ? renderGridCard(template)
                            : renderListCard(template)
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center">
                        <div className="text-gray-400">
                            <FiPackage className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-lg font-medium text-gray-600">No templates found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filter</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-sm border border-gray-100/50">
                    <p className="text-sm text-gray-500">
                        Showing {templates.length} of {totalTemplates} templates
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}