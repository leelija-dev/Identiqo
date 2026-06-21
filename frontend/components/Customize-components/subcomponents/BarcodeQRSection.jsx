// components/Customize-components/subcomponents/BarcodeQRSection.jsx
'use client';

import { useState } from 'react';
import { useEditor } from '@/app/customize/context/EditorContext';

export default function BarcodeQRSection() {
  const {
    barcodeValue,
    qrValue,
    setBarcodeValue,
    setQrValue,
    generateBarcodeOnCanvas,
    generateQRCodeOnCanvas,
    isGenerating,
    showToastMessage,
    editor,
  } = useEditor();

  const [selectedSide, setSelectedSide] = useState('front');

  const handleApplyBarcode = async () => {
    const card = editor.getCurrentCardElement();
    if (!card) {
      showToastMessage?.('Card not found', 'error');
      return;
    }

    if (!barcodeValue) {
      showToastMessage?.('Please enter text for barcode', 'warning');
      return;
    }

    const sideSelector = selectedSide === 'front' 
      ? '.card-front, .face.front' 
      : '.card-back, .face.back';
    
    const sideElements = card.querySelectorAll(sideSelector);
    if (!sideElements?.length) {
      showToastMessage?.(`No ${selectedSide} side found`, 'error');
      return;
    }

    let foundBarcode = false;
    for (const sideElement of sideElements) {
      const barcodeElements = sideElement.querySelectorAll('.barcode, .barcode-section');
      if (barcodeElements?.length) {
        foundBarcode = true;
        for (const container of barcodeElements) {
          if (!container.dataset.originalHtml) {
            container.dataset.originalHtml = container.innerHTML;
          }
          container.innerHTML = '';
          const canvas = document.createElement('canvas');
          canvas.style.cssText = 'width:100%; height:auto; display:block;';
          container.appendChild(canvas);
          await generateBarcodeOnCanvas(canvas, barcodeValue);
        }
      }
    }

    if (!foundBarcode) {
      showToastMessage?.(`No barcode placeholder on ${selectedSide} side`, 'warning');
      return;
    }

    showToastMessage?.(`Barcode generated on ${selectedSide} side`, 'success');
    editor.triggerUpdate?.();
  };

  const handleApplyQR = async () => {
    const card = editor.getCurrentCardElement();
    if (!card) {
      showToastMessage?.('Card not found', 'error');
      return;
    }

    if (!qrValue) {
      showToastMessage?.('Please enter text or URL for QR code', 'warning');
      return;
    }

    const sideSelector = selectedSide === 'front' 
      ? '.card-front, .face.front' 
      : '.card-back, .face.back';
    
    const sideElements = card.querySelectorAll(sideSelector);
    if (!sideElements?.length) {
      showToastMessage?.(`No ${selectedSide} side found`, 'error');
      return;
    }

    let foundQR = false;
    for (const sideElement of sideElements) {
      const qrElements = sideElement.querySelectorAll('.qr-placeholder');
      if (qrElements?.length) {
        foundQR = true;
        for (const placeholder of qrElements) {
          if (!placeholder.dataset.originalHtml) {
            placeholder.dataset.originalHtml = placeholder.innerHTML;
          }
          placeholder.innerHTML = '';
          const canvas = document.createElement('canvas');
          canvas.style.cssText = 'width:100%; height:100%;';
          placeholder.appendChild(canvas);
          await generateQRCodeOnCanvas(canvas, qrValue);
        }
      }
    }

    if (!foundQR) {
      showToastMessage?.(`No QR placeholder on ${selectedSide} side`, 'warning');
      return;
    }

    showToastMessage?.(`QR code generated on ${selectedSide} side`, 'success');
    editor.triggerUpdate?.();
  };

  const handleClearBarcode = () => {
    const card = editor.getCurrentCardElement();
    if (!card) {
      showToastMessage?.('Card not found', 'error');
      return;
    }

    const sideSelector = selectedSide === 'front' 
      ? '.card-front, .face.front' 
      : '.card-back, .face.back';
    
    const sideElements = card.querySelectorAll(sideSelector);
    if (!sideElements?.length) return;

    let cleared = false;
    for (const sideElement of sideElements) {
      const barcodeElements = sideElement.querySelectorAll('.barcode, .barcode-section');
      if (barcodeElements?.length) {
        cleared = true;
        barcodeElements.forEach(container => {
          if (container.dataset.originalHtml) {
            container.innerHTML = container.dataset.originalHtml;
          } else {
            container.innerHTML = '';
          }
        });
      }
    }

    if (cleared) {
      showToastMessage?.(`Barcode cleared from ${selectedSide} side`, 'info');
      editor.triggerUpdate?.();
    }
  };

  const handleClearQR = () => {
    const card = editor.getCurrentCardElement();
    if (!card) {
      showToastMessage?.('Card not found', 'error');
      return;
    }

    const sideSelector = selectedSide === 'front' 
      ? '.card-front, .face.front' 
      : '.card-back, .face.back';
    
    const sideElements = card.querySelectorAll(sideSelector);
    if (!sideElements?.length) return;

    let cleared = false;
    for (const sideElement of sideElements) {
      const qrElements = sideElement.querySelectorAll('.qr-placeholder');
      if (qrElements?.length) {
        cleared = true;
        qrElements.forEach(placeholder => {
          if (placeholder.dataset.originalHtml) {
            placeholder.innerHTML = placeholder.dataset.originalHtml;
          } else {
            placeholder.innerHTML = '';
          }
        });
      }
    }

    if (cleared) {
      showToastMessage?.(`QR code cleared from ${selectedSide} side`, 'info');
      editor.triggerUpdate?.();
    }
  };

  return (
    <div className="space-y-3">
      {/* Side selector */}
      <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
        <button
          onClick={() => setSelectedSide('front')}
          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedSide === 'front'
              ? 'bg-white shadow-sm text-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Front Side
        </button>
        <button
          onClick={() => setSelectedSide('back')}
          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedSide === 'back'
              ? 'bg-white shadow-sm text-indigo-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Back Side
        </button>
      </div>

      {/* Barcode */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
          <span>📊</span> Barcode
          <span className="text-[10px] text-slate-400 font-normal ml-1">(CODE128)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={barcodeValue}
            onChange={(e) => setBarcodeValue(e.target.value)}
            placeholder="Enter barcode text"
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleApplyBarcode}
            disabled={!barcodeValue || isGenerating}
            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isGenerating ? '⏳' : 'Generate'}
          </button>
          <button
            onClick={handleClearBarcode}
            className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* QR Code */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-600 flex items-center gap-1">
          <span>📱</span> QR Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            placeholder="Enter URL or text for QR"
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleApplyQR}
            disabled={!qrValue || isGenerating}
            className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isGenerating ? '⏳' : 'Generate'}
          </button>
          <button
            onClick={handleClearQR}
            className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Info note */}
      <div className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
        💡 Select a side first, then generate or clear.
      </div>
    </div>
  );
}