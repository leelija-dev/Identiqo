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
      const next = Math.min(w / design.width, h / design.height, 1);
      setScale(next > 0 ? next : 1);
    };

    update();
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
  className = '',
}) {
  const frameRef = useRef(null);
  const { scale, design, scaledWidth, scaledHeight } = useFitScale(orientation, frameRef);

  return (
    <div
      ref={frameRef}
      className={`relative flex w-full items-center justify-center overflow-visible ${className}`}
      style={{
        aspectRatio: `${design.width} / ${design.height}`,
        maxWidth: design.width,
        width: '100%',
      }}
    >
      <div
        className="relative shrink-0"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
        <div
          ref={scaleWrapRef}
          className="absolute left-0 top-0"
          style={{
            width: design.width,
            height: design.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <div
            ref={innerRef}
            className="card-editor-canvas h-full w-full rounded-[20px] overflow-visible"
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
