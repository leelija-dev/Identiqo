//app/customize/hooks/useBarcodeQR.js

'use client';

import { useState, useCallback } from 'react';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

export function useBarcodeQR() {
  const [barcodeValue, setBarcodeValue] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBarcodeOnCanvas = useCallback(async (canvas, value) => {
    if (!canvas || !value) return false;

    try {
      setIsGenerating(true);

      JsBarcode(canvas, value, {
        format: 'CODE128',
        displayValue: true,
        fontSize: 14,
        margin: 5,
        width: 2,
        height: 60,
      });

      return true;
    } catch (error) {
      console.error('Barcode generation failed:', error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateQRCodeOnCanvas = useCallback(async (canvas, value) => {
    if (!canvas || !value) return false;

    try {
      setIsGenerating(true);

      await QRCode.toCanvas(canvas, value, {
        width: 200,
        margin: 1,
      });

      return true;
    } catch (error) {
      console.error('QR generation failed:', error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearBarcode = useCallback(() => {
    setBarcodeValue('');
  }, []);

  const clearQR = useCallback(() => {
    setQrValue('');
  }, []);

  return {
    barcodeValue,
    qrValue,
    isGenerating,

    setBarcodeValue,
    setQrValue,

    generateBarcodeOnCanvas,
    generateQRCodeOnCanvas,

    clearBarcode,
    clearQR,
  };
}