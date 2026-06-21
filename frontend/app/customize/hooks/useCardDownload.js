// app/customize/hooks/useCardDownload.js

'use client';

import { useState, useCallback } from 'react';
import { jsPDF } from 'jspdf';

export function useCardDownload() {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Helper: Capture face as canvas - FIXED: back side is properly oriented
  const captureFaceAsCanvas = useCallback(async (faceEl, orientation, html2canvas, isBack = false) => {
    const design = orientation === 'portrait' 
      ? { width: 350, height: 550 } 
      : { width: 550, height: 348 };
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed; 
      top: -9999px; 
      left: -9999px; 
      width: ${design.width}px; 
      height: ${design.height}px; 
      border-radius: 24px; 
      overflow: hidden; 
      background: #fff;
    `;
    
    const clone = faceEl.cloneNode(true);
    
    // Fix for back side - remove any transform that might flip it
    if (isBack) {
      clone.style.transform = 'none';
      clone.style.transformStyle = 'flat';
      // Also remove transform from children
      const transformedChildren = clone.querySelectorAll('[style*="transform"]');
      transformedChildren.forEach(child => {
        child.style.transform = 'none';
      });
    }
    
    // Replace canvases with images
    const liveCanvases = faceEl.querySelectorAll('canvas');
    const cloneCanvases = clone.querySelectorAll('canvas');
    liveCanvases.forEach((liveCanvas, idx) => {
      const cloneCanvas = cloneCanvases[idx];
      if (cloneCanvas) {
        const img = document.createElement('img');
        try {
          img.src = liveCanvas.toDataURL('image/png');
        } catch {
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        }
        img.style.cssText = liveCanvas.style.cssText || 'width:100%;height:auto;';
        cloneCanvas.replaceWith(img);
      }
    });
    
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    
    // Wait for cloned DOM, styles, and images to settle before capture
    await new Promise(r => setTimeout(r, 200));
    
    let canvas;
    try {
      canvas = await html2canvas(wrapper, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff', 
        allowTaint: false 
      });
    } finally {
      // Always remove the temporary wrapper, even if html2canvas throws
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper);
      }
    }
    
    return canvas;
  }, []);

  // Download as PNG
  const downloadAsPNG = useCallback(async (frontFace, backFace, orientation, showToast) => {
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const frontCanvas = await captureFaceAsCanvas(frontFace, orientation, html2canvas, false);
      const backCanvas = await captureFaceAsCanvas(backFace, orientation, html2canvas, true);
      
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = frontCanvas.width;
      combinedCanvas.height = frontCanvas.height + backCanvas.height;
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to create canvas context');
      }
      ctx.drawImage(frontCanvas, 0, 0);
      ctx.drawImage(backCanvas, 0, frontCanvas.height);
      
      const link = document.createElement('a');
      link.download = `card-both-sides-${Date.now()}.png`;
      link.href = combinedCanvas.toDataURL('image/png', 0.9);
      link.click();
      
      showToast?.('✅ Downloaded as PNG!');
    } catch (error) {
      console.error('PNG download failed:', error);
      showToast?.(`Download failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  }, [captureFaceAsCanvas]);

  // Download as JPG
  const downloadAsJPG = useCallback(async (frontFace, backFace, orientation, showToast) => {
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const frontCanvas = await captureFaceAsCanvas(frontFace, orientation, html2canvas, false);
      const backCanvas = await captureFaceAsCanvas(backFace, orientation, html2canvas, true);
      
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = frontCanvas.width;
      combinedCanvas.height = frontCanvas.height + backCanvas.height;
      const ctx = combinedCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('Unable to create canvas context');
      }
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      ctx.drawImage(frontCanvas, 0, 0);
      ctx.drawImage(backCanvas, 0, frontCanvas.height);
      
      const link = document.createElement('a');
      link.download = `card-both-sides-${Date.now()}.jpg`;
      link.href = combinedCanvas.toDataURL('image/jpeg', 0.9);
      link.click();
      
      showToast?.('✅ Downloaded as JPG!');
    } catch (error) {
      console.error('JPG download failed:', error);
      showToast?.(`Download failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  }, [captureFaceAsCanvas]);

  // Download as PDF
  const downloadAsPDF = useCallback(async (frontFace, backFace, orientation, showToast) => {
    setIsDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      const frontCanvas = await captureFaceAsCanvas(frontFace, orientation, html2canvas, false);
      const backCanvas = await captureFaceAsCanvas(backFace, orientation, html2canvas, true);
      
      const pdf = new jsPDF({
        orientation: orientation === 'portrait' ? 'portrait' : 'landscape',
        unit: 'px',
        format: [frontCanvas.width, frontCanvas.height],
      });
      
      pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, frontCanvas.width, frontCanvas.height);
      pdf.addPage([backCanvas.width, backCanvas.height]);
      pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, backCanvas.width, backCanvas.height);
      pdf.save(`card-${Date.now()}.pdf`);
      
      showToast?.('✅ PDF downloaded!');
    } catch (error) {
      console.error('PDF download failed:', error);
      showToast?.(`Download failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  }, [captureFaceAsCanvas]);

  // Main download handler
  const downloadCardBothSides = useCallback(async (format, frontFace, backFace, orientation, showToast) => {
    if (!frontFace || !backFace) {
      showToast?.('Could not find both sides of the card');
      return;
    }
    
    switch (format) {
      case 'png':
        await downloadAsPNG(frontFace, backFace, orientation, showToast);
        break;
      case 'jpg':
        await downloadAsJPG(frontFace, backFace, orientation, showToast);
        break;
      case 'pdf':
        await downloadAsPDF(frontFace, backFace, orientation, showToast);
        break;
      default:
        await downloadAsPNG(frontFace, backFace, orientation, showToast);
    }
  }, [downloadAsPNG, downloadAsJPG, downloadAsPDF]);

  return {
    showDownloadMenu,
    isDownloading,
    setShowDownloadMenu,
    downloadCardBothSides,
    downloadAsPNG,
    downloadAsJPG,
    downloadAsPDF,
  };
}