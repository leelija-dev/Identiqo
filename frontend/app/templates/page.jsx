// app/templates/page.jsx
'use client';

import { useState, useEffect, useMemo, memo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { templatesByOrientation, normalizeTemplateHtml } from '../../templatesdata';
import CardPreview, { CardGrid, CardSkeleton } from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import { FiDownload, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';
import { SidebarSkeleton, TemplateGridSkeleton } from '@/components/Common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Common/Pagination';
import Modal from '@/components/Common/Modal';

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const modalCardRef = useRef(null);

  // --- Sliding pill & indicator state ---
  const [pillStyle, setPillStyle] = useState({ left: '0px', width: '0px' });
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0px', width: '0px' });

  const tabBarRef = useRef(null);
  const tabRefs = useRef({
    landscape: null,
    portrait: null,
  });
  const slideTimeoutRef = useRef(null);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobileIndustryOpen, setIsMobileIndustryOpen] = useState(false);
  const mobileIndustryRef = useRef(null);
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

  const handleOrientationChange = useCallback((newOrientation) => {
    setOrientation(newOrientation);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
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
    setIndicatorStyle({ left: `${left}px`, width: `${width}px` });
  }, [orientation]);

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

  const pageBackground = orientation === 'landscape'
    ? 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #dbeafe 100%)'
    : 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 50%, #fce7f3 100%)';

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: pageBackground,
        transition: 'background 0.5s ease',
      }}
    >
      <div className="flex min-h-screen">
        {/* ===== SIDEBAR - Desktop ===== */}
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <aside className="hidden md:block md:sticky md:top-0 h-screen w-[280px] bg-white/60 backdrop-blur-md border-r border-white/20 py-6 overflow-y-auto z-40 flex-shrink-0">
            <div className="mb-8">
              <div className="text-lg uppercase tracking-[1.5px] text-slate-500 font-semibold px-5 pb-3">
                CARD CATEGORY
              </div>
              {CATEGORY_OPTIONS.map(item => (
                <div
                  key={item.key}
                  onClick={() => setCategory(item.key)}
                  className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all text-sm font-medium rounded-lg mx-2 ${
                    category === item.key
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 shadow-sm backdrop-blur-sm'
                      : 'text-slate-600 hover:bg-slate-100/50 hover:text-indigo-600'
                  }`}
                >
                  {item.icon} {item.label}
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="text-lg uppercase tracking-[1.5px] text-slate-500 font-semibold px-5 pb-3">
                INDUSTRY FILTER
              </div>
              <div className="px-5">
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-800 cursor-pointer hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {INDUSTRY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 w-full max-w-full overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 min-w-0">
          {/* Header Section - Responsive flex wrap */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex-shrink-0">
              <h1 className="text-slate-800 text-xl font-bold">
                {categoryTitles[category]}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 ml-auto">
              {/* Mobile Filter Button - Only on mobile */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/60 text-slate-600 text-sm whitespace-nowrap"
              >
                <FiFilter size={14} />
                <span>Filter</span>
                {(category !== 'all' || industryFilter !== 'all') && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                )}
              </button>

              {/* Orientation Tab Switcher */}
              <div className="relative w-auto flex-shrink-0" ref={tabBarRef}>
                <div className="relative z-10 flex items-stretch gap-0 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm p-1">
                  {['landscape', 'portrait'].map((tab) => (
                    <button
                      key={tab}
                      ref={(el) => { tabRefs.current[tab] = el; }}
                      onClick={() => handleOrientationChange(tab)}
                      className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium z-10 whitespace-nowrap ${
                        orientation === tab
                          ? 'text-indigo-700 font-bold'
                          : 'text-slate-500 hover:text-indigo-500'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{tab === 'landscape' ? '🌄' : '📱'}</span>
                      <span className="text-[10px] sm:text-xs">{tab === 'landscape' ? 'LAND' : 'PORT'}</span>
                    </button>
                  ))}
                </div>

                {/* Sliding background pill */}
                <div
                  className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-white via-indigo-50/80 to-white shadow-sm pointer-events-none z-0"
                  style={{
                    ...pillStyle,
                    transition: 'left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                  }}
                />

                {/* Sliding bottom indicator */}
                <div
                  className="absolute bottom-0 left-0 h-[3px] bg-indigo-500 rounded-t-full pointer-events-none z-20"
                  style={{
                    ...indicatorStyle,
                    transition: 'left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), background 0.2s',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Templates Grid - FIXED: Landscape shows 1 card per row on mobile */}
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
                      grid gap-4 sm:gap-5 md:gap-6
                      ${orientation === 'landscape'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
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
                        <p className="mt-2 text-xs font-medium text-slate-700 text-center truncate w-full px-1">
                          {template.name || 'Untitled Card'}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 mb-4 overflow-x-auto">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    siblingCount={1}
                    showFirstLast={true}
                    className="justify-center min-w-max"
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ===== MOBILE FILTER SHEET ===== */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-[1000] md:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl z-[1001] md:hidden overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-6">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    Card Category
                  </label>
                  <div className="space-y-1">
                    {CATEGORY_OPTIONS.map(item => (
                      <div
                        key={item.key}
                        onClick={() => {
                          setCategory(item.key);
                          setShowMobileFilters(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          category === item.key
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">
                    Industry
                  </label>
                  <div className="space-y-1">
                    {INDUSTRY_OPTIONS.map(opt => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setIndustryFilter(opt.value);
                          setShowMobileFilters(false);
                        }}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                          industryFilter === opt.value
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== MODAL using imported Modal component ===== */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        htmlContent={selectedTemplate?.htmlContent || ''}
        orientation={selectedTemplate?.orientation || 'landscape'}
        onWishlist={addToWishlist}
        onCustomize={goToCustomize}
        onDownload={downloadTemplate}
        showWishlist={true}
        showCustomize={true}
        showDownload={true}
        title={selectedTemplate?.name || 'Template Preview'}
      />

      {/* ===== TOAST ===== */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 left-4 sm:left-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 sm:px-5 py-2.5 rounded-full font-semibold z-[1100] text-sm shadow-lg text-center sm:text-right"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{
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

          .overflow-y-auto {
            scroll-behavior: smooth;
          }

          .modal-open {
            overflow: hidden;
          }

          /* Responsive breakpoints */
          @media (max-width: 480px) {
            .grid-cols-1\\:xs\\:grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
        `
      }} />
    </div>
  );
}