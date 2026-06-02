'use client';

import { useState, useEffect, useRef, useCallback, useMemo, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CardEditorStage, withFullSizeCapture } from '@/components/Common/CardPreview';
import { allTemplates, normalizeTemplateHtml } from '@/templatesdata';
import { 
  FiUser, FiBriefcase, FiPhone, FiMail, FiGlobe, FiMapPin, FiHash, FiMessageSquare, 
  FiCalendar, FiLock, FiShield, FiCheckCircle, FiEdit2, FiRefreshCw, FiImage, 
  FiDownload, FiSave, FiRotateCcw, FiType, FiBold, FiItalic, FiUnderline, 
  FiDroplet, FiBox, FiLayers, FiTrash2, FiUpload, FiRefreshCcw,
  FiMenu, FiX, FiLoader
} from 'react-icons/fi';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaUser, FaBuilding, FaQrcode, FaBarcode } from 'react-icons/fa';

// -------------------- CONFIGURATION --------------------
const DEFAULT_TEXT_CLASSES = [
  'employee_name', 'company_name', 'designation', 'phone', 'email', 'website', 
  'address', 'employee_id', 'tagline', 'department', 'job_title', 'expiry', 
  'access', 'clearance', 'joined', 'signature', 'name', 'id_number'
];

const DEFAULT_IMAGE_CLASSES = {
  profile: ['.profile-image', '.profile-img', '.profile-photo', '[class*="profile"]'],
  signature: ['.sign-placeholder', '.sign-img', '.signature-placeholder', '[class*="sign"]'],
  logo: ['.logo'],
  barcode: ['.barcode', '.barcode-section'],
  qr: ['.qr-placeholder']
};

// -------------------- HELPER FUNCTIONS --------------------
function toTitleCase(str) {
  return str.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
}

function rgbToHex(rgb) {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return null;
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length < 3) return null;
  return '#' + rgbValues.slice(0, 3).map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function getFieldLabel(className) {
  const labels = {
    employee_name: "👤 Employee Name", company_name: "🏢 Company Name",
    designation: "💼 Designation", phone: "📞 Phone", email: "📧 Email",
    website: "🌐 Website", address: "📍 Address", employee_id: "🆔 Employee ID",
    tagline: "💬 Tagline", department: "🏢 Department", job_title: "💼 Job Title",
    expiry: "📅 Expiry", access: "🔑 Access Level", clearance: "🛡️ Clearance",
    joined: "📅 Join Date", signature: "✍️ Signature", name: "👤 Name", id_number: "🆔 ID Number"
  };
  return labels[className] || toTitleCase(className);
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

// Throttle helper to limit how often a function runs
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func.apply(this, args);
  };
}

