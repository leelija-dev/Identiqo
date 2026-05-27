'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const FIELD_LABELS = {
  employee_name: "👤 Employee Name",
  company_name: "🏢 Company Name",
  designation: "💼 Designation",
  phone: "📞 Phone",
  email: "📧 Email",
  website: "🌐 Website",
  address: "📍 Address",
  employee_id: "🆔 Employee ID",
  tagline: "💬 Tagline",
  department: "🏢 Department",
  job_title: "💼 Job Title",
  expiry: "📅 Expiry",
  access: "🔑 Access Level",
  clearance: "🛡️ Clearance",
  joined: "📅 Join Date",
  signature: "✍️ Signature",
  name: "👤 Name",
  id_number: "🆔 ID Number",
};

const TEXT_CLASSES = Object.keys(FIELD_LABELS);

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

export default function CustomizePage() {
  const previewCanvasRef = useRef(null);
  const cardStageRef = useRef(null);
  const sidebarRef = useRef(null);

  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentOrientation, setCurrentOrientation] = useState('landscape');
  const [originalHTML, setOriginalHTML] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showTextPopup, setShowTextPopup] = useState(false);
  const [textPopupPosition, setTextPopupPosition] = useState({ x: 0, y: 0 });
  const [currentEditingElement, setCurrentEditingElement] = useState(null);
  const [textFields, setTextFields] = useState([]);
  const [backgroundBlocks, setBackgroundBlocks] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [uploadedProfileImage, setUploadedProfileImage] = useState(null);
  const [uploadedSignatureImage, setUploadedSignatureImage] = useState(null);
  const [uploadedLogoImage, setUploadedLogoImage] = useState(null);
  const [popupFontFamily, setPopupFontFamily] = useState('Inter');
  const [popupFontSize, setPopupFontSize] = useState(14);
  const [popupBold, setPopupBold] = useState(false);
  const [popupItalic, setPopupItalic] = useState(false);
  const [popupUnderline, setPopupUnderline] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [qrValue, setQrValue] = useState('');

  // Feature detection state
  const [hasProfile, setHasProfile] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [hasLogo, setHasLogo] = useState(false);
  const [hasBarcode, setHasBarcode] = useState(false);
  const [hasQR, setHasQR] = useState(false);

  // Color Theme state (for visiting cards)
  const [selectedTheme, setSelectedTheme] = useState('Default');
  const [customPrimary, setCustomPrimary] = useState('#ff7e5f');
  const [customSecondary, setCustomSecondary] = useState('#6a11cb');
  const [customAccent, setCustomAccent] = useState('#2575fc');

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

    const selector = TEXT_CLASSES.map(cls => `.${cls}`).join(', ');
    const textElements = card.querySelectorAll(selector);

    const items = [];
    const seen = new Set();

    textElements.forEach((element, index) => {
      if (seen.has(element)) return;
      seen.add(element);

      const text = element.innerText?.trim() || '';
      if (!text) return;

      const computed = getComputedStyle(element);
      element.dataset.elementIndex = String(index);
      if (!element.dataset.originalText) element.dataset.originalText = text;
      if (!element.dataset.originalColor) element.dataset.originalColor = rgbToHex(computed.color) || '#000000';
      if (!element.dataset.originalFontFamily) element.dataset.originalFontFamily = computed.fontFamily;
      if (!element.dataset.originalFontSize) element.dataset.originalFontSize = computed.fontSize;
      if (!element.dataset.originalFontWeight) element.dataset.originalFontWeight = computed.fontWeight;
      if (!element.dataset.originalFontStyle) element.dataset.originalFontStyle = computed.fontStyle;
      if (!element.dataset.originalTextDecoration) element.dataset.originalTextDecoration = computed.textDecoration || 'none';

      const classList = (element.className || '').toString().split(/\s+/);
      const matchedClass = TEXT_CLASSES.find(cls => classList.includes(cls));
      
      let label;
      if (matchedClass && FIELD_LABELS[matchedClass]) {
        label = FIELD_LABELS[matchedClass];
      } else if (matchedClass) {
        label = toTitleCase(matchedClass);
      } else {
        const shortText = text.length > 26 ? `${text.slice(0, 26)}...` : text;
        label = shortText || `Text ${index + 1}`;
      }

      const isBackField = !!element.closest('.card-back, .face.back, [class*="back"]');
      const fullLabel = isBackField ? `${label} (Back)` : label;
      const color = rgbToHex(computed.color) || '#000000';

      items.push({
        index,
        label: fullLabel,
        text,
        color,
        side: isBackField ? 'Back' : 'Front',
        element,
        originalText: text,
        originalColor: color,
        className: matchedClass || ''
      });
    });

    setTextFields(items);
  }, [getCurrentCardElement]);

  const buildBackgroundBlocks = useCallback(() => {
    const card = getCurrentCardElement();
    if (!card) return;

    const bgElements = card.querySelectorAll('.editable-bg');
    const blocks = [];

    bgElements.forEach((element, index) => {
      const computed = getComputedStyle(element);
      const currentColor = rgbToHex(computed.backgroundColor) || '#ffffff';
      const currentBgImage = computed.backgroundImage || 'none';
      const startsAsGradient = currentBgImage.includes('gradient(');
      const startsAsImage = currentBgImage !== 'none' && !startsAsGradient;
      
      const isBack = !!element.closest('.card-back, .face.back, [class*="back"]');
      const label = isBack ? `Background ${index + 1} (Back)` : `Background ${index + 1} (Front)`;

      blocks.push({
        index,
        element,
        label,
        currentColor,
        currentBgImage,
        mode: startsAsGradient ? 'gradient' : (startsAsImage ? 'image' : 'solid'),
        gradColor1: '#4f46e5',
        gradColor2: '#6366f1',
        gradDirection: '135deg'
      });
    });

    setBackgroundBlocks(blocks);
  }, [getCurrentCardElement]);

  const detectFeatures = useCallback(() => {
    const card = getCurrentCardElement();
    if (!card) return;

    setHasProfile(!!card.querySelector('.profile-image, .profile-img, .profile-photo, [class*="profile"]'));
    setHasSignature(!!card.querySelector('.sign-placeholder, .sign-img, .signature-placeholder, [class*="sign"]'));
    setHasLogo(!!card.querySelector('.logo'));
    setHasBarcode(!!card.querySelector('.barcode, .barcode-section'));
    setHasQR(!!card.querySelector('.qr-placeholder'));
  }, [getCurrentCardElement]);

  const buildSidebar = useCallback(() => {
    buildTextList();
    if (currentTemplate?.category === 'employee') {
      buildBackgroundBlocks();
    }
    detectFeatures();
  }, [buildTextList, buildBackgroundBlocks, detectFeatures, currentTemplate]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedTemplateForCustomize');
    if (saved) {
      try {
        const template = JSON.parse(saved);
        setCurrentTemplate(template);
        setCurrentOrientation(template.orientation || 'landscape');

        setTimeout(() => {
          if (previewCanvasRef.current && template.fullHTML) {
            previewCanvasRef.current.innerHTML = template.fullHTML;
            setOriginalHTML(template.fullHTML);

            // Apply theme colors for visiting cards
            if (template.category === 'visiting' && template.themeColors) {
              const tc = template.themeColors;
              previewCanvasRef.current.style.setProperty('--primary', tc.primary);
              previewCanvasRef.current.style.setProperty('--secondary', tc.secondary);
              previewCanvasRef.current.style.setProperty('--accent', tc.accent);
              setCustomPrimary(tc.primary);
              setCustomSecondary(tc.secondary);
              setCustomAccent(tc.accent);
              setSelectedTheme('Default');
            }

            const card = getCurrentCardElement();
            if (card) {
              const front = getFrontFace();
              const back = getBackFace();
              const flipInner = card.querySelector('.flip-card-inner');

              if (flipInner) {
                flipInner.style.transform = 'rotateY(0deg)';
                flipInner.dataset.flipped = 'false';
              }
              if (front) front.style.display = 'block';
              if (back) back.style.display = 'block';
            }

            buildSidebar();
          }
        }, 200);
      } catch (e) {
        showToastMessage('Error loading template');
      }
    } else {
      showToastMessage('No template selected. Go back and choose one.');
    }
  }, []);

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));
  }, []);

  const handleResizeStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e) => {
      const deltaX = startX - e.clientX;
      const newWidth = Math.min(750, Math.max(360, startWidth + deltaX));
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

    if (!front || !back) {
      showToastMessage('Card sides not found');
      return;
    }

    const flipInner = card?.querySelector('.flip-card-inner');

    if (flipInner) {
      const isFlipped = flipInner.dataset.flipped === 'true';
      flipInner.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
      flipInner.dataset.flipped = isFlipped ? 'false' : 'true';
      front.style.display = 'block';
      back.style.display = 'block';
      showToastMessage(isFlipped ? 'Showing front side' : 'Showing back side');
    } else {
      const isFrontVisible = front.style.display !== 'none';
      front.style.display = isFrontVisible ? 'none' : 'block';
      back.style.display = isFrontVisible ? 'block' : 'none';
      showToastMessage(isFrontVisible ? 'Showing back side' : 'Showing front side');
    }
  };

  const handleTextChange = (index, newText) => {
    const field = textFields.find(f => f.index === index);
    if (field?.element) {
      field.element.innerText = newText;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, text: newText } : f));
    }
  };

  const handleColorChange = (index, newColor) => {
    const field = textFields.find(f => f.index === index);
    if (field?.element) {
      field.element.style.color = newColor;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, color: newColor } : f));
    }
  };

  const resetTextField = (index) => {
    const field = textFields.find(f => f.index === index);
    if (field?.element) {
      field.element.innerText = field.originalText;
      field.element.style.color = field.originalColor;
      setTextFields(prev => prev.map(f => f.index === index ? { ...f, text: field.originalText, color: field.originalColor } : f));
      showToastMessage('Field reset to original');
    }
  };

  const setBackgroundMode = (blockIndex, mode) => {
    setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, mode } : b));
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    if (!block) return;
    if (mode === 'solid') {
      block.element.style.backgroundImage = 'none';
      block.element.style.background = block.currentColor;
    }
  };

  const setSolidColor = (blockIndex, color) => {
    setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, currentColor: color } : b));
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    if (block) {
      block.element.style.backgroundImage = 'none';
      block.element.style.background = color;
    }
  };

  const setGradient = (blockIndex, color1, color2, direction) => {
    setBackgroundBlocks(prev => prev.map(b => b.index === blockIndex ? { ...b, gradColor1: color1, gradColor2: color2, gradDirection: direction } : b));
    const block = backgroundBlocks.find(b => b.index === blockIndex);
    if (block) {
      const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
      block.element.style.background = gradient;
      block.element.style.backgroundImage = gradient;
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
        const img = ev.target?.result;
        if (!img) return;
        const block = backgroundBlocks.find(b => b.index === blockIndex);
        if (block) {
          block.element.style.backgroundImage = `url(${img})`;
          block.element.style.backgroundSize = 'cover';
          block.element.style.backgroundPosition = 'center';
          block.element.style.backgroundRepeat = 'no-repeat';
          setBackgroundMode(blockIndex, 'image');
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Apply theme to visiting card
  const applyTheme = (themeName, primary, secondary, accent) => {
    setSelectedTheme(themeName);
    if (previewCanvasRef.current) {
      previewCanvasRef.current.style.setProperty('--primary', primary);
      previewCanvasRef.current.style.setProperty('--secondary', secondary);
      previewCanvasRef.current.style.setProperty('--accent', accent);
    }
  };

  const showTextPopupHandler = (field, event) => {
    if (event) event.stopPropagation();
    setCurrentEditingElement(field.element);
    const computed = getComputedStyle(field.element);
    setPopupFontFamily(computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim());
    setPopupFontSize(parseInt(computed.fontSize, 10) || 14);
    setPopupBold(computed.fontWeight >= 600 || computed.fontWeight === 'bold');
    setPopupItalic(computed.fontStyle === 'italic');
    setPopupUnderline(computed.textDecoration?.includes('underline') || false);

    if (event) {
      setTextPopupPosition({ x: event.clientX, y: event.clientY });
    } else {
      const rect = field.element.getBoundingClientRect();
      setTextPopupPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    }
    setShowTextPopup(true);
  };

  const hideTextPopup = () => {
    setShowTextPopup(false);
    setCurrentEditingElement(null);
  };

  const applyPopupFontFamily = (font) => {
    setPopupFontFamily(font);
    if (currentEditingElement) currentEditingElement.style.fontFamily = font;
  };

  const applyPopupFontSize = (size) => {
    setPopupFontSize(size);
    if (currentEditingElement) currentEditingElement.style.fontSize = size + 'px';
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

        if (type === 'profile') {
          setUploadedProfileImage(imageData);
          const containers = previewCanvasRef.current?.querySelectorAll('.profile-image, .profile-img, .profile-photo, [class*="profile"]');
          containers?.forEach(el => {
            if (el.tagName === 'IMG') el.src = imageData;
            else { el.innerHTML = ''; el.style.backgroundImage = `url(${imageData})`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
          });
        } else if (type === 'signature') {
          setUploadedSignatureImage(imageData);
          const containers = previewCanvasRef.current?.querySelectorAll('.sign-placeholder, .sign-img, .signature-placeholder, [class*="sign"]');
          containers?.forEach(el => {
            el.innerHTML = ''; el.style.backgroundImage = `url(${imageData})`; el.style.backgroundSize = 'contain'; el.style.backgroundRepeat = 'no-repeat'; el.style.backgroundPosition = 'center';
          });
        } else if (type === 'logo') {
          setUploadedLogoImage(imageData);
          const containers = previewCanvasRef.current?.querySelectorAll('.logo img, .logo-image img, [class*="logo"] img');
          containers?.forEach(img => { img.src = imageData; });
        }
        showToastMessage(`${type} uploaded ✓`);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const removeImage = (type) => {
    if (type === 'profile') setUploadedProfileImage(null);
    else if (type === 'signature') setUploadedSignatureImage(null);
    else if (type === 'logo') setUploadedLogoImage(null);
    showToastMessage(`${type} removed`);
  };

  const applyBarcode = () => {
    if (!barcodeValue) {
      showToastMessage('Please enter text or number for barcode');
      return;
    }
    const card = getCurrentCardElement();
    if (!card) return;
    const barcodeElements = card.querySelectorAll('.barcode, .barcode-section');
    if (!barcodeElements.length) {
      showToastMessage('No barcode placeholder found on this template');
      return;
    }
    import('jsbarcode').then((JsBarcode) => {
      barcodeElements.forEach((container) => {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
        container.appendChild(canvas);
        JsBarcode.default(canvas, barcodeValue, {
          format: 'CODE128',
          lineColor: '#000000',
          width: 2,
          height: 40,
          displayValue: false,
          margin: 5,
          background: '#ffffff',
        });
      });
      showToastMessage('Barcode generated successfully');
    }).catch(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 60;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      for (let i = 0; i < barcodeValue.length; i++) {
        const barWidth = (barcodeValue.charCodeAt(i) % 10) + 2;
        ctx.fillRect(i * 12, 10, barWidth, 40);
      }
      const dataUrl = canvas.toDataURL();
      barcodeElements.forEach(container => {
        container.innerHTML = `<img src="${dataUrl}" style="width:100%;height:auto;" />`;
      });
      showToastMessage('Barcode applied (simple)');
    });
  };

  const applyQRCode = () => {
    if (!qrValue) {
      showToastMessage('Please enter text or URL for QR code');
      return;
    }
    const card = getCurrentCardElement();
    const qrElements = card?.querySelectorAll('.qr-placeholder');
    if (!qrElements?.length) {
      showToastMessage('No QR placeholder found');
      return;
    }
    import('qrcode').then((QRCode) => {
      qrElements.forEach((placeholder) => {
        placeholder.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        placeholder.appendChild(canvas);
        QRCode.toCanvas(canvas, qrValue, {
          width: 150,
          margin: 1,
          color: { dark: '#000000', light: '#ffffff' },
        });
      });
      showToastMessage('QR code applied');
    }).catch(() => {
      const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrValue)}&size=150`;
      qrElements.forEach(placeholder => {
        placeholder.innerHTML = `<img src="${qrUrl}" style="width:100%;height:100%;object-fit:contain;" />`;
      });
      showToastMessage('QR code applied (online fallback)');
    });
  };

  const downloadCard = async () => {
    const card = getCurrentCardElement();
    if (!card) { showToastMessage('No card to download'); return; }
    try {
      const html2canvas = (await import('html2canvas')).default;
      const flipInner = card.querySelector('.flip-card-inner');
      if (flipInner) flipInner.style.transform = 'none';
      const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      if (flipInner) {
        flipInner.style.transform = flipInner.dataset.flipped === 'true' ? 'rotateY(180deg)' : 'rotateY(0deg)';
      }
      const link = document.createElement('a');
      link.download = `card-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      const downloads = JSON.parse(localStorage.getItem('cardstudio_downloads') || '[]');
      downloads.unshift({
        id: Date.now(),
        name: currentTemplate?.name + " (Downloaded)" || 'Custom Card',
        orientation: currentOrientation,
        fullHTML: previewCanvasRef.current?.innerHTML,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('cardstudio_downloads', JSON.stringify(downloads));
      showToastMessage('✅ Card downloaded & saved!');
    } catch (e) {
      showToastMessage('Download failed');
    }
  };

  const saveToDrafts = () => {
    if (!previewCanvasRef.current) { showToastMessage('No template to save'); return; }
    const drafts = JSON.parse(localStorage.getItem('cardstudio_drafts') || '[]');
    drafts.push({
      id: Date.now(),
      name: `${currentTemplate?.name} (Custom)`,
      orientation: currentOrientation,
      fullHTML: previewCanvasRef.current.innerHTML,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('cardstudio_drafts', JSON.stringify(drafts));
    showToastMessage('✅ Saved to Drafts!');
  };

  const resetAll = () => {
    if (originalHTML && previewCanvasRef.current) {
      previewCanvasRef.current.innerHTML = originalHTML;
      setUploadedProfileImage(null);
      setUploadedSignatureImage(null);
      setUploadedLogoImage(null);
      // Re-apply theme for visiting cards
      if (currentTemplate?.category === 'visiting' && currentTemplate?.themeColors) {
        const tc = currentTemplate.themeColors;
        previewCanvasRef.current.style.setProperty('--primary', tc.primary);
        previewCanvasRef.current.style.setProperty('--secondary', tc.secondary);
        previewCanvasRef.current.style.setProperty('--accent', tc.accent);
        setSelectedTheme('Default');
      }
      setTimeout(() => buildSidebar(), 200);
      showToastMessage('Reset to original template');
    }
  };

  const showImageSection = hasProfile || hasSignature || hasLogo || hasBarcode || hasQR;

  return (
    <div className="h-screen flex flex-col bg-[#f5f7fb] font-['Inter'] overflow-hidden">

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-y-auto p-10 relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
            <button onClick={flipCard} className="bg-white border-none px-4 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:bg-indigo-600 hover:text-white transition-all text-sm text-indigo-600">
              🔄 Flip Card
            </button>
            <button onClick={downloadCard} className="bg-green-500 text-white border-none px-4 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:bg-green-600 transition-all text-sm">
              ⬇️ Download PNG
            </button>
          </div>

          <div ref={cardStageRef} className={`w-full relative rounded-[20px] bg-transparent flex justify-center ${currentOrientation === 'landscape' ? 'max-w-[550px] aspect-[1.58/1]' : 'max-w-[350px] aspect-[0.58/1]'}`}>
            <div ref={previewCanvasRef} className="w-full h-full relative rounded-[20px] overflow-hidden" />
          </div>
        </div>

        <div ref={sidebarRef} className="bg-white border-l border-slate-200 flex flex-col shadow-lg m-6 ml-0 rounded-[20px] overflow-hidden relative" style={{ width: `${sidebarWidth}px`, minWidth: '360px', maxWidth: '750px' }}>
          <div className="absolute left-0 top-0 w-2 h-full cursor-ew-resize bg-transparent hover:bg-indigo-500/50 transition-colors z-[100]" onMouseDown={handleResizeStart} />

          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2.5">
              Customize Card
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full uppercase">{currentOrientation}</span>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-full uppercase">{currentTemplate?.category || ''}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">{currentTemplate?.name || 'Select a template'}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
            
            {/* TEXT FIELDS */}
            <div className="mb-3.5 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
              {textFields.length === 0 ? (
                <p className="text-center py-5 text-slate-400 text-xs">No editable text found</p>
              ) : (
                <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto">
                  {textFields.map((field) => (
                    <div key={field.index} className="bg-slate-50 rounded-[10px] p-2.5 border border-slate-100">
                      <input
                        type="text"
                        value={field.text}
                        onChange={(e) => handleTextChange(field.index, e.target.value)}
                        onClick={(e) => showTextPopupHandler(field, e)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] cursor-pointer"
                        placeholder="Click to edit..."
                      />
                      <div className="flex gap-2 mt-2 items-center">
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="color"
                            value={field.color}
                            onChange={(e) => handleColorChange(field.index, e.target.value)}
                            className="w-8 h-7 border-none rounded-md cursor-pointer p-0"
                          />
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{field.label}</span>
                        </div>
                        <button onClick={() => resetTextField(field.index)} className="bg-slate-100 text-slate-500 border-none px-3 py-1.5 rounded-md text-[11px] cursor-pointer hover:bg-slate-200 transition-all">
                          ↺
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BACKGROUND COLORS - Employee cards only */}
            {currentTemplate?.category === 'employee' && (
              <div className="mb-3.5 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                {backgroundBlocks.length === 0 ? (
                  <p className="text-center py-5 text-slate-400 text-xs">No editable backgrounds found</p>
                ) : (
                  backgroundBlocks.map((block) => (
                    <div key={block.index} className="mb-3">
                      <span className="text-[10px] text-slate-400 mb-1 block">{block.label}</span>
                      <div className="flex bg-slate-100 p-1 rounded-[10px] gap-0.5 mb-2">
                        {['solid', 'gradient', 'image'].map(mode => (
                          <button
                            key={mode}
                            onClick={() => setBackgroundMode(block.index, mode)}
                            className={`flex-1 border-none bg-transparent px-2 py-1.5 text-[11px] rounded-lg cursor-pointer transition-all font-semibold ${block.mode === mode ? 'bg-white text-indigo-600 font-bold shadow-sm' : 'text-slate-500'}`}
                          >
                            {mode === 'solid' ? 'Solid' : mode === 'gradient' ? 'Gradient' : 'Image'}
                          </button>
                        ))}
                      </div>

                      {block.mode === 'solid' && (
                        <div className="flex gap-2 items-center">
                          <input type="color" value={block.currentColor} onChange={(e) => setSolidColor(block.index, e.target.value)} className="w-10 h-8 border-none rounded cursor-pointer" />
                          <input type="text" value={block.currentColor} onChange={(e) => setSolidColor(block.index, e.target.value)} placeholder="#ffffff" className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs" />
                        </div>
                      )}

                      {block.mode === 'gradient' && (
                        <div className="flex gap-2 items-center">
                          <input type="color" value={block.gradColor1} onChange={(e) => setGradient(block.index, e.target.value, block.gradColor2, block.gradDirection)} className="w-10 h-8 border-none rounded cursor-pointer" />
                          <input type="color" value={block.gradColor2} onChange={(e) => setGradient(block.index, block.gradColor1, e.target.value, block.gradDirection)} className="w-10 h-8 border-none rounded cursor-pointer" />
                          <select value={block.gradDirection} onChange={(e) => setGradient(block.index, block.gradColor1, block.gradColor2, e.target.value)} className="flex-1 px-1.5 py-1.5 border border-slate-200 rounded text-xs">
                            <option value="to right">Left → Right</option>
                            <option value="to left">Right → Left</option>
                            <option value="to bottom">Top → Bottom</option>
                            <option value="to top">Bottom → Top</option>
                            <option value="135deg">Diagonal</option>
                          </select>
                        </div>
                      )}

                      {block.mode === 'image' && (
                        <div className="flex gap-2">
                          <button onClick={() => uploadBackgroundImage(block.index)} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100">Upload Image</button>
                          <button onClick={() => setBackgroundMode(block.index, 'solid')} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-2 py-2 rounded-lg text-xs font-semibold hover:bg-slate-100">Remove</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* COLOR THEME - Visiting cards only */}
            {currentTemplate?.category === 'visiting' && (
              <div className="mb-3.5 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">🎨 Color Theme</div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { name: 'Default', primary: currentTemplate?.themeColors?.primary || '#ff7e5f', secondary: currentTemplate?.themeColors?.secondary || '#6a11cb', accent: currentTemplate?.themeColors?.accent || '#2575fc' },
                    { name: 'Sunset', primary: '#ff6b35', secondary: '#f7931e', accent: '#ff2d55' },
                    { name: 'Ocean', primary: '#0077b6', secondary: '#00b4d8', accent: '#90e0ef' },
                    { name: 'Forest', primary: '#2d6a4f', secondary: '#52b788', accent: '#95d5b2' },
                    { name: 'Midnight', primary: '#6c63ff', secondary: '#3f37c9', accent: '#4895ef' },
                    { name: 'Rose Gold', primary: '#e8a87c', secondary: '#d45d79', accent: '#f0c0a0' },
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => applyTheme(theme.name, theme.primary, theme.secondary, theme.accent)}
                      className={`p-2 rounded-xl border-2 transition-all ${selectedTheme === theme.name ? 'border-indigo-500 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex gap-1 mb-1 justify-center">
                        <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ background: theme.secondary }}></div>
                      </div>
                      <span className="text-[9px] font-semibold text-slate-600">{theme.name}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] text-slate-400 mb-2 block">Custom Colors</span>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[9px] text-slate-400 block mb-1">Primary</label>
                      <input
                        type="color"
                        value={customPrimary}
                        onChange={(e) => {
                          setCustomPrimary(e.target.value);
                          setSelectedTheme('Custom');
                          if (previewCanvasRef.current) {
                            previewCanvasRef.current.style.setProperty('--primary', e.target.value);
                          }
                        }}
                        className="w-full h-8 border border-slate-200 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] text-slate-400 block mb-1">Secondary</label>
                      <input
                        type="color"
                        value={customSecondary}
                        onChange={(e) => {
                          setCustomSecondary(e.target.value);
                          setSelectedTheme('Custom');
                          if (previewCanvasRef.current) {
                            previewCanvasRef.current.style.setProperty('--secondary', e.target.value);
                          }
                        }}
                        className="w-full h-8 border border-slate-200 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] text-slate-400 block mb-1">Accent</label>
                      <input
                        type="color"
                        value={customAccent}
                        onChange={(e) => {
                          setCustomAccent(e.target.value);
                          setSelectedTheme('Custom');
                          if (previewCanvasRef.current) {
                            previewCanvasRef.current.style.setProperty('--accent', e.target.value);
                          }
                        }}
                        className="w-full h-8 border border-slate-200 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IMAGES & DIGITAL ID - Conditional rendering */}
            {showImageSection && (
              <div className="mb-3.5 p-3.5 border border-slate-100 rounded-2xl bg-white shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  {hasProfile && (
                    <div>
                      <div onClick={() => uploadImage('profile')} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3.5 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        <div className="min-h-[80px] flex items-center justify-center text-xs text-slate-400">
                          {uploadedProfileImage ? <img src={uploadedProfileImage} className="w-full h-full object-cover rounded-lg" alt="Profile" /> : '📷 Profile'}
                        </div>
                      </div>
                      {uploadedProfileImage && <button onClick={() => removeImage('profile')} className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center">✕ Remove</button>}
                    </div>
                  )}

                  {hasSignature && (
                    <div>
                      <div onClick={() => uploadImage('signature')} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3.5 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        <div className="min-h-[80px] flex items-center justify-center text-xs text-slate-400">
                          {uploadedSignatureImage ? <img src={uploadedSignatureImage} className="w-full h-full object-contain rounded-lg" alt="Signature" /> : '✍️ Signature'}
                        </div>
                      </div>
                      {uploadedSignatureImage && <button onClick={() => removeImage('signature')} className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center">✕ Remove</button>}
                    </div>
                  )}

                  {hasLogo && (
                    <div>
                      <div onClick={() => uploadImage('logo')} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3.5 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                        <div className="min-h-[80px] flex items-center justify-center text-xs text-slate-400">
                          {uploadedLogoImage ? <img src={uploadedLogoImage} className="w-full h-full object-contain rounded-lg" alt="Logo" /> : '🏢 Logo'}
                        </div>
                      </div>
                      {uploadedLogoImage && <button onClick={() => removeImage('logo')} className="mt-2 text-xs text-red-500 hover:text-red-700 w-full text-center">✕ Remove</button>}
                    </div>
                  )}

                  {hasBarcode && (
                    <div>
                      <input type="text" value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} placeholder="Barcode text..." className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs mb-1" />
                      <button onClick={applyBarcode} className="w-full px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-semibold hover:bg-indigo-600">Generate Barcode</button>
                    </div>
                  )}

                  {hasQR && (
                    <div>
                      <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} placeholder="QR URL or text..." className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs mb-1" />
                      <button onClick={applyQRCode} className="w-full px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-semibold hover:bg-indigo-600">Generate QR</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-3.5 border-t border-slate-100 flex gap-2.5">
            <button onClick={saveToDrafts} className="flex-[2] bg-gradient-to-br from-indigo-600 to-indigo-500 text-white px-3.5 py-3 rounded-[10px] font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">Save to Drafts</button>
            <button onClick={resetAll} className="flex-1 bg-slate-50 text-slate-600 border border-slate-100 px-3.5 py-3 rounded-[10px] font-semibold hover:bg-slate-100 transition-all">Reset</button>
          </div>
        </div>
      </div>

      {/* Text Style Popup */}
      {showTextPopup && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={hideTextPopup} />
          <div
            className="fixed z-[9999] bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl min-w-[260px]"
            style={{
              left: `${Math.min(textPopupPosition.x, typeof window !== 'undefined' ? window.innerWidth - 280 : 0)}px`,
              top: `${Math.max(textPopupPosition.y - 10, 10)}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="flex gap-2 items-center mb-3">
              <select value={popupFontFamily} onChange={(e) => applyPopupFontFamily(e.target.value)} className="flex-[2] px-2 py-2 border border-slate-200 rounded-lg text-[11px] bg-white cursor-pointer">
                <option value="Inter">Inter</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Poppins">Poppins</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Space Grotesk">Space Grotesk</option>
              </select>
              <input type="number" value={popupFontSize} onChange={(e) => applyPopupFontSize(parseInt(e.target.value))} className="w-[60px] px-2 py-2 border border-slate-200 rounded-lg text-[11px] text-center" min="8" max="72" />
              <span className="text-[11px] text-slate-400">px</span>
            </div>

            <div className="flex gap-2 mb-3">
              <button onClick={() => togglePopupStyle('bold')} className={`w-9 h-9 border rounded-lg font-bold text-sm transition-all ${popupBold ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300'}`}><b>B</b></button>
              <button onClick={() => togglePopupStyle('italic')} className={`w-9 h-9 border rounded-lg italic text-sm transition-all ${popupItalic ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300'}`}><i>I</i></button>
              <button onClick={() => togglePopupStyle('underline')} className={`w-9 h-9 border rounded-lg underline text-sm transition-all ${popupUnderline ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-300'}`}><u>U</u></button>
              {currentEditingElement && (
                <input type="color" value={textFields.find(f => f.element === currentEditingElement)?.color || '#000000'} onChange={(e) => { if (currentEditingElement) currentEditingElement.style.color = e.target.value; }} className="w-9 h-9 border border-slate-200 rounded-lg cursor-pointer p-0.5" />
              )}
            </div>

            <button onClick={resetPopupField} className="w-full bg-slate-100 text-slate-600 px-3 py-2.5 rounded-lg text-[11px] font-semibold hover:bg-slate-200 hover:text-slate-800 transition-all">↺ Reset to Original</button>
          </div>
        </>
      )}

      {/* Toast */}
      <div className={`fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 z-[1100] pointer-events-none ${showToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[100px]'}`}>
        {toastMessage}
      </div>

      <style jsx global>{`
        .flip-card { width: 100%; height: 100%; perspective: 1800px; cursor: pointer; }
        .flip-card-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.23, 1, 0.32, 1); }
        .card-front, .card-back, .face.front, .face.back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 20px; overflow: hidden; display: block !important; }
        .card-back, .face.back { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}