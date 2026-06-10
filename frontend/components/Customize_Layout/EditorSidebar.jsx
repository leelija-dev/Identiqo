// components/Customize_Layout/EditorSidebar.jsx
'use client';

import { FiX, FiSave, FiRotateCcw } from 'react-icons/fi';
import { TextFieldEditor } from './TextFieldEditor';
import { StylingPanel } from './StylingPanel';

export function EditorSidebar({
  currentTemplate, currentOrientation, isMobileView = false,
  textFields, onTextChange, onColorChange, onFontSizeChange, onFontFamilyChange,
  onToggleTextFieldStyle, onResetTextField, onTextFieldClick,
  backgroundBlocks, onBackgroundModeChange, onSolidColorChange, onGradientChange,
  onBackgroundImageUpload, refreshBackgrounds,
  showThemeSection, selectedTheme, customPrimary, customSecondary, customAccent, customCardBg,
  onApplyTheme, onCustomPrimaryChange, onCustomSecondaryChange, onCustomAccentChange, onCustomCardBgChange,
  showImageSection, detectedFeatures, uploadedImages, onImageUpload, onImageRemove,
  barcodeValue, qrValue, onBarcodeValueChange, onQrValueChange, onApplyBarcode, onApplyQR,
  onSave, onReset, onClose, sidebarRef, sidebarWidth, onResizeStart, isSidebarOpen, onToggleSidebar, triggerUpdate, previewCanvasRef
}) {
  return (
    <div 
      ref={sidebarRef} 
      className={`${isMobileView ? 'relative' : 'fixed lg:relative'} top-0 right-0 h-full bg-white border-l border-slate-200 flex flex-col shadow-lg rounded-l-2xl transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`} 
      style={{ width: `min(${sidebarWidth}px, 100vw)`, maxWidth: '100vw' }}
    >
      {!isMobileView && (
        <div className="lg:hidden absolute left-3 top-3 z-50">
          <button onClick={onClose || onToggleSidebar} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <FiX size={20} />
          </button>
        </div>
      )}
      <div 
        className="absolute left-0 top-0 w-2 h-full cursor-ew-resize bg-transparent hover:bg-indigo-500/50 transition-colors z-50 hidden lg:block" 
        onMouseDown={onResizeStart} 
      />
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        <TextFieldEditor
          textFields={textFields}
          onTextChange={onTextChange}
          onColorChange={onColorChange}
          onFontSizeChange={onFontSizeChange}
          onFontFamilyChange={onFontFamilyChange}
          onToggleStyle={onToggleTextFieldStyle}
          onReset={onResetTextField}
          onFieldClick={onTextFieldClick}
        />
        <StylingPanel
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
          triggerUpdate={triggerUpdate}
          previewCanvasRef={previewCanvasRef}
        />
      </div>
      <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
        <button onClick={onSave} className="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-2.5 rounded-[10px] font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm">
          <FiSave size={14} /> Save
        </button>
        <button onClick={onReset} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2.5 rounded-[10px] font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-1 text-sm">
          <FiRotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
export default EditorSidebar;