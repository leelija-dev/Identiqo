// app/templates/page.jsx
'use client';

import { useState, useEffect, useMemo, memo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { templatesByOrientation, normalizeTemplateHtml } from '../../templatesdata';
import CardPreview from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import Pagination from '@/components/Common/Pagination';
import Modal from '@/components/Common/Modal';
import { SidebarSkeleton, TemplateGridSkeleton } from '@/components/Common/Skeleton';
import { FiChevronDown } from 'react-icons/fi';

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_OPTIONS = [
  { key: 'all', icon: '📁', label: 'All Templates' },
  { key: 'employee', icon: '👤', label: 'Employee Card' },
  { key: 'visiting', icon: '🎫', label: 'Visiting Card' },
];

const INDUSTRY_OPTIONS = [
  { value: 'all', label: '🌐 All Industries' },
  { value: 'technology', label: '💻 Technology / IT' },
  { value: 'marketing', label: '📢 Marketing & Advertising' },
  { value: 'corporate', label: '🏢 Corporate' },
];

const ORIENTATIONS = ['landscape', 'portrait'];
const ITEMS_PER_PAGE = 10;
const STORAGE_KEYS = {
  TEMPLATE_STATE: 'templatePageState',
  WISHLIST: 'cardstudio_wishlist',
  SELECTED_TEMPLATE: 'selectedTemplateForCustomize',
};

const TOAST_DURATION = 2000;
const LOADING_DELAY = 800;
const SLIDE_ANIMATION_DURATION = 40;

// ============================================================================
// Memoized Components
// ============================================================================

const MemoizedCardPreview = memo(CardPreview);
MemoizedCardPreview.displayName = 'MemoizedCardPreview';

// Desktop Sidebar (only visible on md+)
const Sidebar = memo(({ category, industryFilter, onCategoryChange, onIndustryChange }) => (
  <aside className="w-[280px] bg-white/60 backdrop-blur-md border-r border-white/20 flex-shrink-0 hidden md:block">
    <div className="sticky top-0 pt-6">
      {/* Category Section */}
      <div className="mb-8">
        <h2 className="text-lg uppercase tracking-[1.5px] text-slate-500 font-semibold px-5 pb-3">
          CARD CATEGORY
        </h2>
        <nav aria-label="Card categories" className="space-y-1">
          {CATEGORY_OPTIONS.map((item) => (
            <Button
              key={item.key}
              variant={category === item.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onCategoryChange(item.key)}
              className={`w-full justify-start mx-2 ${category === item.key ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20' : ''}`}
            >
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Industry Filter Section - Desktop dropdown */}
      <div className="mb-8">
        <h2 className="text-lg uppercase tracking-[1.5px] text-slate-500 font-semibold px-5 pb-3">
          INDUSTRY FILTER
        </h2>
        <div className="px-5">
          <select
            value={industryFilter}
            onChange={(e) => onIndustryChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-800 cursor-pointer hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </aside>
));

Sidebar.displayName = 'Sidebar';

// ============================================================================
// Main Component
// ============================================================================

export default function TemplatesPage() {
  const router = useRouter();

  // State Management
  const [orientation, setOrientation] = useState('landscape');
  const [category, setCategory] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobileIndustryOpen, setIsMobileIndustryOpen] = useState(false);
  const mobileIndustryRef = useRef(null);

  // Sliding Tab State
  const [pillStyle, setPillStyle] = useState({ left: '0px', width: '0px' });

  // Refs
  const tabBarRef = useRef(null);
  const tabRefs = useRef({
    landscape: null,
    portrait: null,
  });
  const slideTimeoutRef = useRef(null);
  const mainContentRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileIndustryRef.current && !mobileIndustryRef.current.contains(event.target)) {
        setIsMobileIndustryOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Computed values
  const categoryTitles = {
    all: 'All Templates',
    employee: 'Employee Cards',
    visiting: 'Visiting Cards',
  };

  // Get selected industry label
  const getSelectedIndustryLabel = () => {
    const selected = INDUSTRY_OPTIONS.find(opt => opt.value === industryFilter);
    return selected ? selected.label : '🌐 All Industries';
  };

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEYS.TEMPLATE_STATE);
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setOrientation(state.orientation || 'landscape');
        setCategory(state.category || 'all');
        setIndustryFilter(state.filter || 'all');
        setCurrentPage(state.currentPage || 1);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }

    const timer = setTimeout(() => setIsLoading(false), LOADING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEYS.TEMPLATE_STATE,
        JSON.stringify({ category, filter: industryFilter, orientation, currentPage })
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [category, industryFilter, orientation, currentPage, isLoading]);

  // Filter templates based on selected criteria
  const filteredTemplates = useMemo(() => {
    const templates = templatesByOrientation[orientation];
    if (!templates) return [];

    return templates.filter((template) => {
      const categoryMatch = category === 'all' || template.category === category;
      const filterMatch = industryFilter === 'all' || template.filter === industryFilter;
      return categoryMatch && filterMatch;
    });
  }, [orientation, category, industryFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTemplates.slice(startIndex, endIndex);
  }, [filteredTemplates, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [orientation, category, industryFilter]);

  // Handle smooth scroll to top on page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setIsScrolling(true);
    
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  }, []);

  // ==========================================================================
  // Update pill position for orientation toggle
  // ==========================================================================

  const updateSlidingPositions = useCallback(() => {
    const activeTabRef =
      orientation === 'landscape' ? tabRefs.current.landscape : tabRefs.current.portrait;
    if (!activeTabRef || !tabBarRef.current) return;

    const barRect = tabBarRef.current.getBoundingClientRect();
    const tabRect = activeTabRef.getBoundingClientRect();
    let left = tabRect.left - barRect.left;
    let width = tabRect.width;
    
    left = Math.max(0, left);
    width = Math.max(20, Math.min(width, barRect.width - left));
    
    setPillStyle({ left: `${left}px`, width: `${width}px` });
  }, [orientation]);

  const handleOrientationChange = useCallback(
    (newOrientation) => {
      if (newOrientation === orientation) return;
      setSlideDirection(newOrientation === 'portrait' ? 1 : -1);
      setOrientation(newOrientation);

      if (slideTimeoutRef.current) clearTimeout(slideTimeoutRef.current);
      slideTimeoutRef.current = setTimeout(updateSlidingPositions, SLIDE_ANIMATION_DURATION);
    },
    [orientation, updateSlidingPositions]
  );

  useEffect(() => {
    const initTimeout = setTimeout(updateSlidingPositions, 80);
    window.addEventListener('resize', updateSlidingPositions);
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('resize', updateSlidingPositions);
    };
  }, [updateSlidingPositions]);

  useEffect(() => {
    if (!tabBarRef.current) return;

    const resizeObserver = new ResizeObserver(() => updateSlidingPositions());
    resizeObserver.observe(tabBarRef.current);
    if (tabRefs.current.landscape) resizeObserver.observe(tabRefs.current.landscape);
    if (tabRefs.current.portrait) resizeObserver.observe(tabRefs.current.portrait);

    return () => resizeObserver.disconnect();
  }, [updateSlidingPositions]);

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================

  const showToastMessage = useCallback((message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), TOAST_DURATION);
  }, []);

  // ==========================================================================
  // Modal Management
  // ==========================================================================

  const openModal = useCallback((template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  }, []);

  // ==========================================================================
  // Template Actions
  // ==========================================================================

  const addToWishlist = useCallback(() => {
    if (!selectedTemplate) return;

    const wishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.WISHLIST) || '[]');
    const alreadyExists = wishlist.some((item) => item.id === selectedTemplate.id);

    if (!alreadyExists) {
      wishlist.push({
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        category: selectedTemplate.category,
        icon: selectedTemplate.icon,
        orientation: selectedTemplate.orientation,
        fullHTML: selectedTemplate.htmlContent,
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
      showToastMessage('✅ Added to Wishlist!');
      closeModal();
    } else {
      showToastMessage('⚠️ Already in wishlist!');
    }
  }, [selectedTemplate, showToastMessage, closeModal]);

  const goToCustomize = useCallback(() => {
    if (!selectedTemplate) return;

    const preprocessedHTML = normalizeTemplateHtml(selectedTemplate.htmlContent);
    localStorage.setItem(
      STORAGE_KEYS.SELECTED_TEMPLATE,
      JSON.stringify({ ...selectedTemplate, fullHTML: preprocessedHTML, sourcePage: 'template' })
    );

    showToastMessage('Loading customization...');
    setTimeout(() => {
      router.push('/customize');
      closeModal();
    }, 150);
  }, [selectedTemplate, router, showToastMessage, closeModal]);

  const downloadTemplate = useCallback(async () => {
    if (!selectedTemplate?.htmlContent) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const design =
        selectedTemplate.orientation === 'portrait'
          ? { width: 350, height: 550 }
          : { width: 550, height: 348 };

      const parserStage = document.createElement('div');
      parserStage.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${design.width}px;height:${design.height}px`;
      parserStage.innerHTML = selectedTemplate.htmlContent;
      document.body.appendChild(parserStage);

      const front = parserStage.querySelector('.card-front, .face.front');
      const back = parserStage.querySelector('.card-back, .face.back');
      const safeName = (selectedTemplate.name || 'template')
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase();

      const captureFace = async (face) => {
        const stage = document.createElement('div');
        stage.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${design.width}px;height:${design.height}px;border-radius:24px;overflow:hidden;background:#fff`;
        const clone = face.cloneNode(true);
        clone.style.cssText =
          'position:relative;width:100%;height:100%;display:block;transform:none;backface-visibility:visible;';
        stage.appendChild(clone);
        document.body.appendChild(stage);
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(stage, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        document.body.removeChild(stage);
        return canvas;
      };

      if (front && back) {
        const [frontCanvas, backCanvas] = await Promise.all([captureFace(front), captureFace(back)]);
        const combined = document.createElement('canvas');
        combined.width = frontCanvas.width;
        combined.height = frontCanvas.height + backCanvas.height;

        const ctx = combined.getContext('2d');
        if (ctx) {
          ctx.drawImage(frontCanvas, 0, 0);
          ctx.drawImage(backCanvas, 0, frontCanvas.height);
        }

        const link = document.createElement('a');
        link.download = `${safeName}-both-${Date.now()}.png`;
        link.href = combined.toDataURL('image/png');
        link.click();
        showToastMessage('Template downloaded (front + back)');
      } else {
        const canvas = await html2canvas(parserStage, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const link = document.createElement('a');
        link.download = `${safeName}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToastMessage('Template downloaded');
      }

      document.body.removeChild(parserStage);
    } catch (error) {
      showToastMessage(`Download failed: ${error.message}`);
    }
  }, [selectedTemplate, showToastMessage]);

  // ==========================================================================
  // Render Helpers
  // ==========================================================================

  const renderMobileFilters = () => (
    <div className="md:hidden mb-5 space-y-3">
      {/* Category chips - Now using Button component */}
      <div className="flex overflow-x-auto pb-2 gap-1.5 scrollbar-none">
        {CATEGORY_OPTIONS.map((item) => (
          <Button
            key={item.key}
            variant={category === item.key ? 'primary' : 'secondary'}
            size="xs"
            onClick={() => setCategory(item.key)}
            className="flex-shrink-0 rounded-full whitespace-nowrap"
          >
            <span aria-hidden="true">{item.icon}</span> {item.label}
          </Button>
        ))}
      </div>

      {/* Industry Dropdown for Mobile - Using Button component */}
      <div className="relative" ref={mobileIndustryRef}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsMobileIndustryOpen(!isMobileIndustryOpen)}
          className="w-full justify-between"
          icon={FiChevronDown}
          iconPosition="right"
        >
          {getSelectedIndustryLabel()}
        </Button>
        
        {isMobileIndustryOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
            {INDUSTRY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIndustryFilter(opt.value);
                  setIsMobileIndustryOpen(false);
                }}
                className={`w-full justify-start rounded-none ${
                  industryFilter === opt.value
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700'
                    : ''
                }`}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================================================
  // ORIENTATION TOGGLE - Like pricing page toggle (Beautiful sliding pill)
  // ==========================================================================
  const renderOrientationTabs = () => (
    <div className="relative inline-flex" ref={tabBarRef}>
      <div className="relative flex items-stretch gap-0 bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
        {/* Sliding Pill Background */}
        <div
          className="absolute top-1 bottom-1 bg-white rounded-full shadow-md transition-all duration-300 ease-out"
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
          }}
        />
        
        {/* Landscape Button */}
        <button
          ref={(el) => {
            tabRefs.current.landscape = el;
          }}
          onClick={() => handleOrientationChange('landscape')}
          className={`relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
            orientation === 'landscape'
              ? 'text-indigo-600'
              : 'text-slate-500 hover:text-indigo-500'
          }`}
        >
          <span className="text-sm sm:text-base mr-1">🌄</span>
          Landscape
        </button>
        
        {/* Portrait Button */}
        <button
          ref={(el) => {
            tabRefs.current.portrait = el;
          }}
          onClick={() => handleOrientationChange('portrait')}
          className={`relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
            orientation === 'portrait'
              ? 'text-indigo-600'
              : 'text-slate-500 hover:text-indigo-500'
          }`}
        >
          <span className="text-sm sm:text-base mr-1">📱</span>
          Portrait
        </button>
      </div>
    </div>
  );

  // ==========================================================================
  // Main Render
  // ==========================================================================

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#faf9f8]">
      {/* Desktop Sidebar */}
      {!isLoading && (
        <Sidebar
          category={category}
          industryFilter={industryFilter}
          onCategoryChange={setCategory}
          onIndustryChange={setIndustryFilter}
        />
      )}

      {/* Main Content Area */}
      <div 
        ref={mainContentRef}
        className="flex-1 overflow-y-auto h-screen scroll-smooth"
      >
        <main className="p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Header with Orientation Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-slate-800 text-xl font-bold">{categoryTitles[category]}</h1>
            {renderOrientationTabs()}
          </div>

          {/* Mobile Filters */}
          {renderMobileFilters()}

          {/* Templates Grid */}
          {isLoading ? (
            <TemplateGridSkeleton count={ITEMS_PER_PAGE} orientation={orientation} />
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No templates found
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${orientation}-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div
                    className={`
                      grid gap-5 sm:gap-6
                      ${orientation === 'landscape'
                        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                      }
                    `}
                  >
                    {paginatedTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        className="group relative flex cursor-pointer flex-col items-center overflow-visible transition-all duration-300 hover:-translate-y-2 w-full"
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MemoizedCardPreview
                          html={template.htmlContent}
                          orientation={orientation}
                          onClick={() => openModal(template)}
                          enableFlip={false}
                          className="w-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10"
                        />
                        <p className="mt-3 text-xs font-medium text-slate-700 md:hidden truncate max-w-[200px]">
                          {template.name || 'Untitled Card'}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  siblingCount={1}
                  showFirstLast={true}
                  className="mt-8 mb-4"
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        htmlContent={selectedTemplate?.htmlContent}
        orientation={selectedTemplate?.orientation}
        onWishlist={addToWishlist}
        onCustomize={goToCustomize}
        onDownload={downloadTemplate}
        showWishlist={true}
        showCustomize={true}
        showDownload={true}
        title="Template Preview"
      />

      {/* Toast Notification */}
      <div
        className={`fixed bottom-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300 z-[1100] text-sm shadow-lg ${
          showToast
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-[100px] pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        {toastMessage}
      </div>

      {/* Global Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        
        button:focus-visible,
        [role="button"]:focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
        }
        
        .overflow-y-auto {
          scroll-behavior: smooth;
        }

        .modal-open {
          overflow: hidden;
        }
      `,
        }}
      />
    </div>
  );
}