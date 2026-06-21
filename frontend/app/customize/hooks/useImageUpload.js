// app/customize/hooks/useImageUpload.js
'use client';

import { useState, useCallback, useRef } from 'react';

// Image selectors – moved outside hook to prevent recreation
const IMAGE_SELECTORS = {
  profile: ['.profile-image', '.profile-img', '.profile-photo'],
  signature: ['.sign-img', '.sign-placeholder', '.signature-placeholder'],
  logo: ['.logo']
};

// Helper: restore a single element to its original state
const restoreElement = (el) => {
  if (el.tagName === 'IMG') {
    if (el.dataset.originalSrc) {
      el.src = el.dataset.originalSrc;
      delete el.dataset.originalSrc;
    } else {
      el.src = '';
      el.style.display = 'none';
    }
    // Clear any leftover styles
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    el.style.backgroundRepeat = '';
    return;
  }

  const img = el.querySelector('img');
  if (img && img.dataset.originalSrc) {
    img.src = img.dataset.originalSrc;
    img.style.display = 'block';
    delete img.dataset.originalSrc;
    img.style.backgroundImage = '';
    img.style.backgroundSize = '';
    img.style.backgroundPosition = '';
    img.style.backgroundRepeat = '';
  }

  if (el.dataset.originalHtml) {
    el.innerHTML = el.dataset.originalHtml;
    delete el.dataset.originalHtml;
    el.style.backgroundImage = '';
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    el.style.backgroundRepeat = '';
    if (el.dataset.originalBg) {
      delete el.dataset.originalBg;
    }
  } else {
    el.innerHTML = '';
    if (el.dataset.originalBg) {
      el.style.backgroundImage = el.dataset.originalBg;
      delete el.dataset.originalBg;
    } else {
      el.style.backgroundImage = 'none';
    }
    el.style.backgroundSize = '';
    el.style.backgroundPosition = '';
    el.style.backgroundRepeat = '';
  }
};

// Helper: capitalize first letter with fallback
const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

