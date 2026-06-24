    import { useState, useRef, useCallback, useEffect } from 'react';

const DEFAULT_TEXT_CLASSES = [
  'employee_name', 'company_name', 'designation', 'phone', 'email', 'website',
  'address', 'employee_id', 'tagline', 'department', 'job_title', 'expiry',
  'access', 'clearance', 'joined', 'signature', 'name', 'id_number'
];

function toTitleCase(str) {
  return str.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
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

function useTextEditor(getCardElement, triggerUpdate, rgbToHex) {
  const [textFields, setTextFields] = useState([]);
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [textPopupPosition, setTextPopupPosition] = useState({ x: 0, y: 0 });
  const [currentEditingElement, setCurrentEditingElement] = useState(null);
  const [popupFontFamily, setPopupFontFamily] = useState('Inter');
  const [popupFontSize, setPopupFontSize] = useState(14);
  const [popupBold, setPopupBold] = useState(false);
  const [popupItalic, setPopupItalic] = useState(false);
  const [popupUnderline, setPopupUnderline] = useState(false);
  const [popupDragActive, setPopupDragActive] = useState(false);
  const [popupDragStart, setPopupDragStart] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);

  const buildTextList = useCallback(() => {
    const card = getCardElement();
    if (!card) return;

    const callback = () => {
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
        const index = items.length;
        element.dataset.elementIndex = String(index);
        element.setAttribute('data-fulltext', text);

        if (!element.dataset.originalText) element.dataset.originalText = text;
        if (!element.dataset.originalColor) element.dataset.originalColor = rgbToHex(computed.color) || '#000000';
        if (!element.dataset.originalFontSize) element.dataset.originalFontSize = computed.fontSize;
        if (!element.dataset.originalFontFamily) element.dataset.originalFontFamily = computed.fontFamily;

        const classList = element.className.split(/\s+/);
        const dataField = element.dataset.field;
        const matchedClass = DEFAULT_TEXT_CLASSES.find(cls => classList.includes(cls)) || dataField;
        const label = matchedClass ? getFieldLabel(matchedClass) : (text.slice(0, 30) + (text.length > 30 ? '...' : ''));
        const isBackField = !!element.closest('.card-back, .face.back, [class*="back"]');
        const color = rgbToHex(computed.color) || '#000000';

        items.push({
          index,
          label: isBackField ? `${label} (Back)` : label,
          text,
          color,
          side: isBackField ? 'Back' : 'Front',
          element,
          originalText: text,
          originalColor: color
        });
      }

      setTextFields(items);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 100 });
    } else {
      setTimeout(callback, 10);
    }
  }, [getCardElement, rgbToHex]);

  const handleTextChange = useCallback((index, newText) => {
    const field = textFields.find(f => f.index === index);
    if (field?.element) {
      field.element.innerText = newText;
      field.element.setAttribute('data-fulltext', newText);
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, text: newText } : f));
      triggerUpdate();
    }
  }, [textFields, triggerUpdate]);

  const handleColorChange = useCallback((index, newColor) => {
    const field = textFields.find(f => f.index === index);
    if (field?.element) {
      field.element.style.color = newColor;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, color: newColor } : f));
      triggerUpdate();
    }
  }, [textFields, triggerUpdate]);

  const resetTextField = useCallback((index) => {
    const field = textFields.find(f => f.index === index);
    if (field?.element) {
      field.element.innerText = field.originalText;
      field.element.style.color = field.originalColor;
      if (field.element.dataset.originalFontSize) field.element.style.fontSize = field.element.dataset.originalFontSize;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, text: field.originalText, color: field.originalColor } : f));
      triggerUpdate();
    }
  }, [textFields, triggerUpdate]);

  const showTextPopupHandler = useCallback((field, event) => {
    event?.stopPropagation();
    setCurrentEditingElement(field.element);
    const computed = getComputedStyle(field.element);
    setPopupFontFamily(computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim());
    setPopupFontSize(parseInt(computed.fontSize, 10) || 14);
    setPopupBold(computed.fontWeight >= 600);
    setPopupItalic(computed.fontStyle === 'italic');
    setPopupUnderline(computed.textDecoration?.includes('underline') || false);

    const rect = field.element.getBoundingClientRect();
    const popupWidth = 280;
    const viewportWidth = window.innerWidth;
    const desiredX = viewportWidth < 768 ? rect.left + rect.width / 2 - popupWidth / 2 : rect.right + 14;
    const desiredY = viewportWidth < 768 ? rect.bottom + 10 : rect.top + 8;
    setTextPopupPosition({
      x: Math.min(Math.max(desiredX, 10), viewportWidth - popupWidth - 10),
      y: Math.min(Math.max(desiredY, 10), window.innerHeight - 200)
    });
    setShowTextPopup(true);
  }, []);

  const hideTextPopup = useCallback(() => {
    setShowTextPopup(false);
    setCurrentEditingElement(null);
    setPopupDragActive(false);
  }, []);

  const handlePopupMouseDown = useCallback((e) => {
    if (e.target.closest('.popup-close-btn')) return;
    setPopupDragActive(true);
    setPopupDragStart({ x: e.clientX - textPopupPosition.x, y: e.clientY - textPopupPosition.y });
  }, [textPopupPosition]);

  const handlePopupMouseMove = useCallback((e) => {
    if (!popupDragActive) return;
    const popupWidth = popupRef.current?.offsetWidth || 280;
    const popupHeight = popupRef.current?.offsetHeight || 200;
    setTextPopupPosition({
      x: Math.min(Math.max(e.clientX - popupDragStart.x, 10), window.innerWidth - popupWidth - 10),
      y: Math.min(Math.max(e.clientY - popupDragStart.y, 10), window.innerHeight - popupHeight - 10)
    });
  }, [popupDragActive, popupDragStart]);

  const handlePopupMouseUp = useCallback(() => {
    setPopupDragActive(false);
  }, []);

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

  const applyPopupFontFamily = useCallback((font) => {
    setPopupFontFamily(font);
    if (currentEditingElement) currentEditingElement.style.fontFamily = font;
    triggerUpdate();
  }, [currentEditingElement, triggerUpdate]);

  const applyPopupFontSize = useCallback((size) => {
    setPopupFontSize(size);
    if (currentEditingElement) currentEditingElement.style.fontSize = size + 'px';
    triggerUpdate();
  }, [currentEditingElement, triggerUpdate]);

  const togglePopupStyle = useCallback((type) => {
    if (!currentEditingElement) return;
    switch (type) {
      case 'bold': {
        const isBold = currentEditingElement.style.fontWeight === 'bold' || parseInt(currentEditingElement.style.fontWeight) >= 600;
        currentEditingElement.style.fontWeight = isBold ? 'normal' : 'bold';
        setPopupBold(!isBold);
        break;
      }
      case 'italic': {
        const isItalic = currentEditingElement.style.fontStyle === 'italic';
        currentEditingElement.style.fontStyle = isItalic ? 'normal' : 'italic';
        setPopupItalic(!isItalic);
        break;
      }
      case 'underline': {
        const hasUnderline = currentEditingElement.style.textDecoration?.includes('underline');
        currentEditingElement.style.textDecoration = hasUnderline ? 'none' : 'underline';
        setPopupUnderline(!hasUnderline);
        break;
      }
    }
    triggerUpdate();
  }, [currentEditingElement, triggerUpdate]);

  const resetPopupField = useCallback(() => {
    if (!currentEditingElement) return;
    currentEditingElement.innerText = currentEditingElement.dataset.originalText || '';
    currentEditingElement.style.color = currentEditingElement.dataset.originalColor || '#000000';
    currentEditingElement.style.fontFamily = currentEditingElement.dataset.originalFontFamily || 'Inter';
    currentEditingElement.style.fontSize = currentEditingElement.dataset.originalFontSize || '14px';
    currentEditingElement.style.fontWeight = currentEditingElement.dataset.originalFontWeight || 'normal';
    currentEditingElement.style.fontStyle = currentEditingElement.dataset.originalFontStyle || 'normal';
    currentEditingElement.style.textDecoration = currentEditingElement.dataset.originalTextDecoration || 'none';
    buildTextList();
    triggerUpdate();
  }, [currentEditingElement, buildTextList, triggerUpdate]);

  return {
    textFields,
    showTextPopup,
    textPopupPosition,
    popupRef,
    currentEditingElement,
    popupFontFamily,
    popupFontSize,
    popupBold,
    popupItalic,
    popupUnderline,
    buildTextList,
    handleTextChange,
    handleColorChange,
    resetTextField,
    showTextPopupHandler,
    hideTextPopup,
    handlePopupMouseDown,
    handlePopupMouseMove,
    handlePopupMouseUp,
    applyPopupFontFamily,
    applyPopupFontSize,
    togglePopupStyle,
    resetPopupField,
  };
}

export default useTextEditor;