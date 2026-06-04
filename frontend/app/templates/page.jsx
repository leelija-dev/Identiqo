// app/templates/page.jsx
'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { templatesByOrientation } from '../../templatesdata';
import { normalizeTemplateHtml } from '../../templatesdata';
import CardPreview, { CardGrid, CardSkeleton } from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';
import { SidebarSkeleton } from '@/components/Common/Skeleton';

// Memoized card component to prevent re-renders
const MemoizedCardPreview = memo(CardPreview);

export default function TemplatesPage() {
  const router = useRouter();
  const [orientation, setOrientation] = useState('landscape');
  const [category, setCategory] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categoryTitles = {
    all: 'All Templates',
    employee: 'Employee Cards',
    visiting: 'Visiting Cards'
  };

  const categoryDescriptions = {
    landscape: 'Browse our landscape collection (550×348px) | Fully editable',
    portrait: 'Browse our portrait collection (350×550px) | Fully editable'
  };

  // Load saved state once
  useEffect(() => {
    const savedState = localStorage.getItem('templatePageState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setOrientation(state.orientation || 'landscape');
        setCategory(state.category || 'all');
        setIndustryFilter(state.filter || 'all');
      } catch (e) {}
    }
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Save state on changes (debounced)
  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      localStorage.setItem('templatePageState', JSON.stringify({
        category,
        filter: industryFilter,
        orientation
      }));
    }, 300);
    return () => clearTimeout(timer);
  }, [category, industryFilter, orientation, isLoading]);

  // Memoize filtered templates
  const filteredTemplates = useMemo(() => {
    const templates = templatesByOrientation[orientation];
    if (!templates) return [];
    return templates.filter(template => {
      const categoryMatch = category === 'all' || template.category === category;
      const filterMatch = industryFilter === 'all' || template.filter === industryFilter;
      return categoryMatch && filterMatch;
    });
  }, [orientation, category, industryFilter]);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const openModal = (template) => {
    setSelectedTemplate(template);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
    document.body.style.overflow = 'unset';
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const handleFlipCardClick = (e) => {
    e.stopPropagation();
    const flipCard = e.target.closest('.flip-card');
    if (flipCard) flipCard.classList.toggle('flipped');
  };

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

  const goToCustomize = () => {
    if (selectedTemplate) {
      const preprocessedHTML = normalizeTemplateHtml(selectedTemplate.htmlContent);
      const templateData = {
        ...selectedTemplate,
        fullHTML: preprocessedHTML,
        sourcePage: 'template'
      };
      localStorage.setItem('selectedTemplateForCustomize', JSON.stringify(templateData));
      showToastMessage('Loading customization...');
      setTimeout(() => router.push('/customize'), 150);
    }
  };

  const downloadTemplate = async () => {
    if (!selectedTemplate?.htmlContent) return;

    let parserStage = null;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const isPortrait = selectedTemplate.orientation === 'portrait';
      const design = isPortrait
        ? { width: 350, height: 550 }
        : { width: 550, height: 348 };

      parserStage = document.createElement('div');
      parserStage.style.position = 'fixed';
      parserStage.style.left = '-9999px';
      parserStage.style.top = '-9999px';
      parserStage.style.width = `${design.width}px`;
      parserStage.style.height = `${design.height}px`;
      parserStage.innerHTML = selectedTemplate.htmlContent;
      document.body.appendChild(parserStage);

      const front = parserStage.querySelector('.card-front, .face.front');
      const back = parserStage.querySelector('.card-back, .face.back');
      const safeName = (selectedTemplate.name || 'template').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      const timestamp = Date.now();

      const captureFace = async (face) => {
        const stage = document.createElement('div');
        const clone = face.cloneNode(true);

        stage.style.position = 'fixed';
        stage.style.left = '-9999px';
        stage.style.top = '-9999px';
        stage.style.width = `${design.width}px`;
        stage.style.height = `${design.height}px`;
        stage.style.borderRadius = '24px';
        stage.style.overflow = 'hidden';
        stage.style.background = '#ffffff';

        clone.style.position = 'relative';
        clone.style.width = '100%';
        clone.style.height = '100%';
        clone.style.display = 'block';
        clone.style.transform = 'none';
        clone.style.backfaceVisibility = 'visible';
        clone.style.webkitBackfaceVisibility = 'visible';

        stage.appendChild(clone);
        document.body.appendChild(stage);
        await new Promise((resolve) => setTimeout(resolve, 100));

        try {
          return await html2canvas(stage, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
          });
        } finally {
          document.body.removeChild(stage);
        }
      };

      if (front && back) {
        const frontCanvas = await captureFace(front);
        const backCanvas = await captureFace(back);

        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = frontCanvas.width;
        combinedCanvas.height = frontCanvas.height + backCanvas.height;
        const ctx = combinedCanvas.getContext('2d');
        ctx.drawImage(frontCanvas, 0, 0);
        ctx.drawImage(backCanvas, 0, frontCanvas.height);

        const link = document.createElement('a');
        link.download = `${safeName}-both-sides-${timestamp}.png`;
        link.href = combinedCanvas.toDataURL('image/png');
        link.click();

        showToastMessage('Template downloaded (front + back)');
      } else {
        const canvas = await html2canvas(parserStage, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const link = document.createElement('a');
        link.download = `${safeName}-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToastMessage('Template downloaded');
      }

      const downloads = JSON.parse(localStorage.getItem('cardstudio_downloads') || '[]');
      downloads.unshift({
        id: Date.now(),
        name: `${selectedTemplate.name} (Template Download)`,
        category: selectedTemplate.category,
        icon: selectedTemplate.icon,
        orientation: selectedTemplate.orientation,
        fullHTML: selectedTemplate.htmlContent,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('cardstudio_downloads', JSON.stringify(downloads));
    } catch (error) {
      console.error(error);
      showToastMessage(`Download failed: ${error.message}`);
    } finally {
      if (parserStage && parserStage.parentNode) {
        parserStage.parentNode.removeChild(parserStage);
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-x-hidden">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar} 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Open sidebar"
        >
          <FiMenu size={20} />
        </button>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar - Sticky on desktop */}
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <aside className={`fixed md:sticky md:top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white/80 backdrop-blur-sm border-r border-slate-200 py-6 overflow-y-auto z-40 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } md:translate-x-0`}>
            <div className="md:hidden absolute right-3 top-3">
              <button onClick={toggleSidebar} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors" aria-label="Close sidebar">
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-8">
              <div className="text-a-xs uppercase tracking-[1.5px] text-slate-400 font-semibold px-5 pb-3">
                CARD CATEGORY
              </div>
              {[
                { key: 'all', icon: '📁', label: 'All Templates' },
                { key: 'employee', icon: '👤', label: 'Employee Card' },
                { key: 'visiting', icon: '🎫', label: 'Visiting Card' }
              ].map(item => (
                <div 
                  key={item.key} 
                  onClick={() => { setCategory(item.key); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all text-a-sm font-medium
                    ${category === item.key ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}
                >
                  {item.icon} {item.label}
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="text-a-xs uppercase tracking-[1.5px] text-slate-400 font-semibold px-5 pb-3">
                INDUSTRY FILTER
              </div>
              <div className="px-5">
                <select 
                  value={industryFilter} 
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-a-sm text-slate-800 cursor-pointer hover:border-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label="Industry filter"
                >
                  <option value="all">🌐 All Industries</option>
                  <option value="technology">💻 Technology / IT</option>
                  <option value="marketing">📢 Marketing & Advertising</option>
                  <option value="corporate">🏢 Corporate</option>
                </select>
              </div>
            </div>
          </aside>
        )}

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggleSidebar} />}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-slate-800 text-h2-sm sm:text-h2-md lg:text-h2-lg font-bold">
                {categoryTitles[category]}
              </h1>
              <p className="text-slate-500 text-p-xs mt-1">
                {categoryDescriptions[orientation]}
              </p>
            </div>
            <div className="flex gap-3 bg-slate-100 p-1 rounded-full">
              {['landscape', 'portrait'].map(ori => (
                <button 
                  key={ori} 
                  onClick={() => setOrientation(ori)}
                  className={`px-4 py-2 rounded-full font-semibold text-p-xs transition-all duration-300
                    ${orientation === ori 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30' 
                      : 'bg-transparent text-slate-500 hover:text-indigo-600'}`}
                >
                  {ori === 'landscape' ? '🌄 Landscape' : '📱 Portrait'}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid with max-width wrapper for very large screens */}
          {isLoading ? (
            <CardSkeleton orientation={orientation} count={6} />
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-p-sm">
              No templates found
            </div>
          ) : (
            <div className="max-w-[1400px] mx-auto">
              <CardGrid orientation={orientation}>
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    onClick={() => openModal(template)} 
                    className="cursor-pointer transition-all duration-300 hover:-translate-y-2 w-full"
                  >
                    <MemoizedCardPreview 
                      html={template.htmlContent} 
                      orientation={orientation}
                    />
                  </div>
                ))}
              </CardGrid>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTemplate && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-fade-in" 
          onClick={handleOverlayClick}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-[90vw]">
            <div className={`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-transparent ${
              selectedTemplate.orientation === 'landscape' 
                ? 'w-full max-w-[550px] aspect-[550/348]' 
                : 'w-full max-w-[350px] aspect-[350/550]'
            }`}>
              <div 
                className="w-full h-full" 
                dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlContent }} 
                onClick={handleFlipCardClick} 
              />
            </div>
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto justify-center animate-fade-in-up">
              <Button
                onClick={addToWishlist}
                variant="warning"
                size="md"
                className="rounded-full text-p-xs md:text-p-sm"
              >
                ⭐ Wishlist
              </Button>
              <Button
                onClick={goToCustomize}
                variant="primary"
                size="md"
                className="rounded-full text-p-xs md:text-p-sm"
              >
                ✏️ Customize
              </Button>
              <Button
                onClick={downloadTemplate}
                variant="success"
                size="md"
                icon={FiDownload}
                className="rounded-full text-p-xs md:text-p-sm"
              >
                Download
              </Button>
              <Button
                onClick={closeModal}
                variant="secondary"
                size="md"
                className="rounded-full text-p-xs md:text-p-sm"
              >
                ✕ Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed bottom-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300 z-[1100] text-p-xs shadow-lg ${
        showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
      }`}>
        {toastMessage}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 
          0% { background-position: -200% 0; } 
          100% { background-position: 200% 0; } 
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shimmer { 
          animation: shimmer 1.5s ease-in-out infinite; 
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
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
        @media (max-width: 480px) and (orientation: portrait) { 
          .rounded-full { 
            min-height: 44px; 
          } 
        }
      `}} />
    </div>
  );
}