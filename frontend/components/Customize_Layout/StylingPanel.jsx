// components/Customize_Layout/StylingPanel.jsx
'use client';

import { FiDroplet, FiLayers, FiImage, FiUpload, FiTrash2, FiRefreshCcw, FiUser, FiType } from 'react-icons/fi';
import { FaBuilding, FaBarcode, FaQrcode } from 'react-icons/fa';
import { THEME_PRESETS } from '@/app/customize/lib/constants';

// ========== BackgroundBlock (internal) ==========
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

// ========== BackgroundEditor ==========
function BackgroundEditor({ backgroundBlocks, onModeChange, onSolidColorChange, onGradientChange, onImageUpload, refreshBackgrounds, triggerUpdate }) {
  return (
    <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
          <FiDroplet /> Background Editor
        </div>
        <button 
          onClick={refreshBackgrounds} 
          className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center gap-1"
        >
          <FiRefreshCcw size={12} /> Refresh
        </button>
      </div>
      {backgroundBlocks.length === 0 ? (
        <p className="text-center py-5 text-slate-400 text-xs">
          No editable backgrounds found. Click "Refresh" to detect.
        </p>
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

// ========== ColorThemeSection ==========
function ColorThemeSection({ selectedTheme, customPrimary, customSecondary, customAccent, customCardBg, onApplyTheme, onCustomPrimaryChange, onCustomSecondaryChange, onCustomAccentChange, onCustomCardBgChange, previewCanvasRef, triggerUpdate }) {
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
        {THEME_PRESETS.map(theme => (
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

// ========== ImageUploadBlock ==========
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

// ========== ImagesSection ==========
function ImagesSection({ detectedFeatures, uploadedImages, onImageUpload, onImageRemove, barcodeValue, qrValue, onBarcodeValueChange, onQrValueChange, onApplyBarcode, onApplyQR, triggerUpdate }) {
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

// ========== Main StylingPanel export ==========
export function StylingPanel(props) {
  const {
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
    triggerUpdate,
    previewCanvasRef
  } = props;

  return (
    <>
      {backgroundBlocks.length > 0 && (
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
    </>
  );
}
export default StylingPanel;