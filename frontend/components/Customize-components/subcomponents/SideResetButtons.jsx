// components/Customize-components/subcomponents/SideResetButtons.jsx

'use client';

import { FiRotateCcw } from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';

export default function SideResetButtons() {
  const {
    resetFrontSide,
    resetBackSide,
  } = useEditor();

  return (
    <div className="grid grid-cols-2 gap-3 pt-2">
      <button
        onClick={resetFrontSide}
        className="group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 text-emerald-700 font-medium text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
      >
        <FiRotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
        Reset Front Side
      </button>
      <button
        onClick={resetBackSide}
        className="group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-purple-700 font-medium text-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
      >
        <FiRotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
        Reset Back Side
      </button>
    </div>
  );
}