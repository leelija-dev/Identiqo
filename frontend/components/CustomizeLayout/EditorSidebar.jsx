// app/customize/components/EditorSidebar.jsx
'use client';

import { useState } from 'react';
import { 
  FiEdit2, FiSave, FiRotateCcw, FiDroplet, FiImage, FiUpload, FiTrash2,
  FiLayers, FiRefreshCcw, FiX, FiUser
} from 'react-icons/fi';
import { FaBarcode, FaQrcode, FaBuilding } from 'react-icons/fa';
import TextFieldEditor from './TextFieldEditor';

export default function EditorSidebar({
  currentTemplate,
  currentOrientation,
  isMobileView = false,
  textFields,
  onTextChange,
  onColorChange,
  onFontSizeChange,
  onFontFamilyChange,
  onToggleTextFieldStyle,
  onResetTextField,
  onTextFieldClick,
  backgroundBlocks,
  onBackgroundModeChange,
  onSolidColorChange,
  onGradientChange,
  onBackgroundImageUpload,
  refreshBackgrounds,
  showThemeSection,
  selectedTheme,
  customPrimary,
  customSecondary,
  customAccent,
  customCardBg,
  onApplyTheme,
  onCustomPrimaryChange,
  onCustomSecondaryChange,
  onCustomAccentChange,
  onCustomCardBgChange,
  showImageSection,
  detectedFeatures,
  uploadedImages,
  onImageUpload,
  onImageRemove,
  barcodeValue,
  qrValue,
  onBarcodeValueChange,
  onQrValueChange,
  onApplyBarcode,
  onApplyQR,
  onSave,
  onReset,
  onClose,
  sidebarRef,
  sidebarWidth,
  onResizeStart,
  isSidebarOpen,
  onToggleSidebar,
  triggerUpdate,
  previewCanvasRef
}) {
  return (
    <div 
      ref={sidebarRef} 
      className={`${isMobileView ? 'relative' : 'fixed lg:relative'} top-0 right-0 h-full bg-white border-l border-slate-200 flex flex-col shadow-lg rounded-l-2xl transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`} 
      style={{ width: `min(${sidebarWidth}px, 100vw)`, maxWidth: '100vw' }}
    >
      {/* Close button (mobile) */}
      <div className="lg:hidden absolute left-3 top-3 z-50">
        <button onClick={onClose || onToggleSidebar} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <FiX size={20} />
        </button>
      </div>
      
      {/* Resize handle */}
      <div 
        className="absolute left-0 top-0 w-2 h-full cursor-ew-resize bg-transparent hover:bg-indigo-500/50 transition-colors z-50 hidden lg:block" 
        onMouseDown={onResizeStart} 
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
        
        {/* Text Fields Editor */}
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

        {/* Background Editor */}
        {currentTemplate?.category === 'employee' && (
          <BackgroundEditor
            backgroundBlocks={backgroundBlocks}
            onModeChange={onBackgroundModeChange}
            onSolidColorChange={onSolidColorChange}
            onGradientChange={onGradientChange}
            onImageUpload={onBackgroundImageUpload}
            refreshBackgrounds={refreshBackgrounds}
            triggerUpdate={triggerUpdate}
          />
        )}

        {/* Color Theme */}
        {showThemeSection && (
          <ColorThemeSection
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
            previewCanvasRef={previewCanvasRef}
            triggerUpdate={triggerUpdate}
          />
        )}

        {/* Images & Digital ID */}
        {showImageSection && (
          <ImagesSection
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
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-slate-100 flex gap-2">
        <button 
          onClick={onSave} 
          className="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-2.5 rounded-[10px] font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-1 text-sm"
        >
          <FiSave size={14} /> Save to Drafts   {/* Changed text */}
        </button>
        <button 
          onClick={onReset} 
          className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2.5 rounded-[10px] font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-1 text-sm"
        >
          <FiRotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}

// Background Editor sub-component – background changed to gradient
function BackgroundEditor({ backgroundBlocks, onModeChange, onSolidColorChange, onGradientChange, onImageUpload, refreshBackgrounds, triggerUpdate }) {
  return (
    <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-gradient-to-br from-indigo-50/30 to-purple-50/30 shadow-sm">   {/* Changed background */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
          <FiDroplet /> Background Editor
        </div>
        <button onClick={refreshBackgrounds} className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center gap-1">
          <FiRefreshCcw size={12} /> Refresh
        </button>
      </div>
      
      {backgroundBlocks.length === 0 ? (
        <p className="text-center py-5 text-slate-400 text-xs">No editable backgrounds found. Click "Refresh" to detect.</p>
      ) : (
        backgroundBlocks.map(block => (
          <BackgroundBlock
            key={block.index}
            block={block}
            onModeChange={onModeChange}
            onSolidColorChange={onSolidColorChange}
            onGradientChange={onGradientChange}
            onImageUpload={onImageUpload}
            triggerUpdate={triggerUpdate}
          />
        ))
      )}
    </div>
  );
}

// BackgroundBlock, ColorThemeSection, ImagesSection, ImageUploadBlock remain unchanged
function BackgroundBlock({ block, onModeChange, onSolidColorChange, onGradientChange, onImageUpload, triggerUpdate }) {
  return (
    <div className="mb-3">
      <span className="text-[10px] text-slate-400 mb-1 block">{block.label}</span>
      
      <div className="flex bg-slate-100 p-1 rounded-[10px] gap-0.5 mb-2">
        {['solid', 'gradient', 'image'].map(mode => (
          <button
            key={mode}
            onClick={() => onModeChange(block.index, mode)}
            className={`flex-1 border-none bg-transparent px-1 py-1 text-[11px] rounded-lg cursor-pointer transition-all font-semibold flex items-center justify-center gap-1 ${
              block.mode === mode ? 'bg-white text-indigo-600 font-bold shadow-sm' : 'text-slate-500'
            }`}
          >
            {mode === 'solid' ? <FiDroplet size={10} /> : mode === 'gradient' ? <FiLayers size={10} /> : <FiImage size={10} />}
            <span className="hidden xs:inline">{mode}</span>
          </button>
        ))}
      </div>
      
      {block.mode === 'solid' && (
        <div className="flex gap-2 items-center">
          <input 
            type="color" 
            value={block.currentColor} 
            onChange={(e) => onSolidColorChange(block.index, e.target.value)} 
            className="w-8 h-7 border-none rounded cursor-pointer" 
          />
          <input 
            type="text" 
            value={block.currentColor} 
            onChange={(e) => onSolidColorChange(block.index, e.target.value)} 
            placeholder="#ffffff" 
            className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs" 
          />
        </div>
      )}
      
      {block.mode === 'gradient' && (
        <div className="flex gap-2 items-center flex-wrap">
          <input 
            type="color" 
            value={block.gradColor1} 
            onChange={(e) => onGradientChange(block.index, e.target.value, block.gradColor2, block.gradDirection)} 
            className="w-8 h-7 border-none rounded cursor-pointer" 
          />
          <input 
            type="color" 
            value={block.gradColor2} 
            onChange={(e) => onGradientChange(block.index, block.gradColor1, e.target.value, block.gradDirection)} 
            className="w-8 h-7 border-none rounded cursor-pointer" 
          />
          <select 
            value={block.gradDirection} 
            onChange={(e) => onGradientChange(block.index, block.gradColor1, block.gradColor2, e.target.value)} 
            className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs"
          >
            <option value="to right">→</option>
            <option value="to left">←</option>
            <option value="to bottom">↓</option>
            <option value="to top">↑</option>
            <option value="135deg">↘</option>
          </select>
        </div>
      )}
      
      {block.mode === 'image' && (
        <div className="flex gap-2">
          <button 
            onClick={() => onImageUpload(block.index)} 
            className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-1"
          >
            <FiUpload size={12} /> Upload
          </button>
          <button 
            onClick={() => onModeChange(block.index, 'solid')} 
            className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-1"
          >
            <FiTrash2 size={12} /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

function ColorThemeSection({ 
  selectedTheme, customPrimary, customSecondary, customAccent, customCardBg,
  onApplyTheme, onCustomPrimaryChange, onCustomSecondaryChange, onCustomAccentChange, 
  onCustomCardBgChange, previewCanvasRef, triggerUpdate 
}) {
  const themes = [
    { name: 'Default', primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc' },
    { name: 'Sunset', primary: '#ff6b35', secondary: '#f7931e', accent: '#ff2d55' },
    { name: 'Ocean', primary: '#0077b6', secondary: '#00b4d8', accent: '#90e0ef' },
    { name: 'Forest', primary: '#2d6a4f', secondary: '#52b788', accent: '#95d5b2' },
    { name: 'Midnight', primary: '#6c63ff', secondary: '#3f37c9', accent: '#4895ef' },
    { name: 'Rose Gold', primary: '#e8a87c', secondary: '#d45d79', accent: '#f0c0a0' },
  ];

  return (
    <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider">
        <FiDroplet /> Color Theme & Background
      </div>
      
      <div className="mb-3">
        <label className="text-[10px] text-slate-400 block mb-1">Card Background</label>
        <div className="flex gap-2 items-center">
          <input 
            type="color" 
            value={customCardBg} 
            onChange={(e) => {
              onCustomCardBgChange(e.target.value);
              previewCanvasRef?.current?.style.setProperty('--card-bg', e.target.value);
              triggerUpdate();
            }} 
            className="w-8 h-7 border border-slate-200 rounded cursor-pointer" 
          />
          <input 
            type="text" 
            value={customCardBg} 
            onChange={(e) => {
              onCustomCardBgChange(e.target.value);
              previewCanvasRef?.current?.style.setProperty('--card-bg', e.target.value);
              triggerUpdate();
            }} 
            placeholder="#ffffff" 
            className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs" 
          />
        </div>
      </div>
      
      <div className="border-t border-slate-100 pt-3 mb-3" />
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {themes.map(theme => (
          <button
            key={theme.name}
            onClick={() => onApplyTheme(theme.name, theme.primary, theme.secondary, theme.accent)}
            className={`p-2 rounded-xl border-2 transition-all ${selectedTheme === theme.name ? 'border-indigo-500 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex gap-1 mb-1 justify-center">
              <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
              <div className="w-4 h-4 rounded-full" style={{ background: theme.secondary }} />
            </div>
            <span className="text-[9px] font-semibold text-slate-600">{theme.name}</span>
          </button>
        ))}
      </div>
      
      <div className="border-t border-slate-100 pt-3">
        <span className="text-[10px] text-slate-400 mb-2 block">Custom Colors</span>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[80px]">
            <label className="text-[9px] text-slate-400 block mb-1">Primary</label>
            <input 
              type="color" 
              value={customPrimary} 
              onChange={(e) => onCustomPrimaryChange(e.target.value)} 
              className="w-full h-7 border border-slate-200 rounded cursor-pointer" 
            />
          </div>
          <div className="flex-1 min-w-[80px]">
            <label className="text-[9px] text-slate-400 block mb-1">Secondary</label>
            <input 
              type="color" 
              value={customSecondary} 
              onChange={(e) => onCustomSecondaryChange(e.target.value)} 
              className="w-full h-7 border border-slate-200 rounded cursor-pointer" 
            />
          </div>
          <div className="flex-1 min-w-[80px]">
            <label className="text-[9px] text-slate-400 block mb-1">Accent</label>
            <input 
              type="color" 
              value={customAccent} 
              onChange={(e) => onCustomAccentChange(e.target.value)} 
              className="w-full h-7 border border-slate-200 rounded cursor-pointer" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ImagesSection({
  detectedFeatures, uploadedImages, onImageUpload, onImageRemove,
  barcodeValue, qrValue, onBarcodeValueChange, onQrValueChange,
  onApplyBarcode, onApplyQR, triggerUpdate
}) {
  return (
    <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider">
        <FiImage /> Images & Digital ID
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {detectedFeatures.hasProfile && (
          <ImageUploadBlock
            label="Profile"
            type="profile"
            image={uploadedImages.profile}
            onUpload={onImageUpload}
            onRemove={onImageRemove}
            icon={<FiUser className="mr-1" />}
          />
        )}
        
        {detectedFeatures.hasSignature && (
          <ImageUploadBlock
            label="Signature"
            type="signature"
            image={uploadedImages.signature}
            onUpload={onImageUpload}
            onRemove={onImageRemove}
            icon={<>✍️ Signature</>}
          />
        )}
        
        {detectedFeatures.hasLogo && (
          <ImageUploadBlock
            label="Logo"
            type="logo"
            image={uploadedImages.logo}
            onUpload={onImageUpload}
            onRemove={onImageRemove}
            icon={<><FaBuilding className="mr-1" /> Logo</>}
          />
        )}
        
        {detectedFeatures.hasBarcode && (
          <div>
            <input 
              type="text" 
              value={barcodeValue} 
              onChange={(e) => onBarcodeValueChange(e.target.value)} 
              placeholder="Barcode text..." 
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs mb-1 focus:border-indigo-500 focus:outline-none" 
            />
            <button 
              onClick={onApplyBarcode} 
              className="w-full px-2 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center justify-center gap-1"
            >
              <FaBarcode /> Generate
            </button>
          </div>
        )}
        
        {detectedFeatures.hasQR && (
          <div>
            <input 
              type="text" 
              value={qrValue} 
              onChange={(e) => onQrValueChange(e.target.value)} 
              placeholder="QR URL or text..." 
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs mb-1 focus:border-indigo-500 focus:outline-none" 
            />
            <button 
              onClick={onApplyQR} 
              className="w-full px-2 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-semibold hover:shadow-md transition-all flex items-center justify-center gap-1"
            >
              <FaQrcode /> Generate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUploadBlock({ label, type, image, onUpload, onRemove, icon }) {
  return (
    <div>
      <div 
        onClick={() => onUpload(type)} 
        className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
      >
        <div className="min-h-[60px] flex items-center justify-center text-xs text-slate-400">
          {image ? (
            <img 
              src={image} 
              className={`w-full h-full ${type === 'signature' ? 'object-contain' : 'object-cover'} rounded-lg`} 
              alt={label} 
            />
          ) : icon}
        </div>
      </div>
      {image && (
        <button 
          onClick={() => onRemove(type)} 
          className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center flex items-center justify-center gap-1"
        >
          <FiTrash2 size={12} /> Remove
        </button>
      )}
    </div>
  );
}

