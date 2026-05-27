'use client';

import { useState, useEffect, useCallback } from 'react';
import { allTemplates, templatesByOrientation } from '../../templatesdata';
import CardPreview from '@/components/Common/CardPreview';

export default function TemplatesPage() {
  // State Management
  const [orientation, setOrientation] = useState('landscape');
  const [category, setCategory] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('templatePageState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setOrientation(state.orientation || 'landscape');
        setCategory(state.category || 'all');
        setIndustryFilter(state.filter || 'all');
      } catch (e) {
        console.error('Error loading state:', e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('templatePageState', JSON.stringify({
      category,
      filter: industryFilter,
      orientation
    }));
  }, [category, industryFilter, orientation]);

  // Show skeleton loading on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [orientation, category, industryFilter]);

  // Get filtered templates
  const getFilteredTemplates = useCallback(() => {
    const templates = templatesByOrientation[orientation];
    return templates.filter(template => {
      const categoryMatch = category === 'all' || template.category === category;
      const filterMatch = industryFilter === 'all' || template.filter === industryFilter;
      return categoryMatch && filterMatch;
    });
  }, [orientation, category, industryFilter]);

  // Toast message handler
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Modal handlers
  const openModal = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
    document.body.style.overflow = 'unset';
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Flip card handler
  const handleFlipCardClick = (e) => {
    e.stopPropagation();
    const flipCard = e.target.closest('.flip-card');
    if (flipCard) {
      flipCard.classList.toggle('flipped');
    }
  };

  // Wishlist handler
  const addToWishlist = () => {
    if (!selectedTemplate) return;
    
    const wishlist = JSON.parse(localStorage.getItem('cardstudio_wishlist') || '[]');
    
    if (!wishlist.some(item => item.id === selectedTemplate.id)) {
      wishlist.push({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        category: selectedTemplate.category,
        icon: selectedTemplate.icon,
        orientation: selectedTemplate.orientation,
        fullHTML: selectedTemplate.htmlContent,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('cardstudio_wishlist', JSON.stringify(wishlist));
      showToastMessage('✅ Added to Wishlist!');
    } else {
      showToastMessage('⚠️ Already in wishlist!');
    }
  };

  // Navigate to customize page
  const goToCustomize = () => {
    if (selectedTemplate) {
      const templateData = {
        ...selectedTemplate,
        fullHTML: selectedTemplate.htmlContent,
        sourcePage: 'template'
      };
      localStorage.setItem('selectedTemplateForCustomize', JSON.stringify(templateData));
      showToastMessage('Loading customization...');
      setTimeout(() => {
        window.location.href = '/customize';
      }, 300);
    }
  };

  const filteredTemplates = getFilteredTemplates();
  
  const categoryTitles = {
    all: 'All Templates',
    employee: 'Employee Cards',
    visiting: 'Visiting Cards'
  };

  const categoryDescriptions = {
    landscape: 'Browse our landscape collection of visiting & ID card designs (550×348px) | 7+ premium visiting cards',
    portrait: 'Browse our portrait collection of ID card designs | Premium designs'
  };

  // Skeleton Card Component
  const SkeletonCard = ({ orientation }) => (
    <div className={`bg-slate-800 rounded-2xl overflow-hidden relative animate-pulse ${
      orientation === 'landscape' ? 'aspect-[550/348]' : 'max-w-[290px] aspect-[290/500] mx-auto'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 bg-[length:200%_100%] animate-shimmer" />
      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-600/50 rounded-t-2xl" />
      <div className={`absolute bg-slate-500/30 rounded-lg ${
        orientation === 'landscape' 
          ? 'top-[60px] left-5 w-20 h-20 rounded-full' 
          : 'top-20 left-1/2 -translate-x-1/2 w-[100px] h-[100px] rounded-full'
      }`} />
      <div className={`absolute bg-slate-500/30 rounded ${
        orientation === 'landscape'
          ? 'top-[70px] right-5 w-[120px] h-5'
          : 'top-[200px] left-5 right-5 h-6'
      }`} />
      <div className={`absolute bg-slate-500/30 rounded ${
        orientation === 'landscape'
          ? 'top-[100px] right-5 w-[100px] h-4'
          : 'top-[240px] left-5 right-5 h-[18px]'
      }`} />
      <div className="absolute bottom-5 left-5 right-5 h-10 bg-slate-600/50 rounded-lg" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] font-['Inter'] overflow-x-hidden">
  

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-70px)] overflow-x-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-slate-200 py-6 overflow-y-auto flex-shrink-0">
          <div className="mb-8">
            <div className="text-[0.7rem] uppercase tracking-[1.5px] text-slate-400 font-semibold px-5 pb-3">
              CARD CATEGORY
            </div>
            
            {[
              { key: 'all', icon: '📁', label: 'All Templates' },
              { key: 'employee', icon: '👤', label: 'Employee Card' },
              { key: 'visiting', icon: '🎫', label: 'Visiting Card' }
            ].map(item => (
              <div
                key={item.key}
                onClick={() => setCategory(item.key)}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all text-[0.9rem] font-medium
                  ${category === item.key 
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
              >
                {item.icon} {item.label}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="text-[0.7rem] uppercase tracking-[1.5px] text-slate-400 font-semibold px-5 pb-3">
              INDUSTRY FILTER
            </div>
            <div className="px-5">
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-[0.85rem] text-slate-800 cursor-pointer hover:border-indigo-600 transition-colors"
              >
                <option value="all">🌐 All Industries</option>
                <option value="technology">💻 Technology / IT</option>
                <option value="marketing">📢 Marketing & Advertising</option>
                <option value="healthcare">🏥 Healthcare / Medical</option>
                <option value="corporate">🏢 Corporate</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto min-w-0">
          {/* Page Title */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-[1.8rem] font-bold text-slate-800 m-0">
                {categoryTitles[category]}
              </h1>
              <p className="text-slate-500 mt-1.5 text-[0.9rem]">
                {categoryDescriptions[orientation]}
              </p>
            </div>
            
            {/* Orientation Toggle */}
            <div className="flex gap-3 bg-slate-100 p-1 rounded-full">
              {['landscape', 'portrait'].map(ori => (
                <button
                  key={ori}
                  onClick={() => setOrientation(ori)}
                  className={`px-5 py-2 rounded-full font-semibold text-[0.85rem] transition-all
                    ${orientation === ori 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                      : 'bg-transparent text-slate-500'
                    }`}
                >
                  {ori === 'landscape' ? '🌄 Landscape' : '📱 Portrait'}
                </button>
              ))}
            </div>
          </div>

          {/* Skeleton Loading Grid */}
          {isLoading && (
            <div className={`grid gap-8 py-2 ${
              orientation === 'landscape' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
            }`}>
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} orientation={orientation} />
              ))}
            </div>
          )}

          {/* Cards Grid */}
          {!isLoading && (
            <div className={`grid gap-[42px] py-2.5 ${
              orientation === 'landscape' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
            }`}>
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full text-center py-16 text-slate-400">
                  No templates found
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => openModal(template)}
                    className="flex cursor-pointer flex-col items-center overflow-visible transition-transform duration-300 hover:-translate-y-2"
                  >
                    {/* Card Preview */}
                    <CardPreview
                      html={template.htmlContent}
                      orientation={orientation}
                      className="transition-all duration-300 hover:shadow-2xl hover:shadow-black/10"
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showModal && selectedTemplate && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[1000] opacity-0 invisible transition-all duration-300"
          style={{ opacity: showModal ? 1 : 0, visibility: showModal ? 'visible' : 'hidden' }}
          onClick={handleOverlayClick}
        >
          <div className="flex gap-8 items-center flex-wrap justify-center p-6">
            {/* Modal Card */}
            <div className={`rounded-[20px] overflow-hidden shadow-2xl shadow-black/50 bg-transparent
              ${selectedTemplate.orientation === 'landscape' 
                ? 'w-[550px] h-[348px]' 
                : 'w-[350px] h-[550px]'
              }`}
            >
              <div 
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlContent }}
                onClick={handleFlipCardClick}
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              <button 
                onClick={addToWishlist}
                className="px-6 py-3.5 rounded-full font-semibold transition-all flex items-center justify-center gap-2.5 text-[0.9rem] bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white"
              >
                ⭐ Save to Wishlist
              </button>
              <button 
                onClick={goToCustomize}
                className="px-6 py-3.5 rounded-full font-semibold transition-all flex items-center justify-center gap-2.5 text-[0.9rem] bg-gradient-to-br from-indigo-600 to-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/30"
              >
                ✏️ Customize Card
              </button>
              <button 
                onClick={closeModal}
                className="px-6 py-3.5 rounded-full font-semibold transition-all flex items-center justify-center gap-2.5 text-[0.9rem] bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      <div className={`fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 z-[1100]
        ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'}`}
      >
        {toastMessage}
      </div>

      {/* Add shimmer animation to global styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .flip-card .flip-card-inner {
          transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card, .card-front, .card-back, .flip-card-inner {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}