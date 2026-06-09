// app/templates/page.jsx
'use client';

import { useState, useEffect, useMemo, memo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { templatesByOrientation, normalizeTemplateHtml } from '../../templatesdata';
import CardPreview from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import { FiDownload } from 'react-icons/fi';
import { SidebarSkeleton, TemplateGridSkeleton } from '@/components/Common/Skeleton';

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

const Sidebar = memo(({ category, industryFilter, onCategoryChange, onIndustryChange }) => (
  <aside className="hidden md:block w-[280px] bg-white/60 backdrop-blur-md border-r border-white/20 overflow-y-auto flex-shrink-0">
    {/* Category Section */}
    <div className="mb-8">
      <h2 className="text-lg uppercase tracking-[1.5px] text-slate-500 font-semibold px-5 pb-3">
        CARD CATEGORY
      </h2>
      <nav aria-label="Card categories">
        {CATEGORY_OPTIONS.map((item) => (
          <button
            key={item.key}
            onClick={() => onCategoryChange(item.key)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all text-sm font-medium rounded-lg mx-2 ${
              category === item.key
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 shadow-sm backdrop-blur-sm'
                : 'text-slate-600 hover:bg-slate-100/50 hover:text-indigo-600'
            }`}
            aria-pressed={category === item.key}
          >
            <span aria-hidden="true">{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
    </div>

    {/* Industry Filter Section */}
    <div className="mb-8">
      <h2 className="text-lg uppercase tracking-[1.5px] text-slate-500 font-semibold px-5 pb-3">
        INDUSTRY FILTER
      </h2>
      <div className="px-5">
        <label htmlFor="industry-filter" className="sr-only">
          Select industry
        </label>
        <select
          id="industry-filter"
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
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState(0);

  // Sliding Tab State
  const [pillStyle, setPillStyle] = useState({ left: '0px', width: '0px' });
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0px', width: '0px' });

  // Refs
  const modalCardRef = useRef(null);
  const tabBarRef = useRef(null);
  const tabRefs = useRef({
    landscape: null,
    portrait: null,
  });
  const slideTimeoutRef = useRef(null);

  // Computed values
  const categoryTitles = {
    all: 'All Templates',
    employee: 'Employee Cards',
    visiting: 'Visiting Cards',
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
        JSON.stringify({ category, filter: industryFilter, orientation })
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [category, industryFilter, orientation, isLoading]);

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

  // ==========================================================================
  // Sliding Tab Logic
  // ==========================================================================

  const updateSlidingPositions = useCallback(() => {
    const activeTabRef =
      orientation === 'landscape' ? tabRefs.current.landscape : tabRefs.current.portrait;
    if (!activeTabRef || !tabBarRef.current) return;

    const barRect = tabBarRef.current.getBoundingClientRect();
    const tabRect = activeTabRef.getBoundingClientRect();
    const left = Math.max(0, tabRect.left - barRect.left);
    const width = Math.max(20, tabRect.width);

    setPillStyle({ left: `${left}px`, width: `${width}px` });
    setIndicatorStyle({ left: `${left}px`, width: `${width}px` });
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

  // Initialize and cleanup sliding positions
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
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedTemplate(null);
    document.body.style.overflow = 'unset';
  }, []);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) closeModal();
    },
    [closeModal]
  );

  const handleModalCardFlip = useCallback((e) => {
    e.stopPropagation();
    const root = modalCardRef.current;
    if (!root) return;

    const flipCard = e.target.closest('.flip-card') || root.querySelector('.flip-card') || root;
    const flipInner = flipCard.querySelector('.flip-card-inner');

    if (flipInner) {
      const isFlipped =
        flipInner.style.transform?.includes('rotateY(180deg)') || flipCard.classList.contains('flipped');

      flipInner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
      flipCard.classList.toggle('flipped', !isFlipped);
    }
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
    } else {
      showToastMessage('⚠️ Already in wishlist!');
    }
  }, [selectedTemplate, showToastMessage]);

  const goToCustomize = useCallback(() => {
    if (!selectedTemplate) return;

    const preprocessedHTML = normalizeTemplateHtml(selectedTemplate.htmlContent);
    localStorage.setItem(
      STORAGE_KEYS.SELECTED_TEMPLATE,
      JSON.stringify({ ...selectedTemplate, fullHTML: preprocessedHTML, sourcePage: 'template' })
    );

    showToastMessage('Loading customization...');
    setTimeout(() => router.push('/customize'), 150);
  }, [selectedTemplate, router, showToastMessage]);

  const downloadTemplate = useCallback(async () => {
    if (!selectedTemplate?.htmlContent) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const design =
        selectedTemplate.orientation === 'portrait'
          ? { width: 350, height: 550 }
          : { width: 550, height: 348 };

      // Create temporary container
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
    <div className="md:hidden mb-5">
      {/* Category Chips */}
      <div className="flex overflow-x-auto pb-2 gap-1.5 mb-3 scrollbar-none">
        {CATEGORY_OPTIONS.map((item) => (
          <button
            key={item.key}
            onClick={() => setCategory(item.key)}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all ${
              category === item.key
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                : 'bg-white/70 backdrop-blur-sm border border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>{' '}
            {item.key === 'all' ? 'All' : item.key === 'employee' ? 'Employee' : 'Visiting'}
          </button>
        ))}
      </div>

      {/* Industry Chips */}
      <div className="flex overflow-x-auto pb-2 gap-1.5 scrollbar-none">
        {INDUSTRY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setIndustryFilter(opt.value)}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all ${
              industryFilter === opt.value
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                : 'bg-white/70 backdrop-blur-sm border border-slate-200 text-slate-600 hover:border-indigo-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderOrientationTabs = () => (
    <div className="relative w-full sm:w-auto flex-shrink-0" ref={tabBarRef}>
      <div className="relative z-10 flex items-stretch gap-0 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm p-1 w-full sm:w-auto">
        {ORIENTATIONS.map((tab) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            onClick={() => handleOrientationChange(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 z-10 whitespace-nowrap ${
              orientation === tab
                ? 'text-indigo-700 font-bold'
                : 'text-slate-500 hover:text-indigo-500'
            }`}
            aria-pressed={orientation === tab}
          >
            <span aria-hidden="true" className="text-sm sm:text-base">
              {tab === 'landscape' ? '🌄' : '📱'}
            </span>
            <span>{tab === 'landscape' ? 'Landscape' : 'Portrait'}</span>
          </button>
        ))}
      </div>

      {/* Sliding Pill */}
      <div
        className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-white via-indigo-50/80 to-white shadow-sm pointer-events-none z-0"
        style={{
          ...pillStyle,
          transition:
            'left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
        }}
      />

      {/* Sliding Indicator */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-indigo-500 rounded-t-full pointer-events-none z-20"
        style={{
          ...indicatorStyle,
          transition:
            'left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
        }}
      />
    </div>
  );

  const renderModal = () => {
    if (!showModal || !selectedTemplate) return null;

    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-fade-in"
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label="Template preview"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-[90vw]">
          <div
            className={`relative ${
              selectedTemplate.orientation === 'landscape'
                ? 'w-full max-w-[550px] aspect-[550/348]'
                : 'w-full max-w-[350px] aspect-[350/550]'
            }`}
          >
            <div
              ref={modalCardRef}
              onClick={handleModalCardFlip}
              className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-black/30 bg-transparent cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Click to flip card"
              onKeyDown={(e) => e.key === 'Enter' && handleModalCardFlip(e)}
            >
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlContent }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto justify-center animate-fade-in-up">
            <Button
              onClick={addToWishlist}
              variant="warning"
              size="md"
              className="w-full md:w-auto rounded-full text-sm bg-amber-500/90 backdrop-blur-sm hover:bg-amber-600"
            >
              ⭐ Wishlist
            </Button>
            <Button
              onClick={goToCustomize}
              variant="primary"
              size="md"
              className="w-full md:w-auto rounded-full text-sm bg-indigo-600/90 backdrop-blur-sm hover:bg-indigo-700"
            >
              ✏️ Customize
            </Button>
            <Button
              onClick={downloadTemplate}
              variant="success"
              size="md"
              icon={FiDownload}
              className="w-full md:w-auto rounded-full text-sm bg-emerald-500/90 backdrop-blur-sm hover:bg-emerald-600"
            >
              Download
            </Button>
            <Button
              onClick={closeModal}
              variant="secondary"
              size="md"
              className="w-full md:w-auto rounded-full text-sm bg-slate-600/90 backdrop-blur-sm hover:bg-slate-700"
            >
              ✕ Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // Main Render
  // ==========================================================================

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[#faf9f8]">
      {/* Sidebar - Always visible, independently scrollable */}
      {isLoading ? (
        <SidebarSkeleton />
      ) : (
        <Sidebar
          category={category}
          industryFilter={industryFilter}
          onCategoryChange={setCategory}
          onIndustryChange={setIndustryFilter}
        />
      )}

      {/* Main Content - Scrollable area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4 mb-6 w-full">
          <div className="flex-shrink-0">
            <h1 className="text-slate-800 text-xl font-bold">{categoryTitles[category]}</h1>
          </div>
          {renderOrientationTabs()}
        </div>

        {/* Mobile Filters */}
        {renderMobileFilters()}

        {/* Templates Grid */}
        {isLoading ? (
          <TemplateGridSkeleton count={8} orientation={orientation} />
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No templates found</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={orientation}
              initial={{ opacity: 0, x: slideDirection * 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDirection * -300 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <div
                className={`
                grid gap-5 sm:gap-6
                ${
                  orientation === 'landscape'
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-3 md:grid-cols-4'
                }
              `}
              >
                {filteredTemplates.map((template) => (
                  <div key={template.id} className="w-full flex justify-center">
                    <MemoizedCardPreview
                      html={template.htmlContent}
                      orientation={orientation}
                      onClick={() => openModal(template)}
                      enableFlip={false}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Modal */}
      {renderModal()}

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
        
        /* Flip Card Styles */
        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 100%;
          perspective: 1000px;
          cursor: pointer;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card .card-front,
        .flip-card .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .flip-card .card-back {
          transform: rotateY(180deg);
        }
        
        /* Focus visible accessibility */
        button:focus-visible,
        [role="button"]:focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
        }
        
        /* Smooth scrolling */
        .overflow-y-auto {
          scroll-behavior: smooth;
        }
      `,
        }}
      />
    </div>
  );
}