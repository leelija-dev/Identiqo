// app/customize/page.jsx
'use client';

import { FiLoader, FiCheckCircle } from 'react-icons/fi';
import { useCustomizePage } from './hooks/useCustomizePage';
import DesktopLayout from '@/components/CustomizeLayout/DesktopLayout';
import MobileLayout from '@/components/CustomizeLayout/MobileLayout';

export default function CustomizePage() {
  const {
    previewCanvasRef,
    cardScaleWrapRef,
    sidebarRef,
    downloadMenuRef,
    currentTemplate,
    currentOrientation,
    isLoading,
    sidebarWidth,
    barcodeValue, setBarcodeValue,
    qrValue, setQrValue,
    isSidebarOpen,
    displayMode,
    sidePreviewHtml,
    isDesktopLayout,
    showDownloadMenu, setShowDownloadMenu,
    cardFlipped,
    showToast,
    toastMessage,
    textFields,
    backgroundBlocks,
    detectedFeatures,
    selectedTheme,
    customPrimary,
    customSecondary,
    customAccent,
    customCardBg,
    uploadedImages,
    handleBackNavigation,
    flipCard,
    handleTextChange,
    handleColorChange,
    handleFontSizeChange,
    handleFontFamilyChange,
    toggleTextFieldStyle,
    resetTextField,
    setBackgroundMode,
    setSolidColor,
    setGradient,
    uploadBackgroundImage,
    refreshBackgrounds,
    applyTheme,
    uploadImage,
    removeImage,
    applyBarcode,
    applyQRCode,
    downloadCardBothSides,
    saveToDrafts,
    resetAll,
    toggleSidebar,
    toggleDisplayMode,
    handleResizeStart,
    handleEditorStageReady,
    triggerUpdate,
    setCustomPrimary,
    setCustomSecondary,
    setCustomAccent,
    setCustomCardBg,
    setSelectedTheme,
    // Share props
    showShareMenu,
    setShowShareMenu,
    handleShare,
  } = useCustomizePage();

  const createCustomThemeHandler = (setter, cssVar) => (value) => {
    setter(value);
    setSelectedTheme('Custom');
    previewCanvasRef.current?.style.setProperty(cssVar, value);
    triggerUpdate();
  };

  const handleCustomPrimaryChange = createCustomThemeHandler(setCustomPrimary, '--primary');
  const handleCustomSecondaryChange = createCustomThemeHandler(setCustomSecondary, '--secondary');
  const handleCustomAccentChange = createCustomThemeHandler(setCustomAccent, '--accent');
  const handleCustomCardBgChange = createCustomThemeHandler(setCustomCardBg, '--card-bg');

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50/50 via-white to-purple-50/50">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center animate-fade-in-up">
          <FiLoader className="animate-spin text-indigo-500 text-4xl mx-auto mb-4" />
          <h2 className="text-h3-sm font-semibold text-slate-800 mb-2">Loading your card...</h2>
          <p className="text-p-xs text-slate-500">Please wait while we prepare the editor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-['Inter'] overflow-hidden">
      {isDesktopLayout ? (
        <DesktopLayout
          previewCanvasRef={previewCanvasRef}
          cardScaleWrapRef={cardScaleWrapRef}
          sidebarRef={sidebarRef}
          downloadMenuRef={downloadMenuRef}
          currentTemplate={currentTemplate}
          currentOrientation={currentOrientation}
          sidebarWidth={sidebarWidth}
          isSidebarOpen={isSidebarOpen}
          displayMode={displayMode}
          sidePreviewHtml={sidePreviewHtml}
          showDownloadMenu={showDownloadMenu}
          cardFlipped={cardFlipped}
          textFields={textFields}
          backgroundBlocks={backgroundBlocks}
          detectedFeatures={detectedFeatures}
          selectedTheme={selectedTheme}
          customPrimary={customPrimary}
          customSecondary={customSecondary}
          customAccent={customAccent}
          customCardBg={customCardBg}
          uploadedImages={uploadedImages}
          barcodeValue={barcodeValue}
          qrValue={qrValue}
          onBack={handleBackNavigation}
          onFlip={flipCard}
          onToggleDisplayMode={toggleDisplayMode}
          onToggleSidebar={toggleSidebar}
          onResizeStart={handleResizeStart}
          onDownloadFormat={downloadCardBothSides}
          setShowDownloadMenu={setShowDownloadMenu}
          onTextChange={handleTextChange}
          onColorChange={handleColorChange}
          onFontSizeChange={handleFontSizeChange}
          onFontFamilyChange={handleFontFamilyChange}
          onToggleStyle={toggleTextFieldStyle}
          onResetTextField={resetTextField}
          onBackgroundModeChange={setBackgroundMode}
          onSolidColorChange={setSolidColor}
          onGradientChange={setGradient}
          onBackgroundImageUpload={uploadBackgroundImage}
          onRefreshBackgrounds={refreshBackgrounds}
          onApplyTheme={applyTheme}
          onCustomPrimaryChange={handleCustomPrimaryChange}
          onCustomSecondaryChange={handleCustomSecondaryChange}
          onCustomAccentChange={handleCustomAccentChange}
          onCustomCardBgChange={handleCustomCardBgChange}
          onImageUpload={uploadImage}
          onImageRemove={removeImage}
          onBarcodeValueChange={setBarcodeValue}
          onQrValueChange={setQrValue}
          onApplyBarcode={applyBarcode}
          onApplyQR={applyQRCode}
          onSave={saveToDrafts}
          onReset={resetAll}
          triggerUpdate={triggerUpdate}
          onEditorStageReady={handleEditorStageReady}
          // Share props
          showShareMenu={showShareMenu}
          setShowShareMenu={setShowShareMenu}
          handleShare={handleShare}
        />
      ) : (
        <MobileLayout
          previewCanvasRef={previewCanvasRef}
          cardScaleWrapRef={cardScaleWrapRef}
          currentTemplate={currentTemplate}
          currentOrientation={currentOrientation}
          barcodeValue={barcodeValue}
          qrValue={qrValue}
          textFields={textFields}
          backgroundBlocks={backgroundBlocks}
          detectedFeatures={detectedFeatures}
          selectedTheme={selectedTheme}
          customPrimary={customPrimary}
          customSecondary={customSecondary}
          customAccent={customAccent}
          customCardBg={customCardBg}
          uploadedImages={uploadedImages}
          onBack={handleBackNavigation}
          onFlip={flipCard}
          onDownloadFormat={downloadCardBothSides}
          onTextChange={handleTextChange}
          onColorChange={handleColorChange}
          onFontSizeChange={handleFontSizeChange}
          onFontFamilyChange={handleFontFamilyChange}
          onToggleStyle={toggleTextFieldStyle}
          onResetTextField={resetTextField}
          onBackgroundModeChange={setBackgroundMode}
          onSolidColorChange={setSolidColor}
          onGradientChange={setGradient}
          onBackgroundImageUpload={uploadBackgroundImage}
          onRefreshBackgrounds={refreshBackgrounds}
          onApplyTheme={applyTheme}
          onCustomPrimaryChange={handleCustomPrimaryChange}
          onCustomSecondaryChange={handleCustomSecondaryChange}
          onCustomAccentChange={handleCustomAccentChange}
          onCustomCardBgChange={handleCustomCardBgChange}
          onImageUpload={uploadImage}
          onImageRemove={removeImage}
          onBarcodeValueChange={setBarcodeValue}
          onQrValueChange={setQrValue}
          onApplyBarcode={applyBarcode}
          onApplyQR={applyQRCode}
          onSave={saveToDrafts}
          onReset={resetAll}
          triggerUpdate={triggerUpdate}
          onEditorStageReady={handleEditorStageReady}
        />
      )}

      {/* Toast */}
      <div className={`fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 z-[1100] pointer-events-none flex items-center gap-2 text-sm shadow-lg ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'}`}>
        <FiCheckCircle size={14} /> {toastMessage}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .card-editor-canvas .flip-card { width: 100%; height: 100%; border-radius: 20px; overflow: hidden; }
        .flip-card { width: 100%; height: 100%; perspective: 1800px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1); }
        .card-front, .card-back, .face.front, .face.back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; overflow: hidden; display: block !important; }
        .card-back, .face.back { transform: rotateY(180deg); }
        .qr-placeholder { max-width: 70px !important; max-height: 70px !important; width: auto !important; height: auto !important; margin: 0 auto !important; overflow: hidden !important; }
        .qr-placeholder canvas, .qr-placeholder img { width: 100% !important; height: 100% !important; object-fit: contain !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
