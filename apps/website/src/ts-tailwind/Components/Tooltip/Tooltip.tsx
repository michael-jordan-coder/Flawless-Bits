import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_ACCENT = '#5865f2';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  label?: string;
  triggerLabel?: string;
  placement?: TooltipPlacement;
  delay?: number;
  accentColor?: string;
  children?: ReactNode;
  className?: string;
}

// Direction the bubble slides in from, per placement.
const SLIDE: Record<TooltipPlacement, { x?: number; y?: number }> = {
  top: { y: 6 },
  bottom: { y: -6 },
  left: { x: 6 },
  right: { x: -6 }
};

const POP_CLASSES: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
};

const ARROW_CLASSES: Record<TooltipPlacement, string> = {
  top: '-bottom-[3px] left-1/2 -ml-1',
  bottom: '-top-[3px] left-1/2 -ml-1',
  left: '-right-[3px] top-1/2 -mt-1',
  right: '-left-[3px] top-1/2 -mt-1'
};

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export default function Tooltip({
  label = 'Tooltip text',
  triggerLabel = 'Hover me',
  placement = 'top',
  delay = 0,
  accentColor = DEFAULT_ACCENT,
  children,
  className = ''
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  const slide = SLIDE[placement] ?? SLIDE.top;

  return (
    <span
      className={join('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children ?? (
        <button
          type="button"
          className="cursor-pointer rounded-full border border-white/15 bg-white/[0.04] px-[1.1rem] py-2 font-sans text-sm font-semibold text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40"
        >
          {triggerLabel}
        </button>
      )}
      <AnimatePresence>
        {open && (
          <span className={join('pointer-events-none absolute z-50', POP_CLASSES[placement])}>
            <motion.span
              role="tooltip"
              className="relative block whitespace-nowrap rounded-lg px-[0.7rem] py-[0.4rem] font-sans text-[0.8125rem] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              style={{ backgroundColor: accentColor }}
              initial={{ opacity: 0, scale: 0.9, ...slide }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, ...slide }}
              transition={{ type: 'spring', stiffness: 520, damping: 30 }}
            >
              {label}
              <span
                className={join('absolute h-2 w-2 rotate-45', ARROW_CLASSES[placement])}
                style={{ backgroundColor: accentColor }}
              />
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
