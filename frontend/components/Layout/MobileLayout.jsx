// components/Layout/MobileLayout.jsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiDownload, FiRefreshCcw } from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';
import { CardEditorStage } from '@/components/Common/Card';
import EditorSidebar from '@/components/Customize-components/EditorSidebar';

export default function MobileLayout() {
  const {
    // Refs
    previewCanvasRef,
    cardScaleWrapRef,
    
    // State
    currentOrientation,
    isLoading,
    
    // Handlers
    handleBackNavigation,
    flipCard,
    downloadCardBothSides,
    handleEditorStageReady,
  } = useEditor();

  const [showMobileDownloadMenu, setShowMobileDownloadMenu] = useState(false);
  const mobileDownloadRef = useRef(null);

  useEffect(() => {
    if (!showMobileDownloadMenu) return;
    const handleClick = (e) => {
      if (mobileDownloadRef.current && !mobileDownloadRef.current.contains(e.target)) {
        setShowMobileDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMobileDownloadMenu]);

  if (isLoading) {
    return (
      <div className="lg:hidden flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden flex flex-col h-full max-h-full overflow-hidden relative">
      {/* Card preview */}
      <div className={`flex-shrink-0 bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 flex items-start sm:items-center justify-center p-3 relative overflow-y-auto overscroll-contain ${
        currentOrientation === 'portrait' ? 'h-[55vh] min-h-[400px]' : 'h-[42vh] min-h-[260px] sm:min-h-[300px]'
      }`}>
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-2 z-30">
          <button 
            onClick={handleBackNavigation} 
            className="min-w-[44px] min-h-[44px] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
            title="Go back"
          >
            <FiArrowLeft size={18} />
          </button>
          
          <div className="relative" ref={mobileDownloadRef}>
            <button 
              onClick={() => setShowMobileDownloadMenu(prev => !prev)} 
              className="min-w-[44px] min-h-[44px] w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
              title="Download"
            >
              <FiDownload size={18} />
            </button>
            {showMobileDownloadMenu && (
              <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[100px]">
                <button 
                  onClick={() => { downloadCardBothSides('png'); setShowMobileDownloadMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50"
                >
                  PNG
                </button>
                <button 
                  onClick={() => { downloadCardBothSides('jpg'); setShowMobileDownloadMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50"
                >
                  JPG
                </button>
                <button 
                  onClick={() => { downloadCardBothSides('pdf'); setShowMobileDownloadMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50"
                >
                  PDF
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={flipCard} 
            className="min-w-[44px] min-h-[44px] w-10 h-10 bg-white rounded-full shadow-lg text-indigo-600 flex items-center justify-center active:scale-95 transition-transform"
            title="Flip card"
          >
            <FiRefreshCcw size={18} />
          </button>
        </div>

        {/* Card canvas */}
        <div className={`w-full mx-auto py-2 flex items-start sm:items-center justify-center ${
          currentOrientation === 'portrait' ? 'max-w-[280px]' : 'max-w-xs sm:max-w-sm'
        }`}>
          <CardEditorStage 
            orientation={currentOrientation} 
            innerRef={previewCanvasRef} 
            scaleWrapRef={cardScaleWrapRef} 
            onReady={handleEditorStageReady} 
          />
        </div>
      </div>

      {/* Bottom sheet editor */}
      <div className="z-30 bg-white rounded-t-2xl shadow-2xl flex flex-col" style={{ maxHeight: '60vh' }}>
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
          <EditorSidebar 
            isMobileView={true}
            isSidebarOpen={true}
            onToggleSidebar={() => {}}
            sidebarRef={null}
            sidebarWidth={600}
            onResizeStart={() => {}}
          />
        </div>
      </div>
    </div>
  );
}