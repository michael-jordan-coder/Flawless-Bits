import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './Threads.css';

export interface ThreadsProps extends HTMLAttributes<HTMLDivElement> {
  count?: number;
  amplitude?: number;
  speed?: number;
  color?: string;
  surfaceColor?: string;
  lineWidth?: number;
  className?: string;
  children?: ReactNode;
}

// A full-bleed weave of vertical threads: each strand runs top to bottom and
// sways with two stacked sine harmonics so the field drifts like hanging silk.
// Drawn to one canvas with a single rAF loop; strands fade toward the edges so
// the weave reads as a soft band. Honors prefers-reduced-motion by painting one
// static frame. Inspired by the flowing-thread backdrops catalogued on designspells.
export default function Threads({
  count = 18,
  amplitude = 18,
  speed = 1,
  color = '#5227FF',
  surfaceColor = '#08080c',
  lineWidth = 1.5,
  className = '',
  children,
  ...rest
}: ThreadsProps) {
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
    let width = 0;
    let height = 0;
    let rafId = 0;
    let start = 0;

    const paint = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;

      const strands = Math.max(1, count);
      const gap = width / (strands + 1);
      const step = Math.max(6, Math.floor(height / 60));
      const t = elapsed * 0.001 * speed;

      for (let i = 0; i < strands; i++) {
        const baseX = gap * (i + 1);
        const phase = i * 0.6;
        const edgeFade = 1 - Math.abs((i + 1) / (strands + 1) - 0.5) * 1.3;
        ctx.globalAlpha = Math.max(0.06, 0.42 * edgeFade);
        ctx.beginPath();
        for (let y = 0; y <= height; y += step) {
          const sway = Math.sin(y * 0.012 + t + phase) * amplitude;
          const sway2 = Math.sin(y * 0.03 - t * 0.7 + phase * 1.3) * amplitude * 0.4;
          const x = baseX + sway + sway2;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
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
  }, [count, amplitude, speed, color, surfaceColor, lineWidth, reduceMotion]);

  return (
    <div ref={wrapRef} className={`threads ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="threads-canvas" />
      {children != null && <div className="threads-content">{children}</div>}
    </div>
  );
}
