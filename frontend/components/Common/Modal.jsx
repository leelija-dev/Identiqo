// frontend/components/Common/Modal.jsx
'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { FiDownload, FiStar, FiEdit2, FiX } from 'react-icons/fi';

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
  const [frontHtml, setFrontHtml] = useState('');
  const [backHtml, setBackHtml] = useState('');

  // Extract front and back content from HTML
  useEffect(() => {
    if (htmlContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      const frontElement = tempDiv.querySelector('.card-front, .face.front');
      const backElement = tempDiv.querySelector('.card-back, .face.back');
      
      if (frontElement && backElement) {
        setFrontHtml(frontElement.innerHTML);
        setBackHtml(backElement.innerHTML);
      } else {
        setFrontHtml(htmlContent);
        setBackHtml(htmlContent);
      }
    }
  }, [htmlContent]);

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
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

  // Reset flip when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsFlipped(false);
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle card flip
  const handleCardFlip = useCallback((e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const isPortrait = orientation === 'portrait';

  // Button animation variants
  const buttonVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[2000] p-3 xs:p-4 sm:p-5 md:p-6 animate-fade-in"
          onClick={handleOverlayClick}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Preview modal'}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col lgg:flex-row gap-4 xs:gap-5 sm:gap-6 items-center justify-center w-full max-w-[90vw] xs:max-w-[85vw] sm:max-w-[80vw] md:max-w-[75vw] lg:max-w-[70vw] xl:max-w-[65vw]"
          >
            {/* Card Preview Container with Flip */}
            <motion.div
              onClick={handleCardFlip}
              className={`rounded-2xl overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 cursor-pointer ${
                isPortrait
                  ? 'w-full max-w-[220px] xs:max-w-[240px] sm:max-w-[260px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px]'
                  : 'w-full max-w-[340px] xs:max-w-[360px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[460px] xl:max-w-[500px]'
              }`}
              style={{
                aspectRatio: isPortrait ? '350 / 550' : '550 / 348',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flip-card w-full h-full">
                <div
                  className="flip-card-inner w-full h-full"
                  style={{
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front Side */}
                  <div
                    className="card-front absolute w-full h-full backface-hidden rounded-2xl overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: frontHtml }}
                    />
                  </div>
                  
                  {/* Back Side */}
                  <div
                    className="card-back absolute w-full h-full backface-hidden rounded-2xl overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: backHtml }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons Container with Smooth Animations */}
            <motion.div 
              className="flex flex-row lgg:flex-col gap-2 xs:gap-2.5 sm:gap-3 w-full lgg:w-auto justify-center"
              initial="initial"
              animate="animate"
              transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
            >
              {showWishlist && (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={onWishlist}
                    variant="warning"
                    size="sm"
                    className="flex-1 lgg:flex-none lgg:w-full text-sm transition-all duration-300"
                  >
                    ⭐ Wishlist
                  </Button>
                </motion.div>
              )}
              
              {showCustomize && (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={onCustomize}
                    variant="primary"
                    size="sm"
                    icon={FiEdit2}
                    className="flex-1 lgg:flex-none lgg:w-full text-sm transition-all duration-300"
                  >
                    ✏️ Customize
                  </Button>
                </motion.div>
              )}
              
              {showDownload && (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={onDownload}
                    variant="success"
                    size="sm"
                    icon={FiDownload}
                    className="flex-1 lgg:flex-none lgg:w-full text-sm transition-all duration-300"
                  >
                    Download
                  </Button>
                </motion.div>
              )}
              
              {customButtons.map((button, index) => (
                <motion.div
                  key={index}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    onClick={button.onClick}
                    variant={button.variant || 'secondary'}
                    size="sm"
                    icon={button.icon}
                    className={`flex-1 lgg:flex-none lgg:w-full text-sm transition-all duration-300 ${button.className || ''}`}
                  >
                    {button.label}
                  </Button>
                </motion.div>
              ))}
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={onClose}
                  variant="secondary"
                  size="sm"
                  icon={FiX}
                  className="flex-1 lgg:flex-none lgg:w-full text-sm transition-all duration-300"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}