// -------------------- MAIN COMPONENT --------------------
export default function CustomizePage() {
  const router = useRouter();
  const previewCanvasRef = useRef(null);
  const cardScaleWrapRef = useRef(null);
  const sidebarRef = useRef(null);
  const popupRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const textCacheRef = useRef({ hash: null, items: [] });
  const resetCooldownRef = useRef({ index: null, active: false });

  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentOrientation, setCurrentOrientation] = useState('landscape');
  const [originalHTML, setOriginalHTML] = useState(null);
  const [pendingTemplateHtml, setPendingTemplateHtml] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [textPopupPosition, setTextPopupPosition] = useState({ x: 0, y: 0 });
  const [currentEditingElement, setCurrentEditingElement] = useState(null);
  const [textFields, setTextFields] = useState([]);
  const [backgroundBlocks, setBackgroundBlocks] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [uploadedImages, setUploadedImages] = useState({ profile: null, signature: null, logo: null });
  const [popupFontFamily, setPopupFontFamily] = useState('Inter');
  const [popupFontSize, setPopupFontSize] = useState(14);
  const [popupBold, setPopupBold] = useState(false);
  const [popupItalic, setPopupItalic] = useState(false);
  const [popupUnderline, setPopupUnderline] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState('flip');
  const [sidePreviewHtml, setSidePreviewHtml] = useState({ front: '', back: '' });
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const [editorStageToken, setEditorStageToken] = useState(0);
  const [popupDragActive, setPopupDragActive] = useState(false);
  const [popupDragStart, setPopupDragStart] = useState({ x: 0, y: 0 });
  const [detectedFeatures, setDetectedFeatures] = useState({
    hasProfile: false, hasSignature: false, hasLogo: false, hasBarcode: false, hasQR: false
  });
  const [selectedTheme, setSelectedTheme] = useState('Default');
  const [customPrimary, setCustomPrimary] = useState('#ff7e5f');
  const [customSecondary, setCustomSecondary] = useState('#6a11cb');
  const [customAccent, setCustomAccent] = useState('#2575fc');
  const [customCardBg, setCustomCardBg] = useState('#ffffff');
  
  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mark changes on any edit
  const markUnsaved = useCallback(() => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  }, [hasUnsavedChanges]);

  // Reset unsaved flag after save/download/reset
  const clearUnsaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  // Warn before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Intercept client-side navigation (Next.js router)
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirmLeave) {
          throw 'Route change cancelled';
        } else {
          clearUnsaved();
        }
      }
    };
    router.events?.on('beforeHistoryChange', handleRouteChange);
    return () => {
      router.events?.off('beforeHistoryChange', handleRouteChange);
    };
  }, [hasUnsavedChanges, router, clearUnsaved]);

  const showToastMessage = useCallback((msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  const getCurrentCardElement = useCallback(() => {
    if (!previewCanvasRef.current) return null;
    return previewCanvasRef.current.querySelector('.flip-card') ||
      previewCanvasRef.current.querySelector('.card') ||
      previewCanvasRef.current.firstElementChild;
  }, []);

  const invalidateEditorCaches = useCallback(() => {
    textCacheRef.current = { hash: null, items: [] };
  }, []);

  const resolveTextFieldElement = useCallback((field) => {
    if (!field || !previewCanvasRef.current) return null;
    if (field.element && previewCanvasRef.current.contains(field.element)) {
      return field.element;
    }

    const card = getCurrentCardElement();
    return card?.querySelector(`[data-element-index="${field.index}"]`) || null;
  }, [getCurrentCardElement]);

  const resolveBackgroundElement = useCallback((block) => {
    if (!block || !previewCanvasRef.current) return null;
    if (block.element && previewCanvasRef.current.contains(block.element)) {
      return block.element;
    }

    const card = getCurrentCardElement();
    return card?.querySelectorAll('.editable-bg')?.[block.index] || null;
  }, [getCurrentCardElement]);

  const getFrontFace = useCallback(() => {
    const card = getCurrentCardElement();
    return card?.querySelector('.card-front, .face.front');
  }, [getCurrentCardElement]);

  const getBackFace = useCallback(() => {
    const card = getCurrentCardElement();
    return card?.querySelector('.card-back, .face.back');
  }, [getCurrentCardElement]);

  const buildTextList = useCallback(() => {
    const card = getCurrentCardElement();
    if (!card) return;

    const currentHTML = card.innerHTML;
    const hash = simpleHash(currentHTML);
    const cachedItems = textCacheRef.current.items;
    const cacheIsLive = cachedItems.every(item => item.element && previewCanvasRef.current?.contains(item.element));
    if (hash === textCacheRef.current.hash && cachedItems.length && cacheIsLive) {
      setTextFields(textCacheRef.current.items);
      return;
    }

    const classSelector = DEFAULT_TEXT_CLASSES.map(cls => `.${cls}`).join(', ');
    const attributeSelector = '[data-editable="true"], [data-field]';
    const textElements = card.querySelectorAll(`${classSelector}, ${attributeSelector}`);
    const fallbackElements = card.querySelectorAll('h1, h2, h3, p, span, b, strong, li, a');
    
    const items = [];
    const seen = new Set();
    const candidates = [...textElements, ...fallbackElements];

    for (const element of candidates) {
      if (seen.has(element)) continue;
      seen.add(element);
      const text = element.innerText?.trim();
      if (!text) continue;
      if (element.querySelector('input, textarea, button, img, svg, canvas')) continue;
      
      const computed = getComputedStyle(element);
      const idx = items.length;
      element.dataset.elementIndex = String(idx);
      element.setAttribute('data-fulltext', text);
      
      if (!element.dataset.originalText) element.dataset.originalText = text;
      if (!element.dataset.originalColor) element.dataset.originalColor = rgbToHex(computed.color) || '#000000';
      if (!element.dataset.originalFontSize) element.dataset.originalFontSize = computed.fontSize;
      if (!element.dataset.originalFontFamily) element.dataset.originalFontFamily = computed.fontFamily;
      if (!element.dataset.originalFontWeight) element.dataset.originalFontWeight = computed.fontWeight;
      if (!element.dataset.originalFontStyle) element.dataset.originalFontStyle = computed.fontStyle;
      if (!element.dataset.originalTextDecoration) element.dataset.originalTextDecoration = computed.textDecoration;
      
      const classList = element.className.split(/\s+/);
      const dataField = element.dataset.field;
      const matchedClass = DEFAULT_TEXT_CLASSES.find(cls => classList.includes(cls)) || dataField;
      const label = matchedClass ? getFieldLabel(matchedClass) : (text.slice(0, 30) + (text.length > 30 ? '...' : ''));
      const isBackField = !!element.closest('.card-back, .face.back, [class*="back"]');
      const color = rgbToHex(computed.color) || '#000000';

      items.push({
        index: idx,
        label: isBackField ? `${label} (Back)` : label,
        text,
        color,
        fontSize: parseInt(computed.fontSize, 10) || 14,
        fontFamily: computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim() || 'Inter',
        bold: computed.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600,
        italic: computed.fontStyle === 'italic',
        underline: computed.textDecoration?.includes('underline') || false,
        side: isBackField ? 'Back' : 'Front',
        element,
        originalText: text,
        originalColor: color
      });
    }
    
    textCacheRef.current = { hash, items };
    setTextFields(items);
  }, [getCurrentCardElement]);

  const buildBackgroundBlocks = useCallback(() => {
    const card = getCurrentCardElement();
    if (!card) return;
    
    let bgElements = card.querySelectorAll('.editable-bg');
    if (bgElements.length === 0) {
      const front = getFrontFace();
      const back = getBackFace();
      if (front && !front.classList.contains('editable-bg')) front.classList.add('editable-bg');
      if (back && !back.classList.contains('editable-bg')) back.classList.add('editable-bg');
      bgElements = card.querySelectorAll('.editable-bg');
    }
    
    const blocks = [];
    for (const el of bgElements) {
      const computed = getComputedStyle(el);
      const currentColor = rgbToHex(computed.backgroundColor) || '#ffffff';
      const currentBgImage = computed.backgroundImage || 'none';
      const startsAsGradient = currentBgImage.includes('gradient(');
      const isBack = !!el.closest('.card-back, .face.back, [class*="back"]');
      blocks.push({
        index: blocks.length,
        element: el,
        label: isBack ? `Background ${blocks.length + 1} (Back)` : `Background ${blocks.length + 1} (Front)`,
        currentColor,
        currentBgImage,
        mode: startsAsGradient ? 'gradient' : (currentBgImage !== 'none' ? 'image' : 'solid'),
        gradColor1: '#4f46e5',
        gradColor2: '#6366f1',
        gradDirection: '135deg'
      });
    }
    setBackgroundBlocks(blocks);
  }, [getCurrentCardElement, getFrontFace, getBackFace]);

  const detectFeatures = useCallback(() => {
    const card = getCurrentCardElement();
    if (!card) return;
    const features = {
      hasProfile: DEFAULT_IMAGE_CLASSES.profile.some(sel => card.querySelector(sel)),
      hasSignature: DEFAULT_IMAGE_CLASSES.signature.some(sel => card.querySelector(sel)),
      hasLogo: DEFAULT_IMAGE_CLASSES.logo.some(sel => card.querySelector(sel)),
      hasBarcode: DEFAULT_IMAGE_CLASSES.barcode.some(sel => card.querySelector(sel)),
      hasQR: DEFAULT_IMAGE_CLASSES.qr.some(sel => card.querySelector(sel))
    };
    setDetectedFeatures(features);
  }, [getCurrentCardElement]);

  const cloneFaceForPreview = useCallback((face) => {
    if (!face) return '';
    const clone = face.cloneNode(true);
    clone.style.cssText = 'position:relative !important; width:100%; height:100%; display:block !important; transform:none !important; backface-visibility:visible !important; -webkit-backface-visibility:visible !important; opacity:1 !important; visibility:visible !important; overflow:hidden;';

    const sourceCanvases = face.querySelectorAll('canvas');
    const cloneCanvases = clone.querySelectorAll('canvas');
    sourceCanvases.forEach((sourceCanvas, index) => {
      const cloneCanvas = cloneCanvases[index];
      if (!cloneCanvas) return;

      try {
        const image = document.createElement('img');
        image.src = sourceCanvas.toDataURL('image/png');
        image.alt = 'Generated code';
        image.style.cssText = sourceCanvas.getAttribute('style') || '';
        if (!image.style.width) image.style.width = '100%';
        if (!image.style.height) image.style.height = 'auto';
        image.style.display = 'block';
        cloneCanvas.replaceWith(image);
      } catch {
        // Keep the cloned canvas if the browser blocks serialization.
      }
    });

    const stage = previewCanvasRef.current;
    if (stage) {
      ['--primary', '--secondary', '--accent', '--card-bg'].forEach(name => {
        const value = stage.style.getPropertyValue(name);
        if (value) clone.style.setProperty(name, value);
      });
    }
    return clone.outerHTML;
  }, []);

  const buildSidePreviewHtml = useCallback(() => ({
    front: cloneFaceForPreview(getFrontFace()),
    back: cloneFaceForPreview(getBackFace())
  }), [cloneFaceForPreview, getFrontFace, getBackFace]);

  const refreshSidePreviewHtml = useCallback(() => {
    requestAnimationFrame(() => {
      if (isMountedRef.current) {
        setSidePreviewHtml(buildSidePreviewHtml());
      }
    });
  }, [buildSidePreviewHtml]);

  const triggerUpdate = useCallback(() => {
    refreshSidePreviewHtml();
    markUnsaved();
  }, [refreshSidePreviewHtml, markUnsaved]);

  const handleEditorStageReady = useCallback(() => {
    setEditorStageToken(token => token + 1);
  }, []);

  const buildSidebar = useCallback(() => {
    buildTextList();
    if (currentTemplate?.category === 'employee') {
      buildBackgroundBlocks();
    }
    detectFeatures();
  }, [buildTextList, buildBackgroundBlocks, detectFeatures, currentTemplate]);

  const refreshBackgrounds = () => {
    if (currentTemplate?.category === 'employee') {
      buildBackgroundBlocks();
      showToastMessage('Background list refreshed');
      markUnsaved();
    }
  };

  // Load template
  useEffect(() => {
    isMountedRef.current = true;
    loadTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && isLoading) {
        setIsLoading(false);
        showToastMessage('Loading took longer than expected. You can refresh if stuck.');
      }
    }, 10000);

    try {
      const saved = localStorage.getItem('selectedTemplateForCustomize');
      const template = saved
        ? JSON.parse(saved)
        : (allTemplates[0] ? { ...allTemplates[0], sourcePage: 'default' } : null);

      if (!template) {
        showToastMessage('No template available. Please open Templates first.');
        setIsLoading(false);
        return;
      }
      const rawHTML = template.fullHTML || template.htmlContent || '';
      const normalizedHTML = normalizeTemplateHtml(rawHTML);
      
      setCurrentTemplate(template);
      setCurrentOrientation(template.orientation || 'landscape');
      setPendingTemplateHtml(normalizedHTML);
      setOriginalHTML(normalizedHTML);
      if (!previewCanvasRef.current) {
        setIsLoading(false);
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        return;
      }

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

        const card = getCurrentCardElement();
        const flipInner = card?.querySelector('.flip-card-inner');
        if (flipInner) flipInner.style.transform = 'rotateY(0deg)';
        
        setIsLoading(false);
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        
        startTransition(() => {
          buildSidebar();
          refreshSidePreviewHtml();
        });
        clearUnsaved(); // no unsaved changes after initial load
      } else {
        showToastMessage('Template preview is unavailable.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      showToastMessage('Error loading template');
      setIsLoading(false);
    }

    return () => {
      isMountedRef.current = false;
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
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

      startTransition(() => {
        buildSidebar();
        refreshSidePreviewHtml();
      });
    });
  }, [isLoading, editorStageToken, pendingTemplateHtml, currentTemplate, displayMode, buildSidebar, refreshSidePreviewHtml, getCurrentCardElement, invalidateEditorCaches]);

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateLayout = () => {
      const isDesktop = mediaQuery.matches;
      if (previewCanvasRef.current?.innerHTML) {
        setPendingTemplateHtml(previewCanvasRef.current.innerHTML);
      }
      setIsDesktopLayout(isDesktop);
      // Force flip mode on mobile
      if (!isDesktop && displayMode !== 'flip') {
        setDisplayMode('flip');
      }
    };
    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, [displayMode]);

  // Close popup on scroll (desktop only)
  useEffect(() => {
    if (!showTextPopup) return;
    const handleScroll = () => setShowTextPopup(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showTextPopup]);

  const handleResizeStart = (e) => {
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
  };

  const flipCard = () => {
    const card = getCurrentCardElement();
    const front = getFrontFace();
    const back = getBackFace();
    if (!front || !back) { showToastMessage('Card sides not found'); return; }
    const flipInner = card?.querySelector('.flip-card-inner');
    if (flipInner) {
      const isFlipped = flipInner.dataset.flipped === 'true';
      flipInner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
      flipInner.dataset.flipped = isFlipped ? 'false' : 'true';
    }
    showToastMessage(flipInner?.dataset.flipped === 'true' ? 'Showing back side' : 'Showing front side');
    // flipping doesn't count as edit
  };

  const handleTextChange = (index, newText) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.innerText = newText;
      element.setAttribute('data-fulltext', newText);
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, text: newText, element } : f));
      triggerUpdate();
    }
  };

  const throttledColorChange = useMemo(() => {
    const fn = (index, newColor) => {
      const field = textFields.find(f => f.index === index);
      const element = resolveTextFieldElement(field);
      if (element) {
        element.style.color = newColor;
        setTextFields(prev => prev.map(f => f.index === index ? { ...f, color: newColor, element } : f));
        triggerUpdate();
      }
    };
    return throttle(fn, 40);
  }, [textFields, resolveTextFieldElement, triggerUpdate]);

  const handleColorChange = useCallback((index, newColor) => {
    // Set cooldown immediately when user interacts
    resetCooldownRef.current = { index, active: true };
    setTimeout(() => {
      if (resetCooldownRef.current.index === index) {
        resetCooldownRef.current.active = false;
      }
    }, 300);
    // Call throttled update
    throttledColorChange(index, newColor);
  }, [throttledColorChange]);

  const handleFontSizeChange = (index, nextSize) => {
    const size = Math.min(72, Math.max(8, Number(nextSize) || 14));
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.fontSize = `${size}px`;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, fontSize: size, element } : f));
      triggerUpdate();
    }
  };

  const handleFontFamilyChange = (index, fontFamily) => {
    const field = textFields.find(f => f.index === index);
    const element = resolveTextFieldElement(field);
    if (element) {
      element.style.fontFamily = fontFamily;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, fontFamily, element } : f));
      triggerUpdate();
    }
  };

  const toggleTextFieldStyle = (index, type) => {
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
    triggerUpdate();
  };

  const resetTextField = (index) => {
    // If this field is in cooldown, ignore the reset
    if (resetCooldownRef.current.active && resetCooldownRef.current.index === index) {
      return;
    }

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
        element
      } : f));
      showToastMessage('Field reset to original');
      triggerUpdate();
    }
  };

  const setBackgroundMode = (blockIndex, mode) => {
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
  };

  const throttledSolidColorChange = useMemo(() => {
    const fn = (blockIndex, color) => {
      const block = backgroundBlocks.find(b => b.index === blockIndex);
      const element = resolveBackgroundElement(block);
      if (block && element) {
        element.style.backgroundImage = 'none';
        element.style.background = color;
        setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, currentColor: color, element } : b));
        triggerUpdate();
      }
    };
    return throttle(fn, 40);
  }, [backgroundBlocks, resolveBackgroundElement, triggerUpdate]);

  const setSolidColor = useCallback((blockIndex, color) => {
    // Set cooldown for background blocks too
    resetCooldownRef.current = { index: `bg-${blockIndex}`, active: true };
    setTimeout(() => {
      if (resetCooldownRef.current.index === `bg-${blockIndex}`) {
        resetCooldownRef.current.active = false;
      }
    }, 300);
    // Call throttled update
    throttledSolidColorChange(blockIndex, color);
  }, [throttledSolidColorChange]);

  const setGradient = (blockIndex, color1, color2, direction) => {
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    const element = resolveBackgroundElement(block);
    if (block && element) {
      const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
      element.style.background = gradient;
      element.style.backgroundImage = gradient;
      setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, gradColor1: color1, gradColor2: color2, gradDirection: direction, element } : b));
      triggerUpdate();
    }
  };

  const uploadBackgroundImage = (blockIndex) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
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
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const applyTheme = (themeName, primary, secondary, accent) => {
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
  };

  // Popup handler - disabled on mobile
  const showTextPopupHandler = (field, event) => {
    if (window.innerWidth < 768) return;
    event?.stopPropagation();
    const element = resolveTextFieldElement(field);
    if (!element) {
      buildTextList();
      showToastMessage('Refreshing editable fields');
      return;
    }

    setCurrentEditingElement(element);
    setTextFields(prev => prev.map(f => f.index === field.index ? { ...f, element } : f));
    const computed = getComputedStyle(element);
    setPopupFontFamily(computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim());
    setPopupFontSize(parseInt(computed.fontSize, 10) || 14);
    setPopupBold(computed.fontWeight >= 600);
    setPopupItalic(computed.fontStyle === 'italic');
    setPopupUnderline(computed.textDecoration?.includes('underline') || false);
    
    const rect = element.getBoundingClientRect();
    const popupWidth = 280;
    const popupHeight = 220;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left, top;
    if (viewportWidth < 768) {
      left = rect.left + rect.width / 2 - popupWidth / 2;
      top = rect.bottom + 8;
    } else {
      left = rect.right + 12;
      top = rect.top;
    }
    
    left = Math.min(Math.max(left, 10), viewportWidth - popupWidth - 10);
    top = Math.min(Math.max(top, 10), viewportHeight - popupHeight - 10);
    
    setTextPopupPosition({ x: left, y: top });
    setShowTextPopup(true);
  };

  const hideTextPopup = () => {
    setShowTextPopup(false);
    setCurrentEditingElement(null);
    setPopupDragActive(false);
  };

  const handlePopupMouseDown = (e) => {
    if (e.target.closest('.popup-close-btn')) return;
    setPopupDragActive(true);
    setPopupDragStart({ x: e.clientX - textPopupPosition.x, y: e.clientY - textPopupPosition.y });
  };

  const handlePopupMouseMove = useCallback((e) => {
    if (!popupDragActive) return;
    const popupWidth = popupRef.current?.offsetWidth || 280;
    const popupHeight = popupRef.current?.offsetHeight || 200;
    setTextPopupPosition({
      x: Math.min(Math.max(e.clientX - popupDragStart.x, 10), window.innerWidth - popupWidth - 10),
      y: Math.min(Math.max(e.clientY - popupDragStart.y, 10), window.innerHeight - popupHeight - 10)
    });
  }, [popupDragActive, popupDragStart]);

  const handlePopupMouseUp = useCallback(() => setPopupDragActive(false), []);

  useEffect(() => {
    if (popupDragActive) {
      document.addEventListener('mousemove', handlePopupMouseMove);
      document.addEventListener('mouseup', handlePopupMouseUp);
    } else {
      document.removeEventListener('mousemove', handlePopupMouseMove);
      document.removeEventListener('mouseup', handlePopupMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handlePopupMouseMove);
      document.removeEventListener('mouseup', handlePopupMouseUp);
    };
  }, [popupDragActive, handlePopupMouseMove, handlePopupMouseUp]);

  const applyPopupFontFamily = (font) => {
    setPopupFontFamily(font);
    if (currentEditingElement) currentEditingElement.style.fontFamily = font;
    triggerUpdate();
  };

  const applyPopupFontSize = (size) => {
    setPopupFontSize(size);
    if (currentEditingElement) currentEditingElement.style.fontSize = size + 'px';
    triggerUpdate();
  };

  const togglePopupStyle = (type) => {
    if (!currentEditingElement) return;
    switch (type) {
      case 'bold':
        const isBold = currentEditingElement.style.fontWeight === 'bold' || parseInt(currentEditingElement.style.fontWeight) >= 600;
        currentEditingElement.style.fontWeight = isBold ? 'normal' : 'bold';
        setPopupBold(!isBold);
        break;
      case 'italic':
        const isItalic = currentEditingElement.style.fontStyle === 'italic';
        currentEditingElement.style.fontStyle = isItalic ? 'normal' : 'italic';
        setPopupItalic(!isItalic);
        break;
      case 'underline':
        const hasUnderline = currentEditingElement.style.textDecoration?.includes('underline');
        currentEditingElement.style.textDecoration = hasUnderline ? 'none' : 'underline';
        setPopupUnderline(!hasUnderline);
        break;
    }
    triggerUpdate();
  };

  const resetPopupField = () => {
    if (!currentEditingElement) return;
    currentEditingElement.innerText = currentEditingElement.dataset.originalText || '';
    currentEditingElement.style.color = currentEditingElement.dataset.originalColor || '#000000';
    currentEditingElement.style.fontFamily = currentEditingElement.dataset.originalFontFamily || 'Inter';
    currentEditingElement.style.fontSize = currentEditingElement.dataset.originalFontSize || '14px';
    currentEditingElement.style.fontWeight = currentEditingElement.dataset.originalFontWeight || 'normal';
    currentEditingElement.style.fontStyle = currentEditingElement.dataset.originalFontStyle || 'normal';
    currentEditingElement.style.textDecoration = currentEditingElement.dataset.originalTextDecoration || 'none';
    buildTextList();
    showToastMessage('Text reset to original');
    triggerUpdate();
  };

  const uploadImage = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imageData = ev.target?.result;
        if (!imageData) return;
        setUploadedImages(prev => ({ ...prev, [type]: imageData }));
        const selectors = {
          profile: DEFAULT_IMAGE_CLASSES.profile,
          signature: DEFAULT_IMAGE_CLASSES.signature,
          logo: DEFAULT_IMAGE_CLASSES.logo
        };
        const containers = previewCanvasRef.current?.querySelectorAll(selectors[type].join(','));
        containers?.forEach(el => {
          if (el.tagName === 'IMG') el.src = imageData;
          else { el.innerHTML = ''; el.style.backgroundImage = `url(${imageData})`; el.style.backgroundSize = type === 'signature' ? 'contain' : 'cover'; el.style.backgroundPosition = 'center'; }
        });
        showToastMessage(`${type} uploaded ✓`);
        triggerUpdate();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const removeImage = (type) => {
    setUploadedImages(prev => ({ ...prev, [type]: null }));
    showToastMessage(`${type} removed`);
    triggerUpdate();
  };

  const applyBarcode = () => {
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
  };

  const applyQRCode = () => {
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
  };

  const downloadCardBothSides = async () => {
    const card = getCurrentCardElement();
    if (!card) { showToastMessage('No card to download'); return; }
    try {
      const html2canvas = (await import('html2canvas')).default;
      const frontFace = card.querySelector('.card-front, .face.front');
      const backFace = card.querySelector('.card-back, .face.back');
      if (!frontFace || !backFace) { showToastMessage('Could not find both sides'); return; }
      
      const captureFace = async (face) => {
        const design = currentOrientation === 'portrait' ? { width: 350, height: 550 } : { width: 550, height: 348 };
        const stage = document.createElement('div');
        stage.style.cssText = `position:fixed; top:-9999px; left:-9999px; width:${design.width}px; height:${design.height}px; border-radius:24px; overflow:hidden; background:#fff;`;
        const clone = face.cloneNode(true);
        clone.style.cssText = 'position:relative; width:100%; height:100%; display:block; transform:none; backface-visibility:visible;';
        stage.appendChild(clone);
        document.body.appendChild(stage);
        await new Promise(r => setTimeout(r, 100));
        const canvas = await html2canvas(stage, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        document.body.removeChild(stage);
        return canvas;
      };
      
      const frontCanvas = await captureFace(frontFace);
      const backCanvas = await captureFace(backFace);
      
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = frontCanvas.width;
      combinedCanvas.height = frontCanvas.height + backCanvas.height;
      const ctx = combinedCanvas.getContext('2d');
      ctx.drawImage(frontCanvas, 0, 0);
      ctx.drawImage(backCanvas, 0, frontCanvas.height);
      
      const link = document.createElement('a');
      link.download = `card-both-sides-${Date.now()}.png`;
      link.href = combinedCanvas.toDataURL('image/png');
      link.click();
      showToastMessage('✅ Both sides downloaded!');
      
      const downloads = JSON.parse(localStorage.getItem('cardstudio_downloads') || '[]');
      downloads.unshift({ id: Date.now(), name: currentTemplate?.name + " (Downloaded)", orientation: currentOrientation, fullHTML: previewCanvasRef.current?.innerHTML, createdAt: new Date().toISOString() });
      localStorage.setItem('cardstudio_downloads', JSON.stringify(downloads));
      clearUnsaved();
    } catch (e) {
      showToastMessage('Download failed: ' + e.message);
    }
  };

  const saveToDrafts = () => {
    if (!previewCanvasRef.current) { showToastMessage('No template to save'); return; }
    const drafts = JSON.parse(localStorage.getItem('cardstudio_drafts') || '[]');
    drafts.push({ id: Date.now(), name: `${currentTemplate?.name} (Custom)`, orientation: currentOrientation, fullHTML: previewCanvasRef.current.innerHTML, createdAt: new Date().toISOString() });
    localStorage.setItem('cardstudio_drafts', JSON.stringify(drafts));
    showToastMessage('✅ Saved to Drafts!');
    clearUnsaved();
  };

  const resetAll = () => {
    if (originalHTML && previewCanvasRef.current) {
      invalidateEditorCaches();
      previewCanvasRef.current.innerHTML = originalHTML;
      setUploadedImages({ profile: null, signature: null, logo: null });
      setBackgroundBlocks([]);
      setCurrentEditingElement(null);
      setShowTextPopup(false);
      if (currentTemplate?.category === 'visiting') {
        const defaults = { primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc', cardBg: '#ffffff' };
        Object.entries(defaults).forEach(([key, value]) => {
          previewCanvasRef.current.style.setProperty(`--${key === 'cardBg' ? 'card-bg' : key}`, value);
        });
        setCustomPrimary(defaults.primary); setCustomSecondary(defaults.secondary); setCustomAccent(defaults.accent); setCustomCardBg(defaults.cardBg);
        setSelectedTheme('Default');
      }
      startTransition(() => {
        buildSidebar();
        triggerUpdate();
      });
      showToastMessage('Reset to original template');
      clearUnsaved();
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleDisplayMode = () => {
    const next = displayMode === 'flip' ? 'both' : 'flip';
    if (next === 'both') {
      if (previewCanvasRef.current?.innerHTML) {
        setPendingTemplateHtml(previewCanvasRef.current.innerHTML);
      }
      setSidePreviewHtml(buildSidePreviewHtml());
    }
    setDisplayMode(next);
    // changing display mode doesn't count as unsaved change
  };

  const showImageSection = detectedFeatures.hasProfile || detectedFeatures.hasSignature || detectedFeatures.hasLogo || detectedFeatures.hasBarcode || detectedFeatures.hasQR;

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <FiLoader className="animate-spin text-indigo-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Loading your card...</h2>
          <p className="text-sm text-slate-500">Please wait while we prepare the editor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[#f5f7fb] font-['Inter'] overflow-hidden">
      {/* MOBILE LAYOUT: only flip mode, no both-sides button */}
      {!isDesktopLayout && (
      <div className="lg:hidden flex flex-col h-full max-h-full overflow-hidden">
        
        {/* ========== CARD PREVIEW AREA ========== */}
        <div className={`flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-start sm:items-center justify-center p-3 relative overflow-y-auto overscroll-contain ${
          currentOrientation === 'portrait' 
            ? 'h-[55vh] min-h-[400px]' 
            : 'h-[42vh] min-h-[260px] sm:min-h-[300px]'
        }`}>
          
          {/* Action Buttons - no toggleDisplayMode button on mobile */}
          <div className="absolute top-2 right-2 flex gap-2 z-30">
            <button 
              onClick={downloadCardBothSides} 
              className="min-w-[44px] min-h-[44px] w-7 h-7 bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center" 
              title="Download both sides"
            >
              <FiDownload size={12} />
            </button>
            {/* Flip button only (both-sides mode not available on mobile) */}
            <button 
              onClick={flipCard} 
              className="min-w-[44px] min-h-[44px] w-7 h-7 bg-white rounded-full shadow-lg text-indigo-600 flex items-center justify-center" 
              title="Flip card"
            >
              <FiRefreshCw size={12} />
            </button>
          </div>

          <div className={`w-full mx-auto py-2 flex items-start sm:items-center justify-center ${
            currentOrientation === 'portrait' ? 'max-w-[280px]' : 'max-w-xs sm:max-w-sm'
          }`}>
            <CardEditorStage orientation={currentOrientation} innerRef={previewCanvasRef} scaleWrapRef={cardScaleWrapRef} onReady={handleEditorStageReady} />
          </div>
        </div>

        {/* ========== BOTTOM SHEET EDITOR ========== */}
        <div className="flex-1 bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden min-h-0">
          
          {/* Drag Handle */}
          <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="px-4 pb-2 border-b border-slate-100 flex-shrink-0">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
              <FiEdit2 className="text-indigo-500" /> Customize
              <span className="text-[8px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">{currentOrientation}</span>
              <span className="text-[8px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">{currentTemplate?.category || ''}</span>
            </h2>
          </div>

          {/* ========== SINGLE SCROLLABLE AREA ========== */}
          <div className="flex-1 overflow-y-auto px-3 py-2 pb-24">
            
            {/* TEXT FIELDS */}
            <div className="mb-3 p-2.5 border border-slate-100 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold text-[10px] uppercase">
                <FiType size={12} /> Editable Text Fields
              </div>
              {textFields.length === 0 ? (
                <p className="text-center py-3 text-slate-400 text-xs">No editable text found</p>
              ) : (
                <div className="space-y-2">
                  {textFields.map(field => (
                    <div key={field.index} className="bg-slate-50 rounded-lg p-2">
                      <div className="text-[9px] text-slate-500 truncate mb-1">{field.label}</div>
                      <input 
                        type="text" 
                        value={field.text} 
                        onChange={(e) => handleTextChange(field.index, e.target.value)} 
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:border-indigo-500" 
                      />
                      <div className="mt-1.5">
                        {/* Row 1: Controls that wrap */}
                        <div className="flex flex-wrap items-center gap-1.5 pb-1">
                          <select
                            value={field.fontFamily || 'Inter'}
                            onChange={(e) => handleFontFamilyChange(field.index, e.target.value)}
                            className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-600 outline-none"
                          >
                            <option value="Inter">Inter</option>
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Playfair Display">Playfair Display</option>
                            <option value="Space Grotesk">Space Grotesk</option>
                          </select>
                          <label className="flex h-7 min-w-[56px] items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 text-[10px] font-bold text-slate-600">
                            T
                            <input
                              type="number"
                              min="8"
                              max="72"
                              value={field.fontSize || 14}
                              onChange={(e) => handleFontSizeChange(field.index, e.target.value)}
                              className="w-8 bg-transparent text-center text-[10px] outline-none"
                            />
                          </label>
                          <input 
                            type="color" 
                            value={field.color} 
                            onChange={(e) => handleColorChange(field.index, e.target.value)} 
                            className="h-7 w-8 flex-shrink-0 rounded-md border border-slate-200 bg-white p-0.5 cursor-pointer" 
                          />
                          <button
                            type="button"
                            onClick={() => toggleTextFieldStyle(field.index, 'bold')}
                            className={`h-7 w-7 flex-shrink-0 rounded-md border text-[11px] font-bold ${field.bold ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                          >B</button>
                          <button
                            type="button"
                            onClick={() => toggleTextFieldStyle(field.index, 'italic')}
                            className={`h-7 w-7 flex-shrink-0 rounded-md border text-[11px] italic ${field.italic ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                          >I</button>
                          <button
                            type="button"
                            onClick={() => toggleTextFieldStyle(field.index, 'underline')}
                            className={`h-7 w-7 flex-shrink-0 rounded-md border text-[11px] underline ${field.underline ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 bg-white text-slate-600'}`}
                          >U</button>
                        </div>

                        {/* Row 2: Reset button - now below */}
                        <div className="mt-1.5">
                          <button 
                            onClick={() => resetTextField(field.index)} 
                            className="flex h-7 w-full items-center justify-center gap-1 rounded-md bg-slate-100 px-2 text-[9px] text-slate-500"
                          >
                            <FiRefreshCw size={10} /> Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BACKGROUND EDITOR (Employee only) */}
            {currentTemplate?.category === 'employee' && (
              <div className="mb-3 p-2.5 border border-slate-100 rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-[10px] uppercase">
                    <FiDroplet size={12} /> Background Editor
                  </div>
                  <button onClick={refreshBackgrounds} className="text-indigo-500 text-[9px] flex items-center gap-0.5">
                    <FiRefreshCcw size={10} /> Refresh
                  </button>
                </div>
                {backgroundBlocks.length === 0 ? (
                  <p className="text-center py-3 text-slate-400 text-xs">No editable backgrounds found.</p>
                ) : (
                  backgroundBlocks.map(block => (
                    <div key={block.index} className="mb-2 last:mb-0">
                      <span className="text-[9px] text-slate-400 mb-1 block">{block.label}</span>
                      <div className="flex bg-slate-100 p-0.5 rounded-lg gap-0.5 mb-1.5">
                        {['solid', 'gradient', 'image'].map(mode => (
                          <button 
                            key={mode} 
                            onClick={() => setBackgroundMode(block.index, mode)} 
                            className={`flex-1 py-1 text-[9px] rounded cursor-pointer font-semibold ${block.mode === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                      {block.mode === 'solid' && (
                        <div className="flex gap-2 items-center">
                          <input type="color" value={block.currentColor} onChange={(e) => setSolidColor(block.index, e.target.value)} className="w-7 h-6 rounded cursor-pointer" />
                          <input type="text" value={block.currentColor} onChange={(e) => setSolidColor(block.index, e.target.value)} className="flex-1 px-1.5 py-1 border border-slate-200 rounded text-xs" />
                        </div>
                      )}
                      {block.mode === 'gradient' && (
                        <div className="flex gap-1 items-center">
                          <input type="color" value={block.gradColor1} onChange={(e) => setGradient(block.index, e.target.value, block.gradColor2, block.gradDirection)} className="w-6 h-6 rounded cursor-pointer" />
                          <input type="color" value={block.gradColor2} onChange={(e) => setGradient(block.index, block.gradColor1, e.target.value, block.gradDirection)} className="w-6 h-6 rounded cursor-pointer" />
                          <select value={block.gradDirection} onChange={(e) => setGradient(block.index, block.gradColor1, block.gradColor2, e.target.value)} className="flex-1 px-1 py-1 border border-slate-200 rounded text-[11px]">
                            <option value="to right">→</option>
                            <option value="to left">←</option>
                            <option value="to bottom">↓</option>
                          </select>
                        </div>
                      )}
                      {block.mode === 'image' && (
                        <div className="flex gap-2">
                          <button onClick={() => uploadBackgroundImage(block.index)} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 py-1 rounded text-[10px] flex items-center justify-center gap-1">
                            <FiUpload size={10} /> Upload
                          </button>
                          <button onClick={() => setBackgroundMode(block.index, 'solid')} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 py-1 rounded text-[10px] flex items-center justify-center gap-1">
                            <FiTrash2 size={10} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* COLOR THEME (Visiting only) */}
            {currentTemplate?.category === 'visiting' && (
              <div className="mb-3 p-2.5 border border-slate-100 rounded-xl bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold text-[10px] uppercase">
                  <FiDroplet size={12} /> Color Theme
                </div>
                <div className="mb-2">
                  <div className="flex gap-2 items-center">
                    <input type="color" value={customCardBg} onChange={(e) => { setCustomCardBg(e.target.value); previewCanvasRef.current?.style.setProperty('--card-bg', e.target.value); triggerUpdate(); }} className="w-7 h-6 border border-slate-200 rounded cursor-pointer" />
                    <input type="text" value={customCardBg} onChange={(e) => { setCustomCardBg(e.target.value); previewCanvasRef.current?.style.setProperty('--card-bg', e.target.value); triggerUpdate(); }} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  {[
                    { name: 'Default', primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc' },
                    { name: 'Sunset', primary: '#ff6b35', secondary: '#f7931e', accent: '#ff2d55' },
                    { name: 'Midnight', primary: '#6c63ff', secondary: '#3f37c9', accent: '#4895ef' },
                  ].map(theme => (
                    <button 
                      key={theme.name} 
                      onClick={() => applyTheme(theme.name, theme.primary, theme.secondary, theme.accent)} 
                      className={`p-1 rounded-lg border transition-all ${selectedTheme === theme.name ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200'}`}
                    >
                      <span className="text-[9px] font-semibold text-slate-600">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* IMAGES & DIGITAL ID */}
            {showImageSection && (
              <div className="mb-3 p-2.5 border border-slate-100 rounded-xl bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold text-[10px] uppercase">
                  <FiImage size={12} /> Images & Digital ID
                </div>
                <div className="space-y-2">
                  {detectedFeatures.hasProfile && (
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                      <div onClick={() => uploadImage('profile')} className="w-10 h-10 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0">
                        {uploadedImages.profile ? <img src={uploadedImages.profile} className="w-full h-full object-cover" alt="Profile" /> : <FiUser size={14} className="text-slate-400" />}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-slate-700 block">Profile Image</span>
                        {uploadedImages.profile && (
                          <button onClick={() => removeImage('profile')} className="text-[10px] text-red-500 flex items-center gap-0.5 mt-0.5">
                            <FiTrash2 size={10} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {detectedFeatures.hasSignature && (
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                      <div onClick={() => uploadImage('signature')} className="w-10 h-10 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0">
                        {uploadedImages.signature ? <img src={uploadedImages.signature} className="w-full h-full object-contain" alt="Signature" /> : <span className="text-sm">✍️</span>}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-slate-700 block">Signature</span>
                        {uploadedImages.signature && (
                          <button onClick={() => removeImage('signature')} className="text-[10px] text-red-500 flex items-center gap-0.5 mt-0.5">
                            <FiTrash2 size={10} /> Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {detectedFeatures.hasBarcode && (
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <input type="text" value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} placeholder="Barcode text..." className="w-full px-2 py-1 border border-slate-200 rounded text-xs mb-1.5" />
                      <button onClick={applyBarcode} className="w-full py-1 bg-indigo-500 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1">
                        <FaBarcode size={10} /> Generate Barcode
                      </button>
                    </div>
                  )}
                  {detectedFeatures.hasQR && (
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} placeholder="QR URL or text..." className="w-full px-2 py-1 border border-slate-200 rounded text-xs mb-1.5" />
                      <button onClick={applyQRCode} className="w-full py-1 bg-indigo-500 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1">
                        <FaQrcode size={10} /> Generate QR Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Action Buttons Footer */}
          <div className="flex-shrink-0 bg-white px-4 py-3 border-t border-slate-100 flex gap-2">
            <button onClick={saveToDrafts} className="flex-[2] bg-gradient-to-br from-indigo-600 to-indigo-500 text-white py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1">
              <FiSave size={13} /> Save
            </button>
            <button onClick={resetAll} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-1">
              <FiRotateCcw size={13} /> Reset
            </button>
          </div>
        </div>
      </div>
      )}

      {/* DESKTOP LAYOUT: both modes (flip and both sides) */}
      {isDesktopLayout && (
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-y-auto p-2 sm:p-4 md:p-6 lg:p-10 relative">
          <div className="absolute left-3 top-3 sm:left-5 sm:top-5 flex gap-2 z-30">
            <button onClick={downloadCardBothSides} className="w-10 h-10 sm:w-11 sm:h-11 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 flex items-center justify-center" title="Download both sides">
              <FiDownload size={18} />
            </button>
            <button onClick={toggleDisplayMode} className={`w-10 h-10 sm:w-11 sm:h-11 border rounded-full shadow-lg transition-all flex items-center justify-center ${displayMode === 'both' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white text-indigo-600 border-white/70'}`} title={displayMode === 'flip' ? 'Show both sides' : 'Show single side'}>
              {displayMode === 'flip' ? <FiLayers size={18} /> : <FiBox size={18} />}
            </button>
            {displayMode === 'flip' && (
              <button onClick={flipCard} className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all text-indigo-600 flex items-center justify-center" title="Flip card">
                <FiRefreshCw size={18} />
              </button>
            )}
          </div>

          {displayMode === 'flip' ? (
            <CardEditorStage orientation={currentOrientation} innerRef={previewCanvasRef} scaleWrapRef={cardScaleWrapRef} onReady={handleEditorStageReady} />
          ) : (
            <div className="flex gap-6 items-center justify-center flex-wrap">
              <div className={`rounded-2xl overflow-hidden shadow-xl bg-white ${currentOrientation === 'portrait' ? 'w-[300px] h-[500px]' : 'w-[500px] h-[320px]'}`}>
                <div dangerouslySetInnerHTML={{ __html: sidePreviewHtml.front }} className="w-full h-full" />
              </div>
              <div className={`rounded-2xl overflow-hidden shadow-xl bg-white ${currentOrientation === 'portrait' ? 'w-[300px] h-[500px]' : 'w-[500px] h-[320px]'}`}>
                <div dangerouslySetInnerHTML={{ __html: sidePreviewHtml.back }} className="w-full h-full" />
              </div>
            </div>
          )}
        </div>

        <div ref={sidebarRef} className={`fixed lg:relative top-0 right-0 h-full bg-white border-l border-slate-200 flex flex-col shadow-lg rounded-l-2xl transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`} style={{ width: `min(${sidebarWidth}px, 100vw)`, maxWidth: '100vw' }}>
          <div className="lg:hidden absolute left-3 top-3 z-50">
            <button onClick={toggleSidebar} className="p-2 bg-slate-100 rounded-full"><FiX size={20} /></button>
          </div>
          <div className="absolute left-0 top-0 w-2 h-full cursor-ew-resize bg-transparent hover:bg-indigo-500/50 transition-colors z-50 hidden lg:block" onMouseDown={handleResizeStart} />

          <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
              <FiEdit2 className="text-indigo-500" /> Customize Card
              <span className="text-[9px] sm:text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full uppercase">{currentOrientation}</span>
              <span className="text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-full uppercase">{currentTemplate?.category || ''}</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 min-h-0">
            {/* TEXT FIELDS (desktop) */}
            <div className="mb-3 p-3 sm:p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider"><FiType /> Editable Text Fields</div>
              {textFields.length === 0 ? (
                <p className="text-center py-5 text-slate-400 text-xs">No editable text found</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-[350px] sm:max-h-[450px] overflow-y-auto">
                  {textFields.map(field => (
                    <div key={field.index} className="bg-slate-50 rounded-[10px] p-2 border border-slate-100">
                      <div className="flex items-center gap-1 mb-1 text-[10px] text-slate-500 truncate">{field.label}</div>
                      <input type="text" value={field.text} onChange={(e) => handleTextChange(field.index, e.target.value)} onClick={(e) => showTextPopupHandler(field, e)} className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 cursor-pointer" placeholder="Click to edit..." />
                      <div className="flex flex-wrap gap-2 mt-2 items-center">
                        <div className="flex items-center gap-1.5 flex-1">
                          <input type="color" value={field.color} onChange={(e) => handleColorChange(field.index, e.target.value)} className="w-7 h-6 sm:w-8 sm:h-7 border-none rounded-md cursor-pointer p-0" />
                        </div>
                        <button onClick={() => resetTextField(field.index)} className="bg-slate-100 text-slate-500 border-none px-2 py-1 rounded-md text-[10px] sm:text-[11px] cursor-pointer hover:bg-slate-200 transition-all flex items-center gap-1"><FiRefreshCw size={12} /> Reset</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BACKGROUND EDITOR (desktop) */}
            {currentTemplate?.category === 'employee' && (
              <div className="mb-3 p-3 sm:p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider"><FiDroplet /> Background Editor</div>
                  <button onClick={refreshBackgrounds} className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center gap-1"><FiRefreshCcw size={12} /> Refresh</button>
                </div>
                {backgroundBlocks.length === 0 ? (
                  <p className="text-center py-5 text-slate-400 text-xs">No editable backgrounds found. Click &quot;Refresh&quot; to detect.</p>
                ) : (
                  backgroundBlocks.map(block => (
                    <div key={block.index} className="mb-3">
                      <span className="text-[10px] text-slate-400 mb-1 block">{block.label}</span>
                      <div className="flex bg-slate-100 p-1 rounded-[10px] gap-0.5 mb-2">
                        {['solid', 'gradient', 'image'].map(mode => (
                          <button key={mode} onClick={() => setBackgroundMode(block.index, mode)} className={`flex-1 border-none bg-transparent px-1 py-1 text-[10px] sm:text-[11px] rounded-lg cursor-pointer transition-all font-semibold flex items-center justify-center gap-1 ${block.mode === mode ? 'bg-white text-indigo-600 font-bold shadow-sm' : 'text-slate-500'}`}>
                            {mode === 'solid' ? <FiDroplet size={10} /> : mode === 'gradient' ? <FiLayers size={10} /> : <FiImage size={10} />}
                            <span className="hidden xs:inline">{mode === 'solid' ? 'Solid' : mode === 'gradient' ? 'Gradient' : 'Image'}</span>
                          </button>
                        ))}
                      </div>
                      {block.mode === 'solid' && (
                        <div className="flex gap-2 items-center">
                          <input type="color" value={block.currentColor} onChange={(e) => setSolidColor(block.index, e.target.value)} className="w-8 h-7 border-none rounded cursor-pointer" />
                          <input type="text" value={block.currentColor} onChange={(e) => setSolidColor(block.index, e.target.value)} placeholder="#ffffff" className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs" />
                        </div>
                      )}
                      {block.mode === 'gradient' && (
                        <div className="flex gap-2 items-center flex-wrap">
                          <input type="color" value={block.gradColor1} onChange={(e) => setGradient(block.index, e.target.value, block.gradColor2, block.gradDirection)} className="w-8 h-7 border-none rounded cursor-pointer" />
                          <input type="color" value={block.gradColor2} onChange={(e) => setGradient(block.index, block.gradColor1, e.target.value, block.gradDirection)} className="w-8 h-7 border-none rounded cursor-pointer" />
                          <select value={block.gradDirection} onChange={(e) => setGradient(block.index, block.gradColor1, block.gradColor2, e.target.value)} className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs">
                            <option value="to right">→</option><option value="to left">←</option><option value="to bottom">↓</option><option value="to top">↑</option><option value="135deg">↘</option>
                          </select>
                        </div>
                      )}
                      {block.mode === 'image' && (
                        <div className="flex gap-2">
                          <button onClick={() => uploadBackgroundImage(block.index)} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2 rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-1"><FiUpload size={12} /> Upload</button>
                          <button onClick={() => setBackgroundMode(block.index, 'solid')} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2 rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-slate-100 flex items-center justify-center gap-1"><FiTrash2 size={12} /> Remove</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* COLOR THEME (desktop) */}
            {currentTemplate?.category === 'visiting' && (
              <div className="mb-3 p-3 sm:p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider"><FiDroplet /> Color Theme & Background</div>
                <div className="mb-3">
                  <label className="text-[10px] text-slate-400 block mb-1">Card Background</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={customCardBg} onChange={(e) => { setCustomCardBg(e.target.value); previewCanvasRef.current?.style.setProperty('--card-bg', e.target.value); triggerUpdate(); }} className="w-8 h-7 border border-slate-200 rounded cursor-pointer" />
                    <input type="text" value={customCardBg} onChange={(e) => { setCustomCardBg(e.target.value); previewCanvasRef.current?.style.setProperty('--card-bg', e.target.value); triggerUpdate(); }} placeholder="#ffffff" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs" />
                    <button onClick={() => { setCustomCardBg('#ffffff'); previewCanvasRef.current?.style.setProperty('--card-bg', '#ffffff'); triggerUpdate(); }} className="px-2 py-1.5 bg-slate-100 rounded text-[10px]">Reset</button>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 mb-3"></div>
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3">
                  {[
                    { name: 'Default', primary: '#ff7e5f', secondary: '#6a11cb', accent: '#2575fc' },
                    { name: 'Sunset', primary: '#ff6b35', secondary: '#f7931e', accent: '#ff2d55' },
                    { name: 'Ocean', primary: '#0077b6', secondary: '#00b4d8', accent: '#90e0ef' },
                    { name: 'Forest', primary: '#2d6a4f', secondary: '#52b788', accent: '#95d5b2' },
                    { name: 'Midnight', primary: '#6c63ff', secondary: '#3f37c9', accent: '#4895ef' },
                    { name: 'Rose Gold', primary: '#e8a87c', secondary: '#d45d79', accent: '#f0c0a0' },
                  ].map(theme => (
                    <button key={theme.name} onClick={() => applyTheme(theme.name, theme.primary, theme.secondary, theme.accent)} className={`p-1 sm:p-2 rounded-xl border-2 transition-all ${selectedTheme === theme.name ? 'border-indigo-500 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex gap-0.5 sm:gap-1 mb-1 justify-center"><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ background: theme.primary }}></div><div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{ background: theme.secondary }}></div></div>
                      <span className="text-[8px] sm:text-[9px] font-semibold text-slate-600">{theme.name}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] text-slate-400 mb-2 block">Custom Colors</span>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[80px]"><label className="text-[9px] text-slate-400 block mb-1">Primary</label><input type="color" value={customPrimary} onChange={(e) => { setCustomPrimary(e.target.value); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--primary', e.target.value); triggerUpdate(); }} className="w-full h-7 border border-slate-200 rounded cursor-pointer" /></div>
                    <div className="flex-1 min-w-[80px]"><label className="text-[9px] text-slate-400 block mb-1">Secondary</label><input type="color" value={customSecondary} onChange={(e) => { setCustomSecondary(e.target.value); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--secondary', e.target.value); triggerUpdate(); }} className="w-full h-7 border border-slate-200 rounded cursor-pointer" /></div>
                    <div className="flex-1 min-w-[80px]"><label className="text-[9px] text-slate-400 block mb-1">Accent</label><input type="color" value={customAccent} onChange={(e) => { setCustomAccent(e.target.value); setSelectedTheme('Custom'); previewCanvasRef.current?.style.setProperty('--accent', e.target.value); triggerUpdate(); }} className="w-full h-7 border border-slate-200 rounded cursor-pointer" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* IMAGES & DIGITAL ID (desktop) */}
            {showImageSection && (
              <div className="mb-3 p-3 sm:p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-semibold text-xs uppercase tracking-wider"><FiImage /> Images & Digital ID</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detectedFeatures.hasProfile && (
                    <div>
                      <div onClick={() => uploadImage('profile')} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        <div className="min-h-[60px] flex items-center justify-center text-xs text-slate-400">{uploadedImages.profile ? <img src={uploadedImages.profile} className="w-full h-full object-cover rounded-lg" alt="Profile" /> : <><FiUser className="mr-1" /> Profile</>}</div>
                      </div>
                      {uploadedImages.profile && <button onClick={() => removeImage('profile')} className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center flex items-center justify-center gap-1"><FiTrash2 size={12} /> Remove</button>}
                    </div>
                  )}
                  {detectedFeatures.hasSignature && (
                    <div>
                      <div onClick={() => uploadImage('signature')} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        <div className="min-h-[60px] flex items-center justify-center text-xs text-slate-400">{uploadedImages.signature ? <img src={uploadedImages.signature} className="w-full h-full object-contain rounded-lg" alt="Signature" /> : <>✍️ Signature</>}</div>
                      </div>
                      {uploadedImages.signature && <button onClick={() => removeImage('signature')} className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center flex items-center justify-center gap-1"><FiTrash2 size={12} /> Remove</button>}
                    </div>
                  )}
                  {detectedFeatures.hasLogo && (
                    <div>
                      <div onClick={() => uploadImage('logo')} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-2 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        <div className="min-h-[60px] flex items-center justify-center text-xs text-slate-400">{uploadedImages.logo ? <img src={uploadedImages.logo} className="w-full h-full object-contain rounded-lg" alt="Logo" /> : <><FaBuilding className="mr-1" /> Logo</>}</div>
                      </div>
                      {uploadedImages.logo && <button onClick={() => removeImage('logo')} className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center flex items-center justify-center gap-1"><FiTrash2 size={12} /> Remove</button>}
                    </div>
                  )}
                  {detectedFeatures.hasBarcode && (
                    <div>
                      <input type="text" value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} placeholder="Barcode text..." className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs mb-1" />
                      <button onClick={applyBarcode} className="w-full px-2 py-1.5 bg-indigo-500 text-white rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-indigo-600 flex items-center justify-center gap-1"><FaBarcode /> Generate</button>
                    </div>
                  )}
                  {detectedFeatures.hasQR && (
                    <div>
                      <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} placeholder="QR URL or text..." className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs mb-1" />
                      <button onClick={applyQRCode} className="w-full px-2 py-1.5 bg-indigo-500 text-white rounded-lg text-[10px] sm:text-xs font-semibold hover:bg-indigo-600 flex items-center justify-center gap-1"><FaQrcode /> Generate</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-3 sm:px-4 py-3 border-t border-slate-100 flex gap-2">
            <button onClick={saveToDrafts} className="flex-[2] bg-gradient-to-br from-indigo-600 to-indigo-500 text-white px-2 py-2.5 rounded-[10px] font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-1 text-xs sm:text-sm"><FiSave size={14} /> Save</button>
            <button onClick={resetAll} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2.5 rounded-[10px] font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-1 text-xs sm:text-sm"><FiRotateCcw size={14} /> Reset</button>
          </div>
        </div>
      </div>
      )}

      {/* Text Style Popup - only visible on desktop */}
      {showTextPopup && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={hideTextPopup} />
          <div ref={popupRef} className="fixed z-[9999] bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-2xl min-w-[240px] sm:min-w-[260px] cursor-grab active:cursor-grabbing" style={{ left: `${textPopupPosition.x}px`, top: `${textPopupPosition.y}px`, userSelect: popupDragActive ? 'none' : 'auto' }} onMouseDown={handlePopupMouseDown}>
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500">Text Style</span>
              <button onClick={hideTextPopup} className="popup-close-btn text-slate-400 hover:text-slate-700 transition-colors"><FiX size={16} /></button>
            </div>
            <div className="flex gap-2 items-center mb-3 flex-wrap">
              <select value={popupFontFamily} onChange={(e) => applyPopupFontFamily(e.target.value)} className="flex-[2] px-2 py-1.5 border border-slate-200 rounded-lg text-[10px] sm:text-[11px] bg-white cursor-pointer">
                <option value="Inter">Inter</option><option value="Arial">Arial</option><option value="Times New Roman">Times New Roman</option><option value="Georgia">Georgia</option><option value="Poppins">Poppins</option><option value="Playfair Display">Playfair Display</option><option value="Space Grotesk">Space Grotesk</option>
              </select>
              <input type="number" value={popupFontSize} onChange={(e) => applyPopupFontSize(parseInt(e.target.value))} className="w-[50px] px-1 py-1.5 border border-slate-200 rounded-lg text-[10px] sm:text-[11px] text-center" min="8" max="72" />
              <span className="text-[10px] sm:text-[11px] text-slate-400">px</span>
            </div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <button onClick={() => togglePopupStyle('bold')} className={`w-7 h-7 sm:w-9 sm:h-9 border rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center ${popupBold ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50'}`}><FiBold /></button>
              <button onClick={() => togglePopupStyle('italic')} className={`w-7 h-7 sm:w-9 sm:h-9 border rounded-lg italic text-xs sm:text-sm transition-all flex items-center justify-center ${popupItalic ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50'}`}><FiItalic /></button>
              <button onClick={() => togglePopupStyle('underline')} className={`w-7 h-7 sm:w-9 sm:h-9 border rounded-lg underline text-xs sm:text-sm transition-all flex items-center justify-center ${popupUnderline ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50'}`}><FiUnderline /></button>
              {currentEditingElement && (
                <input type="color" value={textFields.find(f => f.element === currentEditingElement)?.color || '#000000'} onChange={(e) => { if (currentEditingElement) currentEditingElement.style.color = e.target.value; triggerUpdate(); }} className="w-7 h-7 sm:w-9 sm:h-9 border border-slate-200 rounded-lg cursor-pointer p-0.5" />
              )}
            </div>
            <button onClick={resetPopupField} className="w-full bg-slate-100 text-slate-600 px-2 py-2 rounded-lg text-[10px] sm:text-[11px] font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-1"><FiRefreshCw size={12} /> Reset</button>
          </div>
        </>
      )}

      {/* Toast */}
      <div className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold transition-all duration-300 z-[1100] pointer-events-none flex items-center gap-2 text-xs sm:text-sm ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'}`}>
        <FiCheckCircle size={14} /> {toastMessage}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .card-editor-canvas .flip-card { width: 100%; height: 100%; border-radius: 20px; overflow: hidden; }
        .flip-card { width: 100%; height: 100%; perspective: 1800px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1); }
        .card-front, .card-back, .face.front, .face.back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; overflow: hidden; display: block !important; }
        .card-back, .face.back { transform: rotateY(180deg); }
        .qr-placeholder { max-width: 70px !important; max-height: 70px !important; width: auto !important; height: auto !important; margin: 0 auto !important; overflow: hidden !important; }
        .qr-placeholder canvas, .qr-placeholder img { width: 100% !important; height: 100% !important; object-fit: contain !important; }
        
        /* Text overflow protection */
        .flip-card [class*="name"], 
        .flip-card [class*="title"],
        .flip-card p, 
        .flip-card span,
        .flip-card .company_name,
        .flip-card .employee_name,
        .flip-card .designation,
        .flip-card .tagline {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          word-break: break-word;
          max-width: 100%;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @media (max-width: 480px) {
          .flip-card { perspective: 1200px; }
          .flip-card-inner { transition: transform 0.5s; }
          .card-front, .card-back { border-radius: 16px; }
        }
      `}} />
    </div>
  );
}