// components/Customize-components/subcomponents/BackgroundEditor.jsx

'use client';

import { FiDroplet, FiRefreshCcw } from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';
import BackgroundBlock from './BackgroundBlock';

export default function BackgroundEditor() {
  const {
    backgroundBlocks,
    setBackgroundMode,
    setSolidColor,
    setGradient,
    uploadBackgroundImage,
    refreshBackgrounds,
    triggerUpdate,
  } = useEditor();

  if (backgroundBlocks.length === 0) {
    return (
      <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-gradient-to-br from-indigo-50/30 to-purple-50/30 shadow-sm">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            <FiDroplet /> Background Editor
          </div>
          <button 
            onClick={refreshBackgrounds} 
            className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center gap-1 transition-colors"
          >
            <FiRefreshCcw size={12} /> Refresh
          </button>
        </div>
        <p className="text-center py-5 text-slate-400 text-xs">
          No editable backgrounds found. Click "Refresh" to detect backgrounds.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-3 p-3.5 border border-slate-100 rounded-2xl bg-gradient-to-br from-indigo-50/30 to-purple-50/30 shadow-sm">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
          <FiDroplet /> Background Editor
        </div>
        <button 
          onClick={refreshBackgrounds} 
          className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center gap-1 transition-colors"
          title="Refresh background list"
        >
          <FiRefreshCcw size={12} /> Refresh
        </button>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto pr-1">
        {backgroundBlocks.map(block => (
          <BackgroundBlock
            key={block.index}
            block={block}
            onModeChange={setBackgroundMode}
            onSolidColorChange={setSolidColor}
            onGradientChange={setGradient}
            onImageUpload={uploadBackgroundImage}
            triggerUpdate={triggerUpdate}
          />
        ))}
      </div>
    </div>
  );
}