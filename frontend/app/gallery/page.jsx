'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CardPreview from '@/components/Common/CardPreview';
import { FiMenu, FiX, FiDownload, FiStar, FiTrash2, FiEdit2, FiChevronLeft } from 'react-icons/fi';

export default function GalleryPage() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState('wishlist');
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [totalItems, setTotalItems] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalCardRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadCategoryData();
      updateStorageInfo();
    }
  }, [currentCategory, isClient]);

  const handleModalCardFlip = (e) => {
    e.stopPropagation();
    const root = modalCardRef.current;
    if (!root) return;

    const clickedFlipCard = e.target.closest('.flip-card');
    const flipCard = clickedFlipCard || root.querySelector('.flip-card') || root;
    const flipInner = flipCard.querySelector?.('.flip-card-inner');

    if (flipInner) {
      const currentlyFlipped =
        flipInner.dataset.flipped === 'true' ||
        /rotateY\(180deg\)/.test(flipInner.style.transform || '') ||
        flipCard.classList.contains('flipped');

      flipInner.style.transform = currentlyFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
      flipInner.dataset.flipped = currentlyFlipped ? 'false' : 'true';
      flipCard.classList.toggle('flipped', !currentlyFlipped);
    }
  };

  const getStorageKey = (category) => `cardstudio_${category}`;

  const loadCategoryData = () => {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(currentCategory);
    const data = localStorage.getItem(key);
    if (!data) {
      setGalleryItems([]);
      return;
    }
    try {
      const parsed = JSON.parse(data);
      setGalleryItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setGalleryItems([]);
    }
  };

  const saveCategoryData = (items) => {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(currentCategory);
    localStorage.setItem(key, JSON.stringify(items));
    setGalleryItems(items);
    updateStorageInfo();
  };

  const safeJsonArrayLength = (raw) => {
    if (!raw) return 0;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  const updateStorageInfo = () => {
    if (typeof window === 'undefined') return;
    const wishlist = safeJsonArrayLength(localStorage.getItem('cardstudio_wishlist'));
    const drafts = safeJsonArrayLength(localStorage.getItem('cardstudio_drafts'));
    const downloads = safeJsonArrayLength(localStorage.getItem('cardstudio_downloads'));
    setTotalItems(wishlist + drafts + downloads);
  };

  const showToastMessage = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getOrientationFromHTML = (html) => {
    if (!html) return 'landscape';
    if (html.includes('portrait') || html.includes('height:500px') || 
        html.includes('aspect-ratio: 0.58') || html.includes('width: 290px')) {
      return 'portrait';
    }
    return 'landscape';
  };

  const openPreviewModal = (id) => {
    const item = galleryItems.find(i => i.id == id);
    if (!item) return;
    setSelectedItem({ ...item });
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    document.body.style.overflow = 'unset';
  };

  const customizeItem = (id) => {
    if (typeof window === 'undefined') return;
    const item = galleryItems.find(i => i.id == id);
    if (item) {
      localStorage.setItem('selectedTemplateForCustomize', JSON.stringify(item));
      router.push('/customize');
    }
  };

  const removeItem = (id) => {
    if (typeof window === 'undefined' || !confirm('Delete this item?')) return;
    const filtered = galleryItems.filter(i => i.id != id);
    saveCategoryData(filtered);
    closeModal();
    showToastMessage('Item deleted');
  };

  const moveToWishlist = () => {
    if (typeof window === 'undefined' || !selectedItem) return;
    let wishlist = [];
    try {
      wishlist = JSON.parse(localStorage.getItem('cardstudio_wishlist') || '[]');
      if (!Array.isArray(wishlist)) wishlist = [];
    } catch {
      wishlist = [];
    }

    if (!wishlist.some(i => i.id === selectedItem.id)) {
      wishlist.push(selectedItem);
      localStorage.setItem('cardstudio_wishlist', JSON.stringify(wishlist));

      if (currentCategory === 'drafts' || currentCategory === 'downloads') {
        const key = getStorageKey(currentCategory);
        try {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(items)) {
            localStorage.setItem(key, JSON.stringify(items.filter(i => i.id !== selectedItem.id)));
          }
        } catch {
          /* ignore */
        }
      }
      
      showToastMessage('✅ Moved to Wishlist');
      closeModal();
      loadCategoryData();
    } else {
      showToastMessage('Already in wishlist', 'warning');
    }
  };

  const handleCardClick = (e, item) => {
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      e.stopPropagation();
      const action = actionBtn.dataset.action;
      const id = actionBtn.dataset.id;
      if (action === 'edit') customizeItem(id);
      else if (action === 'delete') removeItem(id);
      return;
    }
    openPreviewModal(item.id);
  };

  const handleModalAction = (action) => {
    if (typeof window === 'undefined') return;
    if (action === 'customize' && selectedItem) {
      localStorage.setItem('selectedTemplateForCustomize', JSON.stringify(selectedItem));
      router.push('/customize');
    } else if (action === 'delete' && selectedItem) {
      removeItem(selectedItem.id);
    } else if (action === 'wishlist') {
      moveToWishlist();
    } else if (action === 'download') {
      downloadSelectedItem();
    } else if (action === 'close') {
      closeModal();
    }
  };

  const downloadSelectedItem = async () => {
    if (!selectedItem?.fullHTML) return;

    let stage = null;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const orientation = selectedItem.orientation || getOrientationFromHTML(selectedItem.fullHTML);
      const isPortrait = orientation === 'portrait';

      stage = document.createElement('div');
      stage.style.position = 'fixed';
      stage.style.left = '-9999px';
      stage.style.top = '-9999px';
      stage.style.width = isPortrait ? '350px' : '550px';
      stage.style.height = isPortrait ? '550px' : '348px';
      stage.style.borderRadius = '24px';
      stage.style.overflow = 'hidden';
      stage.innerHTML = selectedItem.fullHTML;
      document.body.appendChild(stage);

      const flipCard = stage.querySelector('.flip-card');
      const flipInner = stage.querySelector('.flip-card-inner');
      const front = stage.querySelector('.card-front, .face.front');
      const back = stage.querySelector('.card-back, .face.back');
      const safeName = (selectedItem.name || 'card').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      const timestamp = Date.now();

      if (front && back && flipCard && flipInner) {
        flipCard.classList.remove('flipped');
        flipInner.style.transform = 'rotateY(0deg)';
        await new Promise((resolve) => setTimeout(resolve, 60));

        const frontCanvas = await html2canvas(stage, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });

        flipCard.classList.add('flipped');
        flipInner.style.transform = 'rotateY(180deg)';
        await new Promise((resolve) => setTimeout(resolve, 60));

        const backCanvas = await html2canvas(stage, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });

        const combinedCanvas = document.createElement('canvas');
        const combinedCtx = combinedCanvas.getContext('2d');
        
        combinedCanvas.width = frontCanvas.width;
        combinedCanvas.height = frontCanvas.height + backCanvas.height;
        
        combinedCtx.drawImage(frontCanvas, 0, 0);
        combinedCtx.drawImage(backCanvas, 0, frontCanvas.height);
        
        const link = document.createElement('a');
        link.download = `${safeName}-both-sides-${timestamp}.png`;
        link.href = combinedCanvas.toDataURL('image/png');
        link.click();

        showToastMessage('Downloaded front and back as single file');
      } else {
        const canvas = await html2canvas(stage, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        });
        const link = document.createElement('a');
        link.download = `${safeName}-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToastMessage('Downloaded');
      }

      const downloads = JSON.parse(localStorage.getItem('cardstudio_downloads') || '[]');
      downloads.unshift({
        id: Date.now(),
        name: `${selectedItem.name || 'Card'} (Downloaded)`,
        category: selectedItem.category || 'downloaded',
        icon: selectedItem.icon || '⬇️',
        orientation,
        fullHTML: selectedItem.fullHTML,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('cardstudio_downloads', JSON.stringify(downloads.slice(0, 50)));
      updateStorageInfo();
    } catch (error) {
      console.error(error);
      showToastMessage(`Download failed: ${error.message}`, 'warning');
    } finally {
      if (stage && stage.parentNode) {
        stage.parentNode.removeChild(stage);
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const categoryTitles = {
    wishlist: 'Wishlist',
    drafts: 'Drafts',
    downloads: 'Downloads'
  };

  const categoryDescriptions = {
    wishlist: 'Your favorite saved designs',
    drafts: 'Work in progress designs',
    downloads: 'Cards you have downloaded as PNG'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-['Inter'] overflow-x-hidden">
      {/* Mobile Header - Side se open karne ke liye button left side */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 px-4 py-3 flex items-center shadow-sm">
        <button 
          onClick={toggleSidebar} 
          className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <FiMenu size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-bold text-lg text-slate-800">My Gallery</h2>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <div className="flex min-h-screen md:min-h-[calc(100vh-72px)]">
        {/* Sidebar - Left se slide hoga */}
        <aside className={`fixed top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white shadow-2xl flex flex-col flex-shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0 md:shadow-md ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  My Gallery
                </h2>
                <p className="text-xs text-slate-500 mt-1">Manage your designs</p>
              </div>
              <button 
                onClick={toggleSidebar} 
                className="md:hidden p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1.5">
            {['wishlist', 'drafts', 'downloads'].map(key => (
              <div
                key={key}
                onClick={() => {
                  setCurrentCategory(key);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`cursor-pointer transition-all rounded-xl py-3 px-4 flex items-center gap-3 group ${
                  currentCategory === key 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="text-xl">
                  {key === 'wishlist' ? '⭐' : key === 'drafts' ? '✏️' : '⬇️'}
                </span>
                <span className="font-medium flex-1">
                  {key === 'wishlist' ? 'Wishlist' : key === 'drafts' ? 'Drafts' : 'Downloads'}
                </span>
                {currentCategory === key && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {galleryItems.length}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Footer Stats */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="text-xs text-slate-500 text-center">
              <p>Total Items: {totalItems}</p>
              <p className="text-[11px] text-slate-400 mt-1">Tap to select category</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile - jab sidebar open ho */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
          {/* Header Section - Desktop */}
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              {categoryTitles[currentCategory]}
            </h1>
            <p className="text-slate-500 text-sm mt-2">{categoryDescriptions[currentCategory]}</p>
          </div>

          {/* Header Section - Mobile */}
          <div className="md:hidden mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              {categoryTitles[currentCategory]}
            </h1>
            <p className="text-slate-500 text-xs mt-1">{categoryDescriptions[currentCategory]}</p>
          </div>

          {/* Content */}
          {!isClient ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-sm">Loading your gallery...</p>
              </div>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-base md:text-lg font-semibold text-slate-700 mb-2">No items yet</h3>
              <p className="text-slate-400 text-sm">Your {currentCategory} will appear here</p>
            </div>
          ) : (
            <>
              {/* Grid View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {galleryItems.map(item => {
                  const orientation = item.orientation || getOrientationFromHTML(item.fullHTML);
                  return (
                    <div 
                      key={item.id} 
                      onClick={(e) => handleCardClick(e, item)} 
                      className="group relative flex cursor-pointer flex-col items-center overflow-visible transition-all duration-300 hover:-translate-y-2"
                    >
                      {/* Action Buttons */}
                      <div className="absolute -top-2 right-2 flex gap-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 opacity-100">
                        <button 
                          data-action="edit" 
                          data-id={item.id} 
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-all hover:scale-110 shadow-lg text-sm active:scale-95"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          data-action="delete" 
                          data-id={item.id} 
                          className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110 shadow-lg text-sm active:scale-95"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>

                      {/* Card Preview */}
                      <CardPreview 
                        html={item.fullHTML} 
                        orientation={orientation} 
                        className="w-full max-w-[260px] sm:max-w-none transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10" 
                      />
                      
                      {/* Card Title - Mobile only */}
                      <p className="mt-3 text-sm font-medium text-slate-700 md:hidden truncate max-w-[200px]">
                        {item.name || 'Untitled Card'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Items Count */}
              <div className="mt-8 text-center text-sm text-slate-400">
                Showing {galleryItems.length} item{galleryItems.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[2000] p-3 sm:p-4 md:p-6" 
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-center w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw]">
            {/* Card Container */}
            <div
              ref={modalCardRef}
              onClick={handleModalCardFlip}
              className={`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 ${
                (selectedItem.orientation || getOrientationFromHTML(selectedItem.fullHTML)) === 'portrait' 
                  ? 'w-full max-w-[300px] sm:max-w-[350px] aspect-[350/550]' 
                  : 'w-full max-w-[450px] sm:max-w-[550px] aspect-[550/348]'
              }`}
            >
              <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: selectedItem.fullHTML || '' }} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 w-full lg:w-auto justify-center flex-wrap">
              <button 
                onClick={() => handleModalAction('customize')} 
                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex items-center gap-2 shadow-lg"
              >
                <FiEdit2 size={16} /> Customize
              </button>
              
              {(currentCategory === 'drafts' || currentCategory === 'downloads') && (
                <button 
                  onClick={() => handleModalAction('wishlist')} 
                  className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex items-center gap-2 shadow-lg"
                >
                  <FiStar size={16} /> Save
                </button>
              )}
              
              <button 
                onClick={() => handleModalAction('download')} 
                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex items-center gap-2 shadow-lg"
              >
                <FiDownload size={16} /> Download
              </button>
              
              <button 
                onClick={() => handleModalAction('delete')} 
                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold bg-red-500 text-white hover:bg-red-600 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex items-center gap-2 shadow-lg"
              >
                <FiTrash2 size={16} /> Delete
              </button>
              
              <button 
                onClick={() => handleModalAction('close')} 
                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex items-center gap-2"
              >
                <FiChevronLeft size={16} /> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-300 z-[1100] shadow-lg ${
        showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
      } ${toastType === 'warning' ? 'bg-amber-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white`}>
        {toastMessage}
      </div>

      <style jsx global>{`
        /* Flip Card Styles */
        .flip-card { 
          width: 100%; 
          height: 100%; 
          perspective: 1800px; 
          cursor: pointer; 
        }
        
        .flip-card-inner { 
          position: relative; 
          width: 100%; 
          height: 100%; 
          transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1); 
          transform-style: preserve-3d; 
        }
        
        .flip-card.flipped .flip-card-inner { 
          transform: rotateY(180deg); 
        }
        
        .card-front, .card-back { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          backface-visibility: hidden; 
          border-radius: 20px; 
          overflow: hidden; 
        }
        
        .card-back { 
          transform: rotateY(180deg); 
        }
        
        /* Touch device optimizations */
        @media (hover: hover) {
          .group:hover .md\\:group-hover\\:opacity-100 {
            opacity: 1;
          }
        }
        
        @media (hover: none) {
          .group .opacity-100 {
            opacity: 1;
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          .grid {
            gap: 1.5rem;
          }
        }
        
        /* Smooth scrolling */
        .overflow-y-auto {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}