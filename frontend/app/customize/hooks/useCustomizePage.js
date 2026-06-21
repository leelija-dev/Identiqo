// app/customize/hooks/useCustomizePage.js
'use client';

import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomizeEditor } from './useCustomizeEditor';
import { useTemplateLoader } from './useTemplateLoader';
import { useDraftManager } from './useDraftManager';
import { useCardDownload } from './useCardDownload';
import { useBarcodeQR } from './useBarcodeQR';
import { useImageUpload } from './useImageUpload';
import { useThemeManager } from './useThemeManager';

// Constants
const DESKTOP_BREAKPOINT = 1024;
const DOM_REBUILD_DELAY = 300;
const PREVIEW_REFRESH_DELAY = 150;
const FLIP_PREVIEW_DELAY = 50;
const TEMPLATE_INJECT_DELAY = 100;
const TEXT_RETRY_DELAY = 100;
const BG_UPLOAD_TIMEOUT = 30000;
const MAX_DRAFT_SIZE = 2_000_000;
const MAX_BG_IMAGE_SIZE = 3 * 1024 * 1024;
const PREVIEW_MAX_SIZE = 100000;

const SELECTORS = {
  front: '.card-front, .face.front',
  back: '.card-back, .face.back',
};

const DEBUG = process.env.NODE_ENV === 'development';
const log = (...args) => DEBUG && console.log(...args);
const logError = (...args) => DEBUG && console.error(...args);
const logWarn = (...args) => DEBUG && console.warn(...args);

