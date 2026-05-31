import { useEffect, useRef } from 'react';
import './DotGrid.css';

interface Dot {
  x: number;
  y: number;
}

interface Shock {
  x: number;
  y: number;
  start: number;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(x => x + x).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export interface DotGridProps {
  dotColor?: string;
  activeColor?: string;
  gap?: number;
  dotSize?: number;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  className?: string;
}

export default function DotGrid({
  dotColor = '#2a2a2e',
  activeColor = '#fafafa',
  gap = 32,
  dotSize = 2,
  proximity = 120,
  shockRadius = 220,
  shockStrength = 6,
  className = ''
}: DotGridProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = prefersReducedMotion();
    const pointer = { x: -9999, y: -9999, active: false };
    const shocks: Shock[] = [];
    const base = hexToRgb(dotColor);
    const active = hexToRgb(activeColor);
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;

    const buildDots = () => {
      dots = [];
      const cols = Math.max(Math.floor(width / gap), 1);
      const rows = Math.max(Math.floor(height / gap), 1);
      const offsetX = (width - (cols - 1) * gap) / 2;
      const offsetY = (height - (rows - 1) * gap) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: offsetX + c * gap, y: offsetY + r * gap });
        }
      }
    };

    const paintStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = dotColor;
      for (let i = 0; i < dots.length; i++) {
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
      if (reduce) paintStatic();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const prox2 = proximity * proximity;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let dx = 0;
        let dy = 0;
        let intensity = 0;
        if (pointer.active) {
          const ddx = d.x - pointer.x;
          const ddy = d.y - pointer.y;
          const dist2 = ddx * ddx + ddy * ddy;
          if (dist2 < prox2) {
            intensity = 1 - Math.sqrt(dist2) / proximity;
          }
        }
        for (let s = shocks.length - 1; s >= 0; s--) {
          const sh = shocks[s];
          const age = (now - sh.start) / 600;
          if (age >= 1) {
            shocks.splice(s, 1);
            continue;
          }
          const ddx = d.x - sh.x;
          const ddy = d.y - sh.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
          if (dist < shockRadius) {
            const falloff = (1 - dist / shockRadius) * (1 - age);
            dx += (ddx / dist) * falloff * shockStrength * 4;
            dy += (ddy / dist) * falloff * shockStrength * 4;
            intensity = Math.max(intensity, falloff);
          }
        }
        const r = Math.round(base[0] + (active[0] - base[0]) * intensity);
        const g = Math.round(base[1] + (active[1] - base[1]) * intensity);
        const b = Math.round(base[2] + (active[2] - base[2]) * intensity);
        ctx.beginPath();
        ctx.arc(d.x + dx, d.y + dy, dotSize + intensity * dotSize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      shocks.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, start: performance.now() });
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduce) {
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
      wrap.addEventListener('pointerdown', onDown);
      rafId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointerdown', onDown);
    };
  }, [dotColor, activeColor, gap, dotSize, proximity, shockRadius, shockStrength]);

  return (
    <div ref={wrapRef} className={`dot-grid ${className}`.trim()}>
      <canvas ref={canvasRef} className="dot-grid-canvas" />
    </div>
  );
}
