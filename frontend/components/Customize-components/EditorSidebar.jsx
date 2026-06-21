// components/Customize-components/EditorSidebar.jsx
'use client';

import { useState } from 'react';
import { FiX, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';
import TextFieldEditor from './subcomponents/TextFieldEditor';
import ImagesSection from './subcomponents/ImagesSection';
import BarcodeQRSection from './subcomponents/BarcodeQRSection';
import SideResetButtons from './subcomponents/SideResetButtons';

// Accordion section – only one open at a time
function AccordionSection({ 
  id, 
  title, 
  icon, 
  count, 
  isOpen, 
  onToggle, 
  children 
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white transition-all duration-200">
      <button
        onClick={() => onToggle(id)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <h3 className="font-medium text-slate-700 text-sm">
            {title}
            {count !== undefined && count > 0 && (
              <span className="ml-1.5 text-xs text-slate-400 font-normal">({count})</span>
            )}
          </h3>
        </div>
        {isOpen ? (
          <FiChevronDown size={16} className="text-slate-400 flex-shrink-0" />
        ) : (
          <FiChevronRight size={16} className="text-slate-400 flex-shrink-0" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function EditorSidebar({ 
  isMobileView = false,
  isSidebarOpen,
  onToggleSidebar,
}) {
  const editor = useEditor();

  const {
    textFields,
    detectedFeatures,
  } = editor;

  const showImageSection = detectedFeatures.hasProfile || 
                           detectedFeatures.hasSignature || 
                           detectedFeatures.hasLogo;
  const showBarcodeQRSection = detectedFeatures.hasBarcode || detectedFeatures.hasQR;

  const textCount = textFields.length;
  const imageCount = (detectedFeatures.hasProfile ? 1 : 0) + 
                     (detectedFeatures.hasSignature ? 1 : 0) + 
                     (detectedFeatures.hasLogo ? 1 : 0);
  const digitalCount = (detectedFeatures.hasBarcode ? 1 : 0) + 
                       (detectedFeatures.hasQR ? 1 : 0);

  const [openSection, setOpenSection] = useState('text');

  const handleToggle = (id) => {
    setOpenSection(prev => prev === id ? '' : id);
  };

  return (
    <div 
      className={`
        relative
        top-0 right-0
        h-full
        bg-white
        border-l border-slate-200
        flex flex-col
        shadow-lg rounded-l-2xl
        transition-transform duration-300 ease-in-out
        z-40
        w-full
        ${isMobileView ? (isSidebarOpen ? 'translate-x-0' : 'translate-x-full') : ''}
      `}
    >
      {/* Close button (mobile only) */}
      {isMobileView && (
        <div className="lg:hidden absolute right-4 top-4 z-50">
          <button 
            onClick={onToggleSidebar} 
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors active:scale-95"
          >
            <FiX size={20} />
          </button>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm px-4 pt-4 pb-2 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Customize Your Card
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">Edit content, images, and security features</p>
      </div>

      {/* Scrollable content with accordion sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 space-y-3">
        
        {/* SECTION 1: Text Editing */}
        <AccordionSection 
          id="text"
          title="Text Fields" 
          icon="✏️" 
          count={textCount}
          isOpen={openSection === 'text'}
          onToggle={handleToggle}
        >
          {textCount > 0 ? (
            <TextFieldEditor />
          ) : (
            <div className="text-xs text-slate-400 py-2 text-center bg-slate-50 rounded-lg">
              No editable text fields found in this template
            </div>
          )}
        </AccordionSection>

        {/* SECTION 2: Images */}
        {showImageSection && (
          <AccordionSection 
            id="images"
            title="Images" 
            icon="🖼️" 
            count={imageCount}
            isOpen={openSection === 'images'}
            onToggle={handleToggle}
          >
            <ImagesSection />
          </AccordionSection>
        )}

        {/* SECTION 3: Barcode & QR Code */}
        {showBarcodeQRSection && (
          <AccordionSection 
            id="digital"
            title="Digital ID" 
            icon="📱" 
            count={digitalCount}
            isOpen={openSection === 'digital'}
            onToggle={handleToggle}
          >
            <BarcodeQRSection />
          </AccordionSection>
        )}

        {/* SECTION 4: Reset Options */}
        <AccordionSection 
          id="reset"
          title="Reset Options" 
          icon="🔄" 
          isOpen={openSection === 'reset'}
          onToggle={handleToggle}
        >
          <SideResetButtons />
        </AccordionSection>
      </div>
    </div>
  );
}