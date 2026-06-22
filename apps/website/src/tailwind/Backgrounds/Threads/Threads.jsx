import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

// Canvas drawing is identical to the CSS variant; only the wrapper uses Tailwind
// utility classes. Vertical threads sway with two stacked sine harmonics and
// fade toward the edges. Honors prefers-reduced-motion with one static frame.
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
}) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

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

    const paint = elapsed => {
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

    const frame = now => {
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
    <div
      ref={wrapRef}
      className={`relative h-full min-h-[200px] w-full overflow-hidden bg-[#08080c] ${className}`.trim()}
      {...rest}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {children != null && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
