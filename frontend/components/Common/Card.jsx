//app/components/Common/Card.jsx

"use client";

import { useRef, useState, useEffect, memo, useCallback } from "react";

/* =========================================================
   CARD CONFIGURATION
========================================================= */

export const CARD_DIMENSIONS = {
 landscape: {
  designSize: { width: 550, height: 348 },
  containerClass:
    "w-full max-w-[100%] sm:max-w-[420px] lg:max-w-[520px] xl:max-w-[600px] mx-auto aspect-[550/348]",
},
  portrait: {
    designSize: { width: 350, height: 550 },
    containerClass:
      "w-full max-w-[320px] mx-auto aspect-[350/550]",
  },
};

/* =========================================================
   CARD CONTAINER (WRAPPER)
========================================================= */

export function CardContainer({
  children,
  orientation = "landscape",
  className = "",
  onClick,
}) {
  const config = CARD_DIMENSIONS[orientation];

  return (
    <div
      onClick={onClick}
      className={`${config.containerClass} ${className} ${
        onClick
          ? "cursor-pointer transition-all duration-300 hover:-translate-y-2"
          : ""
      }`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   CARD GRID (LIST VIEW) – tighter gaps for portrait
========================================================= */

export function CardGrid({
  children,
  orientation = "landscape",
  className = "",
}) {
  const gapClass =
    orientation === "portrait"
      ? "gap-1 sm:gap-1.5 lg:gap-2"
      : "gap-1.5 sm:gap-2 lg:gap-3";

  const gridClasses = `grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 ${gapClass} justify-items-center items-start`;

  return <div className={`${gridClasses} ${className}`}>{children}</div>;
}

/* =========================================================
   CARD SKELETON (LOADING UI)
========================================================= */

export function CardSkeleton({ orientation = "landscape", count = 8 }) {
  const config = CARD_DIMENSIONS[orientation];

  return (
    <CardGrid orientation={orientation}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${config.containerClass} animate-pulse rounded-xl bg-gradient-to-r from-slate-200/50 via-slate-100/50 to-slate-200/50`}
        />
      ))}
    </CardGrid>
  );
}

/* =========================================================
   SCALE HOOK (CORE ENGINE)
   FIXED: Added debouncing for resize events
========================================================= */

function useFitScale(orientation, containerRef) {
  const [scale, setScale] = useState(1);
  const config = CARD_DIMENSIONS[orientation];
  const designSize = config.designSize;
  const timeoutRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;

      if (!w || !h) return;

      const next = Math.min(w / designSize.width, h / designSize.height);
      setScale(Math.max(0.2, Math.min(next, 1)));
    };

    // Debounced version for resize events
    const debouncedUpdateScale = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(updateScale, 100);
    };

    updateScale();

    const observer = new ResizeObserver(debouncedUpdateScale);
    observer.observe(el);

    window.addEventListener("resize", debouncedUpdateScale);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      observer.disconnect();
      window.removeEventListener("resize", debouncedUpdateScale);
    };
  }, [containerRef, orientation, designSize.width, designSize.height]);

  return {
    scale,
    designSize,
    scaledWidth: designSize.width * scale,
    scaledHeight: designSize.height * scale,
  };
}

/* =========================================================
   FLIP CARD WRAPPER (Adds flip functionality to any card)
   FIXED: Back side no longer appears mirrored
   IMPROVED: Added keyboard accessibility
========================================================= */

export function FlipCardWrapper({ children, className = "", onClick }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    
    // Prevent double flip during animation
    if (isFlipping) return;
    
    setIsFlipping(true);
    setIsFlipped(!isFlipped);
    
    if (onClick) onClick(e);
    
    // Reset flipping state after animation completes
    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip(e);
    }
  };

  return (
    <div
      className={`flip-card ${className} ${isFlipped ? 'flipped' : ''}`}
      style={{
        width: '100%',
        height: '100%',
        perspective: '1000px'
      }}
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "Flip to front" : "Flip to back"}
    >
      <div
        className="flip-card-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          textAlign: 'center',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   CARD PREVIEW (READ ONLY) - NO WHITE BACKGROUND
   FIXED: Added proper styling for card faces
   IMPROVED: Added React.memo for performance
========================================================= */

function CardPreviewComponent({
  html,
  orientation = "landscape",
  className = "",
  onClick,
  enableFlip = false,
}) {
  const frameRef = useRef(null);
  const { scale, designSize, scaledWidth, scaledHeight } = useFitScale(
    orientation,
    frameRef
  );

  const hasValidHtml = html && typeof html === 'string' && html.trim().length > 0;

  const renderCardContent = () => (
    <div
      ref={frameRef}
      className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-transparent"
    >
      <div
        className="relative shrink-0"
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        <div
          className="absolute top-0 left-0 overflow-hidden rounded-xl"
          style={{
            width: designSize.width,
            height: designSize.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );

  if (!hasValidHtml) {
    return (
      <CardContainer
        orientation={orientation}
        onClick={onClick}
        className={className}
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-xl border border-dashed border-slate-300 bg-slate-50/50 backdrop-blur-sm text-sm text-slate-500">
          <span className="text-2xl mb-2">🃟</span>
          <span>No preview</span>
        </div>
      </CardContainer>
    );
  }

  if (enableFlip) {
    return (
      <CardContainer orientation={orientation} className={className}>
        <FlipCardWrapper onClick={onClick}>
          {renderCardContent()}
        </FlipCardWrapper>
      </CardContainer>
    );
  }

  return (
    <CardContainer
      orientation={orientation}
      onClick={onClick}
      className={className}
    >
      {renderCardContent()}
    </CardContainer>
  );
}

// Memoize the CardPreview component to prevent unnecessary re-renders
const CardPreview = memo(CardPreviewComponent);
CardPreview.displayName = 'CardPreview';

export default CardPreview;

/* =========================================================
   CARD EDITOR STAGE (CANVAS FOR CUSTOMIZER)
   FIXED: Now properly renders HTML content from innerRef
   FIXED: onReady fires once when canvas DOM node is mounted (callback ref)
========================================================= */

export function CardEditorStage({
  orientation = "landscape",
  innerRef,
  scaleWrapRef,
  onReady,
  className = "",
}) {
  const frameRef = useRef(null);
  const [canvasNode, setCanvasNode] = useState(null);
  const readyCalledRef = useRef(false);

  const { scale, designSize, scaledWidth, scaledHeight } = useFitScale(
    orientation,
    frameRef
  );

  // Callback ref: captures the canvas node, updates state, and forwards to innerRef
  const handleCanvasRef = useCallback((node) => {
    setCanvasNode(node);
    if (innerRef) {
      if (typeof innerRef === 'function') {
        innerRef(node);
      } else {
        innerRef.current = node;
      }
    }
  }, [innerRef]);

  // Signal readiness exactly once when the canvas node becomes available
  useEffect(() => {
    if (canvasNode && !readyCalledRef.current) {
      readyCalledRef.current = true;
      // Small delay to ensure DOM is fully rendered and scaled
      const timer = setTimeout(() => {
        onReady?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [canvasNode, onReady]);

  return (
    <div
      ref={frameRef}
      className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: "100%",
        height: "auto",
        minHeight: `${Math.max(scaledHeight + 20, 240)}px`,
      }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: scaledWidth,
          height: scaledHeight,
          visibility: scale > 0 ? "visible" : "hidden",
        }}
      >
        <div
          ref={scaleWrapRef}
          className="absolute top-0 left-0 overflow-hidden rounded-xl shadow-lg"
          style={{
            width: designSize.width,
            height: designSize.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            ref={handleCanvasRef}
            className="w-full h-full overflow-auto card-editor-canvas"
            style={{
              width: designSize.width,
              height: designSize.height,
              position: "relative",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EXPORT HELPER (FOR DOWNLOAD)
========================================================= */

export async function withFullSizeCapture(scaleWrapEl, captureFn) {
  if (!scaleWrapEl) return captureFn();

  const prev = scaleWrapEl.style.transform;

  scaleWrapEl.style.transform = "none";

  try {
    return await captureFn();
  } finally {
    scaleWrapEl.style.transform = prev;
  }
}