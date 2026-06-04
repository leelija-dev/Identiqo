// app/customize/components/TextStylePopup.jsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { FiX, FiBold, FiItalic, FiUnderline, FiRefreshCcw } from 'react-icons/fi';

export default function TextStylePopup({ 
  show, 
  position, 
  currentElement,
  textFields,
  onClose,
  onUpdate,
  onReset,
  triggerUpdate
}) {
  const popupRef = useRef(null);
  const [popupFontFamily, setPopupFontFamily] = useState('Inter');
  const [popupFontSize, setPopupFontSize] = useState(14);
  const [popupBold, setPopupBold] = useState(false);
  const [popupItalic, setPopupItalic] = useState(false);
  const [popupUnderline, setPopupUnderline] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [popupPosition, setPopupPosition] = useState(position);

  useEffect(() => {
    setPopupPosition(position);
  }, [position]);

  useEffect(() => {
    if (currentElement) {
      const computed = getComputedStyle(currentElement);
      setPopupFontFamily(computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim());
      setPopupFontSize(parseInt(computed.fontSize, 10) || 14);
      setPopupBold(computed.fontWeight >= 600);
      setPopupItalic(computed.fontStyle === 'italic');
      setPopupUnderline(computed.textDecoration?.includes('underline') || false);
    }
  }, [currentElement]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.popup-close-btn')) return;
    setDragActive(true);
    setDragStart({ x: e.clientX - popupPosition.x, y: e.clientY - popupPosition.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragActive) return;
    const popupWidth = popupRef.current?.offsetWidth || 280;
    const popupHeight = popupRef.current?.offsetHeight || 200;
    setPopupPosition({
      x: Math.min(Math.max(e.clientX - dragStart.x, 10), window.innerWidth - popupWidth - 10),
      y: Math.min(Math.max(e.clientY - dragStart.y, 10), window.innerHeight - popupHeight - 10)
    });
  }, [dragActive, dragStart]);

  const handleMouseUp = useCallback(() => setDragActive(false), []);

  useEffect(() => {
    if (dragActive) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragActive, handleMouseMove, handleMouseUp]);

  const applyFontFamily = (font) => {
    setPopupFontFamily(font);
    if (currentElement) currentElement.style.fontFamily = font;
    triggerUpdate();
  };

  const applyFontSize = (size) => {
    setPopupFontSize(size);
    if (currentElement) currentElement.style.fontSize = size + 'px';
    triggerUpdate();
  };

  const toggleStyle = (type) => {
    if (!currentElement) return;
    switch (type) {
      case 'bold':
        const isBold = currentElement.style.fontWeight === 'bold' || parseInt(currentElement.style.fontWeight) >= 600;
        currentElement.style.fontWeight = isBold ? 'normal' : 'bold';
        setPopupBold(!isBold);
        break;
      case 'italic':
        const isItalic = currentElement.style.fontStyle === 'italic';
        currentElement.style.fontStyle = isItalic ? 'normal' : 'italic';
        setPopupItalic(!isItalic);
        break;
      case 'underline':
        const hasUnderline = currentElement.style.textDecoration?.includes('underline');
        currentElement.style.textDecoration = hasUnderline ? 'none' : 'underline';
        setPopupUnderline(!hasUnderline);
        break;
    }
    triggerUpdate();
  };

  const handleReset = () => {
    if (!currentElement) return;
    currentElement.innerText = currentElement.dataset.originalText || '';
    currentElement.style.color = currentElement.dataset.originalColor || '#000000';
    currentElement.style.fontFamily = currentElement.dataset.originalFontFamily || 'Inter';
    currentElement.style.fontSize = currentElement.dataset.originalFontSize || '14px';
    currentElement.style.fontWeight = currentElement.dataset.originalFontWeight || 'normal';
    currentElement.style.fontStyle = currentElement.dataset.originalFontStyle || 'normal';
    currentElement.style.textDecoration = currentElement.dataset.originalTextDecoration || 'none';
    onReset();
    triggerUpdate();
  };

  if (!show) return null;

  const currentField = textFields?.find(f => f.element === currentElement);
  const currentColor = currentField?.color || '#000000';

  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />
      <div 
        ref={popupRef} 
        className="fixed z-[9999] bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl min-w-[260px] cursor-grab active:cursor-grabbing" 
        style={{ 
          left: `${popupPosition.x}px`, 
          top: `${popupPosition.y}px`, 
          userSelect: dragActive ? 'none' : 'auto' 
        }} 
        onMouseDown={handleMouseDown}
      >
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500">Text Style</span>
          <button onClick={onClose} className="popup-close-btn text-slate-400 hover:text-slate-700 transition-colors">
            <FiX size={16} />
          </button>
        </div>

        <div className="flex gap-2 items-center mb-3 flex-wrap">
          <select 
            value={popupFontFamily} 
            onChange={(e) => applyFontFamily(e.target.value)} 
            className="flex-[2] px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-white cursor-pointer"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Poppins">Poppins</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Space Grotesk">Space Grotesk</option>
          </select>
          <input 
            type="number" 
            value={popupFontSize} 
            onChange={(e) => applyFontSize(parseInt(e.target.value))} 
            className="w-[50px] px-1 py-1.5 border border-slate-200 rounded-lg text-[11px] text-center" 
            min="8" 
            max="72" 
          />
          <span className="text-[11px] text-slate-400">px</span>
        </div>

        <div className="flex gap-2 mb-3 flex-wrap">
          <button 
            onClick={() => toggleStyle('bold')} 
            className={`w-9 h-9 border rounded-lg font-bold text-sm transition-all flex items-center justify-center ${popupBold ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50'}`}
          >
            <FiBold />
          </button>
          <button 
            onClick={() => toggleStyle('italic')} 
            className={`w-9 h-9 border rounded-lg italic text-sm transition-all flex items-center justify-center ${popupItalic ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50'}`}
          >
            <FiItalic />
          </button>
          <button 
            onClick={() => toggleStyle('underline')} 
            className={`w-9 h-9 border rounded-lg underline text-sm transition-all flex items-center justify-center ${popupUnderline ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50'}`}
          >
            <FiUnderline />
          </button>
          <input 
            type="color" 
            value={currentColor} 
            onChange={(e) => { 
              if (currentElement) currentElement.style.color = e.target.value; 
              triggerUpdate(); 
            }} 
            className="w-9 h-9 border border-slate-200 rounded-lg cursor-pointer p-0.5" 
          />
        </div>

        <button 
          onClick={handleReset} 
          className="w-full bg-slate-100 text-slate-600 px-2 py-2 rounded-lg text-[11px] font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-1"
        >
          <FiRefreshCcw size={12} /> Reset
        </button>
      </div>
    </>
  );
}