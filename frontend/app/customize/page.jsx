// app/customize/page.jsx
'use client';

import { useState, useEffect, useRef, useCallback, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { allTemplates, normalizeTemplateHtml } from '@/templatesdata';
import { CardEditorStage, CardContainer } from '@/components/Common/Card';
import {
  FiLoader, FiCheckCircle, FiArrowLeft, FiDownload, FiLayers, FiBox,
  FiRefreshCcw, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomizeEditor } from './hooks/useCustomizeEditor';
import EditorSidebar from './components/EditorSidebar';
import { jsPDF } from 'jspdf';

// ----------------------------------------------------------------------------
// Tile Wall Background Component
// ----------------------------------------------------------------------------
const TileWallBackground = () => {
  const wallRef = useRef(null);
  const resizeTimerRef = useRef(null);

  const ASPECT_RATIO = 1.6;
  const MIN_LIGHTNESS = 93;
  const MAX_LIGHTNESS = 97;
  const PATTERN_EVEN = ['landscape', 'portrait', 'landscape', 'portrait', 'landscape', 'portrait'];
  const PATTERN_ODD  = ['portrait', 'landscape', 'portrait', 'landscape', 'portrait', 'landscape'];
  const MIN_ROW_HEIGHT_PX = 88;
  const MAX_ROW_HEIGHT_PX = 180;

  const getTileBackground = (seed) => {
    const variation = (seed * 131) % 7;
    let lightness = MIN_LIGHTNESS + (variation / 6) * (MAX_LIGHTNESS - MIN_LIGHTNESS);
    lightness = Math.min(MAX_LIGHTNESS, Math.max(MIN_LIGHTNESS, lightness));
    return `hsl(42, 8%, ${lightness.toFixed(1)}%)`;
  };

  const buildWall = useCallback(() => {
    if (!wallRef.current) return;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const ratio = ASPECT_RATIO;
    const invRatio = 1 / ratio;
    const patternLen = PATTERN_EVEN.length;
    const totalCoeff = (patternLen / 2) * ratio + (patternLen / 2) * invRatio;

    let rowHeight = containerWidth / totalCoeff;
    let needsWidthScaling = false;
    let widthScale = 1;

    if (rowHeight < MIN_ROW_HEIGHT_PX) {
      rowHeight = MIN_ROW_HEIGHT_PX;
      needsWidthScaling = true;
      widthScale = rowHeight / (containerWidth / totalCoeff);
    } else if (rowHeight > MAX_ROW_HEIGHT_PX) {
      rowHeight = MAX_ROW_HEIGHT_PX;
      needsWidthScaling = true;
      widthScale = rowHeight / (containerWidth / totalCoeff);
    }

    let landWidth = rowHeight * ratio;
    let portWidth = rowHeight * invRatio;

    if (needsWidthScaling) {
      const targetRawSum = rowHeight * totalCoeff;
      const finalScale = containerWidth / targetRawSum;
      landWidth = (ratio * rowHeight) * finalScale;
      portWidth = (invRatio * rowHeight) * finalScale;
    } else {
      const sumCheck = (patternLen / 2) * landWidth + (patternLen / 2) * portWidth;
      if (Math.abs(sumCheck - containerWidth) > 0.5) {
        const delta = containerWidth - sumCheck;
        portWidth += delta / (patternLen / 2);
      }
    }

    const finalRowHeight = rowHeight;
    const rowsNeeded = Math.ceil(containerHeight / finalRowHeight) + 1;

    wallRef.current.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let rowIdx = 0; rowIdx < rowsNeeded; rowIdx++) {
      const pattern = rowIdx % 2 === 0 ? PATTERN_EVEN : PATTERN_ODD;
      const rowDiv = document.createElement('div');
      rowDiv.className = 'tile-row';
      rowDiv.style.height = `${finalRowHeight}px`;

      for (let colIdx = 0; colIdx < pattern.length; colIdx++) {
        const orientation = pattern[colIdx];
        const tileWidth = orientation === 'landscape' ? landWidth : portWidth;

        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.width = `${tileWidth}px`;
        tile.style.height = `${finalRowHeight}px`;

        const colorSeed = rowIdx * 127 + colIdx * 53;
        tile.style.backgroundColor = getTileBackground(colorSeed);
        tile.style.boxShadow = 'inset 0 1px 0 rgba(255,255,245,0.3), 0 1px 2px rgba(0,0,0,0.02)';

        rowDiv.appendChild(tile);
      }
      fragment.appendChild(rowDiv);
    }

    wallRef.current.appendChild(fragment);
  }, []);

  useEffect(() => {
    buildWall();
    const handleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => buildWall(), 80);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(() => buildWall(), 20));
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [buildWall]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div ref={wallRef} className="wall absolute inset-0" />
    </div>
  );
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function CustomizePage() {
  const router = useRouter();

  // ---- REFS ----
  const previewCanvasRef = useRef(null);
  const cardScaleWrapRef = useRef(null);
  const sidebarRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const downloadMenuRef = useRef(null);
  const captureTimeoutRef = useRef(null);

  // ---- STATE ----
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
  const [bothSidesImages, setBothSidesImages] = useState({ front: null, back: null });
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [editorStageToken, setEditorStageToken] = useState(0);
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(true);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  // ---- CUSTOM HOOK ----
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
    buildTextList,
    buildBackgroundBlocks,
    buildSidebar,
    invalidateEditorCaches,
    markUnsaved,
    clearUnsaved,
  } = useCustomizeEditor(previewCanvasRef);

  // ---- TOAST ----
  const showToastMessage = useCallback((msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  // ---- CAPTURE BOTH SIDES AS IMAGES (stable, with back side fix) ----
  const captureBothSides = useCallback(async () => {
    if (!isMountedRef.current || displayMode !== 'both') return;

    const frontFace = getFrontFace();
    const backFace = getBackFace();
    if (!frontFace || !backFace) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const design = currentOrientation === 'portrait'
        ? { width: 350, height: 550 }
        : { width: 550, height: 348 };

      const captureFace = async (faceEl, isBack = false) => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `position:fixed; top:-9999px; left:-9999px; width:${design.width}px; height:${design.height}px; border-radius:24px; overflow:hidden; background:#fff;`;
        const clone = faceEl.cloneNode(true);
        
        // Fix for back face: remove the rotateY(180deg) transform that causes mirrored text
        if (isBack) {
          clone.style.transform = 'none';
          clone.style.setProperty('transform', 'none', 'important');
          clone.style.backfaceVisibility = 'visible';
        }
        
        // Replace any canvas elements with images (preserve barcode/qr)
        const liveCanvases = faceEl.querySelectorAll('canvas');
        const cloneCanvases = clone.querySelectorAll('canvas');
        liveCanvases.forEach((liveCanvas, idx) => {
          const cloneCanvas = cloneCanvases[idx];
          if (cloneCanvas) {
            const img = document.createElement('img');
            try { img.src = liveCanvas.toDataURL('image/png'); } catch { /* fallback */ }
            img.style.cssText = liveCanvas.style.cssText || 'width:100%;height:auto;';
            cloneCanvas.replaceWith(img);
          }
        });
        
        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);
        await new Promise(r => setTimeout(r, 100));
        const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        document.body.removeChild(wrapper);
        return canvas.toDataURL('image/png');
      };

      const [frontUrl, backUrl] = await Promise.all([
        captureFace(frontFace, false),
        captureFace(backFace, true)
      ]);
      
      if (isMountedRef.current && displayMode === 'both') {
        setBothSidesImages({ front: frontUrl, back: backUrl });
      }
    } catch (err) {
      console.warn('Capture failed:', err);
    }
  }, [getFrontFace, getBackFace, currentOrientation, displayMode]);

  // ---- AUTO-CAPTURE WHEN CHANGES OCCUR (while in 'both' mode) ----
  useEffect(() => {
    if (displayMode !== 'both') return;
    if (captureTimeoutRef.current) clearTimeout(captureTimeoutRef.current);
    captureTimeoutRef.current = setTimeout(() => {
      captureBothSides();
    }, 300);
    return () => clearTimeout(captureTimeoutRef.current);
  }, [
    displayMode, textFields, backgroundBlocks, uploadedImages,
    customPrimary, customSecondary, customAccent, customCardBg,
    barcodeValue, qrValue, captureBothSides
  ]);

  // Capture immediately when switching to 'both' mode
  useEffect(() => {
    if (displayMode === 'both') {
      captureBothSides();
    }
  }, [displayMode, captureBothSides]);

  // ---- NAVIGATION ----
  const handleBackNavigation = useCallback(() => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        clearUnsaved();
        router.push('/templates');
      }
    } else {
      router.push('/templates');
    }
  }, [hasUnsavedChanges, clearUnsaved, router]);

  // ---- CARD OPERATIONS ----
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

  // ---- TEXT FIELD HANDLERS ----
  const handleTextChange = useCallback((index, newText) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.innerText = newText;
      element.setAttribute('data-fulltext', newText);
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, text: newText, element } : f));
      markUnsaved();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, markUnsaved]);

  const handleColorChange = useCallback((index, newColor) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.color = newColor;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, color: newColor, element } : f));
      markUnsaved();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, markUnsaved]);

  const handleFontSizeChange = useCallback((index, nextSize) => {
    const size = Math.min(72, Math.max(8, Number(nextSize) || 14));
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.fontSize = `${size}px`;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, fontSize: size, element } : f));
      markUnsaved();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, markUnsaved]);

  const handleFontFamilyChange = useCallback((index, fontFamily) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.fontFamily = fontFamily;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, fontFamily, element } : f));
      markUnsaved();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, markUnsaved]);

  const toggleTextFieldStyle = useCallback((index, type) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (!element) return;
    const computed = getComputedStyle(element);
    const next = {};
    if (type === 'bold') {
      const isBold = element.style.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600;
      element.style.fontWeight = isBold ? 'normal' : 'bold';
      next.bold = !isBold;
    }
    if (type === 'italic') {
      const isItalic = element.style.fontStyle === 'italic' || computed.fontStyle === 'italic';
      element.style.fontStyle = isItalic ? 'normal' : 'italic';
      next.italic = !isItalic;
    }
    if (type === 'underline') {
      const hasUnderline = (element.style.textDecoration || computed.textDecoration || '').includes('underline');
      element.style.textDecoration = hasUnderline ? 'none' : 'underline';
      next.underline = !hasUnderline;
    }
    setTextFields(prev => prev.map(f => f.index === index ? { ...f, ...next, element } : f));
    markUnsaved();
  }, [textFields, resolveTextFieldElement, setTextFields, markUnsaved]);

  const resetTextField = useCallback((index) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.innerText = field.originalText;
      element.style.color = field.originalColor;
      if (element.dataset.originalFontSize) element.style.fontSize = element.dataset.originalFontSize;
      if (element.dataset.originalFontWeight) element.style.fontWeight = element.dataset.originalFontWeight;
      if (element.dataset.originalFontStyle) element.style.fontStyle = element.dataset.originalFontStyle;
      if (element.dataset.originalTextDecoration) element.style.textDecoration = element.dataset.originalTextDecoration;
      if (element.dataset.originalFontFamily) element.style.fontFamily = element.dataset.originalFontFamily;
      const computed = getComputedStyle(element);
      setTextFields(prev => prev.map(f => f.index === index ? {
        ...f,
        text: field.originalText,
        color: field.originalColor,
        fontSize: parseInt(computed.fontSize, 10) || 14,
        fontFamily: computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim() || 'Inter',
        bold: computed.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600,
        italic: computed.fontStyle === 'italic',
        underline: computed.textDecoration?.includes('underline') || false,
        element,
      } : f));
      showToastMessage('Field reset to original');
      markUnsaved();
    }
  }, [textFields, resolveTextFieldElement, setTextFields, showToastMessage, markUnsaved]);

  // ---- BACKGROUND HANDLERS ----
  const setBackgroundMode = useCallback((blockIndex, mode) => {
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    const element = resolveBackgroundElement(block);
    if (block && element) {
      if (mode === 'solid') {
        element.style.backgroundImage = 'none';
        element.style.background = block.currentColor;
      }
      setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, mode, element } : b));
      markUnsaved();
    }
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundBlocks, markUnsaved]);

  const setSolidColor = useCallback((blockIndex, color) => {
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    const element = resolveBackgroundElement(block);
    if (block && element) {
      element.style.backgroundImage = 'none';
      element.style.background = color;
      setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, currentColor: color, element } : b));
      markUnsaved();
    }
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundBlocks, markUnsaved]);

  const setGradient = useCallback((blockIndex, color1, color2, direction) => {
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    const element = resolveBackgroundElement(block);
    if (block && element) {
      const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
      element.style.background = gradient;
      element.style.backgroundImage = gradient;
      setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, gradColor1: color1, gradColor2: color2, gradDirection: direction, element } : b));
      markUnsaved();
    }
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundBlocks, markUnsaved]);

  const uploadBackgroundImage = useCallback((blockIndex) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    document.body.appendChild(input);
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) { document.body.removeChild(input); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const block = backgroundBlocks.find(b => b.index === blockIndex);
        const element = resolveBackgroundElement(block);
        if (block && element) {
          element.style.backgroundImage = `url(${ev.target.result})`;
          element.style.backgroundSize = 'cover';
          element.style.backgroundPosition = 'center';
          setBackgroundMode(blockIndex, 'image');
          markUnsaved();
        }
        document.body.removeChild(input);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [backgroundBlocks, resolveBackgroundElement, setBackgroundMode, markUnsaved]);

  const refreshBackgrounds = useCallback(() => {
    if (currentTemplate?.category === 'employee') {
      buildBackgroundBlocks();
      showToastMessage('Background list refreshed');
      markUnsaved();
    }
  }, [currentTemplate, buildBackgroundBlocks, showToastMessage, markUnsaved]);

  // ---- THEME HANDLERS ----
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
    markUnsaved();
  }, [setSelectedTheme, setCustomPrimary, setCustomSecondary, setCustomAccent, markUnsaved]);

  // ---- IMAGE HANDLERS ----
  const uploadImage = useCallback((type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) { document.body.removeChild(input); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageData = ev.target?.result;
        if (!imageData) { document.body.removeChild(input); return; }
        setUploadedImages(prev => ({ ...prev, [type]: imageData }));
        const selectors = {
          profile: ['.profile-image', '.profile-img', '.profile-photo', '.profile', '.avatar', '.user-pic', '.photo', '[class*="profile"]', '[class*="avatar"]', '[class*="photo"]'],
          signature: ['.sign-placeholder', '.sign-img', '.signature-placeholder', '[class*="sign"]'],
          logo: ['.logo', '[class*="logo"]']
        };
        const containers = previewCanvasRef.current?.querySelectorAll(selectors[type].join(','));
        if (!containers || containers.length === 0) {
          const fallback = previewCanvasRef.current?.querySelectorAll('div:empty, img[src=""], img:not([src])');
          if (fallback && fallback.length > 0) {
            const el = fallback[0];
            if (el.tagName === 'IMG') { el.src = imageData; el.style.display = 'block'; }
            else {
              el.style.backgroundImage = `url(${imageData})`;
              el.style.backgroundSize = type === 'signature' ? 'contain' : 'cover';
              el.style.backgroundPosition = 'center';
              el.style.minHeight = '60px'; el.style.minWidth = '60px';
            }
            showToastMessage(`${type} uploaded (fallback) ✓`);
            markUnsaved();
          } else {
            showToastMessage(`No ${type} placeholder found`);
          }
          document.body.removeChild(input);
          return;
        }
        containers.forEach(el => {
          if (el.tagName === 'IMG') { el.src = imageData; el.style.display = 'block'; }
          else {
            el.innerHTML = '';
            el.style.backgroundImage = `url(${imageData})`;
            el.style.backgroundSize = type === 'signature' ? 'contain' : 'cover';
            el.style.backgroundPosition = 'center';
            if (!el.style.width && !el.style.height) { el.style.width = '60px'; el.style.height = '60px'; }
          }
        });
        showToastMessage(`${type} uploaded ✓`);
        markUnsaved();
        document.body.removeChild(input);
      };
      reader.readAsDataURL(file);
    };
    input.addEventListener('cancel', () => document.body.removeChild(input));
    input.click();
  }, [setUploadedImages, showToastMessage, markUnsaved]);

  const removeImage = useCallback((type) => {
    setUploadedImages(prev => ({ ...prev, [type]: null }));
    showToastMessage(`${type} removed`);
    markUnsaved();
  }, [setUploadedImages, showToastMessage, markUnsaved]);

  // ---- BARCODE / QR ----
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
        JsBarcode.default(canvas, barcodeValue, { format: 'CODE128', lineColor: '#000000', width: 2, height: 40, displayValue: false, margin: 5 });
      });
      showToastMessage('Barcode generated');
      markUnsaved();
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
      markUnsaved();
    });
  }, [barcodeValue, getCurrentCardElement, showToastMessage, markUnsaved]);

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
      markUnsaved();
    }).catch(() => {
      qrElements.forEach(placeholder => {
        placeholder.innerHTML = `<img src="https://quickchart.io/qr?text=${encodeURIComponent(qrValue)}&size=150" style="width:100%;height:100%;object-fit:contain;">`;
      });
      showToastMessage('QR code applied (fallback)');
      markUnsaved();
    });
  }, [qrValue, getCurrentCardElement, showToastMessage, markUnsaved]);

  // ---- DOWNLOAD ----
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

  const saveToDrafts = useCallback(() => {
    if (!previewCanvasRef.current) { showToastMessage('No template to save'); return; }
    const drafts = JSON.parse(localStorage.getItem('cardstudio_drafts') || '[]');
    drafts.push({ id: Date.now(), name: `${currentTemplate?.name} (Custom)`, orientation: currentOrientation, fullHTML: previewCanvasRef.current.innerHTML, createdAt: new Date().toISOString() });
    localStorage.setItem('cardstudio_drafts', JSON.stringify(drafts));
    showToastMessage('✅ Saved to Drafts!');
    clearUnsaved();
  }, [currentTemplate, currentOrientation, showToastMessage, clearUnsaved]);

  const resetAll = useCallback(() => {
    if (originalHTML && previewCanvasRef.current) {
      invalidateEditorCaches();
      previewCanvasRef.current.innerHTML = originalHTML;
      setUploadedImages({ profile: null, signature: null, logo: null });
      setBackgroundBlocks([]);
      if (currentTemplate?.category === 'visiting') {
        const defaults = { primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc', cardBg: '#ffffff' };
        Object.entries(defaults).forEach(([key, value]) => { previewCanvasRef.current.style.setProperty(`--${key === 'cardBg' ? 'card-bg' : key}`, value); });
        setCustomPrimary(defaults.primary); setCustomSecondary(defaults.secondary); setCustomAccent(defaults.accent); setCustomCardBg(defaults.cardBg);
        setSelectedTheme('Default');
      }
      startTransition(() => { buildSidebar(); });
      showToastMessage('Reset to original template');
      clearUnsaved();
    }
  }, [originalHTML, invalidateEditorCaches, currentTemplate, setUploadedImages, setBackgroundBlocks, setCustomPrimary, setCustomSecondary, setCustomAccent, setCustomCardBg, setSelectedTheme, buildSidebar, showToastMessage, clearUnsaved]);

  // ---- SIDEBAR / DISPLAY ----
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const toggleDisplayMode = useCallback(() => {
    const next = displayMode === 'flip' ? 'both' : 'flip';
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

  const handleEditorStageReady = useCallback(() => { setEditorStageToken(token => token + 1); }, []);

  useEffect(() => {
    if (!showDownloadMenu) return;
    const handleClick = (e) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDownloadMenu]);

  // ---- EFFECTS ----
  useEffect(() => {
    isMountedRef.current = true;
    loadTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && isLoading) {
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
        setOriginalHTML(normalizedHTML);
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
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        startTransition(() => { buildSidebar(); });
        clearUnsaved();
      } else { showToastMessage('Template preview is unavailable.'); setIsLoading(false); }
    } catch (e) { console.error(e); showToastMessage('Error loading template'); setIsLoading(false); }
    return () => { isMountedRef.current = false; if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current); };
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
      startTransition(() => { buildSidebar(); });
    });
  }, [isLoading, editorStageToken, pendingTemplateHtml, currentTemplate, displayMode, buildSidebar, getCurrentCardElement, invalidateEditorCaches]);

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

  const showImageSection = detectedFeatures.hasProfile || detectedFeatures.hasSignature || detectedFeatures.hasLogo || detectedFeatures.hasBarcode || detectedFeatures.hasQR;
  const showThemeSection = currentTemplate?.category === 'visiting';
  const cardWidth = currentOrientation === 'portrait' ? '350px' : '550px';
  
  // Dynamic card width for both-sides landscape when sidebar closed
  const getBothSidesCardWidth = useCallback(() => {
    if (currentOrientation === 'portrait') return '350px';
    // Landscape
    if (displayMode === 'both' && !isSidebarOpen) {
      return '480px'; // Larger when sidebar closed
    }
    return '550px';
  }, [currentOrientation, displayMode, isSidebarOpen]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50/50 via-white to-purple-50/50">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center animate-fade-in-up">
          <FiLoader className="animate-spin text-indigo-500 text-4xl mx-auto mb-4" />
          <h2 className="text-h3-sm font-semibold text-slate-800 mb-2">Loading your card...</h2>
          <p className="text-p-xs text-slate-500">Please wait while we prepare the editor</p>
        </div>
      </div>
    );
  }

  // ---- RENDER ----
  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-['Inter'] overflow-hidden">
      {/* DESKTOP LAYOUT */}
      {isDesktopLayout ? (
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* PREVIEW AREA WITH TILE WALL BACKGROUND */}
          <div className="flex-1 flex items-center justify-center overflow-y-auto p-6 lg:p-10 relative transition-all duration-300 bg-slate-100">
            <TileWallBackground />

            {/* Action Buttons */}
            <div className="absolute left-5 top-5 flex gap-2 z-30">
              <button onClick={handleBackNavigation} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center" title="Back to templates">
                <FiArrowLeft size={20} />
              </button>
              <div className="relative" ref={downloadMenuRef}>
                <button onClick={() => setShowDownloadMenu(prev => !prev)} className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center" title="Download">
                  <FiDownload size={18} />
                </button>
                {showDownloadMenu && (
                  <div className="absolute top-14 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[120px]">
                    <button onClick={() => { downloadCardBothSides('png'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"><FiDownload size={12} /> PNG</button>
                    <button onClick={() => { downloadCardBothSides('jpg'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"><FiDownload size={12} /> JPG</button>
                    <button onClick={() => { downloadCardBothSides('pdf'); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-50 flex items-center gap-2"><FiDownload size={12} /> PDF</button>
                  </div>
                )}
              </div>
              <button onClick={toggleDisplayMode} className={`w-11 h-11 border rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${displayMode === 'both' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500' : 'bg-white text-indigo-600 border-white/70 hover:bg-indigo-50'}`} title={displayMode === 'flip' ? 'Show both sides' : 'Show single side'}>
                {displayMode === 'flip' ? <FiLayers size={18} /> : <FiBox size={18} />}
              </button>
              {displayMode === 'flip' && (
                <button onClick={flipCard} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 text-indigo-600 flex items-center justify-center" title="Flip card">
                  <motion.div animate={{ rotate: cardFlipped ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <FiRefreshCcw size={18} />
                  </motion.div>
                </button>
              )}
              <button onClick={toggleSidebar} className="w-11 h-11 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-300 text-slate-600 flex items-center justify-center" title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}>
                {isSidebarOpen ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
              </button>
            </div>

            {/* Card Display */}
            <div className="relative z-10 w-full max-w-2xl">
              <AnimatePresence mode="wait">
                {displayMode === 'flip' ? (
                  <motion.div
                    key="single"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-2xl"
                  >
                    <div className="relative [perspective:1200px]">
                      <div className="relative transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(2deg)] rounded-2xl shadow-2xl shadow-indigo-500/10">
                        <CardEditorStage
                          orientation={currentOrientation}
                          innerRef={previewCanvasRef}
                          scaleWrapRef={cardScaleWrapRef}
                          onReady={handleEditorStageReady}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="both"
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, layout: { duration: 0.3 } }}
                    className={`flex ${(() => {
                      if (currentOrientation === 'landscape') {
                        return isSidebarOpen ? 'flex-col gap-6' : 'flex-row gap-6';
                      }
                      return 'flex-row gap-6';
                    })()} items-center justify-center max-w-full transition-all duration-300 ease-in-out`}
                  >
                    {/* Front side image */}
                    <div style={{ width: getBothSidesCardWidth(), maxWidth: '100%' }}>
                      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 bg-white">
                        {bothSidesImages.front ? (
                          <img src={bothSidesImages.front} alt="Front side" className="w-full h-auto block" />
                        ) : (
                          <div className="flex items-center justify-center" style={{ aspectRatio: currentOrientation === 'portrait' ? '350/550' : '550/348' }}>
                            <FiLoader className="animate-spin text-indigo-500 text-2xl" />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Back side image */}
                    <div style={{ width: getBothSidesCardWidth(), maxWidth: '100%' }}>
                      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 bg-white">
                        {bothSidesImages.back ? (
                          <img src={bothSidesImages.back} alt="Back side" className="w-full h-auto block" />
                        ) : (
                          <div className="flex items-center justify-center" style={{ aspectRatio: currentOrientation === 'portrait' ? '350/550' : '550/348' }}>
                            <FiLoader className="animate-spin text-indigo-500 text-2xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* DESKTOP SIDEBAR */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                key="desktop-sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `min(${sidebarWidth}px, 100vw)`, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="h-full z-40 overflow-hidden"
                ref={sidebarRef}
              >
                <EditorSidebar
                  currentTemplate={currentTemplate}
                  currentOrientation={currentOrientation}
                  textFields={textFields}
                  onTextChange={handleTextChange}
                  onColorChange={handleColorChange}
                  onFontSizeChange={handleFontSizeChange}
                  onFontFamilyChange={handleFontFamilyChange}
                  onToggleTextFieldStyle={toggleTextFieldStyle}
                  onResetTextField={resetTextField}
                  onTextFieldClick={null}
                  backgroundBlocks={backgroundBlocks}
                  onBackgroundModeChange={setBackgroundMode}
                  onSolidColorChange={setSolidColor}
                  onGradientChange={setGradient}
                  onBackgroundImageUpload={uploadBackgroundImage}
                  refreshBackgrounds={refreshBackgrounds}
                  showThemeSection={showThemeSection}
                  selectedTheme={selectedTheme}
                  customPrimary={customPrimary}
                  customSecondary={customSecondary}
                  customAccent={customAccent}
                  customCardBg={customCardBg}
                  onApplyTheme={applyTheme}
                  onCustomPrimaryChange={(v) => { setCustomPrimary(v); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--primary', v); markUnsaved(); }}
                  onCustomSecondaryChange={(v) => { setCustomSecondary(v); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--secondary', v); markUnsaved(); }}
                  onCustomAccentChange={(v) => { setCustomAccent(v); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--accent', v); markUnsaved(); }}
                  onCustomCardBgChange={(v) => { setCustomCardBg(v); previewCanvasRef.current?.style.setProperty('--card-bg', v); markUnsaved(); }}
                  showImageSection={showImageSection}
                  detectedFeatures={detectedFeatures}
                  uploadedImages={uploadedImages}
                  onImageUpload={uploadImage}
                  onImageRemove={removeImage}
                  barcodeValue={barcodeValue}
                  qrValue={qrValue}
                  onBarcodeValueChange={setBarcodeValue}
                  onQrValueChange={setQrValue}
                  onApplyBarcode={applyBarcode}
                  onApplyQR={applyQRCode}
                  onSave={saveToDrafts}
                  onReset={resetAll}
                  sidebarRef={sidebarRef}
                  sidebarWidth={sidebarWidth}
                  onResizeStart={handleResizeStart}
                  isSidebarOpen={true}
                  onToggleSidebar={toggleSidebar}
                  triggerUpdate={markUnsaved}
                  previewCanvasRef={previewCanvasRef}
                  isMobileView={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* MOBILE LAYOUT */
        <MobileLayout
          currentOrientation={currentOrientation}
          currentTemplate={currentTemplate}
          previewCanvasRef={previewCanvasRef}
          cardScaleWrapRef={cardScaleWrapRef}
          onEditorStageReady={handleEditorStageReady}
          onBack={handleBackNavigation}
          onDownloadFormat={downloadCardBothSides}
          onFlip={flipCard}
          textFields={textFields}
          backgroundBlocks={backgroundBlocks}
          showThemeSection={showThemeSection}
          showImageSection={showImageSection}
          detectedFeatures={detectedFeatures}
          uploadedImages={uploadedImages}
          selectedTheme={selectedTheme}
          customPrimary={customPrimary}
          customSecondary={customSecondary}
          customAccent={customAccent}
          customCardBg={customCardBg}
          barcodeValue={barcodeValue}
          qrValue={qrValue}
          onTextChange={handleTextChange}
          onColorChange={handleColorChange}
          onFontSizeChange={handleFontSizeChange}
          onFontFamilyChange={handleFontFamilyChange}
          onToggleTextFieldStyle={toggleTextFieldStyle}
          onResetTextField={resetTextField}
          onBackgroundModeChange={setBackgroundMode}
          onSolidColorChange={setSolidColor}
          onGradientChange={setGradient}
          onBackgroundImageUpload={uploadBackgroundImage}
          refreshBackgrounds={refreshBackgrounds}
          onApplyTheme={applyTheme}
          onCustomPrimaryChange={(v) => { setCustomPrimary(v); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--primary', v); markUnsaved(); }}
          onCustomSecondaryChange={(v) => { setCustomSecondary(v); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--secondary', v); markUnsaved(); }}
          onCustomAccentChange={(v) => { setCustomAccent(v); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--accent', v); markUnsaved(); }}
          onCustomCardBgChange={(v) => { setCustomCardBg(v); previewCanvasRef.current?.style.setProperty('--card-bg', v); markUnsaved(); }}
          onImageUpload={uploadImage}
          onImageRemove={removeImage}
          onBarcodeValueChange={setBarcodeValue}
          onQrValueChange={setQrValue}
          onApplyBarcode={applyBarcode}
          onApplyQR={applyQRCode}
          onSave={saveToDrafts}
          onReset={resetAll}
          triggerUpdate={markUnsaved}
          previewCanvasRef={previewCanvasRef}
          isEditorOpen={isMobileEditorOpen}
          onToggleEditor={() => {}}
        />
      )}

      {/* Toast */}
      <div className={`fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 z-[1100] pointer-events-none flex items-center gap-2 text-sm shadow-lg ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'}`}>
        <FiCheckCircle size={14} /> {toastMessage}
      </div>

      {/* Global styles (including tile wall styles) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .card-editor-canvas .flip-card { width: 100%; height: 100%; border-radius: 20px; overflow: hidden; }
        .flip-card { width: 100%; height: 100%; perspective: 1800px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1); }
        .card-front, .card-back, .face.front, .face.back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; overflow: hidden; display: block !important; }
        .card-back, .face.back { transform: rotateY(180deg); }
        .qr-placeholder { max-width: 70px !important; max-height: 70px !important; width: auto !important; height: auto !important; margin: 0 auto !important; overflow: hidden !important; }
        .qr-placeholder canvas, .qr-placeholder img { width: 100% !important; height: 100% !important; object-fit: contain !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        
        /* Tile wall styles */
        .wall {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #eceef0;
        }
        .tile-row {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-start;
          align-items: stretch;
          background: inherit;
          width: 100%;
        }
        .tile {
          position: relative;
          transition: transform 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1), 
                      box-shadow 0.25s ease,
                      filter 0.2s ease;
          will-change: transform;
          backface-visibility: hidden;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-top: none;
          border-left: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02), 0 1px 1px rgba(0, 0, 0, 0.03);
          background-clip: padding-box;
        }
        .tile-row:first-child .tile {
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        .tile-row .tile:first-child {
          border-left: 1px solid rgba(0, 0, 0, 0.08);
        }
        .tile:hover {
          transform: scale(1.02) translateY(-6px);
          box-shadow: 0 20px 28px -12px rgba(0, 0, 0, 0.25), 0 6px 12px -6px rgba(0, 0, 0, 0.15);
          z-index: 10;
          transition: transform 0.18s cubic-bezier(0.15, 0.85, 0.3, 1.05), box-shadow 0.2s ease;
        }
        .tile::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(circle at 30% 25%, rgba(255,255,240,0.02) 0%, rgba(0,0,0,0.01) 100%);
          opacity: 0.3;
        }
        .wall, .tile-row, .tile {
          transform: translateZ(0);
        }

        /* Smooth image resizing */
        img {
          transition: width 0.3s ease-in-out;
        }
      `}} />
    </div>
  );
}

// ---------- MOBILE LAYOUT (unchanged except using markUnsaved) ----------
function MobileLayout({
  currentOrientation, currentTemplate,
  previewCanvasRef, cardScaleWrapRef, onEditorStageReady,
  onBack, onDownloadFormat, onFlip,
  textFields, backgroundBlocks, showThemeSection, showImageSection,
  detectedFeatures, uploadedImages, selectedTheme,
  customPrimary, customSecondary, customAccent, customCardBg,
  barcodeValue, qrValue,
  onTextChange, onColorChange, onFontSizeChange, onFontFamilyChange,
  onToggleTextFieldStyle, onResetTextField,
  onBackgroundModeChange, onSolidColorChange, onGradientChange,
  onBackgroundImageUpload, refreshBackgrounds,
  onApplyTheme, onCustomPrimaryChange, onCustomSecondaryChange,
  onCustomAccentChange, onCustomCardBgChange,
  onImageUpload, onImageRemove,
  onBarcodeValueChange, onQrValueChange, onApplyBarcode, onApplyQR,
  onSave, onReset, triggerUpdate,
  previewCanvasRef: canvasRef,
  isEditorOpen, onToggleEditor,
}) {
  const [showMobileDownloadMenu, setShowMobileDownloadMenu] = useState(false);
  const mobileDownloadRef = useRef(null);
  useEffect(() => {
    if (!showMobileDownloadMenu) return;
    const handleClick = (e) => {
      if (mobileDownloadRef.current && !mobileDownloadRef.current.contains(e.target)) {
        setShowMobileDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMobileDownloadMenu]);
  return (
    <div className="lg:hidden flex flex-col h-full max-h-full overflow-hidden relative">
      <div className={`flex-shrink-0 bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 flex items-start sm:items-center justify-center p-3 relative overflow-y-auto overscroll-contain ${currentOrientation === 'portrait' ? 'h-[55vh] min-h-[400px]' : 'h-[42vh] min-h-[260px] sm:min-h-[300px]'}`}>
        <div className="absolute top-2 right-2 flex gap-2 z-30">
          <button onClick={onBack} className="min-w-[44px] min-h-[44px] w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center" title="Back"><FiArrowLeft size={14} /></button>
          <div className="relative" ref={mobileDownloadRef}>
            <button onClick={() => setShowMobileDownloadMenu(prev => !prev)} className="min-w-[44px] min-h-[44px] w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg flex items-center justify-center" title="Download"><FiDownload size={14} /></button>
            {showMobileDownloadMenu && (
              <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 min-w-[100px]">
                <button onClick={() => { onDownloadFormat('png'); setShowMobileDownloadMenu(false); }} className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-slate-50">PNG</button>
                <button onClick={() => { onDownloadFormat('jpg'); setShowMobileDownloadMenu(false); }} className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-slate-50">JPG</button>
                <button onClick={() => { onDownloadFormat('pdf'); setShowMobileDownloadMenu(false); }} className="w-full text-left px-3 py-1.5 text-[10px] hover:bg-slate-50">PDF</button>
              </div>
            )}
          </div>
          <button onClick={onFlip} className="min-w-[44px] min-h-[44px] w-8 h-8 bg-white rounded-full shadow-lg text-indigo-600 flex items-center justify-center" title="Flip"><FiRefreshCcw size={14} /></button>
        </div>
        <div className={`w-full mx-auto py-2 flex items-start sm:items-center justify-center ${currentOrientation === 'portrait' ? 'max-w-[280px]' : 'max-w-xs sm:max-w-sm'}`}>
          <CardEditorStage orientation={currentOrientation} innerRef={previewCanvasRef} scaleWrapRef={cardScaleWrapRef} onReady={onEditorStageReady} />
        </div>
      </div>
      <div className="z-30 bg-white rounded-t-2xl shadow-2xl flex flex-col" style={{ maxHeight: '60vh' }}>
        <div className="flex justify-center pt-2 pb-1 flex-shrink-0"><div className="w-10 h-1 bg-slate-300 rounded-full" /></div>
        <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
          <EditorSidebar
            currentTemplate={currentTemplate}
            currentOrientation={currentOrientation}
            textFields={textFields}
            onTextChange={onTextChange}
            onColorChange={onColorChange}
            onFontSizeChange={onFontSizeChange}
            onFontFamilyChange={onFontFamilyChange}
            onToggleTextFieldStyle={onToggleTextFieldStyle}
            onResetTextField={onResetTextField}
            onTextFieldClick={null}
            backgroundBlocks={backgroundBlocks}
            onBackgroundModeChange={onBackgroundModeChange}
            onSolidColorChange={onSolidColorChange}
            onGradientChange={onGradientChange}
            onBackgroundImageUpload={onBackgroundImageUpload}
            refreshBackgrounds={refreshBackgrounds}
            showThemeSection={showThemeSection}
            selectedTheme={selectedTheme}
            customPrimary={customPrimary}
            customSecondary={customSecondary}
            customAccent={customAccent}
            customCardBg={customCardBg}
            onApplyTheme={onApplyTheme}
            onCustomPrimaryChange={onCustomPrimaryChange}
            onCustomSecondaryChange={onCustomSecondaryChange}
            onCustomAccentChange={onCustomAccentChange}
            onCustomCardBgChange={onCustomCardBgChange}
            showImageSection={showImageSection}
            detectedFeatures={detectedFeatures}
            uploadedImages={uploadedImages}
            onImageUpload={onImageUpload}
            onImageRemove={onImageRemove}
            barcodeValue={barcodeValue}
            qrValue={qrValue}
            onBarcodeValueChange={onBarcodeValueChange}
            onQrValueChange={onQrValueChange}
            onApplyBarcode={onApplyBarcode}
            onApplyQR={onApplyQR}
            onSave={onSave}
            onReset={onReset}
            triggerUpdate={triggerUpdate}
            previewCanvasRef={canvasRef}
            isMobileView={true}
            isSidebarOpen={true}
            sidebarRef={null}
            sidebarWidth={600}
            onToggleSidebar={() => {}}
          />
        </div>
      </div>
    </div>
  );
}