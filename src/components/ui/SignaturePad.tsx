"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SignaturePadProps {
  onSignedChange: (hasSignature: boolean) => void;
  placeholder?: string;
  clearLabel?: string;
  className?: string;
}

const STROKE_COLOR = "#00d4e8";
const STROKE_WIDTH = 2;
const MIN_STROKE_POINTS = 20;

function getPoint(
  event: React.PointerEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export function SignaturePad({
  onSignedChange,
  placeholder = "Draw your signature",
  clearLabel = "Clear",
  className = "",
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const strokePointsRef = useRef(0);
  const [hasSignature, setHasSignature] = useState(false);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx || rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = STROKE_WIDTH;
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, [initCanvas]);

  const updateSignedState = useCallback(
    (signed: boolean) => {
      setHasSignature(signed);
      onSignedChange(signed);
    },
    [onSignedChange],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    const { x, y } = getPoint(event, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getPoint(event, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();

    strokePointsRef.current += 1;
    if (strokePointsRef.current >= MIN_STROKE_POINTS && !hasSignature) {
      updateSignedState(true);
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokePointsRef.current = 0;
    updateSignedState(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative border border-border bg-surface">
        {!hasSignature && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs uppercase tracking-wider text-text-muted/50"
          >
            {placeholder}
          </span>
        )}
        <canvas
          ref={canvasRef}
          aria-label={placeholder}
          className="block h-28 w-full touch-none cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="text-[10px] uppercase tracking-widest text-text-muted transition-colors hover:text-accent"
        >
          {clearLabel}
        </button>
      </div>
    </div>
  );
}
