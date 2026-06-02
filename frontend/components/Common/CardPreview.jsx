'use client';

import { useRef, useState, useEffect } from 'react';

export const CARD_DESIGN_SIZE = {
  landscape: { width: 550, height: 348 },
  portrait: { width: 350, height: 550 },
};

function useFitScale(orientation, containerRef) {
  const [scale, setScale] = useState(1);
  const design = CARD_DESIGN_SIZE[orientation] || CARD_DESIGN_SIZE.landscape;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      let next = Math.min(w / design.width, h / design.height);
      next = Math.max(0.3, Math.min(next, 1));
      setScale(next);
    };

    setTimeout(update, 0);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [orientation, design.width, design.height]);

  return {
    scale,
    design,
    scaledWidth: design.width * scale,
    scaledHeight: design.height * scale,
  };
}

/** Read-only card preview for grids (templates, gallery). */
export default function CardPreview({
  html,
  orientation = 'landscape',
  maxWidth,
  className = '',
}) {
  const frameRef = useRef(null);
  const { scale, design, scaledWidth, scaledHeight } = useFitScale(orientation, frameRef);
  const scaleClass =
    orientation === 'portrait' ? 'scaled-template-portrait' : 'scaled-template-landscape';

  const resolvedMaxWidth =
    maxWidth ?? (orientation === 'landscape' ? 320 : 260);

  if (!html || !String(html).trim()) {
    return (
      <div
        className={`flex w-full  items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 py-16 text-xs text-slate-400 ${className}`}
        style={{
          aspectRatio: `${design.width} / ${design.height}`,
          maxWidth: resolvedMaxWidth,
        }}
      >
        No preview
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      className={`relative flex w-full items-center justify-center overflow-visible ${className}`}
      style={{
        aspectRatio: `${design.width} / ${design.height}`,
        maxWidth: resolvedMaxWidth,
      }}
    >
      <div
        className="relative shrink-0"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
        <div
          className={`${scaleClass} absolute left-0 top-0 overflow-hidden rounded-[20px]`}
          style={{
            width: design.width,
            height: design.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

/** Editor stage: fixed design canvas scaled to fit available space (customize page). */
export function CardEditorStage({
  orientation = 'landscape',
  innerRef,
  scaleWrapRef,
  onReady,
  className = '',
}) {
  const frameRef = useRef(null);
  const { scale, design, scaledWidth, scaledHeight } = useFitScale(orientation, frameRef);

  useEffect(() => {
    if (innerRef?.current) onReady?.();
  }, [innerRef, onReady, orientation]);

  return (
    <div
      ref={frameRef}
      className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}
      style={{
        maxWidth: '100%',
        width: '100%',
        height: 'auto',
        minHeight: `${Math.max(scaledHeight + 20, 240)}px`,
      }}
    >
      <div
        className="relative shrink-0"
        style={{ 
          width: scaledWidth, 
          height: scaledHeight,
          visibility: scale > 0 ? 'visible' : 'hidden',
        }}
      >
        <div
          ref={scaleWrapRef}
          className="absolute left-0 top-0 overflow-hidden"
          style={{
            width: design.width,
            height: design.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <div
            ref={innerRef}
            className="card-editor-canvas h-full w-full rounded-[20px] overflow-hidden"
            style={{ width: design.width, height: design.height }}
          />
        </div>
      </div>
    </div>
  );
}

/** Temporarily removes preview scale so html2canvas captures at full design size. */
export async function withFullSizeCapture(scaleWrapEl, captureFn) {
  if (!scaleWrapEl) return captureFn();

  const prevTransform = scaleWrapEl.style.transform;
  scaleWrapEl.style.transform = 'none';
  try {
    return await captureFn();
  } finally {
    scaleWrapEl.style.transform = prevTransform;
  }
}
