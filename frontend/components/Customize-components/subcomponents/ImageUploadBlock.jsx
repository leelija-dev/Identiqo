// components/Customize-components/subcomponents/ImageUploadBlock.jsx

'use client';

import { FiTrash2, FiUser, FiUpload } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';

export default function ImageUploadBlock({ 
  label, 
  type, 
  image, 
  onUpload, 
  onRemove,
  icon 
}) {
  const getDefaultIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'profile':
        return <FiUser className="text-2xl text-slate-400" />;
      case 'signature':
        return <span className="text-xl">✍️</span>;
      case 'logo':
        return <FaBuilding className="text-2xl text-slate-400" />;
      default:
        return <FiUpload className="text-xl text-slate-400" />;
    }
  };

  return (
    <div className="group">
      {/* Upload Area with 3D hover effect */}
      <div 
        onClick={() => onUpload(type)} 
        className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-400 hover:bg-indigo-50/30 active:scale-95"
      >
        <div className="min-h-[80px] flex items-center justify-center">
          {image ? (
            <img 
              src={image} 
              className={`w-full max-h-[70px] ${type === 'signature' ? 'object-contain' : 'object-cover'} rounded-lg`} 
              alt={label} 
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              {getDefaultIcon()}
              <span className="text-[10px] text-slate-400">Click to upload {label}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Remove Button (only shows when image is uploaded) */}
      {image && (
        <button 
          onClick={() => onRemove(type)} 
          className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center flex items-center justify-center gap-1 transition-colors opacity-0 group-hover:opacity-100"
        >
          <FiTrash2 size={12} /> Remove {label}
        </button>
      )}
    </div>




);
}