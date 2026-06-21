// components/Layout/DesktopLayout.jsx
'use client';

import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiDownload, FiRefreshCcw,
  FiChevronLeft, FiChevronRight, FiShare2, FiSave
} from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';
import { CardEditorStage } from '@/components/Common/Card';
import EditorSidebar from '@/components/Customize-components/EditorSidebar';

const gridPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z'/%3E%3C/g%3E%3C/svg%3E")`;

export default function DesktopLayout() {
  const {
    previewCanvasRef,
    cardScaleWrapRef,
    downloadMenuRef,
    currentTemplate,
    currentOrientation,
    isSidebarOpen,
    showDownloadMenu,
    cardFlipped,
    showShareMenu,
    isLoading,
    handleBackNavigation,
    flipCard,
    toggleSidebar,
    setShowDownloadMenu,
    setShowShareMenu,
    handleShare,
    saveToDrafts,
    downloadCardBothSides,
    handleEditorStageReady,
  } = useEditor();

  if (isLoading) {
    return (
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading template...</p>
        </div>
      </div>
    );
  }

  if (!currentTemplate) {
    return (
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <p className="text-slate-500">No template selected. Please go back and choose a template.</p>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-1 overflow-hidden">
      <div
        className="flex-1 flex items-center justify-center overflow-y-auto p-6 lg:p-10 relative transition-all duration-300"
        style={{ backgroundImage: gridPattern, backgroundColor: '#f8fafc' }}
      >
        {/* Top toolbar – unchanged */}
        <div className="absolute left-5 top-5 flex gap-2 z-30">
          <button onClick={handleBackNavigation} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center">
            <FiArrowLeft size={20} />
          </button>

          <div className="relative" ref={downloadMenuRef}>
            <button onClick={() => setShowDownloadMenu(prev => !prev)} className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              <FiDownload size={18} />
            </button>
            {showDownloadMenu && (
              <div className="absolute top-14 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[120px]">
                <button onClick={() => { downloadCardBothSides('png'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50">PNG</button>
                <button onClick={() => { downloadCardBothSides('jpg'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50">JPG</button>
                <button onClick={() => { downloadCardBothSides('pdf'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50">PDF</button>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setShowShareMenu(prev => !prev)} className="w-11 h-11 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              <FiShare2 size={18} />
            </button>
            {showShareMenu && (
              <div className="absolute top-14 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[140px]">
                <button onClick={() => { handleShare('copy'); setShowShareMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50">🔗 Copy Link</button>
                <button onClick={() => { handleShare('email'); setShowShareMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50">📧 Share via Email</button>
                <button onClick={() => { handleShare('social'); setShowShareMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50">🌐 Share to Social</button>
              </div>
            )}
          </div>

          <button onClick={saveToDrafts} className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
            <FiSave size={18} />
          </button>

          <button
            onClick={flipCard}
            className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 text-indigo-600 flex items-center justify-center"
            title="Flip card"
          >
            <motion.div animate={{ rotate: cardFlipped ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <FiRefreshCcw size={18} />
            </motion.div>
          </button>

          <button onClick={toggleSidebar} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center">
            {isSidebarOpen ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>

        {/* Main card preview – unchanged */}
        <motion.div
          key="flip-mode"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          <div className="relative [perspective:1200px]">
            <div className="relative transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(2deg)] rounded-2xl shadow-2xl shadow-indigo-500/10">
              <CardEditorStage
                orientation={currentOrientation}
                innerRef={previewCanvasRef}
                scaleWrapRef={cardScaleWrapRef}
                onReady={handleEditorStageReady}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sidebar container – using viewport width with min/max constraints */}
      <div
        className="h-full z-40 flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          width: isSidebarOpen ? '40vw' : '0px',
        }}
      >
        <div
          className="h-full"
          style={{
            width: '40vw',
            minWidth: '500px',
            maxWidth: '800px',
          }}
        >
          <EditorSidebar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            isMobileView={false}
          />
        </div>
      </div>
    </div>
  );
}