// Allowed image extensions
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export function useImageUpload() {
  const [uploadedImages, setUploadedImages] = useState({
    profile: null,
    signature: null,
    logo: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const uploadLockRef = useRef(false);

  const cleanupInput = (input) => {
    if (input && document.body.contains(input)) {
      document.body.removeChild(input);
    }
  };

  const uploadImage = useCallback((type, previewCanvasRef, showToast, triggerUpdate) => {
    return new Promise((resolve, reject) => {
      // Lock check with toast
      if (uploadLockRef.current) {
        showToast?.('Upload already in progress', 'warning');
        reject(new Error('Upload already in progress'));
        return;
      }

      // Validate image type
      if (!IMAGE_SELECTORS[type]) {
        showToast?.('Invalid image type', 'error');
        reject(new Error(`Unknown image type: ${type}`));
        return;
      }

      // Check canvas is ready
      if (!previewCanvasRef?.current) {
        showToast?.('Canvas not ready. Please wait.', 'warning');
        reject(new Error('Canvas not ready'));
        return;
      }

      uploadLockRef.current = true;
      setIsUploading(true);

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      document.body.appendChild(input);

      // Final cleanup function – resets lock and removes input
      const finalCleanup = () => {
        cleanupInput(input);
        uploadLockRef.current = false;
        setIsUploading(false);
      };

      // Fallback cleanup: if the file picker is cancelled and `oncancel` doesn't fire,
      // clean up after a timeout. (Some browsers never fire oncancel.)
      // const cancelTimeout = setTimeout(() => {
      //   // If the input is still attached and no file was selected, we assume cancellation.
      //   // However, we only clean up if the input is still in the DOM and we haven't already resolved.
      //   if (document.body.contains(input)) {
      //     // Don't resolve/reject – just clean up to avoid stuck state.
      //     // The user might have simply closed the dialog without selecting.
      //     // We don't want to reject the promise because that might be considered an error.
      //     // So we just clean up and let the promise remain pending? Actually we need to reject to let the caller know.
      //     // But we already have an oncancel handler that rejects. However, if oncancel doesn't fire, we need to reject.
      //     // We'll reject with a cancellation error.
      //     if (!uploadLockRef.current) return; // already cleaned
      //     finalCleanup();
      //     reject(new Error('Upload cancelled (timeout)'));
      //   }
      // }, 5000); // 5 seconds should be enough for most users

      input.onchange = (e) => {
        clearTimeout(cancelTimeout);
        const file = e.target.files?.[0];
        if (!file) {
          finalCleanup();
          reject(new Error('No file selected'));
          return;
        }

        if (!file.type.startsWith('image/')) {
          showToast?.('Please select a valid image file', 'error');
          finalCleanup();
          reject(new Error('Invalid file type'));
          return;
        }

        // Validate file extension with fallback
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
          showToast?.('Only JPG, PNG, and WEBP files are allowed', 'error');
          finalCleanup();
          reject(new Error('Unsupported file format'));
          return;
        }

        // 2MB limit
        const MAX_FILE_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          showToast?.('Image must be smaller than 2MB', 'error');
          finalCleanup();
          reject(new Error('File too large'));
          return;
        }

        const reader = new FileReader();

        reader.onload = (ev) => {
          try {
            const imageData = ev.target?.result;
            if (typeof imageData !== 'string') {
              throw new Error('Invalid image data');
            }

            // Prevent oversized Base64 strings (approx 2.6MB for a 2MB image)
            if (imageData.length > 3_000_000) {
              throw new Error('Image data too large after encoding');
            }

            const selectors = IMAGE_SELECTORS[type];
            if (!selectors?.length) {
              throw new Error('No selectors configured for this image type');
            }

            const selectorString = selectors.join(',');
            const containers = previewCanvasRef.current.querySelectorAll(selectorString);

            if (containers?.length) {
              // Only update state if we actually found placeholders
              setUploadedImages(prev => ({ ...prev, [type]: imageData }));

              containers.forEach(el => {
                if (el.tagName === 'IMG') {
                  if (!el.dataset.originalSrc) {
                    el.dataset.originalSrc = el.src;
                  }
                  el.src = imageData;
                  el.style.display = 'block';
                  return;
                }

                const img = el.querySelector('img');
                if (img) {
                  if (!el.dataset.originalHtml) {
                    el.dataset.originalHtml = el.innerHTML;
                  }
                  if (!img.dataset.originalSrc) {
                    img.dataset.originalSrc = img.src;
                  }
                  img.src = imageData;
                  img.style.display = 'block';
                } else {
                  if (!el.dataset.originalHtml) {
                    el.dataset.originalHtml = el.innerHTML;
                  }
                  if (!el.dataset.originalBg) {
                    el.dataset.originalBg = getComputedStyle(el).backgroundImage || 'none';
                  }
                  el.innerHTML = '';
                  el.style.backgroundImage = `url(${imageData})`;
                  el.style.backgroundSize = type === 'signature' ? 'contain' : 'cover';
                  el.style.backgroundPosition = 'center';
                  el.style.backgroundRepeat = 'no-repeat';
                }
              });

              showToast?.(`${capitalize(type)} uploaded successfully ✓`, 'success');

              try {
                triggerUpdate?.();
              } catch (err) {
                console.error('triggerUpdate failed:', err);
              }

              resolve(true);
            } else {
              showToast?.(`No ${type} placeholder found in template`, 'warning');
              resolve(false);
            }
          } catch (error) {
            showToast?.(error?.message || 'Image upload failed', 'error');
            reject(error);
          } finally {
            finalCleanup();
          }
        };

        reader.onerror = (err) => {
          console.error('FileReader error:', err);
          showToast?.('Failed to read image file', 'error');
          finalCleanup();
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      };

      input.oncancel = () => {
        clearTimeout(cancelTimeout);
        finalCleanup();
        reject(new Error('Upload cancelled'));
      };

      input.click();
    });
  }, []);

  const removeImage = useCallback((type, previewCanvasRef, showToast, triggerUpdate) => {
    if (!IMAGE_SELECTORS[type]) {
      showToast?.(`Unknown image type: ${type}`, 'error');
      return;
    }

    setUploadedImages(prev => ({ ...prev, [type]: null }));

    const containers = previewCanvasRef?.current?.querySelectorAll(IMAGE_SELECTORS[type].join(','));
    if (containers?.length) {
      containers.forEach(restoreElement);
    }

    showToast?.(`${capitalize(type)} removed`, 'info');

    try {
      triggerUpdate?.();
    } catch (err) {
      console.error('triggerUpdate failed:', err);
    }
  }, []);

  const clearAllImages = useCallback((previewCanvasRef, showToast, triggerUpdate) => {
    setUploadedImages({
      profile: null,
      signature: null,
      logo: null
    });

    Object.keys(IMAGE_SELECTORS).forEach(type => {
      const containers = previewCanvasRef?.current?.querySelectorAll(IMAGE_SELECTORS[type].join(','));
      if (containers?.length) {
        containers.forEach(restoreElement);
      }
    });

    showToast?.('All images cleared', 'info');

    try {
      triggerUpdate?.();
    } catch (err) {
      console.error('triggerUpdate failed:', err);
    }
  }, []);

  const getImage = useCallback((type) => uploadedImages[type], [uploadedImages]);
  const hasImage = useCallback((type) => !!uploadedImages[type], [uploadedImages]);

  return {
    uploadedImages,
    isUploading,
    setUploadedImages,
    uploadImage,
    removeImage,
    clearAllImages,
    getImage,
    hasImage,
  };
}