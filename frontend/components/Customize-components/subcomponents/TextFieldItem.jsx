// components/Customize-components/subcomponents/TextFieldItem.jsx

'use client';

import { FiRefreshCcw } from 'react-icons/fi';

export default function TextFieldItem({ 
  field, 
  onTextChange, 
  onColorChange,
  onFontSizeChange,
  onFontFamilyChange,
  onToggleStyle,
  onReset,
  onFieldClick
}) {
  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-200 group">
      {/* Field Label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
          {field.label}
          {field.side === 'Back' && (
            <span className="ml-1 text-[8px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">Back</span>
          )}
        </div>
        
        {/* Individual Reset Button */}
        <button 
          onClick={() => onReset(field.index)} 
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-full p-1"
          title="Reset this field to original"
        >
          <FiRefreshCcw size={10} />
        </button>
      </div>
      
      {/* Text Input with 3D hover effect */}
      <input 
        type="text" 
        value={field.text} 
        onChange={(e) => onTextChange(field.index, e.target.value)} 
        onClick={(e) => onFieldClick?.(field, e)} 
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-300"
        placeholder="Click to edit..." 
      />
      
      {/* Formatting Controls */}
      <div className="flex flex-wrap gap-2 mt-3 items-center">
        <div className="flex items-center gap-1.5 flex-1 flex-wrap">
          {/* Font Family Dropdown */}
          <select 
            value={field.fontFamily || 'Inter'} 
            onChange={(e) => onFontFamilyChange(field.index, e.target.value)} 
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-600 outline-none focus:border-indigo-500 hover:shadow-sm transition-all"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Poppins">Poppins</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Space Grotesk">Space Grotesk</option>
            <option value="Roboto">Roboto</option>
            <option value="Montserrat">Montserrat</option>
          </select>
          
          {/* Font Size */}
          <label className="flex h-8 min-w-[56px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-bold text-slate-600 hover:shadow-sm transition-all">
            T
            <input 
              type="number" 
              min="8" 
              max="72" 
              value={field.fontSize || 14} 
              onChange={(e) => onFontSizeChange(field.index, e.target.value)} 
              className="w-8 bg-transparent text-center text-[11px] outline-none" 
            />
          </label>
          
          {/* Color Picker */}
          <input 
            type="color" 
            value={field.color} 
            onChange={(e) => onColorChange(field.index, e.target.value)} 
            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-1 hover:shadow-sm transition-all" 
            title="Text color"
          />
          
          {/* Bold Button */}
          <button 
            type="button" 
            onClick={() => onToggleStyle(field.index, 'bold')} 
            className={`h-8 w-8 rounded-lg border text-[12px] font-bold transition-all hover:shadow-md hover:-translate-y-0.5 ${
              field.bold 
                ? 'border-indigo-500 bg-indigo-500 text-white' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
            }`}
          >
            B
          </button>
          
          {/* Italic Button */}
          <button 
            type="button" 
            onClick={() => onToggleStyle(field.index, 'italic')} 
            className={`h-8 w-8 rounded-lg border text-[12px] italic transition-all hover:shadow-md hover:-translate-y-0.5 ${
              field.italic 
                ? 'border-indigo-500 bg-indigo-500 text-white' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
            }`}
          >
            I
          </button>
          
          {/* Underline Button */}
          <button 
            type="button" 
            onClick={() => onToggleStyle(field.index, 'underline')} 
            className={`h-8 w-8 rounded-lg border text-[12px] underline transition-all hover:shadow-md hover:-translate-y-0.5 ${
              field.underline 
                ? 'border-indigo-500 bg-indigo-500 text-white' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
            }`}
          >
            U
          </button>
        </div>
      </div>
    </div>
  );
}