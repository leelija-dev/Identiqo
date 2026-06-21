// app/customize/hooks/useCustomizeEditor.js

'use client';

import { useState, useCallback, useRef } from 'react';
import { rgbToHex, simpleHash, getFieldLabel, DEFAULT_TEXT_CLASSES, DEFAULT_IMAGE_CLASSES } from '../utils/customizeHelpers';

export function useCustomizeEditor(previewCanvasRef) {
  const textCacheRef = useRef({ hash: null, items: [] });
  const resetCooldownRef = useRef({ index: null, active: false });

  // State
  const [textFields, setTextFields] = useState([]);
  const [backgroundBlocks, setBackgroundBlocks] = useState([]);
  const [detectedFeatures, setDetectedFeatures] = useState({
    hasProfile: false, hasSignature: false, hasLogo: false, hasBarcode: false, hasQR: false
  });

  // Helper to get current card element
  const getCurrentCardElement = useCallback(() => {
    if (!previewCanvasRef.current) return null;
    return previewCanvasRef.current.querySelector('.flip-card') ||
      previewCanvasRef.current.querySelector('.card') ||
      previewCanvasRef.current.firstElementChild;
  }, [previewCanvasRef]);

  // Get front/back faces
  const getFrontFace = useCallback(() => {
    const card = getCurrentCardElement();
    return card?.querySelector('.card-front, .face.front');
  }, [getCurrentCardElement]);

  const getBackFace = useCallback(() => {
    const card = getCurrentCardElement();
    return card?.querySelector('.card-back, .face.back');
  }, [getCurrentCardElement]);

  // Resolve text field element (prefer stored element, then search by index)
  const resolveTextFieldElement = useCallback((field) => {
    if (!field || !previewCanvasRef.current) return null;
    // If we have a stored element and it's still in the DOM, use it
    if (field.element && previewCanvasRef.current.contains(field.element)) {
      return field.element;
    }
    // Otherwise search by data-element-index
    const card = getCurrentCardElement();
    const element = card?.querySelector(`[data-element-index="${field.index}"]`);
    if (element) {
      // Update the stored reference for next time
      field.element = element;
      return element;
    }
    return null;
  }, [getCurrentCardElement, previewCanvasRef]);

  // Resolve background element
  const resolveBackgroundElement = useCallback((block) => {
    if (!block || !previewCanvasRef.current) return null;
    if (block.element && previewCanvasRef.current.contains(block.element)) {
      return block.element;
    }
    const card = getCurrentCardElement();
    return card?.querySelectorAll('.editable-bg')?.[block.index] || null;
  }, [getCurrentCardElement, previewCanvasRef]);

  // Invalidate caches
  const invalidateEditorCaches = useCallback(() => {
    textCacheRef.current = { hash: null, items: [] };
  }, []);

  // Build text fields list
  const buildTextList = useCallback(() => {
    const card = getCurrentCardElement();
    if (!card) {
      console.log('buildTextList: No card element');
      return;
    }

    const currentHTML = card.innerHTML;
    const hash = simpleHash(currentHTML);
    const cachedItems = textCacheRef.current.items;
    const cacheIsLive = cachedItems.every(item => item.element && previewCanvasRef.current?.contains(item.element));
    
    if (hash === textCacheRef.current.hash && cachedItems.length && cacheIsLive) {
      console.log('Using cached text fields');
      setTextFields(textCacheRef.current.items);
      return;
    }

    const classSelector = DEFAULT_TEXT_CLASSES.map(cls => `.${cls}`).join(', ');
    const attributeSelector = '[data-editable="true"], [data-field]';
    let textElements = card.querySelectorAll(`${classSelector}, ${attributeSelector}`);
    
    // Fallback to common text tags if none found
    if (textElements.length === 0) {
      textElements = card.querySelectorAll('h1, h2, h3, p, span, b, strong, li, a');
      console.log('Using fallback text elements:', textElements.length);
    }
    
    const items = [];
    const seen = new Set();

    for (const element of textElements) {
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
        element, // store DOM reference
        originalText: text,
        originalColor: color,
        originalFontSize: computed.fontSize,
        originalFontFamily: computed.fontFamily,
        originalFontWeight: computed.fontWeight,
        originalFontStyle: computed.fontStyle,
        originalTextDecoration: computed.textDecoration,
      });
    }
    
    console.log(`Detected ${items.length} editable text fields`);
    textCacheRef.current = { hash, items };
    setTextFields(items);
  }, [getCurrentCardElement, previewCanvasRef]);

  // Build background blocks
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

  // Detect features
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

  // Build sidebar (all sections)
  const buildSidebar = useCallback(() => {
    buildTextList();
    buildBackgroundBlocks();
    detectFeatures();
  }, [buildTextList, buildBackgroundBlocks, detectFeatures]);

  return {
    textFields,
    backgroundBlocks,
    detectedFeatures,
    textCacheRef,
    resetCooldownRef,
    setTextFields,
    setBackgroundBlocks,
    setDetectedFeatures,
    getCurrentCardElement,
    getFrontFace,
    getBackFace,
    resolveTextFieldElement,
    resolveBackgroundElement,
    buildTextList,
    buildBackgroundBlocks,
    detectFeatures,
    buildSidebar,
    invalidateEditorCaches,
  };
}