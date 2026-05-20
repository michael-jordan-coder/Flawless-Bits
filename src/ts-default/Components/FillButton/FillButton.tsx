import * as React from 'react';
import { useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import './FillButton.css';

gsap.registerPlugin(useGSAP);

export type FillButtonSize = 'sm' | 'md';

export interface FillButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  children: React.ReactNode;
  fillColor?: string;
  textColor?: string;
  restingTextColor?: string;
  trailing?: React.ReactNode;
  size?: FillButtonSize;
  filled?: boolean;
}

const DURATION = 0.28;
const DEFAULT_FILL = '#5227FF';
const DEFAULT_TEXT_AFTER = '#ffffff';
const DEFAULT_TEXT_RESTING = '#ffffff';

const join = (...classes: Array<string | false | null | undefined>): string => classes.filter(Boolean).join(' ');

export default function FillButton({
  children,
  fillColor = DEFAULT_FILL,
  textColor = DEFAULT_TEXT_AFTER,
  restingTextColor = DEFAULT_TEXT_RESTING,
  trailing,
  size = 'md',
  filled = false,
  className = '',
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: FillButtonProps) {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const fillRef = React.useRef<HTMLSpanElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const tweenRef = React.useRef<gsap.core.Tween | null>(null);
  const lastOriginRef = React.useRef<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const fill = fillRef.current;
      const label = labelRef.current;
      if (!fill || !label) return;

      if (filled) {
        gsap.set(fill, { clipPath: 'circle(150% at 50% 50%)' });
        gsap.set(label, { color: textColor });
        return;
      }

      gsap.set(fill, { clipPath: 'circle(0px at 50% 50%)' });
      gsap.set(label, { color: restingTextColor });
    },
    { scope: rootRef, dependencies: [textColor, restingTextColor, filled] }
  );

  // Radius covers the furthest corner from the origin so the fill ends flush with all edges.
  const animateIn = React.useCallback(
    (originX: number, originY: number) => {
      if (filled) return;
      const fill = fillRef.current;
      const label = labelRef.current;
      const root = rootRef.current;
      if (!fill || !label || !root) return;

      const rect = root.getBoundingClientRect();
      const radius = Math.max(
        Math.hypot(originX, originY),
        Math.hypot(rect.width - originX, originY),
        Math.hypot(originX, rect.height - originY),
        Math.hypot(rect.width - originX, rect.height - originY)
      );

      lastOriginRef.current = { x: originX, y: originY };
      tweenRef.current?.kill();

      const duration = reduced ? 0 : DURATION;
      gsap.set(fill, { clipPath: `circle(0px at ${originX}px ${originY}px)` });
      tweenRef.current = gsap.to(fill, {
        clipPath: `circle(${radius}px at ${originX}px ${originY}px)`,
        duration,
        ease: 'power3.out'
      });
      gsap.to(label, {
        color: textColor,
        duration: duration * 0.6,
        ease: 'power2.out'
      });
    },
    [filled, reduced, textColor]
  );

  const animateOut = React.useCallback(() => {
    if (filled) return;
    const fill = fillRef.current;
    const label = labelRef.current;
    if (!fill || !label) return;

    const origin = lastOriginRef.current;
    const cx = origin ? `${origin.x}px` : '50%';
    const cy = origin ? `${origin.y}px` : '50%';

    tweenRef.current?.kill();
    const duration = reduced ? 0 : DURATION * 0.7;
    tweenRef.current = gsap.to(fill, {
      clipPath: `circle(0px at ${cx} ${cy})`,
      duration,
      ease: 'power3.in'
    });
    gsap.to(label, {
      color: restingTextColor,
      duration: duration * 0.8,
      ease: 'power2.in'
    });
  }, [filled, reduced, restingTextColor]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseEnter?.(e);
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    animateIn(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    animateOut();
  };

  // Focus has no cursor coordinate — radial reveal from the centre instead.
  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    onFocus?.(e);
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    animateIn(rect.width / 2, rect.height / 2);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    onBlur?.(e);
    animateOut();
  };

  return (
    <button
      ref={rootRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={join('fill-button', `fill-button--${size}`, filled && 'is-filled', className)}
      {...rest}
    >
      <span
        ref={fillRef}
        data-fill
        aria-hidden
        className="fill-button__fill"
        style={{ backgroundColor: fillColor }}
      />
      <span ref={labelRef} data-label className="fill-button__label">
        {children}
        {trailing}
      </span>
    </button>
  );
}
