// app/customize/hooks/useCustomizePage.js
'use client';

import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { allTemplates, normalizeTemplateHtml } from '@/templatesdata';
import { useCustomizeEditor } from './useCustomizeEditor';
import { jsPDF } from 'jspdf';

export function useCustomizePage() {
  const router = useRouter();

  // Refs
  const previewCanvasRef = useRef(null);
  const cardScaleWrapRef = useRef(null);
  const sidebarRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(true);
  const downloadMenuRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // State
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentOrientation, setCurrentOrientation] = useState('landscape');
  const [originalHTML, setOriginalHTML] = useState(null);
  const [pendingTemplateHtml, setPendingTemplateHtml] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [displayMode, setDisplayMode] = useState('flip');
  const [sidePreviewHtml, setSidePreviewHtml] = useState({ front: '', back: '' });
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [editorStageToken, setEditorStageToken] = useState(0);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  // Share state
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Custom editor hook (handles text fields, backgrounds, features)
  const {
    textFields, setTextFields,
    backgroundBlocks, setBackgroundBlocks,
    detectedFeatures,
    selectedTheme, setSelectedTheme,
    customPrimary, setCustomPrimary,
    customSecondary, setCustomSecondary,
    customAccent, setCustomAccent,
    customCardBg, setCustomCardBg,
    uploadedImages, setUploadedImages,
    hasUnsavedChanges,
    getCurrentCardElement,
    getFrontFace,
    getBackFace,
    resolveTextFieldElement,
    resolveBackgroundElement,
    buildSidebar,
    invalidateEditorCaches,
    markUnsaved,
    clearUnsaved,
  } = useCustomizeEditor(previewCanvasRef);

  // ---- Toast helper ----
  const showToastMessage = useCallback((msg) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 2000);
  }, []);

  // ---- Share handler (static) ----
  const handleShare = useCallback((action) => {
    if (action === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      showToastMessage('Link copied to clipboard!');
    } else if (action === 'email') {
      showToastMessage('Email sharing would open here (static demo)');
    } else if (action === 'social') {
      showToastMessage('Social sharing would open here (static demo)');
    }
  }, [showToastMessage]);

  // ---- Side‑by‑side preview (both sides) ----
  const refreshSidePreviewHtml = useCallback(() => {
    requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      const front = getFrontFace();
      const back = getBackFace();

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
          -webkit-backface-visibility: visible !important;
          opacity: 1 !important;
          visibility: visible !important;
          overflow: hidden !important;
          border-radius: 20px;
        `;
        // Replace canvases with images (for barcode/qr)
        const sourceCanvases = face.querySelectorAll('canvas');
        const cloneCanvases = clone.querySelectorAll('canvas');
        sourceCanvases.forEach((sourceCanvas, idx) => {
          const cloneCanvas = cloneCanvases[idx];
          if (cloneCanvas) {
            const img = document.createElement('img');
            try { img.src = sourceCanvas.toDataURL('image/png'); } catch { img.src = 'data:image/png;base64,...'; }
            img.style.cssText = sourceCanvas.getAttribute('style') || '';
            cloneCanvas.replaceWith(img);
          }
        });
        // Copy CSS custom properties
        const stage = previewCanvasRef.current;
        if (stage) {
          ['--primary', '--secondary', '--accent', '--card-bg'].forEach(name => {
            const value = stage.style.getPropertyValue(name);
            if (value) clone.style.setProperty(name, value);
          });
        }
        return clone.outerHTML;
      };

      setSidePreviewHtml({
        front: cloneFaceForPreview(front),
        back: cloneFaceForPreview(back),
      });
    });
  }, [getFrontFace, getBackFace, previewCanvasRef]);

  const triggerUpdate = useCallback(() => {
    refreshSidePreviewHtml();
    markUnsaved();
  }, [refreshSidePreviewHtml, markUnsaved]);

  // ---- Navigation ----
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
        // Fall through to the route fallback below.
      }

      router.push('/templates');
    };

    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        clearUnsaved();
        goBackSafely();
      }
    } else {
      goBackSafely();
    }
  }, [hasUnsavedChanges, clearUnsaved, router]);

  // ---- Flip card (single side mode) ----
  const flipCard = useCallback(() => {
    const card = getCurrentCardElement();
    const front = getFrontFace();
    const back = getBackFace();
    if (!front || !back) {
      showToastMessage('Card sides not found');
      return;
    }
    const flipInner = card?.querySelector('.flip-card-inner');
    if (flipInner) {
      const newFlipped = !cardFlipped;
      flipInner.style.transform = newFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
      setCardFlipped(newFlipped);
      showToastMessage(newFlipped ? 'Showing back side' : 'Showing front side');
    }
  }, [getCurrentCardElement, getFrontFace, getBackFace, showToastMessage, cardFlipped]);

  // ---- Text field handlers (unchanged, included for completeness) ----
  const handleTextChange = useCallback((index, newText) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.innerText = newText;
      element.setAttribute('data-fulltext', newText);
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, text: newText, element } : f));
      triggerUpdate();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, triggerUpdate]);

  const handleColorChange = useCallback((index, newColor) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.color = newColor;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, color: newColor, element } : f));
      triggerUpdate();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, triggerUpdate]);

  const handleFontSizeChange = useCallback((index, nextSize) => {
    const size = Math.min(72, Math.max(8, Number(nextSize) || 14));
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.fontSize = `${size}px`;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, fontSize: size, element } : f));
      triggerUpdate();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, triggerUpdate]);

  const handleFontFamilyChange = useCallback((index, fontFamily) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.fontFamily = fontFamily;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, fontFamily, element } : f));
      triggerUpdate();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, triggerUpdate]);

  const toggleTextFieldStyle = useCallback((index, type) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (!element) return;
    const computed = getComputedStyle(element);
    if (type === 'bold') {
      const isBold = element.style.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600;
      element.style.fontWeight = isBold ? 'normal' : 'bold';
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, bold: !isBold, element } : f));
    } else if (type === 'italic') {
      const isItalic = element.style.fontStyle === 'italic' || computed.fontStyle === 'italic';
      element.style.fontStyle = isItalic ? 'normal' : 'italic';
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, italic: !isItalic, element } : f));
    } else if (type === 'underline') {
      const hasUnderline = (element.style.textDecoration || computed.textDecoration || '').includes('underline');
      element.style.textDecoration = hasUnderline ? 'none' : 'underline';
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, underline: !hasUnderline, element } : f));
    }
    triggerUpdate();
  }, [textFields, resolveTextFieldElement, setTextFields, triggerUpdate]);

  const resetTextField = useCallback((index) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.innerText = field.originalText;
      element.style.color = field.originalColor;
      if (field.originalFontSize) element.style.fontSize = field.originalFontSize;
      if (field.originalFontFamily) element.style.fontFamily = field.originalFontFamily;
      element.style.fontWeight = field.originalFontWeight || 'normal';
      element.style.fontStyle = field.originalFontStyle || 'normal';
      element.style.textDecoration = field.originalTextDecoration || 'none';
      const computed = getComputedStyle(element);
      setTextFields(prev => prev.map(f => f.index === index ? {
        ...f,
        text: field.originalText,
        color: field.originalColor,
        fontSize: parseInt(computed.fontSize, 10) || 14,
        fontFamily: computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim(),
        bold: computed.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600,
        italic: computed.fontStyle === 'italic',
        underline: computed.textDecoration?.includes('underline') || false,
      } : f));
      showToastMessage('Field reset to original');
      triggerUpdate();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, showToastMessage, triggerUpdate]);

  // ---- Background handlers (unchanged, included for completeness) ----
  const setBackgroundMode = useCallback((blockIndex, mode) => {
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    const element = resolveBackgroundElement(block);
    if (block && element) {
      if (mode === 'solid') {
        element.style.backgroundImage = 'none';
        element.style.background = block.currentColor;
      }
      setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, mode, element } : b));
      triggerUpdate();
    }
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundBlocks, triggerUpdate]);

  const setSolidColor = useCallback((blockIndex, color) => {
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    const element = resolveBackgroundElement(block);
    if (block && element) {
      element.style.backgroundImage = 'none';
      element.style.background = color;
      setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, currentColor: color, element } : b));
      triggerUpdate();
    }
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundBlocks, triggerUpdate]);

  const setGradient = useCallback((blockIndex, color1, color2, direction) => {
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    const element = resolveBackgroundElement(block);
    if (block && element) {
      const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
      element.style.background = gradient;
      element.style.backgroundImage = gradient;
      setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, gradColor1: color1, gradColor2: color2, gradDirection: direction, element } : b));
      triggerUpdate();
    }
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundBlocks, triggerUpdate]);

  const uploadBackgroundImage = useCallback((blockIndex) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    document.body.appendChild(input);
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const block = backgroundBlocks.find(b => b.index === blockIndex);
        const element = resolveBackgroundElement(block);
        if (block && element) {
          element.style.backgroundImage = `url(${ev.target.result})`;
          element.style.backgroundSize = 'cover';
          element.style.backgroundPosition = 'center';
          setBackgroundMode(blockIndex, 'image');
          triggerUpdate();
        }
        document.body.removeChild(input);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundMode, triggerUpdate]);

  const refreshBackgrounds = useCallback(() => {
    if (currentTemplate?.category === 'employee') {
      const card = getCurrentCardElement();
      const front = getFrontFace();
      const back = getBackFace();
      if (front && !front.classList.contains('editable-bg')) front.classList.add('editable-bg');
      if (back && !back.classList.contains('editable-bg')) back.classList.add('editable-bg');
      const bgElements = card?.querySelectorAll('.editable-bg') || [];
      const newBlocks = Array.from(bgElements).map((el, idx) => ({
        index: idx,
        element: el,
        label: el.closest('.card-back, .back') ? `Background ${idx+1} (Back)` : `Background ${idx+1} (Front)`,
        currentColor: '#ffffff',
        mode: 'solid',
      }));
      setBackgroundBlocks(newBlocks);
      showToastMessage('Background list refreshed');
      markUnsaved();
    }
  }, [currentTemplate, getCurrentCardElement, getFrontFace, getBackFace, setBackgroundBlocks, showToastMessage, markUnsaved]);

  // ---- Theme handlers ----
  const applyTheme = useCallback((themeName, primary, secondary, accent) => {
    setSelectedTheme(themeName);
    setCustomPrimary(primary);
    setCustomSecondary(secondary);
    setCustomAccent(accent);
    if (previewCanvasRef.current) {
      previewCanvasRef.current.style.setProperty('--primary', primary);
      previewCanvasRef.current.style.setProperty('--secondary', secondary);
      previewCanvasRef.current.style.setProperty('--accent', accent);
    }
    triggerUpdate();
  }, [setSelectedTheme, setCustomPrimary, setCustomSecondary, setCustomAccent, triggerUpdate]);

  // ---- Image handlers ----
  const uploadImage = useCallback((type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    document.body.appendChild(input);
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageData = ev.target.result;
        setUploadedImages(prev => ({ ...prev, [type]: imageData }));
        const selectors = {
          profile: ['.profile-image', '.profile-img', '.profile-photo', '.profile', '.avatar', '[class*="profile"]'],
          signature: ['.sign-placeholder', '.sign-img', '.signature-placeholder', '[class*="sign"]'],
          logo: ['.logo', '[class*="logo"]']
        };
        const containers = previewCanvasRef.current?.querySelectorAll(selectors[type].join(','));
        if (containers?.length) {
          containers.forEach(el => {
            if (el.tagName === 'IMG') { el.src = imageData; el.style.display = 'block'; }
            else {
              el.innerHTML = '';
              el.style.backgroundImage = `url(${imageData})`;
              el.style.backgroundSize = type === 'signature' ? 'contain' : 'cover';
              el.style.backgroundPosition = 'center';
            }
          });
          showToastMessage(`${type} uploaded ✓`);
          triggerUpdate();
        } else {
          showToastMessage(`No ${type} placeholder found`);
        }
        document.body.removeChild(input);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [setUploadedImages, showToastMessage, triggerUpdate]);

  const removeImage = useCallback((type) => {
    setUploadedImages(prev => ({ ...prev, [type]: null }));
    showToastMessage(`${type} removed`);
    triggerUpdate();
  }, [setUploadedImages, showToastMessage, triggerUpdate]);

  // ---- Barcode / QR ----
  const applyBarcode = useCallback(() => {
    if (!barcodeValue) { showToastMessage('Please enter text for barcode'); return; }
    const card = getCurrentCardElement();
    const barcodeElements = card?.querySelectorAll('.barcode, .barcode-section');
    if (!barcodeElements?.length) { showToastMessage('No barcode placeholder found'); return; }
    import('jsbarcode').then(JsBarcode => {
      barcodeElements.forEach(container => {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'width:100%; height:auto; display:block;';
        container.appendChild(canvas);
        JsBarcode.default(canvas, barcodeValue, { format: 'CODE128', lineColor: '#000', width: 2, height: 40, displayValue: false, margin: 5 });
      });
      showToastMessage('Barcode generated');
      triggerUpdate();
    }).catch(() => {
      barcodeElements.forEach(container => {
        container.innerHTML = `<canvas style="width:100%;height:auto;"></canvas>`;
        const canvas = container.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 300; canvas.height = 60;
        ctx.fillStyle = 'white'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        for (let i = 0; i < barcodeValue.length; i++) {
          ctx.fillRect(i * 12, 10, (barcodeValue.charCodeAt(i) % 10) + 2, 40);
        }
      });
      showToastMessage('Barcode applied (simple)');
      triggerUpdate();
    });
  }, [barcodeValue, getCurrentCardElement, showToastMessage, triggerUpdate]);

  const applyQRCode = useCallback(() => {
    if (!qrValue) { showToastMessage('Please enter text or URL for QR'); return; }
    const card = getCurrentCardElement();
    const qrElements = card?.querySelectorAll('.qr-placeholder');
    if (!qrElements?.length) { showToastMessage('No QR placeholder found'); return; }
    import('qrcode').then(QRCode => {
      qrElements.forEach(placeholder => {
        placeholder.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'width:100%; height:100%;';
        placeholder.appendChild(canvas);
        QRCode.toCanvas(canvas, qrValue, { width: 150, margin: 1 });
      });
      showToastMessage('QR code applied');
      triggerUpdate();
    }).catch(() => {
      qrElements.forEach(placeholder => {
        placeholder.innerHTML = `<img src="https://quickchart.io/qr?text=${encodeURIComponent(qrValue)}&size=150" style="width:100%;height:100%;object-fit:contain;">`;
      });
      showToastMessage('QR code applied (fallback)');
      triggerUpdate();
    });
  }, [qrValue, getCurrentCardElement, showToastMessage, triggerUpdate]);

  // ---- Download both sides ----
  const downloadCardBothSides = useCallback(async (format = 'png') => {
    const card = getCurrentCardElement();
    if (!card) { showToastMessage('No card to download'); return; }
    const frontFace = card.querySelector('.card-front, .face.front');
    const backFace = card.querySelector('.card-back, .face.back');
    if (!frontFace || !backFace) { showToastMessage('Could not find both sides'); return; }
    try {
      const html2canvas = (await import('html2canvas')).default;
      const design = currentOrientation === 'portrait' ? { width: 350, height: 550 } : { width: 550, height: 348 };
      const captureLiveFace = async (faceEl) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `position:fixed; top:-9999px; left:-9999px; width:${design.width}px; height:${design.height}px; border-radius:24px; overflow:hidden; background:#fff;`;
        const clone = faceEl.cloneNode(true);
        const liveCanvases = faceEl.querySelectorAll('canvas');
        const cloneCanvases = clone.querySelectorAll('canvas');
        liveCanvases.forEach((liveCanvas, idx) => {
          const cloneCanvas = cloneCanvases[idx];
          if (cloneCanvas) {
            const img = document.createElement('img');
            try { img.src = liveCanvas.toDataURL('image/png'); } catch { img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; }
            img.style.cssText = liveCanvas.style.cssText || 'width:100%;height:auto;';
            cloneCanvas.replaceWith(img);
          }
        });
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);
        await new Promise(r => setTimeout(r, 200));
        const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: '#ffffff', allowTaint: false });
        document.body.removeChild(wrapper);
        return canvas;
      };
      const frontCanvas = await captureLiveFace(frontFace);
      const backCanvas = await captureLiveFace(backFace);
      if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: currentOrientation === 'portrait' ? 'portrait' : 'landscape',
          unit: 'px',
          format: [frontCanvas.width, frontCanvas.height],
        });
        pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, frontCanvas.width, frontCanvas.height);
        pdf.addPage([backCanvas.width, backCanvas.height]);
        pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, backCanvas.width, backCanvas.height);
        pdf.save(`card-${Date.now()}.pdf`);
        showToastMessage('✅ PDF downloaded!');
      } else {
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = frontCanvas.width;
        combinedCanvas.height = frontCanvas.height + backCanvas.height;
        const ctx = combinedCanvas.getContext('2d');
        ctx.drawImage(frontCanvas, 0, 0);
        ctx.drawImage(backCanvas, 0, frontCanvas.height);
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const ext = format === 'jpg' ? 'jpg' : 'png';
        const link = document.createElement('a');
        link.download = `card-both-sides-${Date.now()}.${ext}`;
        link.href = combinedCanvas.toDataURL(mimeType, 0.9);
        link.click();
        showToastMessage(`✅ Downloaded as ${ext.toUpperCase()}!`);
      }
      const downloads = JSON.parse(localStorage.getItem('cardstudio_downloads') || '[]');
      downloads.unshift({ id: Date.now(), name: currentTemplate?.name + ' (Downloaded)', orientation: currentOrientation, fullHTML: previewCanvasRef.current?.innerHTML, createdAt: new Date().toISOString() });
      localStorage.setItem('cardstudio_downloads', JSON.stringify(downloads));
      clearUnsaved();
    } catch (e) { showToastMessage('Download failed: ' + e.message); }
  }, [getCurrentCardElement, currentOrientation, currentTemplate, showToastMessage, clearUnsaved]);

  // ---- Save to drafts ----
  const saveToDrafts = useCallback(() => {
    if (!previewCanvasRef.current) { showToastMessage('No template to save'); return; }
    const drafts = JSON.parse(localStorage.getItem('cardstudio_drafts') || '[]');
    drafts.push({ id: Date.now(), name: `${currentTemplate?.name} (Custom)`, orientation: currentOrientation, fullHTML: previewCanvasRef.current.innerHTML, createdAt: new Date().toISOString() });
    localStorage.setItem('cardstudio_drafts', JSON.stringify(drafts));
    showToastMessage('✅ Saved to Drafts!');
    clearUnsaved();
  }, [currentTemplate, currentOrientation, showToastMessage, clearUnsaved]);

  // ---- Reset all ----
  const resetAll = useCallback(() => {
    if (originalHTML && previewCanvasRef.current) {
      invalidateEditorCaches();
      previewCanvasRef.current.innerHTML = originalHTML;
      setUploadedImages({ profile: null, signature: null, logo: null });
      setBackgroundBlocks([]);
      if (currentTemplate?.category === 'visiting') {
        const defaults = { primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc', cardBg: '#ffffff' };
        Object.entries(defaults).forEach(([key, value]) => {
          previewCanvasRef.current.style.setProperty(`--${key === 'cardBg' ? 'card-bg' : key}`, value);
        });
        setCustomPrimary(defaults.primary);
        setCustomSecondary(defaults.secondary);
        setCustomAccent(defaults.accent);
        setCustomCardBg(defaults.cardBg);
        setSelectedTheme('Default');
      }
      startTransition(() => { buildSidebar(); triggerUpdate(); });
      showToastMessage('Reset to original template');
      clearUnsaved();
    }
  }, [originalHTML, invalidateEditorCaches, currentTemplate, setUploadedImages, setBackgroundBlocks, setCustomPrimary, setCustomSecondary, setCustomAccent, setCustomCardBg, setSelectedTheme, buildSidebar, triggerUpdate, showToastMessage, clearUnsaved]);

  // ---- Sidebar / display toggles ----
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const toggleDisplayMode = useCallback(() => {
    const next = displayMode === 'flip' ? 'both' : 'flip';
    if (next === 'both' && previewCanvasRef.current?.innerHTML) {
      setPendingTemplateHtml(previewCanvasRef.current.innerHTML);
    }
    setDisplayMode(next);
  }, [displayMode]);

  const handleResizeStart = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;
    const handleMouseMove = (e) => {
      const newWidth = Math.min(750, Math.max(320, startWidth + (startX - e.clientX)));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      localStorage.setItem('sidebarWidth', String(sidebarWidth));
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth]);

  const handleEditorStageReady = useCallback(() => {
    setEditorStageToken(token => token + 1);
  }, []);

  // ---- Effects: load template, rebuild on stage ready, responsive, unsaved warning ----
  useEffect(() => {
    isMountedRef.current = true;
    isLoadingRef.current = true;
    loadTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && isLoadingRef.current) {
        setIsLoading(false);
        showToastMessage('Loading took longer than expected.');
      }
    }, 10000);
    try {
      const saved = localStorage.getItem('selectedTemplateForCustomize');
      const template = saved ? JSON.parse(saved) : (allTemplates[0] ? { ...allTemplates[0], sourcePage: 'default' } : null);
      if (!template) { showToastMessage('No template available.'); setIsLoading(false); return; }
      const rawHTML = template.fullHTML || template.htmlContent || '';
      const normalizedHTML = normalizeTemplateHtml(rawHTML);
      setCurrentTemplate(template);
      setCurrentOrientation(template.orientation || 'landscape');
      setPendingTemplateHtml(normalizedHTML);
      setOriginalHTML(normalizedHTML);
      if (previewCanvasRef.current && normalizedHTML) {
        invalidateEditorCaches();
        previewCanvasRef.current.innerHTML = normalizedHTML;
        if (template.category === 'visiting') {
          const defaults = { primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc', cardBg: '#ffffff' };
          ['primary', 'secondary', 'accent', 'cardBg'].forEach(key => {
            const value = template.themeColors?.[key] || defaults[key];
            previewCanvasRef.current.style.setProperty(`--${key === 'cardBg' ? 'card-bg' : key}`, value);
          });
          setCustomPrimary(template.themeColors?.primary || defaults.primary);
          setCustomSecondary(template.themeColors?.secondary || defaults.secondary);
          setCustomAccent(template.themeColors?.accent || defaults.accent);
          setCustomCardBg('#ffffff');
        }
        setIsLoading(false);
        isLoadingRef.current = false;
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        startTransition(() => { buildSidebar(); refreshSidePreviewHtml(); });
        clearUnsaved();
      } else {
        showToastMessage('Template preview is unavailable.');
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    } catch (e) {
      console.error(e);
      showToastMessage('Error loading template');
      setIsLoading(false);
      isLoadingRef.current = false;
    }
    return () => { isMountedRef.current = false; if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current); };
  }, [buildSidebar, clearUnsaved, invalidateEditorCaches, refreshSidePreviewHtml, setCustomAccent, setCustomCardBg, setCustomPrimary, setCustomSecondary, showToastMessage]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isLoading || !editorStageToken || !previewCanvasRef.current || !pendingTemplateHtml) return;
    invalidateEditorCaches();
    previewCanvasRef.current.innerHTML = pendingTemplateHtml;
    if (currentTemplate?.category === 'visiting') {
      const defaults = { primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc', cardBg: '#ffffff' };
      ['primary', 'secondary', 'accent', 'cardBg'].forEach(key => {
        const value = currentTemplate.themeColors?.[key] || defaults[key];
        previewCanvasRef.current.style.setProperty(`--${key === 'cardBg' ? 'card-bg' : key}`, value);
      });
      setCustomPrimary(currentTemplate.themeColors?.primary || defaults.primary);
      setCustomSecondary(currentTemplate.themeColors?.secondary || defaults.secondary);
      setCustomAccent(currentTemplate.themeColors?.accent || defaults.accent);
      setCustomCardBg('#ffffff');
    }
    requestAnimationFrame(() => {
      const card = getCurrentCardElement();
      const flipInner = card?.querySelector('.flip-card-inner');
      if (flipInner) flipInner.style.transform = 'rotateY(0deg)';
      startTransition(() => { buildSidebar(); refreshSidePreviewHtml(); });
    });
  }, [isLoading, editorStageToken, pendingTemplateHtml, currentTemplate, displayMode, buildSidebar, refreshSidePreviewHtml, getCurrentCardElement, invalidateEditorCaches, setCustomAccent, setCustomCardBg, setCustomPrimary, setCustomSecondary]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateLayout = () => {
      const isDesktop = mediaQuery.matches;
      if (previewCanvasRef.current?.innerHTML) setPendingTemplateHtml(previewCanvasRef.current.innerHTML);
      setIsDesktopLayout(isDesktop);
      if (!isDesktop && displayMode !== 'flip') setDisplayMode('flip');
    };
    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, [displayMode]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = 'You have unsaved changes.'; return e.returnValue; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));
  }, []);

  // Return everything needed by the UI components
  return {
    // Refs
    previewCanvasRef,
    cardScaleWrapRef,
    sidebarRef,
    downloadMenuRef,
    // State
    currentTemplate,
    currentOrientation,
    isLoading,
    sidebarWidth,
    barcodeValue, setBarcodeValue,
    qrValue, setQrValue,
    isSidebarOpen,
    displayMode,
    sidePreviewHtml,
    isDesktopLayout,
    showDownloadMenu, setShowDownloadMenu,
    cardFlipped,
    showToast,
    toastMessage,
    // Editor data
    textFields,
    backgroundBlocks,
    detectedFeatures,
    selectedTheme,
    customPrimary,
    customSecondary,
    customAccent,
    customCardBg,
    uploadedImages,
    hasUnsavedChanges,
    // Handlers
    handleBackNavigation,
    flipCard,
    handleTextChange,
    handleColorChange,
    handleFontSizeChange,
    handleFontFamilyChange,
    toggleTextFieldStyle,
    resetTextField,
    setBackgroundMode,
    setSolidColor,
    setGradient,
    uploadBackgroundImage,
    refreshBackgrounds,
    applyTheme,
    uploadImage,
    removeImage,
    applyBarcode,
    applyQRCode,
    downloadCardBothSides,
    saveToDrafts,
    resetAll,
    toggleSidebar,
    toggleDisplayMode,
    handleResizeStart,
    handleEditorStageReady,
    triggerUpdate,
    // Helper for custom handlers
    setCustomPrimary,
    setCustomSecondary,
    setCustomAccent,
    setCustomCardBg,
    setSelectedTheme,
    // Share
    showShareMenu,
    setShowShareMenu,
    handleShare,
  };
}
