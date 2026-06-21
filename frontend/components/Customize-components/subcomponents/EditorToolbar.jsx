// components/Customize-components/subcomponents/EditorToolbar.jsx

'use client';

import { 
  FiArrowLeft, 
  FiDownload, 
  FiRefreshCcw, 
  FiShare2, 
  FiSave,
  FiLayers,
  FiBox
} from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function EditorToolbar({
  // Navigation
  onBack,
  onFlip,
  onToggleDisplayMode,
  onToggleSidebar,
  
  // Download
  onDownload,
  showDownloadMenu,
  setShowDownloadMenu,
  isDownloading,
  
  // Share
  onShare,
  showShareMenu,
  setShowShareMenu,
  
  // Save
  onSave,
  
  // State
  displayMode,
  cardFlipped,
  isSidebarOpen,
  isDesktop = true,
  downloadMenuRef,
}) {
  return (
    <div className={`${isDesktop ? 'absolute left-5 top-5' : 'absolute top-2 right-2'} flex gap-2 z-30`}>
      {/* Back Button */}
      <button 
        onClick={onBack} 
        className={`${isDesktop ? 'w-11 h-11' : 'min-w-[44px] min-h-[44px] w-10 h-10'} bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center active:scale-95`}
        title="Go back"
      >
        <FiArrowLeft size={isDesktop ? 20 : 18} />
      </button>

      {/* Download Dropdown */}
      <div className="relative" ref={downloadMenuRef}>
        <button 
          onClick={() => setShowDownloadMenu(prev => !prev)} 
          disabled={isDownloading}
          className={`${isDesktop ? 'w-11 h-11' : 'min-w-[44px] min-h-[44px] w-10 h-10'} bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Download"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiDownload size={isDesktop ? 18 : 16} />
          )}
        </button>
        
        {showDownloadMenu && (
          <div className={`${isDesktop ? 'absolute top-14 right-0' : 'absolute top-12 right-0'} bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[100px]`}>
            <button 
              onClick={() => { onDownload('png'); setShowDownloadMenu(false); }} 
              className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors"
            >
              PNG
            </button>
            <button 
              onClick={() => { onDownload('jpg'); setShowDownloadMenu(false); }} 
              className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors"
            >
              JPG
            </button>
            <button 
              onClick={() => { onDownload('pdf'); setShowDownloadMenu(false); }} 
              className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 transition-colors"
            >
              PDF
            </button>
          </div>
        )}
      </div>

      {/* Share Dropdown */}
      {isDesktop && (
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(prev => !prev)}
            className="w-11 h-11 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center active:scale-95"
            title="Share"
          >
            <FiShare2 size={18} />
          </button>
          
          {showShareMenu && (
            <div className="absolute top-14 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[140px]">
              <button
                onClick={() => { onShare('copy'); setShowShareMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
              >
                🔗 Copy Link
              </button>
              <button
                onClick={() => { onShare('email'); setShowShareMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
              >
                📧 Share via Email
              </button>
              <button
                onClick={() => { onShare('social'); setShowShareMenu(false); }}
                className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
              >
                🌐 Share to Social
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      {isDesktop && (
        <button
          onClick={onSave}
          className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center active:scale-95"
          title="Save to Drafts"
        >
          <FiSave size={18} />
        </button>
      )}

      {/* Toggle Display Mode (Flip / Both Sides) */}
      {isDesktop && (
        <button 
          onClick={onToggleDisplayMode} 
          className={`w-11 h-11 border rounded-full shadow-lg transition-all duration-300 flex items-center justify-center active:scale-95 ${
            displayMode === 'both' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500' 
              : 'bg-white text-indigo-600 border-white/70 hover:bg-indigo-50'
          }`}
          title={displayMode === 'flip' ? 'Show both sides' : 'Show flip mode'}
        >
          {displayMode === 'flip' ? <FiLayers size={18} /> : <FiBox size={18} />}
        </button>
      )}

      {/* Flip Card Button (only in flip mode) */}
      {displayMode === 'flip' && (
        <button 
          onClick={onFlip} 
          className={`${isDesktop ? 'w-11 h-11' : 'min-w-[44px] min-h-[44px] w-10 h-10'} bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 text-indigo-600 flex items-center justify-center active:scale-95`}
          title="Flip card"
        >
          <motion.div animate={{ rotate: cardFlipped ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <FiRefreshCcw size={isDesktop ? 18 : 16} />
          </motion.div>
        </button>
      )}

      {/* Toggle Sidebar Button (desktop only) */}
      {isDesktop && (
        <button 
          onClick={onToggleSidebar} 
          className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center active:scale-95"
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? 
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg> : 
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          }
        </button>
      )}
    </div>
  );
}