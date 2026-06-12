// app/customize/components/DesktopLayout.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiDownload, FiLayers, FiBox, FiRefreshCcw, 
  FiChevronLeft, FiChevronRight, FiShare2, FiSave 
} from 'react-icons/fi';
import { CardEditorStage, CardContainer } from '@/components/Common/Card';
import EditorSidebar from './EditorSidebar';

const gridPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z'/%3E%3C/g%3E%3C/svg%3E")`;

export default function DesktopLayout({
  previewCanvasRef,
  cardScaleWrapRef,
  sidebarRef,
  downloadMenuRef,
  currentTemplate,
  currentOrientation,
  sidebarWidth,
  isSidebarOpen,
  displayMode,
  sidePreviewHtml,
  showDownloadMenu,
  cardFlipped,
  textFields,
  backgroundBlocks,
  detectedFeatures,
  selectedTheme,
  customPrimary,
  customSecondary,
  customAccent,
  customCardBg,
  uploadedImages,
  barcodeValue,
  qrValue,
  showShareMenu,
  setShowShareMenu,
  handleShare,
  onBack,
  onFlip,
  onToggleDisplayMode,
  onToggleSidebar,
  onResizeStart,
  onDownloadFormat,
  setShowDownloadMenu,
  onTextChange,
  onColorChange,
  onFontSizeChange,
  onFontFamilyChange,
  onToggleStyle,
  onResetTextField,
  onBackgroundModeChange,
  onSolidColorChange,
  onGradientChange,
  onBackgroundImageUpload,
  onRefreshBackgrounds,
  onApplyTheme,
  onCustomPrimaryChange,
  onCustomSecondaryChange,
  onCustomAccentChange,
  onCustomCardBgChange,
  onImageUpload,
  onImageRemove,
  onBarcodeValueChange,
  onQrValueChange,
  onApplyBarcode,
  onApplyQR,
  onSave,
  onReset,
  triggerUpdate,
  onEditorStageReady,
}) {
  const cardWidth = currentOrientation === 'portrait' ? '350px' : '550px';
  const showThemeSection = currentTemplate?.category === 'visiting';
  const showImageSection = detectedFeatures.hasProfile || detectedFeatures.hasSignature || detectedFeatures.hasLogo || detectedFeatures.hasBarcode || detectedFeatures.hasQR;

  return (
    <div className="hidden lg:flex flex-1 overflow-hidden">
      <div
        className="flex-1 flex items-center justify-center overflow-y-auto p-6 lg:p-10 relative transition-all duration-300"
        style={{ backgroundImage: gridPattern, backgroundColor: '#f8fafc' }}
      >
        {/* Action buttons */}
        <div className="absolute left-5 top-5 flex gap-2 z-30">
          <button onClick={onBack} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center">
            <FiArrowLeft size={20} />
          </button>

          {/* Download dropdown */}
          <div className="relative" ref={downloadMenuRef}>
            <button onClick={() => setShowDownloadMenu(prev => !prev)} className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              <FiDownload size={18} />
            </button>
            {showDownloadMenu && (
              <div className="absolute top-14 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[120px]">
                <button onClick={() => { onDownloadFormat('png'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2">PNG</button>
                <button onClick={() => { onDownloadFormat('jpg'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2">JPG</button>
                <button onClick={() => { onDownloadFormat('pdf'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2">PDF</button>
              </div>
            )}
          </div>

          {/* Share dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(prev => !prev)}
              className="w-11 h-11 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              title="Share"
            >
              <FiShare2 size={18} />
            </button>
            {showShareMenu && (
              <div className="absolute top-14 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[140px]">
                <button
                  onClick={() => { handleShare('copy'); setShowShareMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  🔗 Copy Link
                </button>
                <button
                  onClick={() => { handleShare('email'); setShowShareMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  📧 Share via Email
                </button>
                <button
                  onClick={() => { handleShare('social'); setShowShareMenu(false); }}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"
                >
                  🌐 Share to Social
                </button>
              </div>
            )}
          </div>

          {/* Save to Drafts button */}
          <button
            onClick={onSave}
            className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            title="Save to Drafts"
          >
            <FiSave size={18} />
          </button>

          <button onClick={onToggleDisplayMode} className={`w-11 h-11 border rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${displayMode === 'both' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500' : 'bg-white text-indigo-600 border-white/70 hover:bg-indigo-50'}`}>
            {displayMode === 'flip' ? <FiLayers size={18} /> : <FiBox size={18} />}
          </button>

          {displayMode === 'flip' && (
            <button onClick={onFlip} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 text-indigo-600 flex items-center justify-center">
              <motion.div animate={{ rotate: cardFlipped ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <FiRefreshCcw size={18} />
              </motion.div>
            </button>
          )}

          <button onClick={onToggleSidebar} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center">
            {isSidebarOpen ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>

        {/* Card display */}
        <AnimatePresence mode="wait">
          {displayMode === 'flip' ? (
            <motion.div key="single" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="w-full max-w-2xl">
              <div className="relative [perspective:1200px]">
                <div className="relative transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(2deg)] rounded-2xl shadow-2xl shadow-indigo-500/10">
                  <CardEditorStage orientation={currentOrientation} innerRef={previewCanvasRef} scaleWrapRef={cardScaleWrapRef} onReady={onEditorStageReady} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="both" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className={`flex ${currentOrientation === 'landscape' ? 'flex-col gap-6' : 'flex-row gap-6'} items-center justify-center max-w-full`}>
              <div style={{ width: cardWidth, maxWidth: '100%' }}>
                <div className="relative transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(2deg)] rounded-2xl shadow-2xl shadow-indigo-500/10">
                  <CardContainer orientation={currentOrientation} className="rounded-2xl overflow-hidden shadow-xl bg-white">
                    <div dangerouslySetInnerHTML={{ __html: sidePreviewHtml.front }} />
                  </CardContainer>
                </div>
              </div>
              <div style={{ width: cardWidth, maxWidth: '100%' }}>
                <div className="relative transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(-2deg)] rounded-2xl shadow-2xl shadow-indigo-500/10">
                  <CardContainer orientation={currentOrientation} className="rounded-2xl overflow-hidden shadow-xl bg-white">
                    <div dangerouslySetInnerHTML={{ __html: sidePreviewHtml.back }} />
                  </CardContainer>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Collapsible sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            key="desktop-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `min(${sidebarWidth}px, 100vw)`, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="h-full z-40 overflow-hidden"
            ref={sidebarRef}
          >
            <EditorSidebar
              currentTemplate={currentTemplate}
              currentOrientation={currentOrientation}
              textFields={textFields}
              onTextChange={onTextChange}
              onColorChange={onColorChange}
              onFontSizeChange={onFontSizeChange}
              onFontFamilyChange={onFontFamilyChange}
              onToggleTextFieldStyle={onToggleStyle}
              onResetTextField={onResetTextField}
              backgroundBlocks={backgroundBlocks}
              onBackgroundModeChange={onBackgroundModeChange}
              onSolidColorChange={onSolidColorChange}
              onGradientChange={onGradientChange}
              onBackgroundImageUpload={onBackgroundImageUpload}
              refreshBackgrounds={onRefreshBackgrounds}
              showThemeSection={showThemeSection}
              selectedTheme={selectedTheme}
              customPrimary={customPrimary}
              customSecondary={customSecondary}
              customAccent={customAccent}
              customCardBg={customCardBg}
              onApplyTheme={onApplyTheme}
              onCustomPrimaryChange={onCustomPrimaryChange}
              onCustomSecondaryChange={onCustomSecondaryChange}
              onCustomAccentChange={onCustomAccentChange}
              onCustomCardBgChange={onCustomCardBgChange}
              showImageSection={showImageSection}
              detectedFeatures={detectedFeatures}
              uploadedImages={uploadedImages}
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              barcodeValue={barcodeValue}
              qrValue={qrValue}
              onBarcodeValueChange={onBarcodeValueChange}
              onQrValueChange={onQrValueChange}
              onApplyBarcode={onApplyBarcode}
              onApplyQR={onApplyQR}
              onSave={onSave}
              onReset={onReset}
              sidebarRef={sidebarRef}
              sidebarWidth={sidebarWidth}
              onResizeStart={onResizeStart}
              isSidebarOpen={true}
              onToggleSidebar={onToggleSidebar}
              triggerUpdate={triggerUpdate}
              previewCanvasRef={previewCanvasRef}
              isMobileView={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}