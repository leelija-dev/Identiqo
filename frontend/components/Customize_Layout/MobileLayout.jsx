// components/Customize_Layout/MobileLayout.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FiArrowLeft, FiDownload, FiRefreshCcw } from 'react-icons/fi';
import { CardEditorStage } from '@/components/Common/Card';
import { EditorSidebar } from './EditorSidebar';

export function MobileLayout({
  currentOrientation, currentTemplate,
  previewCanvasRef, cardScaleWrapRef, onEditorStageReady,
  onBack, onDownloadFormat, onFlip,
  textFields, backgroundBlocks, showThemeSection, showImageSection,
  detectedFeatures, uploadedImages, selectedTheme,
  customPrimary, customSecondary, customAccent, customCardBg,
  barcodeValue, qrValue,
  onTextChange, onColorChange, onFontSizeChange, onFontFamilyChange,
  onToggleTextFieldStyle, onResetTextField,
  onBackgroundModeChange, onSolidColorChange, onGradientChange,
  onBackgroundImageUpload, refreshBackgrounds,
  onApplyTheme, onCustomPrimaryChange, onCustomSecondaryChange,
  onCustomAccentChange, onCustomCardBgChange,
  onImageUpload, onImageRemove,
  onBarcodeValueChange, onQrValueChange, onApplyBarcode, onApplyQR,
  onSave, onReset, triggerUpdate,
}) {
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

  return (
    <div className="lg:hidden flex flex-col h-full max-h-full overflow-hidden relative">
      <div className={`flex-shrink-0 bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 flex items-start sm:items-center justify-center p-3 relative overflow-y-auto overscroll-contain ${currentOrientation === 'portrait' ? 'h-[55vh] min-h-[400px]' : 'h-[42vh] min-h-[260px] sm:min-h-[300px]'}`}>
        <div className="absolute top-2 right-2 flex gap-2 z-30">
          <button onClick={onBack} className="min-w-[44px] min-h-[44px] w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center" title="Back"><FiArrowLeft size={14} /></button>
          <div className="relative" ref={mobileDownloadRef}>
            <button onClick={() => setShowMobileDownloadMenu(prev => !prev)} className="min-w-[44px] min-h-[44px] w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg flex items-center justify-center" title="Download"><FiDownload size={14} /></button>
            {showMobileDownloadMenu && (
              <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[100px]">
                <button onClick={() => { onDownloadFormat('png'); setShowMobileDownloadMenu(false); }} className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-slate-50">PNG</button>
                <button onClick={() => { onDownloadFormat('jpg'); setShowMobileDownloadMenu(false); }} className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-slate-50">JPG</button>
                <button onClick={() => { onDownloadFormat('pdf'); setShowMobileDownloadMenu(false); }} className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-slate-50">PDF</button>
              </div>
            )}
          </div>
          <button onClick={onFlip} className="min-w-[44px] min-h-[44px] w-8 h-8 bg-white rounded-full shadow-lg text-indigo-600 flex items-center justify-center" title="Flip"><FiRefreshCcw size={14} /></button>
        </div>
        <div className={`w-full mx-auto py-2 flex items-start sm:items-center justify-center ${currentOrientation === 'portrait' ? 'max-w-[280px]' : 'max-w-xs sm:max-w-sm'}`}>
          <CardEditorStage orientation={currentOrientation} innerRef={previewCanvasRef} scaleWrapRef={cardScaleWrapRef} onReady={onEditorStageReady} />
        </div>
      </div>
      <div className="z-30 bg-white rounded-t-2xl shadow-2xl flex flex-col" style={{ maxHeight: '60vh' }}>
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0"><div className="w-10 h-1 bg-slate-300 rounded-full" /></div>
        <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
          <EditorSidebar
            currentTemplate={currentTemplate}
            currentOrientation={currentOrientation}
            textFields={textFields}
            onTextChange={onTextChange}
            onColorChange={onColorChange}
            onFontSizeChange={onFontSizeChange}
            onFontFamilyChange={onFontFamilyChange}
            onToggleTextFieldStyle={onToggleTextFieldStyle}
            onResetTextField={onResetTextField}
            onTextFieldClick={null}
            backgroundBlocks={backgroundBlocks}
            onBackgroundModeChange={onBackgroundModeChange}
            onSolidColorChange={onSolidColorChange}
            onGradientChange={onGradientChange}
            onBackgroundImageUpload={onBackgroundImageUpload}
            refreshBackgrounds={refreshBackgrounds}
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
            triggerUpdate={triggerUpdate}
            previewCanvasRef={previewCanvasRef}
            isMobileView={true}
            isSidebarOpen={true}
            sidebarRef={null}
            sidebarWidth={600}
            onToggleSidebar={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
e