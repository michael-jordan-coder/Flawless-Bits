import { motion } from 'motion/react';
import type { ReactNode } from 'react';

// Conic rainbow whose start angle is driven by the animated --rb-angle variable.
const RAINBOW =
  'conic-gradient(from var(--rb-angle, 0deg), #ff0080, #ff8c00, #ffe600, #00ff8c, #00b3ff, #8c00ff, #ff0080)';

export interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  speed?: number;
  blur?: number;
  borderWidth?: number;
  radius?: number;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export default function RainbowButton({
  children = 'Get started',
  speed = 3000,
  blur = 14,
  borderWidth = 2,
  radius = 14,
  className = '',
  ...rest
}: RainbowButtonProps) {
  const spin = {
    animate: { '--rb-angle': '360deg' },
    transition: { duration: Math.max(0, speed) / 1000, ease: 'linear' as const, repeat: Infinity }
  };

  return (
    <button
      type="button"
      className={join(
        'group relative isolate inline-flex cursor-pointer border-0 bg-transparent p-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/60',
        className
      )}
      style={{ borderRadius: radius }}
      {...rest}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 z-0 opacity-55 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: RAINBOW, filter: `blur(${blur}px)`, borderRadius: radius }}
        {...spin}
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{ background: RAINBOW, borderRadius: radius }}
        {...spin}
      />
      <span
        className="absolute z-[2] bg-[#0a0a0a]"
        style={{ inset: borderWidth, borderRadius: Math.max(0, radius - borderWidth) }}
      />
      <span className="relative z-[3] px-[1.8rem] py-[0.8rem] font-sans text-base font-semibold text-white">
        {children}
      </span>
    </button>
  );
}
