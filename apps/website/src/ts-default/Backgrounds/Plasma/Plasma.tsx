import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './Plasma.css';

export interface PlasmaProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
  surfaceColor?: string;
  speed?: number;
  scale?: number;
  intensity?: number;
  className?: string;
  children?: ReactNode;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// A full-bleed plasma field: a single hue whose brightness flows from a stack of
// sine waves, rendered into a tiny offscreen buffer and scaled up smoothly so
// the bands stay soft and cheap. One rAF loop, ResizeObserver, reduced-motion
// static frame. Inspired by the flowing plasma backdrops catalogued on designspells.
export default function Plasma({
  color = '#5227FF',
  surfaceColor = '#08080c',
  speed = 1,
  scale = 3,
  intensity = 1,
  className = '',
  children,
  ...rest
}: PlasmaProps) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = !!reduceMotion;
    const offscreen = document.createElement('canvas');
    const octx = offscreen.getContext('2d');
    if (!octx) return undefined;

    const [sR, sG, sB] = hexToRgb(surfaceColor);
    const [cR, cG, cB] = hexToRgb(color);
    const TAU = Math.PI * 2;

    let width = 0;
    let height = 0;
    let lw = 1;
    let lh = 1;
    let image: ImageData | null = null;
    let rafId = 0;
    let start = 0;

    const paint = (elapsed: number) => {
      if (!image) return;
      const data = image.data;
      const t = elapsed * 0.0006 * speed;
      for (let y = 0; y < lh; y++) {
        const ny = y / lh;
        for (let x = 0; x < lw; x++) {
          const nx = x / lw;
          let v = Math.sin(nx * scale * TAU + t);
          v += Math.sin(ny * scale * TAU + t * 1.3);
          v += Math.sin((nx + ny) * scale * TAU + t * 0.7);
          const dx = nx - 0.5;
          const dy = ny - 0.5;
          v += Math.sin(Math.sqrt(dx * dx + dy * dy) * scale * TAU * 2 - t * 0.9);
          let b = (v + 4) / 8;
          b = Math.max(0, Math.min(1, b * intensity));
          const idx = (y * lw + x) * 4;
          data[idx] = sR + (cR - sR) * b;
          data[idx + 1] = sG + (cG - sG) * b;
          data[idx + 2] = sB + (cB - sB) * b;
          data[idx + 3] = 255;
        }
      }
      octx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offscreen, 0, 0, lw, lh, 0, 0, width, height);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      lw = 128;
      lh = Math.max(16, Math.min(128, Math.round((128 * height) / width)));
      offscreen.width = lw;
      offscreen.height = lh;
      image = octx.createImageData(lw, lh);
      if (reduce) paint(0);
    };

    const frame = (now: number) => {
      if (!start) start = now;
      paint(now - start);
      rafId = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduce) {
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [color, surfaceColor, speed, scale, intensity, reduceMotion]);

  return (
    <div ref={wrapRef} className={`plasma ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="plasma-canvas" />
      {children != null && <div className="plasma-content">{children}</div>}
    </div>
  );
}
