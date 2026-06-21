// components/Customize-components/subcomponents/ColorThemeSection.jsx

'use client';

import { FiDroplet } from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';

export default function ColorThemeSection() {
  const {
    selectedTheme,
    customPrimary,
    customSecondary,
    customAccent,
    customCardBg,
    applyTheme,
    setCustomPrimary,
    setCustomSecondary,
    setCustomAccent,
    setCustomCardBg,
    triggerUpdate,
    previewCanvasRef,
  } = useEditor();

  const themes = [
    { name: 'Default', primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc' },
    { name: 'Sunset', primary: '#ff6b35', secondary: '#f7931e', accent: '#ff2d55' },
    { name: 'Ocean', primary: '#0077b6', secondary: '#00b4d8', accent: '#90e0ef' },
    { name: 'Forest', primary: '#2d6a4f', secondary: '#52b788', accent: '#95d5b2' },
    { name: 'Midnight', primary: '#6c63ff', secondary: '#3f37c9', accent: '#4895ef' },
    { name: 'RoseGold', primary: '#e8a87c', secondary: '#d45d79', accent: '#f0c0a0' },
  ];

  const handleCustomPrimaryChange = (value) => {
    setCustomPrimary(value);
    previewCanvasRef?.current?.style.setProperty('--primary', value);
    triggerUpdate();
  };

  const handleCustomSecondaryChange = (value) => {
    setCustomSecondary(value);
    previewCanvasRef?.current?.style.setProperty('--secondary', value);
    triggerUpdate();
  };

  const handleCustomAccentChange = (value) => {
    setCustomAccent(value);
    previewCanvasRef?.current?.style.setProperty('--accent', value);
    triggerUpdate();
  };

  const handleCustomCardBgChange = (value) => {
    setCustomCardBg(value);
    previewCanvasRef?.current?.style.setProperty('--card-bg', value);
    triggerUpdate();
  };

  const handleThemeClick = (theme) => {
    applyTheme(theme.name, theme.primary, theme.secondary, theme.accent);
  };

  return (
    <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider">
        <FiDroplet /> Color Theme & Background
      </div>
      
      {/* Card Background Color */}
      <div className="mb-3">
        <label className="text-[10px] text-slate-400 block mb-1">Card Background</label>
        <div className="flex gap-2 items-center">
          <input 
            type="color" 
            value={customCardBg} 
            onChange={(e) => handleCustomCardBgChange(e.target.value)} 
            className="w-8 h-7 border border-slate-200 rounded cursor-pointer" 
          />
          <input 
            type="text" 
            value={customCardBg} 
            onChange={(e) => handleCustomCardBgChange(e.target.value)} 
            placeholder="#ffffff" 
            className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-500" 
          />
        </div>
      </div>
      
      <div className="border-t border-slate-100 pt-3 mb-3" />
      
      {/* Predefined Themes Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {themes.map(theme => (
          <button
            key={theme.name}
            onClick={() => handleThemeClick(theme)}
            className={`p-2 rounded-xl border-2 transition-all active:scale-95 ${
              selectedTheme === theme.name 
                ? 'border-indigo-500 shadow-md' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex gap-1 mb-1 justify-center">
              <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }} />
              <div className="w-4 h-4 rounded-full" style={{ background: theme.secondary }} />
              <div className="w-4 h-4 rounded-full" style={{ background: theme.accent }} />
            </div>
            <span className="text-[9px] font-semibold text-slate-600">{theme.name}</span>
          </button>
        ))}
      </div>
      
      <div className="border-t border-slate-100 pt-3">
        <span className="text-[10px] text-slate-400 mb-2 block">Custom Colors</span>
        <div className="flex flex-wrap gap-3">
          {/* Primary Color */}
          <div className="flex-1 min-w-[80px]">
            <label className="text-[9px] text-slate-400 block mb-1">Primary</label>
            <input 
              type="color" 
              value={customPrimary} 
              onChange={(e) => handleCustomPrimaryChange(e.target.value)} 
              className="w-full h-7 border border-slate-200 rounded cursor-pointer" 
            />
          </div>
          
          {/* Secondary Color */}
          <div className="flex-1 min-w-[80px]">
            <label className="text-[9px] text-slate-400 block mb-1">Secondary</label>
            <input 
              type="color" 
              value={customSecondary} 
              onChange={(e) => handleCustomSecondaryChange(e.target.value)} 
              className="w-full h-7 border border-slate-200 rounded cursor-pointer" 
            />
          </div>
          
          {/* Accent Color */}
          <div className="flex-1 min-w-[80px]">
            <label className="text-[9px] text-slate-400 block mb-1">Accent</label>
            <input 
              type="color" 
              value={customAccent} 
              onChange={(e) => handleCustomAccentChange(e.target.value)} 
              className="w-full h-7 border border-slate-200 rounded cursor-pointer" 
            />
          </div>
        </div>
        
        {/* Color Preview Bar */}
        <div className="mt-3 flex h-8 rounded-lg overflow-hidden">
          <div className="flex-1" style={{ backgroundColor: customPrimary }} />
          <div className="flex-1" style={{ backgroundColor: customSecondary }} />
          <div className="flex-1" style={{ backgroundColor: customAccent }} />
        </div>
      </div>
    </div>
  );
}