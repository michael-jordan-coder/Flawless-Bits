import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './MeshGradient.css';

const hexToRgb = (hex: string): [number, number, number] => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const DEFAULT_COLORS = ['#7c3aed', '#2563eb', '#06b6d4', '#ec4899', '#f59e0b'];

interface Blob {
  cx: number;
  cy: number;
  ox: number;
  oy: number;
  angle: number;
  angSpeed: number;
  radius: number;
  rgb: string;
}

// An animated mesh-gradient backdrop: several large soft radial color blobs
// whose control points orbit on smooth elliptical paths, so the colors blend
// into a living, morphing mesh. Each frame fills the surface, then layers N
// radial gradients (lighter composite) under a soft blur for a glassy bleed.
// Single rAF loop, dpr-scaled canvas, ResizeObserver. Honors
// prefers-reduced-motion by painting one static frame instead of looping.
export interface MeshGradientProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  colors?: string[];
  surfaceColor?: string;
  speed?: number;
  blobCount?: number;
  blur?: number;
  className?: string;
  children?: ReactNode;
}

export default function MeshGradient({
  colors = DEFAULT_COLORS,
  surfaceColor = '#08080c',
  speed = 1,
  blobCount = 0,
  blur = 40,
  className = '',
  children,
  ...rest
}: MeshGradientProps) {
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
    const palette = colors.length > 0 ? colors : DEFAULT_COLORS;
    const count = blobCount > 0 ? blobCount : palette.length;
    const TAU = Math.PI * 2;

    let width = 0;
    let height = 0;
    let blobs: Blob[] = [];
    let rafId = 0;
    let start = 0;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const buildBlobs = () => {
      blobs = [];
      for (let i = 0; i < count; i++) {
        const [r, g, b] = hexToRgb(palette[i % palette.length]);
        blobs.push({
          cx: rand(0.2, 0.8),
          cy: rand(0.2, 0.8),
          ox: rand(0.12, 0.32),
          oy: rand(0.12, 0.32),
          angle: rand(0, TAU),
          angSpeed: rand(0.1, 0.26) * (Math.random() < 0.5 ? -1 : 1),
          radius: rand(0.45, 0.7),
          rgb: `${r}, ${g}, ${b}`
        });
      }
    };

    const paint = (elapsed: number) => {
      const t = elapsed * 0.001 * speed;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);

      const minSide = Math.min(width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const a = blob.angle + t * blob.angSpeed;
        const x = (blob.cx + Math.cos(a) * blob.ox) * width;
        const y = (blob.cy + Math.sin(a) * blob.oy) * height;
        const radius = blob.radius * minSide;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `rgba(${blob.rgb}, 0.9)`);
        grad.addColorStop(0.5, `rgba(${blob.rgb}, 0.35)`);
        grad.addColorStop(1, `rgba(${blob.rgb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
      if (reduce) paint(0);
    };

    const frame = (now: number) => {
      if (!start) start = now;
      paint(now - start);
      rafId = requestAnimationFrame(frame);
    };

    buildBlobs();
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
  }, [colors, surfaceColor, speed, blobCount, blur, reduceMotion]);

  return (
    <div ref={wrapRef} className={`mesh-gradient ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="mesh-gradient-canvas" />
      {children != null && <div className="mesh-gradient-content">{children}</div>}
    </div>
  );
}
