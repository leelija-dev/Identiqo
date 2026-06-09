// app/gallery/page.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CardPreview, { CardGrid } from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import { FiDownload, FiStar, FiTrash2, FiEdit2, FiChevronLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateGridSkeleton, SidebarSkeleton } from '@/components/Common/Skeleton';

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
  const [isLoading, setIsLoading] = useState(true);
  const modalCardRef = useRef(null);

  // Direction for horizontal slide animation (1 = from right, -1 = from left)
  const [categoryDirection, setCategoryDirection] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadCategoryData();
      updateStorageInfo();
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [currentCategory, isClient]);

  // Detect orientation from HTML content - prioritize stored orientation
  const getOrientationFromHTML = useCallback((html, itemOrientation) => {
    // If the item has a stored orientation property, use it first
    if (itemOrientation === 'portrait' || itemOrientation === 'landscape') {
      return itemOrientation;
    }
    
    if (!html) return 'landscape';
    const htmlStr = String(html).toLowerCase();
    
    // Check for explicit portrait indicators in the HTML
    if (
      htmlStr.includes('width: 350px') ||
      htmlStr.includes('width:350px') ||
      htmlStr.includes('350/550') ||
      htmlStr.includes('aspect-ratio:350/550') ||
      htmlStr.includes('height:550px') ||
      htmlStr.includes('height:500px') ||
      htmlStr.includes('aspect-ratio: 0.58')
    ) {
      return 'portrait';
    }
    
    // Check for explicit landscape indicators in the HTML
    if (
      htmlStr.includes('width: 550px') ||
      htmlStr.includes('width:550px') ||
      htmlStr.includes('550/348') ||
      htmlStr.includes('aspect-ratio:550/348') ||
      htmlStr.includes('height:348px')
    ) {
      return 'landscape';
    }
    
    // Fallback: check if the word "portrait" appears
    if (htmlStr.includes('portrait')) {
      return 'portrait';
    }
    
    // Default to landscape
    return 'landscape';
  }, []);

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
      const orientation = getOrientationFromHTML(selectedItem.fullHTML, selectedItem.orientation);
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

  // Separate items by orientation - ALWAYS use stored orientation first
  const landscapeItems = galleryItems.filter(item => 
    getOrientationFromHTML(item.fullHTML, item.orientation) === 'landscape'
  );
  const portraitItems = galleryItems.filter(item => 
    getOrientationFromHTML(item.fullHTML, item.orientation) === 'portrait'
  );

  // Dynamic background gradient per category
  const categoryBackgrounds = {
    wishlist: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)',
    drafts: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
    downloads: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
  };

  // Category order for slide direction
  const categoryOrder = ['wishlist', 'drafts', 'downloads'];

  const handleCategoryChange = (newCategory) => {
    const oldIndex = categoryOrder.indexOf(currentCategory);
    const newIndex = categoryOrder.indexOf(newCategory);
    if (newIndex > oldIndex) setCategoryDirection(1);  // slide from right
    else if (newIndex < oldIndex) setCategoryDirection(-1); // slide from left
    else setCategoryDirection(0);
    setCurrentCategory(newCategory);
  };

  // Custom skeleton for gallery (matching the layout)
  const GallerySkeleton = () => (
    <div className="space-y-8">
      <div>
        <div className="mb-4">
          <div className="h-7 bg-slate-200 rounded w-48 animate-pulse"></div>
        </div>
        <TemplateGridSkeleton count={3} orientation="landscape" />
      </div>
      <div>
        <div className="mb-4">
          <div className="h-7 bg-slate-200 rounded w-48 animate-pulse"></div>
        </div>
        <TemplateGridSkeleton count={4} orientation="portrait" />
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen overflow-x-hidden font-['Inter']"
      style={{
        background: categoryBackgrounds[currentCategory],
        transition: 'background 0.5s ease',
      }}
    >
      <div className="min-h-screen overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h1 className="text-slate-800 text-xl sm:text-2xl font-bold">
                My Gallery
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage wishlist, drafts, and downloaded cards
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: 'wishlist', icon: '⭐', label: 'Wishlist' },
                { key: 'drafts', icon: '✏️', label: 'Drafts' },
                { key: 'downloads', icon: '⬇️', label: 'Downloads' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleCategoryChange(item.key)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm whitespace-nowrap ${
                    currentCategory === item.key
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                      : 'bg-white/60 backdrop-blur-sm border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500">
              Total items: {totalItems}
            </div>
          </div>

          {/* Content with directional slide animation */}
          {!isClient ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 text-p-xs">Loading your gallery...</p>
              </div>
            </div>
          ) : isLoading ? (
            <GallerySkeleton />
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 md:py-24 animate-fade-in-up">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-p-sm font-semibold text-slate-700 mb-2">No items yet</h3>
              <p className="text-slate-400 text-xs">Your {currentCategory} will appear here</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0, x: categoryDirection * 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: categoryDirection * -200 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <div className="max-w-[1400px] mx-auto space-y-8">
                  {/* Landscape Cards Section */}
                  {landscapeItems.length > 0 && (
                    <div>
                      {portraitItems.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-h4-sm font-semibold text-slate-700 flex items-center gap-2">
                            <span>🌄</span> Landscape Cards
                            <span className="text-xs font-normal text-slate-400">
                              ({landscapeItems.length} {landscapeItems.length === 1 ? 'card' : 'cards'})
                            </span>
                          </h3>
                        </div>
                      )}
                      <CardGrid orientation="landscape" className="w-full">
                        {landscapeItems.map(item => (
                          <div 
                            key={item.id} 
                            onClick={(e) => handleCardClick(e, item)} 
                            className="group relative flex cursor-pointer flex-col items-center overflow-visible transition-all duration-300 hover:-translate-y-2 w-full"
                          >
                            <div className="absolute -top-2 right-2 flex gap-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 opacity-100">
                              <button data-action="edit" data-id={item.id} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-all hover:scale-110 shadow-lg text-sm active:scale-95"><FiEdit2 size={14} /></button>
                              <button data-action="delete" data-id={item.id} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all hover:scale-110 shadow-lg text-sm active:scale-95"><FiTrash2 size={14} /></button>
                            </div>
                            <CardPreview html={item.fullHTML} orientation="landscape" className="w-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10" />
                            <p className="mt-3 text-p-xs font-medium text-slate-700 md:hidden truncate max-w-[200px]">{item.name || 'Untitled Card'}</p>
                          </div>
                        ))}
                      </CardGrid>
                    </div>
                  )}

                  {/* Portrait Cards Section */}
                  {portraitItems.length > 0 && (
                    <div>
                      {landscapeItems.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-h4-sm font-semibold text-slate-700 flex items-center gap-2">
                            <span>📱</span> Portrait Cards
                            <span className="text-xs font-normal text-slate-400">
                              ({portraitItems.length} {portraitItems.length === 1 ? 'card' : 'cards'})
                            </span>
                          </h3>
                        </div>
                      )}
                      <CardGrid orientation="portrait" className="w-full">
                        {portraitItems.map(item => (
                          <div 
                            key={item.id} 
                            onClick={(e) => handleCardClick(e, item)} 
                            className="group relative flex cursor-pointer flex-col items-center overflow-visible transition-all duration-300 hover:-translate-y-2 w-full"
                          >
                            <div className="absolute -top-2 right-2 flex gap-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 opacity-100">
                              <button data-action="edit" data-id={item.id} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-all hover:scale-110 shadow-lg text-sm active:scale-95"><FiEdit2 size={14} /></button>
                              <button data-action="delete" data-id={item.id} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all hover:scale-110 shadow-lg text-sm active:scale-95"><FiTrash2 size={14} /></button>
                            </div>
                            <CardPreview html={item.fullHTML} orientation="portrait" className="w-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10" />
                            <p className="mt-3 text-p-xs font-medium text-slate-700 md:hidden truncate max-w-[200px]">{item.name || 'Untitled Card'}</p>
                          </div>
                        ))}
                      </CardGrid>
                    </div>
                  )}

                  <div className="text-center text-xs text-slate-400 pb-8">
                    Showing {galleryItems.length} item{galleryItems.length !== 1 ? 's' : ''}
                    {landscapeItems.length > 0 && portraitItems.length > 0 && (
                      <span> ({landscapeItems.length} landscape, {portraitItems.length} portrait)</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[2000] p-3 sm:p-4 md:p-6 animate-fade-in" 
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-center w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[85vw]">
            <div
              ref={modalCardRef}
              onClick={handleModalCardFlip}
              className={`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 ${
                getOrientationFromHTML(selectedItem.fullHTML, selectedItem.orientation) === 'portrait' 
                  ? 'w-full max-w-[300px] sm:max-w-[350px] aspect-[350/550]' 
                  : 'w-full max-w-[450px] sm:max-w-[550px] aspect-[550/348]'
              }`}
            >
              <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: selectedItem.fullHTML || '' }} />
            </div>

            {/* Action Buttons - stacked on mobile, row on desktop */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 w-full lg:w-auto justify-center animate-fade-in-up">
              <Button onClick={() => handleModalAction('customize')} variant="primary" size="md" icon={FiEdit2} className="w-full lg:w-auto">Customize</Button>
              {(currentCategory === 'drafts' || currentCategory === 'downloads') && (
                <Button onClick={() => handleModalAction('wishlist')} variant="warning" size="md" icon={FiStar} className="w-full lg:w-auto">Save</Button>
              )}
              <Button onClick={() => handleModalAction('download')} variant="success" size="md" icon={FiDownload} className="w-full lg:w-auto">Download</Button>
              <Button onClick={() => handleModalAction('delete')} variant="danger" size="md" icon={FiTrash2} className="w-full lg:w-auto">Delete</Button>
              <Button onClick={() => handleModalAction('close')} variant="secondary" size="md" icon={FiChevronLeft} className="w-full lg:w-auto">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs font-medium transition-all duration-300 z-[1100] shadow-lg ${
        showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
      } ${toastType === 'warning' ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} text-white`}>
        {toastMessage}
      </div>

      <style jsx global>{`
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
        
        .overflow-y-auto {
          scroll-behavior: smooth;
        }
        
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
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        
        @keyframes shimmer { 
          0% { background-position: -200% 0; } 
          100% { background-position: 200% 0; } 
        }
        
        .animate-shimmer { 
          animation: shimmer 1.5s ease-in-out infinite; 
        }
      `}</style>
    </div>
  );
}