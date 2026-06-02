'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CardPreview from '@/components/Common/CardPreview';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';

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
  const modalCardRef = useRef(null); 

  useEffect(() => {
    setIsClient(true);
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

        // Combine both sides into a single canvas
        const combinedCanvas = document.createElement('canvas');
        const combinedCtx = combinedCanvas.getContext('2d');
        
        // Set combined canvas dimensions (stack vertically)
        combinedCanvas.width = frontCanvas.width;
        combinedCanvas.height = frontCanvas.height + backCanvas.height;
        
        // Draw front on top
        combinedCtx.drawImage(frontCanvas, 0, 0);
        
        // Draw back below front
        combinedCtx.drawImage(backCanvas, 0, frontCanvas.height);
        
        // Download combined image
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
      localStorage.setItem('cardstudio_downloads', JSON.stringify(downloads));
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
    <div className="min-h-screen bg-slate-50 font-['Inter'] overflow-x-hidden">
      <div className="md:hidden fixed top-20 left-4 z-50">
        <button onClick={toggleSidebar} className="bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition-colors">
          <FiMenu size={20} />
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className={`fixed md:relative top-0 left-0 h-full w-[280px] max-w-[85vw] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="md:hidden absolute right-3 top-3">
            <button onClick={toggleSidebar} className="p-2 bg-slate-100 rounded-full">
              <FiX size={20} />
            </button>
          </div>
          <div className="p-5 border-b">
            <h2 className="font-bold text-lg text-slate-800">My Gallery</h2>
            <p className="text-xs text-slate-400 mt-1">Manage your saved designs</p>
          </div>
          <nav className="flex-1 py-4 px-3">
            {['wishlist', 'drafts', 'downloads'].map(key => (
              <div
                key={key}
                onClick={() => {
                  setCurrentCategory(key);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`cursor-pointer transition-all rounded-xl py-3 px-4 mb-2 flex items-center gap-2.5 text-sm sm:text-base ${currentCategory === key ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <span>{key === 'wishlist' ? '⭐ Wishlist' : key === 'drafts' ? '✏️ Drafts' : '⬇️ Downloads'}</span>
              </div>
            ))}
          </nav>
          
        </aside>

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggleSidebar} />}

        <div className="flex-1 overflow-y-auto bg-slate-100/40 p-4 sm:p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{categoryTitles[currentCategory]}</h1>
            <p className="text-slate-500 text-sm mt-1">{categoryDescriptions[currentCategory]}</p>
          </div>

          {!isClient ? (
            <div className="text-center py-16 text-slate-400">Loading...</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400">✨ No items in {currentCategory}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8 items-start">
              {galleryItems.map(item => {
                const orientation = item.orientation || getOrientationFromHTML(item.fullHTML);
                return (
                  <div key={item.id} onClick={(e) => handleCardClick(e, item)} className="group relative flex cursor-pointer flex-col items-center overflow-visible transition-transform duration-300 hover:-translate-y-2">
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button data-action="edit" data-id={item.id} className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors text-sm">✏️</button>
                      <button data-action="delete" data-id={item.id} className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors text-sm">🗑️</button>
                    </div>
                    <CardPreview html={item.fullHTML} orientation={orientation} className="w-full max-w-[280px] sm:max-w-none transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal with reliable flip */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[2000] p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full max-w-[90vw]">
            <div
              ref={modalCardRef}
              onClick={handleModalCardFlip}
              className={`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ${(selectedItem.orientation || getOrientationFromHTML(selectedItem.fullHTML)) === 'portrait' ? 'w-full max-w-[350px] aspect-[350/550]' : 'w-full max-w-[550px] aspect-[550/348]'}`}
            >
              <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: selectedItem.fullHTML || '' }} />
            </div>
            <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto justify-center">
              <button onClick={() => handleModalAction('customize')} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold bg-indigo-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm md:text-base">✏️ Customize</button>
              {(currentCategory === 'drafts' || currentCategory === 'downloads') && (
                <button onClick={() => handleModalAction('wishlist')} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold bg-amber-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm md:text-base">⭐ Wishlist</button>
              )}
              <button onClick={() => handleModalAction('download')} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold bg-emerald-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm md:text-base flex items-center justify-center gap-2"><FiDownload /> Download</button>
              <button onClick={() => handleModalAction('delete')} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold bg-red-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm md:text-base">🗑️ Delete</button>
              <button onClick={() => handleModalAction('close')} className="px-5 py-2.5 md:px-6 md:py-3.5 rounded-full font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm md:text-base">✕ Close</button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 z-[1100] ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'} ${toastType === 'warning' ? 'bg-amber-500' : 'bg-green-500'} text-white`}>
        {toastMessage}
      </div>

      <style jsx global>{`
        .flip-card { width: 100%; height: 100%; perspective: 1800px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transition: transform 0.65s; transform-style: preserve-3d; }
        .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
        .card-front, .card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 20px; overflow: hidden; }
        .card-back { transform: rotateY(180deg); }
        @media (max-width: 320px) { .grid { gap: 1rem; } }
        @media (max-width: 480px) and (orientation: portrait) { button { min-height: 44px; } }
      `}</style>
    </div>
  );
}
