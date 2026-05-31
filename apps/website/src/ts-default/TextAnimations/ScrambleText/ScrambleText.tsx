import { useCallback, useEffect, useRef, useState } from 'react';
import './ScrambleText.css';

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface ScrambleTextProps {
  text?: string;
  trigger?: 'hover' | 'view';
  duration?: number;
  scrambleChars?: string;
  className?: string;
}

export default function ScrambleText({
  text = 'Scramble',
  trigger = 'hover',
  duration = 900,
  scrambleChars = DEFAULT_CHARS,
  className = ''
}: ScrambleTextProps) {
  const [display, setDisplay] = useState<string>(text);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const rootRef = useRef<HTMLSpanElement>(null);

  const run = useCallback(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    startRef.current = 0;
    const chars = scrambleChars;
    const tick = (now: number) => {
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
      className={`scramble-text ${className}`.trim()}
      tabIndex={trigger === 'hover' ? 0 : undefined}
      {...hoverProps}
    >
      <span className="scramble-text-visible" aria-hidden="true">
        {display}
      </span>
      <span className="scramble-text-sr">{text}</span>
    </span>
  );
}
