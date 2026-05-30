'use client';

import { useState, useEffect, useCallback } from 'react';
import { templatesByOrientation } from '../../templatesdata';
import { normalizeTemplateHtml } from '../../templatesdata';
import CardPreview from '@/components/Common/CardPreview';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';

export default function TemplatesPage() {
  const [orientation, setOrientation] = useState('landscape');
  const [category, setCategory] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load saved state
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
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem('templatePageState', JSON.stringify({
      category,
      filter: industryFilter,
      orientation
    }));
  }, [category, industryFilter, orientation]);

  // Skeleton loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [orientation, category, industryFilter]);

  const getFilteredTemplates = useCallback(() => {
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
      // Pre‑normalize the HTML to avoid processing on the customize page
      const preprocessedHTML = normalizeTemplateHtml(selectedTemplate.htmlContent);
      const templateData = {
        ...selectedTemplate,
        fullHTML: preprocessedHTML,
        sourcePage: 'template'
      };
      localStorage.setItem('selectedTemplateForCustomize', JSON.stringify(templateData));
      showToastMessage('Loading customization...');
      setTimeout(() => {
        window.location.href = '/customize';
      }, 50);
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

  const filteredTemplates = getFilteredTemplates();
  
  const categoryTitles = {
    all: 'All Templates',
    employee: 'Employee Cards',
    visiting: 'Visiting Cards'
  };

  const categoryDescriptions = {
    landscape: 'Browse our landscape collection (550×348px) | Fully editable',
    portrait: 'Browse our portrait collection (350×550px) | Fully editable'
  };

  const SkeletonCard = ({ orientation }) => (
    <div className={`bg-slate-800 rounded-2xl overflow-hidden relative animate-pulse ${
      orientation === 'landscape' ? 'aspect-[550/348]' : 'aspect-[350/550] max-w-[280px] mx-auto'
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
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] font-['Inter'] overflow-x-hidden">
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button onClick={toggleSidebar} className="bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition-colors">
          <FiMenu size={20} />
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-70px)]">
        <aside className={`fixed md:relative top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white border-r border-slate-200 py-6 overflow-y-auto z-40 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="md:hidden absolute right-3 top-3">
            <button onClick={toggleSidebar} className="p-2 bg-slate-100 rounded-full"><FiX size={20} /></button>
          </div>

          <div className="mb-8">
            <div className="text-[0.7rem] uppercase tracking-[1.5px] text-slate-400 font-semibold px-5 pb-3">CARD CATEGORY</div>
            {[
              { key: 'all', icon: '📁', label: 'All Templates' },
              { key: 'employee', icon: '👤', label: 'Employee Card' },
              { key: 'visiting', icon: '🎫', label: 'Visiting Card' }
            ].map(item => (
              <div key={item.key} onClick={() => { setCategory(item.key); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer transition-all text-[0.9rem] font-medium
                  ${category === item.key ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}>
                {item.icon} {item.label}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="text-[0.7rem] uppercase tracking-[1.5px] text-slate-400 font-semibold px-5 pb-3">INDUSTRY FILTER</div>
            <div className="px-5">
              <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-[0.85rem] text-slate-800 cursor-pointer hover:border-indigo-600 transition-colors">
                <option value="all">🌐 All Industries</option>
                <option value="technology">💻 Technology / IT</option>
                <option value="marketing">📢 Marketing & Advertising</option>
                <option value="corporate">🏢 Corporate</option>
              </select>
            </div>
          </div>
        </aside>

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggleSidebar} />}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 min-w-0">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">{categoryTitles[category]}</h1>
              <p className="text-slate-500 text-sm sm:text-base mt-1">{categoryDescriptions[orientation]}</p>
            </div>
            <div className="flex gap-3 bg-slate-100 p-1 rounded-full">
              {['landscape', 'portrait'].map(ori => (
                <button key={ori} onClick={() => setOrientation(ori)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all
                    ${orientation === ori ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-transparent text-slate-500'}`}>
                  {ori === 'landscape' ? '🌄 Landscape' : '📱 Portrait'}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className={`grid gap-6 sm:gap-8 ${orientation === 'landscape' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'}`}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} orientation={orientation} />)}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No templates found</div>
          ) : (
            <div className={`grid gap-6 sm:gap-8 ${orientation === 'landscape' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredTemplates.map((template) => (
                <div key={template.id} onClick={() => openModal(template)} className="cursor-pointer transition-transform duration-300 hover:-translate-y-2">
                  <CardPreview html={template.htmlContent} orientation={orientation} className="w-full transition-all duration-300 hover:shadow-2xl hover:shadow-black/10" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[1000] p-4" onClick={handleOverlayClick}>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-[90vw]">
            <div className={`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-transparent ${selectedTemplate.orientation === 'landscape' ? 'w-full max-w-[550px] aspect-[550/348]' : 'w-full max-w-[350px] aspect-[350/550]'}`}>
              <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: selectedTemplate.htmlContent }} onClick={handleFlipCardClick} />
            </div>
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto justify-center">
              <button onClick={addToWishlist} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold transition-all text-sm md:text-base bg-white text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white">⭐ Wishlist</button>
              <button onClick={goToCustomize} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold transition-all text-sm md:text-base bg-gradient-to-br from-indigo-600 to-indigo-500 text-white hover:shadow-lg">✏️ Customize</button>
              <button onClick={downloadTemplate} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold transition-all text-sm md:text-base bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg flex items-center justify-center gap-2"><FiDownload /> Download</button>
              <button onClick={closeModal} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold transition-all text-sm md:text-base bg-slate-100 text-slate-500 hover:bg-slate-200">✕ Close</button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold transition-all duration-300 z-[1100] text-sm ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'}`}>
        {toastMessage}
      </div>

      <style jsx global>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-shimmer { animation: shimmer 1.5s ease-in-out infinite; }
        .flip-card .flip-card-inner { transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1); }
        .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
        .flip-card, .card-front, .card-back, .flip-card-inner { width: 100% !important; height: 100% !important; }
        @media (max-width: 320px) { .grid { gap: 1rem; } button { font-size: 0.75rem; padding: 0.5rem 1rem; } }
        @media (max-width: 480px) and (orientation: portrait) { .rounded-full { min-height: 44px; } }
      `}</style>
    </div>
  );
}