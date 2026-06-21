// components/Customize-components/subcomponents/ImagesSection.jsx

'use client';

import { FiImage, FiRotateCcw } from 'react-icons/fi';
import { useEditor } from '@/app/customize/context/EditorContext';
import ImageUploadBlock from './ImageUploadBlock';

export default function ImagesSection() {
  const {
    detectedFeatures,
    uploadedImages,
    uploadImage,
    removeImage,
    resetFrontSideImages,
    resetBackSideImages,
  } = useEditor();

  const hasProfile = detectedFeatures.hasProfile;
  const hasSignature = detectedFeatures.hasSignature;
  const hasLogo = detectedFeatures.hasLogo;

  const hasAnyImage = hasProfile || hasSignature || hasLogo;

  if (!hasAnyImage) {
    return (
      <div className="text-center py-6 text-slate-400 text-sm">
        No image placeholders detected in this template
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Front Side Images */}
      {(hasProfile || hasLogo) && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              FRONT SIDE IMAGES
            </div>
            <button
              onClick={resetFrontSideImages}
              className="text-[10px] text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-emerald-50"
              title="Reset all front side images"
            >
              <FiRotateCcw size={10} /> Reset Front Images
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {hasProfile && (
              <ImageUploadBlock
                label="Profile"
                type="profile"
                image={uploadedImages.profile}
                onUpload={uploadImage}
                onRemove={removeImage}
              />
            )}
            {hasLogo && (
              <ImageUploadBlock
                label="Logo"
                type="logo"
                image={uploadedImages.logo}
                onUpload={uploadImage}
                onRemove={removeImage}
              />
            )}
          </div>
        </div>
      )}

      {/* Back Side Images */}
      {hasSignature && (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              BACK SIDE IMAGES
            </div>
            <button
              onClick={resetBackSideImages}
              className="text-[10px] text-slate-400 hover:text-purple-600 transition-colors flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-purple-50"
              title="Reset all back side images"
            >
              <FiRotateCcw size={10} /> Reset Back Images
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ImageUploadBlock
              label="Signature"
              type="signature"
              image={uploadedImages.signature}
              onUpload={uploadImage}
              onRemove={removeImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}