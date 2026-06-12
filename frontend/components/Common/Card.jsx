"use client";

import { useRef, useState, useEffect } from "react";

/* =========================================================
   CARD CONFIGURATION
========================================================= */

export const CARD_DIMENSIONS = {
  landscape: {
    designSize: { width: 550, height: 348 },
    containerClass:
      "w-full max-w-[360px] mx-auto aspect-[550/348] max-h-[240px]",
  },
  portrait: {
    designSize: { width: 350, height: 550 },
    containerClass:
      "w-full max-w-[240px] mx-auto aspect-[350/550] max-h-[400px]",
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

  const gridClasses = `grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gapClass} justify-items-center items-start`;

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
========================================================= */

function useFitScale(orientation, containerRef) {
  const [scale, setScale] = useState(1);
  const config = CARD_DIMENSIONS[orientation];
  const designSize = config.designSize;

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

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);

    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
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
========================================================= */

export function FlipCardWrapper({ children, className = "", onClick }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
    if (onClick) onClick(e);
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
========================================================= */

export default function CardPreview({
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

/* =========================================================
   CARD EDITOR STAGE (CANVAS FOR CUSTOMIZER)
========================================================= */

export function CardEditorStage({
  orientation = "landscape",
  innerRef,
  scaleWrapRef,
  onReady,
  className = "",
}) {
  const frameRef = useRef(null);

  const { scale, designSize, scaledWidth, scaledHeight } = useFitScale(
    orientation,
    frameRef
  );

  useEffect(() => {
    if (innerRef?.current) onReady?.();
  }, [innerRef, onReady, orientation]);

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
          }}
        >
          <div
            ref={innerRef}
            className="w-full h-full overflow-hidden card-editor-canvas"
            style={{
              width: designSize.width,
              height: designSize.height,
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