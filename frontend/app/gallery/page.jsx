// app/gallery/page.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CardPreview, { CardGrid } from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import Pagination from '@/components/Common/Pagination';
import Modal from '@/components/Common/Modal';
import { FiDownload, FiStar, FiTrash2, FiEdit2, FiTrash } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateGridSkeleton } from '@/components/Common/Skeleton';

function GallerySkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4">
          <div className="h-7 bg-slate-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-2 lg:gap-3 justify-items-center items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full max-w-[360px] mx-auto aspect-[550/348] max-h-[240px] animate-pulse rounded-xl bg-gradient-to-r from-slate-200/50 via-slate-100/50 to-slate-200/50" />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-4">
          <div className="h-7 bg-slate-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-1.5 lg:gap-2 justify-items-center items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full max-w-[240px] mx-auto aspect-[350/550] max-h-[400px] animate-pulse rounded-xl bg-gradient-to-r from-slate-200/50 via-slate-100/50 to-slate-200/50" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState('wishlist');
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [totalItems, setTotalItems] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sliding pill state
  const [pillStyle, setPillStyle] = useState({ left: '0px', width: '0px' });
  const categoryBarRef = useRef(null);
  const categoryRefs = useRef({
    wishlist: null,
    drafts: null,
    downloads: null,
  });
  
  // Pagination states
  const [landscapePage, setLandscapePage] = useState(1);
  const [portraitPage, setPortraitPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Direction for horizontal slide animation
  const [categoryDirection, setCategoryDirection] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    setLandscapePage(1);
    setPortraitPage(1);
  }, [currentCategory]);

  // Update pill position when category changes
  useEffect(() => {
    if (!isClient) return;
    const updatePill = () => {
      const activeRef = categoryRefs.current[currentCategory];
      if (activeRef && categoryBarRef.current) {
        const parentRect = categoryBarRef.current.getBoundingClientRect();
        const btnRect = activeRef.getBoundingClientRect();
        setPillStyle({
          left: `${btnRect.left - parentRect.left}px`,
          width: `${btnRect.width}px`,
        });
      }
    };
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [currentCategory, isClient]);

  // Detect orientation from HTML content
  const getOrientationFromHTML = useCallback((html, itemOrientation) => {
    if (itemOrientation === 'portrait' || itemOrientation === 'landscape') {
      return itemOrientation;
    }
    
    if (!html) return 'landscape';
    const htmlStr = String(html).toLowerCase();
    
    if (
      htmlStr.includes('width: 350px') ||
      htmlStr.includes('width:350px') ||
      htmlStr.includes('350/550') ||
      htmlStr.includes('aspect-ratio:350/550') ||
      htmlStr.includes('height:550px') ||
      htmlStr.includes('height:500px')
    ) {
      return 'portrait';
    }
    
    if (
      htmlStr.includes('width: 550px') ||
      htmlStr.includes('width:550px') ||
      htmlStr.includes('550/348') ||
      htmlStr.includes('aspect-ratio:550/348') ||
      htmlStr.includes('height:348px')
    ) {
      return 'landscape';
    }
    
    if (htmlStr.includes('portrait')) {
      return 'portrait';
    }
    
    return 'landscape';
  }, []);

  const getStorageKey = (category) => `cardstudio_${category}`;

  const safeJsonArrayLength = (raw) => {
    if (!raw) return 0;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  const loadCategoryData = useCallback(() => {
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
  }, [currentCategory]);

  const updateStorageInfo = useCallback(() => {
    if (typeof window === 'undefined') return;
    const wishlist = safeJsonArrayLength(localStorage.getItem('cardstudio_wishlist'));
    const drafts = safeJsonArrayLength(localStorage.getItem('cardstudio_drafts'));
    const downloads = safeJsonArrayLength(localStorage.getItem('cardstudio_downloads'));
    setTotalItems(wishlist + drafts + downloads);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadCategoryData();
      updateStorageInfo();
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [currentCategory, isClient, loadCategoryData, updateStorageInfo]);

  const saveCategoryData = (items) => {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(currentCategory);
    localStorage.setItem(key, JSON.stringify(items));
    setGalleryItems(items);
    updateStorageInfo();
  };

  // Clear current category items
  const clearCurrentCategory = useCallback(() => {
    if (!confirm(`Are you sure you want to clear all items from ${currentCategory}? This action cannot be undone.`)) {
      return;
    }
    
    const key = getStorageKey(currentCategory);
    localStorage.setItem(key, JSON.stringify([]));
    setGalleryItems([]);
    updateStorageInfo();
    showToastMessage(`Cleared all ${currentCategory} items`, 'warning');
    
    // Reset pagination
    setLandscapePage(1);
    setPortraitPage(1);
  }, [currentCategory]);

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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
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

  // Separate items by orientation
  const landscapeItems = galleryItems.filter(item => 
    getOrientationFromHTML(item.fullHTML, item.orientation) === 'landscape'
  );
  const portraitItems = galleryItems.filter(item => 
    getOrientationFromHTML(item.fullHTML, item.orientation) === 'portrait'
  );

  // Paginated items
  const paginatedLandscapeItems = landscapeItems.slice(
    (landscapePage - 1) * ITEMS_PER_PAGE,
    landscapePage * ITEMS_PER_PAGE
  );
  const paginatedPortraitItems = portraitItems.slice(
    (portraitPage - 1) * ITEMS_PER_PAGE,
    portraitPage * ITEMS_PER_PAGE
  );

  const landscapeTotalPages = Math.ceil(landscapeItems.length / ITEMS_PER_PAGE);
  const portraitTotalPages = Math.ceil(portraitItems.length / ITEMS_PER_PAGE);

  const handleLandscapePageChange = (page) => {
    setLandscapePage(page);
    setTimeout(() => {
      const landscapeSection = document.getElementById('landscape-section');
      if (landscapeSection) {
        landscapeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePortraitPageChange = (page) => {
    setPortraitPage(page);
    setTimeout(() => {
      const portraitSection = document.getElementById('portrait-section');
      if (portraitSection) {
        portraitSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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
    if (newIndex > oldIndex) setCategoryDirection(1);
    else if (newIndex < oldIndex) setCategoryDirection(-1);
    else setCategoryDirection(0);
    setCurrentCategory(newCategory);
  };

  // Category items for the toggle
  const categoryItems = [
    { key: 'wishlist', icon: '⭐', label: 'Wishlist' },
    { key: 'drafts', icon: '✏️', label: 'Drafts' },
    { key: 'downloads', icon: '⬇️', label: 'Downloads' },
  ];

  // Get current category display name
  const getCurrentCategoryName = () => {
    const current = categoryItems.find(item => item.key === currentCategory);
    return current ? current.label : '';
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-slate-800 text-xl sm:text-2xl font-bold">
                  My Gallery
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Manage wishlist, drafts, and downloaded cards
                </p>
              </div>
              
              {/* Clear Button for current section */}
              {galleryItems.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={FiTrash}
                  onClick={clearCurrentCategory}
                  className="rounded-full shadow-sm"
                >
                  Clear {getCurrentCategoryName()}
                </Button>
              )}
            </div>

            {/* Category Toggle - Beautiful sliding pill style */}
            <div className="relative inline-flex" ref={categoryBarRef}>
              <div className="relative flex items-stretch gap-0 bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner">
                {/* Sliding Pill Background */}
                <div
                  className="absolute top-1 bottom-1 bg-white rounded-full shadow-md transition-all duration-300 ease-out"
                  style={{
                    left: pillStyle.left,
                    width: pillStyle.width,
                  }}
                />
                
                {categoryItems.map((item) => (
                  <button
                    key={item.key}
                    ref={(el) => {
                      categoryRefs.current[item.key] = el;
                    }}
                    onClick={() => handleCategoryChange(item.key)}
                    className={`relative z-10 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${
                      currentCategory === item.key
                        ? 'text-indigo-600'
                        : 'text-slate-500 hover:text-indigo-500'
                    }`}
                  >
                    <span className="text-sm sm:text-base mr-1">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
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
                <p className="text-slate-400 text-sm">Loading your gallery...</p>
              </div>
            </div>
          ) : isLoading ? (
            <GallerySkeleton />
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 md:py-24 animate-fade-in-up">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">No items yet</h3>
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
                <div className="max-w-[1400px] mx-auto space-y-10">
                  {/* Landscape Cards Section */}
                  {landscapeItems.length > 0 && (
                    <div id="landscape-section">
                      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                          <span>🌄</span> Landscape Cards
                          <span className="text-xs font-normal text-slate-400">
                            ({landscapeItems.length} {landscapeItems.length === 1 ? 'card' : 'cards'})
                          </span>
                        </h3>
                        {landscapeTotalPages > 1 && (
                          <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">
                            Page {landscapePage} of {landscapeTotalPages}
                          </span>
                        )}
                      </div>
                      
                      <CardGrid orientation="landscape">
                        {paginatedLandscapeItems.map(item => (
                          <div 
                            key={item.id} 
                            onClick={(e) => handleCardClick(e, item)} 
                            className="group relative flex cursor-pointer flex-col items-center overflow-visible transition-all duration-300 hover:-translate-y-2 w-full"
                          >
                            {/* Edit and Delete buttons */}
                            <div className="absolute -top-2 right-2 flex gap-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 opacity-100">
                              <Button
                                variant="primary"
                                size="xs"
                                icon={FiEdit2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  customizeItem(item.id);
                                }}
                                className="!w-8 !h-8 !p-0 rounded-full shadow-lg"
                                ariaLabel="Edit card"
                              />
                              <Button
                                variant="danger"
                                size="xs"
                                icon={FiTrash2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="!w-8 !h-8 !p-0 rounded-full shadow-lg"
                                ariaLabel="Delete card"
                              />
                            </div>
                            <CardPreview 
                              html={item.fullHTML} 
                              orientation="landscape" 
                              className="w-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10" 
                            />
                            <p className="mt-3 text-xs font-medium text-slate-700 md:hidden truncate max-w-[200px]">
                              {item.name || 'Untitled Card'}
                            </p>
                          </div>
                        ))}
                      </CardGrid>
                      
                      {landscapeTotalPages > 1 && (
                        <Pagination
                          currentPage={landscapePage}
                          totalPages={landscapeTotalPages}
                          onPageChange={handleLandscapePageChange}
                          siblingCount={1}
                          showFirstLast={true}
                          className="mt-6"
                        />
                      )}
                    </div>
                  )}

                  {/* Portrait Cards Section */}
                  {portraitItems.length > 0 && (
                    <div id="portrait-section">
                      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                          <span>📱</span> Portrait Cards
                          <span className="text-xs font-normal text-slate-400">
                            ({portraitItems.length} {portraitItems.length === 1 ? 'card' : 'cards'})
                          </span>
                        </h3>
                        {portraitTotalPages > 1 && (
                          <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">
                            Page {portraitPage} of {portraitTotalPages}
                          </span>
                        )}
                      </div>
                      
                      <CardGrid orientation="portrait">
                        {paginatedPortraitItems.map(item => (
                          <div 
                            key={item.id} 
                            onClick={(e) => handleCardClick(e, item)} 
                            className="group relative flex cursor-pointer flex-col items-center overflow-visible transition-all duration-300 hover:-translate-y-2 w-full"
                          >
                            {/* Edit and Delete buttons */}
                            <div className="absolute -top-2 right-2 flex gap-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 opacity-100">
                              <Button
                                variant="primary"
                                size="xs"
                                icon={FiEdit2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  customizeItem(item.id);
                                }}
                                className="!w-8 !h-8 !p-0 rounded-full shadow-lg"
                                ariaLabel="Edit card"
                              />
                              <Button
                                variant="danger"
                                size="xs"
                                icon={FiTrash2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="!w-8 !h-8 !p-0 rounded-full shadow-lg"
                                ariaLabel="Delete card"
                              />
                            </div>
                            <CardPreview 
                              html={item.fullHTML} 
                              orientation="portrait" 
                              className="w-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10" 
                            />
                            <p className="mt-3 text-xs font-medium text-slate-700 md:hidden truncate max-w-[200px]">
                              {item.name || 'Untitled Card'}
                            </p>
                          </div>
                        ))}
                      </CardGrid>
                      
                      {portraitTotalPages > 1 && (
                        <Pagination
                          currentPage={portraitPage}
                          totalPages={portraitTotalPages}
                          onPageChange={handlePortraitPageChange}
                          siblingCount={1}
                          showFirstLast={true}
                          className="mt-6"
                        />
                      )}
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

      {/* Modal - Using reusable Modal component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        htmlContent={selectedItem?.fullHTML}
        orientation={getOrientationFromHTML(selectedItem?.fullHTML, selectedItem?.orientation)}
        onWishlist={moveToWishlist}
        onCustomize={() => {
          if (selectedItem) {
            localStorage.setItem('selectedTemplateForCustomize', JSON.stringify(selectedItem));
            router.push('/customize');
          }
        }}
        onDownload={downloadSelectedItem}
        showWishlist={currentCategory !== 'wishlist'}
        showCustomize={true}
        showDownload={true}
        title="Card Preview"
      />

      {/* Toast Notification */}
      <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs font-medium transition-all duration-300 z-[1100] shadow-lg ${
        showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'
      } ${toastType === 'warning' ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} text-white`}>
        {toastMessage}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
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

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}