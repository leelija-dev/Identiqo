"use client";

import { useRef, useState, useEffect } from "react";

/* =========================================================
   CARD CONFIGURATION
========================================================= */

export const CARD_DIMENSIONS = {
  landscape: {
    designSize: { width: 550, height: 348 },
    containerClass: "w-full aspect-[550/348]",
  },
  portrait: {
    designSize: { width: 350, height: 550 },
    containerClass: "w-full aspect-[350/550]",
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
      className={`w-full ${config.containerClass} ${className} ${
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
   CARD GRID (LIST VIEW)
========================================================= */

export function CardGrid({
  children,
  orientation = "landscape",
  className = "",
}) {
  const isLandscape = orientation === "landscape";

  const gridClasses = isLandscape
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-items-center";

  return <div className={`${gridClasses} ${className}`}>{children}</div>;
}

/* =========================================================
   CARD SKELETON (LOADING UI)
========================================================= */

export function CardSkeleton({ orientation = "landscape", count = 6 }) {
  const config = CARD_DIMENSIONS[orientation];

  return (
    <CardGrid orientation={orientation}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${config.containerClass} animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200`}
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
      setScale(Math.max(0.3, Math.min(next, 1)));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);

    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [orientation, designSize.width, designSize.height]);

  return {
    scale,
    designSize,
    scaledWidth: designSize.width * scale,
    scaledHeight: designSize.height * scale,
  };
}

/* =========================================================
   CARD PREVIEW (READ ONLY)
========================================================= */

export default function CardPreview({
  html,
  orientation = "landscape",
  className = "",
  onClick,
}) {
  const frameRef = useRef(null);
  const { scale, designSize, scaledWidth, scaledHeight } = useFitScale(
    orientation,
    frameRef
  );

  if (!html || !html.trim()) {
    return (
      <CardContainer
        orientation={orientation}
        onClick={onClick}
        className={className}
      >
        <div className="flex items-center justify-center w-full h-full rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
          No preview
        </div>
      </CardContainer>
    );
  }

  return (
    <CardContainer
      orientation={orientation}
      onClick={onClick}
      className={className}
    >
      <div
        ref={frameRef}
        className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-xl"
      >
        <div
          className="relative shrink-0"
          style={{
            width: scaledWidth,
            height: scaledHeight,
          }}
        >
          <div
            className="absolute top-0 left-0 overflow-hidden rounded-xl shadow-sm"
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