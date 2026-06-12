import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function ScrambleText({
  text = 'Scramble',
  trigger = 'hover',
  duration = 900,
  scrambleChars = DEFAULT_CHARS,
  className = ''
}) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const rootRef = useRef(null);

  const run = useCallback(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    startRef.current = 0;
    const chars = scrambleChars;
    const tick = now => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const settledCount = progress * text.length;
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === ' ') {
          out += ' ';
          continue;
        }
        out += i < settledCount ? ch : chars[Math.floor(Math.random() * chars.length)];
      }
      setDisplay(out);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, duration, scrambleChars]);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(() => {
    if (trigger !== 'view') return undefined;
    const node = rootRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger, run]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const hoverProps = trigger === 'hover' ? { onMouseEnter: run, onFocus: run } : {};

  return (
    <span
      ref={rootRef}
      className={`inline-block cursor-default whitespace-pre font-mono text-[clamp(1.75rem,5vw,3rem)] font-semibold tracking-tight text-[#fafafa] outline-none focus-visible:rounded-sm focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#fafafa] ${className}`.trim()}
      tabIndex={trigger === 'hover' ? 0 : undefined}
      {...hoverProps}
    >
      <span className="inline-block" aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
