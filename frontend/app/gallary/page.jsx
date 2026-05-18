'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
  const [currentCategory, setCurrentCategory] = useState('wishlist');
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [totalItems, setTotalItems] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mount (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load items when category changes
  useEffect(() => {
    if (isClient) {
      loadCategoryData();
      updateStorageInfo();
    }
  }, [currentCategory, isClient]);

  const getStorageKey = (category) => `cardstudio_${category}`;

  const loadCategoryData = () => {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(currentCategory);
    const data = localStorage.getItem(key);
    setGalleryItems(data ? JSON.parse(data) : []);
  };

  const saveCategoryData = (items) => {
    if (typeof window === 'undefined') return;
    const key = getStorageKey(currentCategory);
    localStorage.setItem(key, JSON.stringify(items));
    setGalleryItems(items);
    updateStorageInfo();
  };

  const updateStorageInfo = () => {
    if (typeof window === 'undefined') return;
    const wishlist = JSON.parse(localStorage.getItem('cardstudio_wishlist') || '[]').length;
    const drafts = JSON.parse(localStorage.getItem('cardstudio_drafts') || '[]').length;
    const downloads = JSON.parse(localStorage.getItem('cardstudio_downloads') || '[]').length;
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
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const customizeItem = (id) => {
    if (typeof window === 'undefined') return;
    const item = galleryItems.find(i => i.id == id);
    if (item) {
      localStorage.setItem('selectedTemplateForCustomize', JSON.stringify(item));
      window.location.href = '/customize';
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
    const wishlist = JSON.parse(localStorage.getItem('cardstudio_wishlist') || '[]');
    
    if (!wishlist.some(i => i.id === selectedItem.id)) {
      wishlist.push(selectedItem);
      localStorage.setItem('cardstudio_wishlist', JSON.stringify(wishlist));
      
      if (currentCategory === 'drafts' || currentCategory === 'downloads') {
        const key = getStorageKey(currentCategory);
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        localStorage.setItem(key, JSON.stringify(items.filter(i => i.id !== selectedItem.id)));
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
      window.location.href = '/customize';
    } else if (action === 'delete' && selectedItem) {
      removeItem(selectedItem.id);
    } else if (action === 'wishlist') {
      moveToWishlist();
    } else if (action === 'close') {
      closeModal();
    }
  };

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
    <div className="min-h-screen bg-slate-50 font-['Inter']">
     

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-72px)]">
        {/* Sidebar */}
        <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-5 border-b">
            <h2 className="font-bold text-lg text-slate-800">My Gallery</h2>
            <p className="text-xs text-slate-400 mt-1">Manage your saved designs</p>
          </div>
          
          <nav className="flex-1 py-4 px-3">
            {[
              { key: 'wishlist', label: '⭐ Wishlist' },
              { key: 'drafts', label: '✏️ Drafts' },
              { key: 'downloads', label: '⬇️ Downloads' }
            ].map(item => (
              <div
                key={item.key}
                onClick={() => setCurrentCategory(item.key)}
                className={`cursor-pointer transition-all rounded-xl py-3 px-4 mb-2 flex items-center gap-2.5
                  ${currentCategory === item.key 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                    : 'hover:bg-slate-50 text-slate-600'
                  }`}
              >
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
          
          <div className="p-4 border-t">
            <div className="bg-indigo-50 rounded-xl p-3 text-center">
              <p className="text-xs text-indigo-600 font-semibold">
                {totalItems} item{totalItems !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
        </aside>

        {/* Gallery Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100/40 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{categoryTitles[currentCategory]}</h1>
            <p className="text-slate-500 text-sm mt-1">{categoryDescriptions[currentCategory]}</p>
          </div>

          {/* Gallery Grid */}
          {!isClient ? (
            <div className="text-center py-16 text-slate-400">Loading...</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              ✨ No items in {currentCategory}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-8 items-start">
              {galleryItems.map(item => {
                const orientation = item.orientation || getOrientationFromHTML(item.fullHTML);
                
                return (
                  <div
                    key={item.id}
                    onClick={(e) => handleCardClick(e, item)}
                    className="cursor-pointer transition-transform duration-300 hover:-translate-y-2 flex flex-col items-center relative group"
                  >
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        data-action="edit"
                        data-id={item.id}
                        className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
                        title="Customize"
                      >
                        ✏️
                      </button>
                      <button
                        data-action="delete"
                        data-id={item.id}
                        className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* Card Preview */}
                    <div className={`w-full flex justify-center items-center rounded-[18px] overflow-hidden bg-transparent transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/10
                      ${orientation === 'landscape' 
                        ? 'aspect-[550/348]' 
                        : 'aspect-[290/550] max-w-[290px] mx-auto'
                      }`}
                    >
                      <div 
                        className={orientation === 'landscape' 
                          ? 'w-[550px] h-[348px] scale-[0.76] origin-center relative rounded-[20px] overflow-hidden -m-10'
                          : 'scale-[0.85] origin-top -m-5 w-[290px] h-[550px] relative rounded-3xl overflow-hidden'
                        }
                        dangerouslySetInnerHTML={{ __html: item.fullHTML }}
                      />
                    </div>

                    {/* Card Info */}
                    <div className="mt-5 text-center">
                      <p className="text-slate-500 text-sm">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Saved'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showModal && selectedItem && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[2000]"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="flex gap-8 items-center flex-wrap justify-center p-6">
            {/* Modal Card */}
            <div className={`rounded-[20px] overflow-hidden shadow-2xl shadow-black/50
              ${selectedItem.orientation === 'portrait' ? 'w-[350px] h-[550px]' : 'w-[550px] h-[348px]'}
            `}>
              <div 
                dangerouslySetInnerHTML={{ __html: selectedItem.fullHTML }}
                onClick={(e) => {
                  e.stopPropagation();
                  const flipCard = e.currentTarget.querySelector('.flip-card');
                  if (flipCard) flipCard.classList.toggle('flipped');
                }}
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              <button onClick={() => handleModalAction('customize')} className="px-6 py-3.5 rounded-full font-semibold bg-indigo-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">
                ✏️ Customize
              </button>
              
              {(currentCategory === 'drafts' || currentCategory === 'downloads') && (
                <button onClick={() => handleModalAction('wishlist')} className="px-6 py-3.5 rounded-full font-semibold bg-amber-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">
                  ⭐ Move to Wishlist
                </button>
              )}
              
              <button onClick={() => handleModalAction('delete')} className="px-6 py-3.5 rounded-full font-semibold bg-red-500 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all">
                🗑️ Delete
              </button>
              
              <button onClick={() => handleModalAction('close')} className="px-6 py-3.5 rounded-full font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 z-[1100]
        ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'}
        ${toastType === 'warning' ? 'bg-amber-500' : 'bg-green-500'} text-white`}
      >
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
          transition: transform 0.65s;
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
      `}</style>
    </div>
  );
}