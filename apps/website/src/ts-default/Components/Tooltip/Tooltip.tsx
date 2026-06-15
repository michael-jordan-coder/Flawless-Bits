import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Tooltip.css';

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
      className={join('tooltip', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children ?? (
        <button type="button" className="tooltip__trigger">
          {triggerLabel}
        </button>
      )}
      <AnimatePresence>
        {open && (
          <span className={`tooltip__pop tooltip__pop--${placement}`}>
            <motion.span
              role="tooltip"
              className="tooltip__bubble"
              style={{ backgroundColor: accentColor }}
              initial={{ opacity: 0, scale: 0.9, ...slide }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, ...slide }}
              transition={{ type: 'spring', stiffness: 520, damping: 30 }}
            >
              {label}
              <span className={`tooltip__arrow tooltip__arrow--${placement}`} style={{ backgroundColor: accentColor }} />
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </span>
  );
}