export function useCustomizePage(showToastFromProps) {
  const router = useRouter();

  // Mounted guard
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Refs
  const previewCanvasRef = useRef(null);
  const cardScaleWrapRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const domObserverRef = useRef(null);
  const rebuildTimeoutRef = useRef(null);
  const previewTimeoutRef = useRef(null);
  const flipPreviewTimeoutRef = useRef(null);
  const templatePreviewTimeoutRef = useRef(null);
  const textRetryTimeoutRef = useRef(null);
  const refreshTimeoutRef = useRef(null);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [displayMode, setDisplayMode] = useState('flip');
  const [sidePreviewHtml, setSidePreviewHtml] = useState({ front: '', back: '' });
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [editorStageToken, setEditorStageToken] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Custom Hooks
  const editor = useCustomizeEditor(previewCanvasRef);
  const template = useTemplateLoader();
  const drafts = useDraftManager();
  const downloads = useCardDownload();
  const barcodeQR = useBarcodeQR();
  const images = useImageUpload();
  const theme = useThemeManager();

  // Toast helper
  const showToastMessage = useCallback((msg, type = 'success') => {
    if (showToastFromProps) {
      showToastFromProps(msg, type);
    } else {
      log(`[${type}] ${msg}`);
    }
  }, [showToastFromProps]);

  // Refresh editor state
  const refreshEditorState = useCallback(() => {
    editor.buildTextList();
    editor.buildBackgroundBlocks();
    editor.detectFeatures();
  }, [editor.buildTextList, editor.buildBackgroundBlocks, editor.detectFeatures]);

  const debouncedRefreshEditorState = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        refreshEditorState();
      }
    }, 100);
  }, [refreshEditorState]);

  const refreshTextFields = refreshEditorState;

  // Template injection
  const injectTemplateHtml = useCallback((container, html) => {
    if (!container) return;
    domObserverRef.current?.disconnect();
    try {
      container.innerHTML = html;
    } catch (err) {
      logError('Template injection failed:', err);
      showToastMessage('Failed to load template', 'error');
      return;
    }
    editor.invalidateEditorCaches();
    refreshEditorState();
    drafts.clearUnsaved();
  }, [editor, refreshEditorState, drafts, showToastMessage]);

  // Side preview
  const refreshSidePreviewHtml = useCallback(() => {
    if (!previewCanvasRef.current) return;
    const front = editor.getFrontFace();
    const back = editor.getBackFace();

    const cloneFaceForPreview = (face) => {
      if (!face) return '';
      const clone = face.cloneNode(true);
      clone.style.cssText = `
        position: relative !important;
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        transform: none !important;
        backface-visibility: visible !important;
        border-radius: 20px;
        overflow: hidden !important;
      `;
      const sourceCanvases = face.querySelectorAll('canvas');
      const cloneCanvases = clone.querySelectorAll('canvas');
      sourceCanvases.forEach((sourceCanvas, idx) => {
        const cloneCanvas = cloneCanvases[idx];
        if (cloneCanvas) {
          const img = document.createElement('img');
          try {
            img.src = sourceCanvas.toDataURL('image/png');
          } catch {
            img.src = '';
          }
          cloneCanvas.replaceWith(img);
        }
      });
      const stage = previewCanvasRef.current;
      if (stage) {
        ['--primary', '--secondary', '--accent', '--card-bg'].forEach((name) => {
          const value = stage.style.getPropertyValue(name);
          if (value) clone.style.setProperty(name, value);
        });
      }
      return clone.outerHTML;
    };

    const frontHtml = cloneFaceForPreview(front);
    const backHtml = cloneFaceForPreview(back);
    if (frontHtml.length > PREVIEW_MAX_SIZE || backHtml.length > PREVIEW_MAX_SIZE) {
      logWarn('Preview HTML is very large; consider optimizing template.');
    }
    setSidePreviewHtml({ front: frontHtml, back: backHtml });
  }, [editor]);

  // Trigger update
  const triggerUpdate = useCallback(() => {
    drafts.markUnsaved();
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    previewTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        refreshSidePreviewHtml();
      }
    }, PREVIEW_REFRESH_DELAY);
  }, [drafts, refreshSidePreviewHtml]);

  // Share handler
  const handleShare = useCallback(async (action) => {
    if (typeof window === 'undefined') return;
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToastMessage('Link copied to clipboard!', 'success');
      } catch (err) {
        logError('Clipboard copy failed:', err);
        showToastMessage('Unable to copy link', 'error');
      }
    } else if (action === 'email') {
      showToastMessage('Email sharing would open here', 'info');
    } else if (action === 'social') {
      showToastMessage('Social sharing would open here', 'info');
    }
  }, [showToastMessage]);

  // Navigation
  const handleBackNavigation = useCallback(() => {
    const goBackSafely = () => {
      if (typeof window === 'undefined') {
        router.push('/templates');
        return;
      }
      try {
        const referrer = document.referrer ? new URL(document.referrer) : null;
        const isSameOrigin = referrer?.origin === window.location.origin;
        if (isSameOrigin && window.history.length > 1) {
          router.back();
          return;
        }
      } catch {
        // fall through
      }
      router.push('/templates');
    };
    if (!drafts.hasUnsavedChanges) {
      goBackSafely();
      return;
    }
    if (typeof window !== 'undefined' && window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
      drafts.clearUnsaved();
      goBackSafely();
    }
  }, [drafts.hasUnsavedChanges, drafts.clearUnsaved, router]);

  // Flip card
  const flipCard = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) {
      showToastMessage('Canvas not found', 'error');
      return;
    }
    let flipInner = canvas.querySelector('.flip-card-inner');
    if (!flipInner) flipInner = canvas.querySelector('[class*="flip-inner"]');
    if (!flipInner) flipInner = canvas.querySelector('.flipper');
    if (flipInner) {
      setCardFlipped((prev) => {
        const next = !prev;
        flipInner.classList.toggle('flipped', next);
        return next;
      });
      if (flipPreviewTimeoutRef.current) {
        clearTimeout(flipPreviewTimeoutRef.current);
      }
      flipPreviewTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          refreshSidePreviewHtml();
        }
      }, FLIP_PREVIEW_DELAY);
    } else {
      showToastMessage('Flip not supported for this template', 'warning');
    }
  }, [previewCanvasRef, showToastMessage, refreshSidePreviewHtml]);

  // ============================================================
  // TEXT FIELD HANDLERS
  // (Complete implementation – kept as in previous versions)
  // ============================================================

  const getFieldByIndex = useCallback((index) => {
    return editor.textFields.find((f) => f.index === index);
  }, [editor.textFields]);

  const handleTextChange = useCallback(
    (index, newText) => {
      log(`[handleTextChange] Index: ${index}, New Text: "${newText}"`);
      const field = getFieldByIndex(index);
      if (!field) {
        showToastMessage('Field not found', 'error');
        return;
      }
      let element = editor.resolveTextFieldElement(field);
      if (!element) {
        debouncedRefreshEditorState();
        if (textRetryTimeoutRef.current) {
          clearTimeout(textRetryTimeoutRef.current);
        }
        textRetryTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          const retryField = getFieldByIndex(index);
          if (!retryField) return;
          const retryEl = editor.resolveTextFieldElement(retryField);
          if (retryEl) {
            retryEl.textContent = newText;
            retryEl.setAttribute('data-fulltext', newText);
            editor.setTextFields((prev) =>
              prev.map((f) => (f.index === index ? { ...f, text: newText, element: retryEl } : f))
            );
            triggerUpdate();
            log('✓ Text updated on card (retry)');
          } else {
            logError(`Failed to find element for index ${index} after rebuild`);
            showToastMessage('Text field not found in card', 'error');
          }
        }, TEXT_RETRY_DELAY);
        return;
      }
      element.textContent = newText;
      element.setAttribute('data-fulltext', newText);
      editor.setTextFields((prev) =>
        prev.map((f) => (f.index === index ? { ...f, text: newText, element } : f))
      );
      triggerUpdate();
      log('✓ Text updated on card');
    },
    [getFieldByIndex, editor, debouncedRefreshEditorState, triggerUpdate, showToastMessage]
  );

  const handleColorChange = useCallback(
    (index, newColor) => {
      const field = getFieldByIndex(index);
      if (!field) return;
      const element = editor.resolveTextFieldElement(field);
      if (element) {
        element.style.color = newColor;
        editor.setTextFields((prev) =>
          prev.map((f) => (f.index === index ? { ...f, color: newColor } : f))
        );
        triggerUpdate();
      }
    },
    [getFieldByIndex, editor, triggerUpdate]
  );

  const handleFontSizeChange = useCallback(
    (index, nextSize) => {
      const size = Math.min(72, Math.max(8, Number(nextSize) || 14));
      const field = getFieldByIndex(index);
      if (!field) return;
      const element = editor.resolveTextFieldElement(field);
      if (element) {
        element.style.fontSize = `${size}px`;
        editor.setTextFields((prev) =>
          prev.map((f) => (f.index === index ? { ...f, fontSize: size } : f))
        );
        triggerUpdate();
      }
    },
    [getFieldByIndex, editor, triggerUpdate]
  );

  const handleFontFamilyChange = useCallback(
    (index, fontFamily) => {
      const field = getFieldByIndex(index);
      if (!field) return;
      const element = editor.resolveTextFieldElement(field);
      if (element) {
        element.style.fontFamily = fontFamily;
        editor.setTextFields((prev) =>
          prev.map((f) => (f.index === index ? { ...f, fontFamily } : f))
        );
        triggerUpdate();
      }
    },
    [getFieldByIndex, editor, triggerUpdate]
  );

  const toggleTextFieldStyle = useCallback(
    (index, type) => {
      const field = getFieldByIndex(index);
      if (!field) return;
      const element = editor.resolveTextFieldElement(field);
      if (!element) return;
      const computed = getComputedStyle(element);
      if (type === 'bold') {
        const isBold = element.style.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600;
        element.style.fontWeight = isBold ? 'normal' : 'bold';
        editor.setTextFields((prev) =>
          prev.map((f) => (f.index === index ? { ...f, bold: !isBold } : f))
        );
      } else if (type === 'italic') {
        const isItalic = element.style.fontStyle === 'italic' || computed.fontStyle === 'italic';
        element.style.fontStyle = isItalic ? 'normal' : 'italic';
        editor.setTextFields((prev) =>
          prev.map((f) => (f.index === index ? { ...f, italic: !isItalic } : f))
        );
      } else if (type === 'underline') {
        const hasUnderline = (element.style.textDecoration || computed.textDecoration || '').includes('underline');
        element.style.textDecoration = hasUnderline ? 'none' : 'underline';
        editor.setTextFields((prev) =>
          prev.map((f) => (f.index === index ? { ...f, underline: !hasUnderline } : f))
        );
      }
      triggerUpdate();
    },
    [getFieldByIndex, editor, triggerUpdate]
  );

  const resetTextField = useCallback(
    (index, silent = false) => {
      const field = getFieldByIndex(index);
      if (!field) return;
      const element = editor.resolveTextFieldElement(field);
      if (element && field) {
        element.textContent = field.originalText;
        element.style.color = field.originalColor;
        if (field.originalFontSize) element.style.fontSize = field.originalFontSize;
        if (field.originalFontFamily) element.style.fontFamily = field.originalFontFamily;
        element.style.fontWeight = field.originalFontWeight || 'normal';
        element.style.fontStyle = field.originalFontStyle || 'normal';
        element.style.textDecoration = field.originalTextDecoration || 'none';
        const computed = getComputedStyle(element);
        editor.setTextFields((prev) =>
          prev.map((f) =>
            f.index === index
              ? {
                  ...f,
                  text: field.originalText,
                  color: field.originalColor,
                  fontSize: parseInt(computed.fontSize, 10) || 14,
                  fontFamily: computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
                  bold: computed.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600,
                  italic: computed.fontStyle === 'italic',
                  underline: computed.textDecoration?.includes('underline') || false,
                }
              : f
          )
        );
        if (!silent) {
          showToastMessage('Field reset to original', 'info');
        }
        if (!silent) {
          triggerUpdate();
        }
      }
    },
    [getFieldByIndex, editor, triggerUpdate, showToastMessage]
  );

  const resetMultipleTextFields = useCallback(
    (indices, silent = false) => {
      const fieldsToReset = indices
        .map(idx => ({ idx, field: editor.textFields.find(f => f.index === idx) }))
        .filter(({ field }) => !!field);
      if (fieldsToReset.length === 0) return;
      editor.setTextFields((prev) => {
        const updated = [...prev];
        fieldsToReset.forEach(({ idx, field }) => {
          const element = editor.resolveTextFieldElement(field);
          if (element) {
            element.textContent = field.originalText;
            element.style.color = field.originalColor;
            if (field.originalFontSize) element.style.fontSize = field.originalFontSize;
            if (field.originalFontFamily) element.style.fontFamily = field.originalFontFamily;
            element.style.fontWeight = field.originalFontWeight || 'normal';
            element.style.fontStyle = field.originalFontStyle || 'normal';
            element.style.textDecoration = field.originalTextDecoration || 'none';
            const computed = getComputedStyle(element);
            const newField = {
              ...field,
              text: field.originalText,
              color: field.originalColor,
              fontSize: parseInt(computed.fontSize, 10) || 14,
              fontFamily: computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
              bold: computed.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600,
              italic: computed.fontStyle === 'italic',
              underline: computed.textDecoration?.includes('underline') || false,
            };
            const index = updated.findIndex(f => f.index === idx);
            if (index !== -1) updated[index] = newField;
          }
        });
        return updated;
      });
      if (!silent) {
        triggerUpdate();
        showToastMessage('Fields reset', 'info');
      }
    },
    [editor, triggerUpdate, showToastMessage]
  );

  // ============================================================
  // DOM OBSERVER
  // ============================================================

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const observer = new MutationObserver((mutations) => {
      let shouldRebuild = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && canvas.contains(mutation.target)) {
          const target = mutation.target;
          if (target.tagName === 'CANVAS' || target.tagName === 'IMG' || target.tagName === 'SVG') continue;
          if (target.closest?.('.barcode, .barcode-section, .qr-placeholder')) continue;
          const hasRelevantChange = Array.from(mutation.addedNodes).some((node) => {
            if (node.nodeType === 1) {
              const tag = node.tagName?.toLowerCase();
              return tag !== 'canvas' && tag !== 'img' && tag !== 'svg';
            }
            return false;
          });
          if (hasRelevantChange || mutation.removedNodes.length > 0) {
            shouldRebuild = true;
            break;
          }
        }
      }
      if (shouldRebuild) {
        if (rebuildTimeoutRef.current) clearTimeout(rebuildTimeoutRef.current);
        rebuildTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          log('DOM changed, rebuilding text fields...');
          startTransition(() => {
            debouncedRefreshEditorState();
          });
        }, DOM_REBUILD_DELAY);
      }
    });

    observer.observe(canvas, { childList: true, subtree: true, attributes: false });
    domObserverRef.current = observer;

    return () => {
      if (domObserverRef.current) {
        domObserverRef.current.disconnect();
        domObserverRef.current = null;
      }
      if (rebuildTimeoutRef.current) clearTimeout(rebuildTimeoutRef.current);
    };
  }, [previewCanvasRef, debouncedRefreshEditorState]);

  // ============================================================
  // DOWNLOAD, DRAFTS, RESET, BACKGROUND, etc.
  // ============================================================

  const handleDownload = useCallback(
    (format) => {
      try {
        const card = editor.getCurrentCardElement();
        const frontFace = card?.querySelector(SELECTORS.front);
        const backFace = card?.querySelector(SELECTORS.back);
        if (!frontFace && !backFace) {
          showToastMessage('No card sides found', 'error');
          return;
        }
        downloads.downloadCardBothSides(
          format,
          frontFace,
          backFace,
          template.currentOrientation,
          showToastMessage
        );
      } catch (err) {
        logError('Download failed:', err);
        showToastMessage('Download failed', 'error');
      }
    },
    [editor, downloads, template.currentOrientation, showToastMessage]
  );

  const handleSaveToDrafts = useCallback(() => {
    if (!previewCanvasRef.current) {
      showToastMessage('No template to save', 'error');
      return;
    }
    const html = previewCanvasRef.current.innerHTML;
    const draftSize = new Blob([html]).size;
    if (draftSize > MAX_DRAFT_SIZE) {
      showToastMessage('Template too large to save (over 2MB). Remove large images first.', 'error');
      return;
    }
    try {
      drafts.saveToDrafts(
        template.currentTemplate,
        template.currentOrientation,
        html,
        template.currentTemplate?.name
      );
      drafts.clearUnsaved();
      showToastMessage('✅ Saved to Drafts!', 'success');
    } catch (error) {
      logError('Save to drafts failed:', error);
      showToastMessage('Failed to save draft', 'error');
    }
  }, [drafts, template, showToastMessage]);

  const cleanupBackgroundUrls = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    canvas.querySelectorAll('.editable-bg').forEach((el) => {
      const url = el.dataset.bgObjectUrl;
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
        delete el.dataset.bgObjectUrl;
      }
    });
  }, []);

  const handleResetAll = useCallback(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    cleanupBackgroundUrls();
    const original = template.resetToOriginal();
    if (original && previewCanvasRef.current) {
      domObserverRef.current?.disconnect();
      try {
        previewCanvasRef.current.innerHTML = original;
      } catch (err) {
        logError('Reset failed:', err);
        showToastMessage('Failed to reset template', 'error');
        return;
      }
      images.setUploadedImages({ profile: null, signature: null, logo: null });
      editor.setBackgroundBlocks([]);
      barcodeQR.setBarcodeValue('');
      barcodeQR.setQrValue('');
      theme.resetToDefaultTheme(previewCanvasRef, triggerUpdate);
      editor.invalidateEditorCaches();
      refreshEditorState();
      startTransition(() => {
        editor.buildSidebar();
        triggerUpdate();
      });
      showToastMessage('Reset to original template', 'info');
      drafts.clearUnsaved();
    }
  }, [template, editor, images, barcodeQR, theme, triggerUpdate, showToastMessage, drafts, cleanupBackgroundUrls]);

  const resetSide = useCallback((side) => {
    if (!previewCanvasRef.current) return;
    const originalHtml = template.originalHTML;
    if (!originalHtml) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHtml;
    const selector = side === 'front' ? SELECTORS.front : SELECTORS.back;
    const originalSide = tempDiv.querySelector(selector);
    const currentSide = side === 'front' ? editor.getFrontFace() : editor.getBackFace();
    if (originalSide && currentSide) {
      domObserverRef.current?.disconnect();
      currentSide.innerHTML = originalSide.innerHTML;
      currentSide.className = originalSide.className;
      refreshEditorState();
      triggerUpdate();
      showToastMessage(`${side === 'front' ? 'Front' : 'Back'} side reset to original`, 'success');
    }
  }, [template.originalHTML, previewCanvasRef, editor, refreshEditorState, triggerUpdate, showToastMessage]);

  const resetFrontSide = useCallback(() => resetSide('front'), [resetSide]);
  const resetBackSide = useCallback(() => resetSide('back'), [resetSide]);

  const resetFrontSideTexts = useCallback(() => {
    const frontIndices = editor.textFields
      .filter((f) => f.side === 'Front')
      .map((f) => f.index);
    resetMultipleTextFields(frontIndices, true);
    triggerUpdate();
    showToastMessage('Front side texts reset', 'success');
  }, [editor.textFields, resetMultipleTextFields, triggerUpdate, showToastMessage]);

  const resetBackSideTexts = useCallback(() => {
    const backIndices = editor.textFields
      .filter((f) => f.side === 'Back')
      .map((f) => f.index);
    resetMultipleTextFields(backIndices, true);
    triggerUpdate();
    showToastMessage('Back side texts reset', 'success');
  }, [editor.textFields, resetMultipleTextFields, triggerUpdate, showToastMessage]);

  const resetFrontSideImages = useCallback(() => {
    images.removeImage('profile', previewCanvasRef, showToastMessage, triggerUpdate);
    images.removeImage('logo', previewCanvasRef, showToastMessage, triggerUpdate);
  }, [images, previewCanvasRef, showToastMessage, triggerUpdate]);

  const resetBackSideImages = useCallback(() => {
    images.removeImage('signature', previewCanvasRef, showToastMessage, triggerUpdate);
  }, [images, previewCanvasRef, showToastMessage, triggerUpdate]);

  const resetBarcode = useCallback(
    (showToast = true) => {
      barcodeQR.setBarcodeValue('');
      const barcodeElements = editor
        .getCurrentCardElement()
        ?.querySelectorAll('.barcode, .barcode-section');
      if (barcodeElements?.length) {
        barcodeElements.forEach((container) => {
          if (container.dataset.originalHtml) {
            container.innerHTML = container.dataset.originalHtml;
          } else {
            container.innerHTML = '';
          }
        });
      }
      if (showToast) {
        showToastMessage('Barcode reset', 'info');
      }
      triggerUpdate();
    },
    [barcodeQR, editor, triggerUpdate, showToastMessage]
  );

  const resetQRCode = useCallback(
    (showToast = true) => {
      barcodeQR.setQrValue('');
      const qrElements = editor
        .getCurrentCardElement()
        ?.querySelectorAll('.qr-placeholder');
      if (qrElements?.length) {
        qrElements.forEach((placeholder) => {
          if (placeholder.dataset.originalHtml) {
            placeholder.innerHTML = placeholder.dataset.originalHtml;
          } else {
            placeholder.innerHTML = '';
          }
        });
      }
      if (showToast) {
        showToastMessage('QR code reset', 'info');
      }
      triggerUpdate();
    },
    [barcodeQR, editor, triggerUpdate, showToastMessage]
  );

  const resetFrontSideBarcodeQR = useCallback(() => {
    resetBarcode(false);
    resetQRCode(false);
    showToastMessage('Front side barcode/QR reset', 'success');
  }, [resetBarcode, resetQRCode, showToastMessage]);

  const resetBackSideBarcodeQR = useCallback(() => {
    resetBarcode(false);
    resetQRCode(false);
    showToastMessage('Back side barcode/QR reset', 'success');
  }, [resetBarcode, resetQRCode, showToastMessage]);

  // Background handlers
  const setBackgroundMode = useCallback(
    (blockIndex, mode) => {
      const block = editor.backgroundBlocks.find((b) => b.index === blockIndex);
      const element = editor.resolveBackgroundElement(block);
      if (block && element) {
        if (mode === 'solid') {
          element.style.backgroundImage = 'none';
          element.style.background = block.currentColor;
        }
        editor.setBackgroundBlocks((prev) =>
          prev.map((b) => (b.index === blockIndex ? { ...b, mode, element } : b))
        );
        triggerUpdate();
      }
    },
    [editor, triggerUpdate]
  );

  const setSolidColor = useCallback(
    (blockIndex, color) => {
      const block = editor.backgroundBlocks.find((b) => b.index === blockIndex);
      const element = editor.resolveBackgroundElement(block);
      if (block && element) {
        element.style.backgroundImage = 'none';
        element.style.background = color;
        editor.setBackgroundBlocks((prev) =>
          prev.map((b) => (b.index === blockIndex ? { ...b, currentColor: color, element } : b))
        );
        triggerUpdate();
      }
    },
    [editor, triggerUpdate]
  );

  const setGradient = useCallback(
    (blockIndex, color1, color2, direction) => {
      const block = editor.backgroundBlocks.find((b) => b.index === blockIndex);
      const element = editor.resolveBackgroundElement(block);
      if (block && element) {
        const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
        element.style.background = gradient;
        element.style.backgroundImage = gradient;
        editor.setBackgroundBlocks((prev) =>
          prev.map((b) =>
            b.index === blockIndex
              ? { ...b, gradColor1: color1, gradColor2: color2, gradDirection: direction, element }
              : b
          )
        );
        triggerUpdate();
      }
    },
    [editor, triggerUpdate]
  );

  const uploadBackgroundImage = useCallback(
    (blockIndex) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      document.body.appendChild(input);

      const cleanup = () => {
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
      };

      const safetyTimeout = setTimeout(() => {
        if (isMountedRef.current) cleanup();
      }, BG_UPLOAD_TIMEOUT);

      input.onchange = (e) => {
        clearTimeout(safetyTimeout);
        const file = e.target.files?.[0];
        if (!file) {
          cleanup();
          return;
        }
        if (!file.type.startsWith('image/')) {
          showToastMessage('Please select an image file', 'error');
          cleanup();
          return;
        }
        if (file.size > MAX_BG_IMAGE_SIZE) {
          showToastMessage('Background image must be smaller than 3MB', 'error');
          cleanup();
          return;
        }
        const block = editor.backgroundBlocks.find((b) => b.index === blockIndex);
        const element = editor.resolveBackgroundElement(block);
        if (block && element) {
          const oldUrl = element.dataset.bgObjectUrl;
          if (oldUrl && oldUrl.startsWith('blob:')) {
            URL.revokeObjectURL(oldUrl);
          }
          const objectUrl = URL.createObjectURL(file);
          element.dataset.bgObjectUrl = objectUrl;
          element.style.backgroundImage = `url(${objectUrl})`;
          element.style.backgroundSize = 'cover';
          element.style.backgroundPosition = 'center';
          setBackgroundMode(blockIndex, 'image');
          triggerUpdate();
        }
        cleanup();
      };

      input.oncancel = () => {
        clearTimeout(safetyTimeout);
        cleanup();
      };

      input.click();
    },
    [editor, setBackgroundMode, triggerUpdate, showToastMessage]
  );

  const refreshBackgrounds = useCallback(() => {
    if (template.currentTemplate?.category === 'employee') {
      editor.buildBackgroundBlocks();
      showToastMessage('Background list refreshed', 'info');
      drafts.markUnsaved();
    }
  }, [template, editor, showToastMessage, drafts]);

  // Toggle functions
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  const toggleDisplayMode = useCallback(() => {
    const next = displayMode === 'flip' ? 'both' : 'flip';
    if (next === 'both') {
      refreshSidePreviewHtml();
    }
    if (next === 'flip') {
      const canvas = previewCanvasRef.current;
      if (canvas) {
        const isEmpty = !canvas.innerHTML || canvas.innerHTML.length < 50;
        if (isEmpty && template.pendingTemplateHtml) {
          injectTemplateHtml(canvas, template.pendingTemplateHtml);
          triggerUpdate();
        }
      }
    }
    setDisplayMode(next);
  }, [
    displayMode,
    template.pendingTemplateHtml,
    previewCanvasRef,
    injectTemplateHtml,
    refreshSidePreviewHtml,
    triggerUpdate,
  ]);

  const handleEditorStageReady = useCallback(() => {
    setEditorStageToken((prev) => prev + 1);
  }, []);

  // ============================================================
  // MAIN EFFECT: LOAD TEMPLATE
  // ============================================================

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (
      !template.isLoading &&
      template.pendingTemplateHtml &&
      previewCanvasRef.current &&
      editorStageToken > 0
    ) {
      const canvas = previewCanvasRef.current;
      if (!canvas.innerHTML || canvas.innerHTML.length < 50) {
        injectTemplateHtml(canvas, template.pendingTemplateHtml);
        if (template.currentTemplate?.category === 'visiting') {
          const defaults = {
            primary: '#ff7e5f',
            secondary: '#6a11cb',
            accent: '#2575fc',
            cardBg: '#ffffff',
          };
          theme.applyThemeColors(
            template.currentTemplate?.themeColors?.primary || defaults.primary,
            template.currentTemplate?.themeColors?.secondary || defaults.secondary,
            template.currentTemplate?.themeColors?.accent || defaults.accent,
            '#ffffff',
            previewCanvasRef,
            triggerUpdate
          );
        }
        startTransition(() => {
          editor.buildSidebar();
        });
        if (templatePreviewTimeoutRef.current) {
          clearTimeout(templatePreviewTimeoutRef.current);
        }
        templatePreviewTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            refreshSidePreviewHtml();
          }
        }, TEMPLATE_INJECT_DELAY);
      }
    }
  }, [
    template.isLoading,
    template.pendingTemplateHtml,
    template.currentTemplate,
    previewCanvasRef,
    editor.buildSidebar,
    theme.applyThemeColors,
    refreshSidePreviewHtml,
    injectTemplateHtml,
    editorStageToken,
    triggerUpdate,
  ]);

  // Responsive layout detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const updateLayout = () => {
      const isDesktop = mediaQuery.matches;
      setIsDesktopLayout(isDesktop);
      if (!isDesktop && displayMode !== 'flip') setDisplayMode('flip');
    };
    updateLayout();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateLayout);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(updateLayout);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateLayout);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(updateLayout);
      }
    };
  }, [displayMode]);

  // Unsaved changes warning
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleBeforeUnload = (e) => {
      if (drafts.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [drafts.hasUnsavedChanges]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current);
      if (rebuildTimeoutRef.current) clearTimeout(rebuildTimeoutRef.current);
      if (flipPreviewTimeoutRef.current) clearTimeout(flipPreviewTimeoutRef.current);
      if (templatePreviewTimeoutRef.current) clearTimeout(templatePreviewTimeoutRef.current);
      if (textRetryTimeoutRef.current) clearTimeout(textRetryTimeoutRef.current);
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      cleanupBackgroundUrls();
    };
  }, [cleanupBackgroundUrls]);

  // ============================================================
  // RETURN OBJECT (all required functions included)
  // ============================================================

  return {
    previewCanvasRef,
    cardScaleWrapRef,
    downloadMenuRef,
    currentTemplate: template.currentTemplate,
    currentOrientation: template.currentOrientation,
    isLoading: template.isLoading,
    pendingTemplateHtml: template.pendingTemplateHtml,
    textFields: editor.textFields,
    backgroundBlocks: editor.backgroundBlocks,
    detectedFeatures: editor.detectedFeatures,
    selectedTheme: theme.selectedTheme,
    customPrimary: theme.customPrimary,
    customSecondary: theme.customSecondary,
    customAccent: theme.customAccent,
    customCardBg: theme.customCardBg,
    uploadedImages: images.uploadedImages,
    barcodeValue: barcodeQR.barcodeValue,
    qrValue: barcodeQR.qrValue,
    showDownloadMenu: downloads.showDownloadMenu,
    isSidebarOpen,
    displayMode,
    sidePreviewHtml,
    isDesktopLayout,
    cardFlipped,
    showShareMenu,
    setBarcodeValue: barcodeQR.setBarcodeValue,
    setQrValue: barcodeQR.setQrValue,
    setShowDownloadMenu: downloads.setShowDownloadMenu,
    setShowShareMenu,
    setSelectedTheme: theme.setSelectedTheme,
    setCustomPrimary: theme.setCustomPrimary,
    setCustomSecondary: theme.setCustomSecondary,
    setCustomAccent: theme.setCustomAccent,
    setCustomCardBg: theme.setCustomCardBg,
    handleTextChange,
    handleColorChange,
    handleFontSizeChange,
    handleFontFamilyChange,
    toggleTextFieldStyle,
    resetTextField,
    refreshTextFields,
    handleBackNavigation,
    flipCard,
    toggleSidebar,
    toggleDisplayMode,
    handleEditorStageReady,
    setBackgroundMode,
    setSolidColor,
    setGradient,
    uploadBackgroundImage,
    refreshBackgrounds,
    applyTheme: (themeName) => theme.applyTheme(themeName, previewCanvasRef, triggerUpdate),
    uploadImage: (type) => images.uploadImage(type, previewCanvasRef, showToastMessage, triggerUpdate),
    removeImage: (type) => images.removeImage(type, previewCanvasRef, showToastMessage, triggerUpdate),
    generateBarcodeOnCanvas: barcodeQR.generateBarcodeOnCanvas,
    generateQRCodeOnCanvas: barcodeQR.generateQRCodeOnCanvas,
    isGenerating: barcodeQR.isGenerating,
    saveToDrafts: handleSaveToDrafts,
    resetAll: handleResetAll,
    downloadCardBothSides: handleDownload,
    handleShare,
    triggerUpdate,
    showToastMessage,
    resetFrontSide,
    resetBackSide,
    resetFrontSideTexts,
    resetBackSideTexts,
    resetFrontSideImages,
    resetBackSideImages,
    resetBarcode,
    resetQRCode,
    resetFrontSideBarcodeQR,
    resetBackSideBarcodeQR,
  };
}
