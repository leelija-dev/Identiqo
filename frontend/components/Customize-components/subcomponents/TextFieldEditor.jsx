// components/Customize-components/subcomponents/TextFieldEditor.jsx

'use client';

import { FiType, FiRotateCcw, FiRefreshCcw } from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';
import TextFieldItem from './TextFieldItem';

export default function TextFieldEditor() {
  const {
    textFields,
    handleTextChange,
    handleColorChange,
    handleFontSizeChange,
    handleFontFamilyChange,
    toggleTextFieldStyle,
    resetTextField,
    resetFrontSideTexts,
    resetBackSideTexts,
  } = useEditor();

  const frontTexts = textFields.filter(f => f.side === 'Front');
  const backTexts = textFields.filter(f => f.side === 'Back');

  if (textFields.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-sm">
        No editable text found in this template
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Front Side Texts */}
      {frontTexts.length > 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              FRONT SIDE
            </div>
            <button
              onClick={resetFrontSideTexts}
              className="text-[10px] text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-emerald-50"
              title="Reset all front side texts"
            >
              <FiRotateCcw size={10} /> Reset Front
            </button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {frontTexts.map(field => (
              <TextFieldItem
                key={field.index}
                field={field}
                onTextChange={handleTextChange}
                onColorChange={handleColorChange}
                onFontSizeChange={handleFontSizeChange}
                onFontFamilyChange={handleFontFamilyChange}
                onToggleStyle={toggleTextFieldStyle}
                onReset={resetTextField}
              />
            ))}
          </div>
        </div>
      )}

      {/* Back Side Texts */}
      {backTexts.length > 0 && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              BACK SIDE
            </div>
            <button
              onClick={resetBackSideTexts}
              className="text-[10px] text-slate-400 hover:text-purple-600 transition-colors flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-purple-50"
              title="Reset all back side texts"
            >
              <FiRotateCcw size={10} /> Reset Back
            </button>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {backTexts.map(field => (
              <TextFieldItem
                key={field.index}
                field={field}
                onTextChange={handleTextChange}
                onColorChange={handleColorChange}
                onFontSizeChange={handleFontSizeChange}
                onFontFamilyChange={handleFontFamilyChange}
                onToggleStyle={toggleTextFieldStyle}
                onReset={resetTextField}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}