// components/Customize-components/subcomponents/BackgroundBlock.jsx

'use client';

import { FiDroplet, FiLayers, FiImage, FiUpload, FiTrash2 } from 'react-icons/fi';

export default function BackgroundBlock({ 
  block, 
  onModeChange, 
  onSolidColorChange, 
  onGradientChange, 
  onImageUpload, 
  triggerUpdate 
}) {
  return (
    <div className="mb-3">
      <span className="text-[10px] text-slate-400 mb-1 block">{block.label}</span>
      
      {/* Mode Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-[10px] gap-0.5 mb-2">
        {['solid', 'gradient', 'image'].map(mode => (
          <button
            key={mode}
            onClick={() => onModeChange(block.index, mode)}
            className={`flex-1 border-none bg-transparent px-1 py-1 text-[11px] rounded-lg cursor-pointer transition-all font-semibold flex items-center justify-center gap-1 ${
              block.mode === mode 
                ? 'bg-white text-indigo-600 font-bold shadow-sm' 
                : 'text-slate-500 hover:bg-slate-200/50'
            }`}
          >
            {mode === 'solid' && <FiDroplet size={10} />}
            {mode === 'gradient' && <FiLayers size={10} />}
            {mode === 'image' && <FiImage size={10} />}
            <span className="hidden xs:inline">{mode}</span>
          </button>
        ))}
      </div>
      
      {/* Solid Color Mode */}
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
            className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-500" 
          />
        </div>
      )}
      
      {/* Gradient Mode */}
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
            className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="to right">→ Right</option>
            <option value="to left">← Left</option>
            <option value="to bottom">↓ Bottom</option>
            <option value="to top">↑ Top</option>
            <option value="135deg">↘ Diagonal</option>
            <option value="45deg">↗ Diagonal</option>
          </select>
        </div>
      )}
      
      {/* Image Mode */}
      {block.mode === 'image' && (
        <div className="flex gap-2">
          <button 
            onClick={() => onImageUpload(block.index)} 
            className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-1 active:scale-95"
          >
            <FiUpload size={12} /> Upload
          </button>
          <button 
            onClick={() => onModeChange(block.index, 'solid')} 
            className="flex-1 bg-slate-50 text-red-500 border border-slate-100 px-2 py-2 rounded-lg text-xs font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-1 active:scale-95"
          >
            <FiTrash2 size={12} /> Remove
          </button>
        </div>
      )}
    </div>
  );
}