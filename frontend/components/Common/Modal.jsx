// frontend/components/Common/Modal.jsx
'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { FiDownload, FiEdit2, FiX, FiRotateCw } from 'react-icons/fi';

export default function Modal({
  isOpen,
  onClose,
  htmlContent,
  orientation = 'landscape',
  onWishlist,
  onCustomize,
  onDownload,
  showWishlist = true,
  showCustomize = true,
  showDownload = true,
  customButtons = [],
  title = '',
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [frontContent, setFrontContent] = useState('');
  const [backContent, setBackContent] = useState('');

  useEffect(() => {
    if (htmlContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      const frontEl = tempDiv.querySelector('.card-front');
      const backEl = tempDiv.querySelector('.card-back');
      
      if (frontEl && backEl) {
        setFrontContent(frontEl.innerHTML);
        setBackContent(backEl.innerHTML);
      } else {
        setFrontContent(htmlContent);
        setBackContent(`
          <div style="background:linear-gradient(135deg, #1e293b, #0f172a); width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; padding:20px; box-sizing:border-box;">
            <div style="text-align:center;">
              <div style="font-size:48px; margin-bottom:16px;">💳</div>
              <h3 style="margin:0 0 8px 0;">Card Back</h3>
              <p style="font-size:12px; opacity:0.7;">Scan QR for verification</p>
              <div style="width:80px; height:80px; background:white; margin:16px auto; border-radius:12px;"></div>
              <p style="font-size:10px; margin-top:16px;">Authorized Signature</p>
              <div style="width:120px; height:2px; background:white; margin:8px auto;"></div>
            </div>
          </div>
        `);
      }
    }
  }, [htmlContent]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) setIsFlipped(false);
  }, [isOpen]);

  const handleCardFlip = useCallback((e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const isPortrait = orientation === 'portrait';
  
  // Responsive card dimensions
const cardDimensions = isPortrait
  ? { width: 'min(350px, 90vw)', height: 'min(550px, 141vw)' }
  : { width: 'min(550px, 92vw)', height: 'min(348px, 58vw)' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[2000] p-3 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-center justify-center max-w-[95vw] lg:max-w-[90vw] xl:max-w-[80vw]"
          >
            {/* Flip Card Container */}
            <div className="relative">
              {/* Flip instruction badge */}
             

              <div
                onClick={handleCardFlip}
                className="cursor-pointer"
                style={{
                  width: cardDimensions.width,
                  height: cardDimensions.height,
                  perspective: '2000px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      background: 'transparent',
                    }}
                  >
                    <div 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: frontContent }}
                    />
                  </div>
                  
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      background: 'transparent',
                    }}
                  >
                    <div 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: backContent }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons - Perfectly Responsive */}
            <div className="flex flex-row flex-wrap lg:flex-col gap-2 sm:gap-2.5 lg:gap-3 w-full lg:w-auto items-stretch lg:items-stretch justify-center">
              {showWishlist && (
                <Button
                  onClick={onWishlist}
                  variant="warning"
                  size="md"
                  className="flex-1 lg:flex-auto min-w-[100px] lg:min-w-[160px] lg:w-[160px] justify-center text-xs sm:text-sm lg:text-base py-2 lg:py-2.5"
                >
                  ⭐ Wishlist
                </Button>
              )}
              
              {showCustomize && (
                <Button
                  onClick={onCustomize}
                  variant="primary"
                  size="md"
                  icon={FiEdit2}
                  className="flex-1 lg:flex-auto min-w-[100px] lg:min-w-[160px] lg:w-[160px] justify-center text-xs sm:text-sm lg:text-base py-2 lg:py-2.5"
                >
                  ✏️ Customize
                </Button>
              )}
              
              {showDownload && (
                <Button
                  onClick={onDownload}
                  variant="success"
                  size="md"
                  icon={FiDownload}
                  className="flex-1 lg:flex-auto min-w-[100px] lg:min-w-[160px] lg:w-[160px] justify-center text-xs sm:text-sm lg:text-base py-2 lg:py-2.5"
                >
                  Download
                </Button>
              )}
              
              {customButtons.map((button, index) => (
                <Button
                  key={index}
                  onClick={button.onClick}
                  variant={button.variant || 'secondary'}
                  size="md"
                  icon={button.icon}
                  className="flex-1 lg:flex-auto min-w-[100px] lg:min-w-[160px] lg:w-[160px] justify-center text-xs sm:text-sm lg:text-base py-2 lg:py-2.5"
                >
                  {button.label}
                </Button>
              ))}
              
              <Button
                onClick={onClose}
                variant="secondary"
                size="md"
                icon={FiX}
                className="flex-1 lg:flex-auto min-w-[100px] lg:min-w-[160px] lg:w-[160px] justify-center text-xs sm:text-sm lg:text-base py-2 lg:py-2.5"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}