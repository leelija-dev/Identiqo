// components/Customize_Layout/TextFieldEditor.jsx
'use client';

import { FiType, FiRefreshCcw } from 'react-icons/fi';

function TextFieldItem({ field, onTextChange, onColorChange, onFontSizeChange, onFontFamilyChange, onToggleStyle, onReset, onFieldClick }) {
  return (
    <div className="bg-slate-50 rounded-[10px] p-2 border border-slate-100">
      <div className="flex items-center gap-1 mb-1 text-[10px] text-slate-500 truncate">
        {field.label}
      </div>
      <input 
        type="text" 
        value={field.text} 
        onChange={(e) => onTextChange(field.index, e.target.value)} 
        onClick={(e) => onFieldClick?.(field, e)} 
        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" 
        placeholder="Click to edit..." 
      />
      <div className="flex flex-wrap gap-2 mt-2 items-center">
        <div className="flex items-center gap-1.5 flex-1">
          <select 
            value={field.fontFamily || 'Inter'} 
            onChange={(e) => onFontFamilyChange(field.index, e.target.value)} 
            className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-600 outline-none"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Poppins">Poppins</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Space Grotesk">Space Grotesk</option>
          </select>
          <label className="flex h-7 min-w-[56px] items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-bold text-slate-600">
            T
            <input 
              type="number" 
              min="8" 
              max="72" 
              value={field.fontSize || 14} 
              onChange={(e) => onFontSizeChange(field.index, e.target.value)} 
              className="w-8 bg-transparent text-center text-[10px] outline-none" 
            />
          </label>
          <input 
            type="color" 
            value={field.color} 
            onChange={(e) => onColorChange(field.index, e.target.value)} 
            className="w-8 h-7 border-none rounded-md cursor-pointer p-0" 
          />
          <button 
            type="button" 
            onClick={() => onToggleStyle(field.index, 'bold')} 
            className={`h-7 w-7 rounded-md border text-[11px] font-bold ${field.bold ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            B
          </button>
          <button 
            type="button" 
            onClick={() => onToggleStyle(field.index, 'italic')} 
            className={`h-7 w-7 rounded-md border text-[11px] italic ${field.italic ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            I
          </button>
          <button 
            type="button" 
            onClick={() => onToggleStyle(field.index, 'underline')} 
            className={`h-7 w-7 rounded-md border text-[11px] underline ${field.underline ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
          >
            U
          </button>
        </div>
        <button 
          onClick={() => onReset(field.index)} 
          className="bg-slate-100 text-slate-500 border-none px-2 py-1 rounded-md text-[11px] cursor-pointer hover:bg-slate-200 transition-all flex items-center gap-1"
        >
          <FiRefreshCcw size={12} /> Reset
        </button>
      </div>
    </div>
  );
}

export function TextFieldEditor({ textFields, onTextChange, onColorChange, onFontSizeChange, onFontFamilyChange, onToggleStyle, onReset, onFieldClick }) {
  return (
    <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider">
        <FiType /> Editable Text Fields
      </div>
      {textFields.length === 0 ? (
        <p className="text-center py-5 text-slate-400 text-xs">No editable text found</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto">
          {textFields.map(field => (
            <TextFieldItem
              key={field.index}
              field={field}
              onTextChange={onTextChange}
              onColorChange={onColorChange}
              onFontSizeChange={onFontSizeChange}
              onFontFamilyChange={onFontFamilyChange}
              onToggleStyle={onToggleStyle}
              onReset={onReset}
              onFieldClick={onFieldClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TextFieldEditor;