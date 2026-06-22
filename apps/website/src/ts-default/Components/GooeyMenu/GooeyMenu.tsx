import { useEffect, useId, useRef, useState, type CSSProperties, type ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import { Plus, Share2, Heart, Bookmark, Link, type LucideProps } from 'lucide-react';
import './GooeyMenu.css';

const DEFAULT_ACCENT = '#3ecf8e';
const ACTION_SIZE = 44;

export type GooeyDirection = 'up' | 'down' | 'left' | 'right';

export interface GooeyAction {
  icon: ComponentType<LucideProps>;
  label: string;
  onClick?: () => void;
}

const DEFAULT_ACTIONS: GooeyAction[] = [
  { icon: Share2, label: 'Share' },
  { icon: Heart, label: 'Favorite' },
  { icon: Bookmark, label: 'Save' },
  { icon: Link, label: 'Copy link' }
];

// Unit vector pointing away from the trigger for each fan direction.
const DIRECTION_VECTOR: Record<GooeyDirection, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface GooeyMenuProps {
  actions?: GooeyAction[];
  direction?: GooeyDirection;
  gap?: number;
  accent?: string;
  className?: string;
}

export default function GooeyMenu({
  actions = DEFAULT_ACTIONS,
  direction = 'up',
  gap = 12,
  accent = DEFAULT_ACCENT,
  className = ''
}: GooeyMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  const filterId = useId().replace(/:/g, '');
  const vector = DIRECTION_VECTOR[direction] ?? DIRECTION_VECTOR.up;
  const step = ACTION_SIZE + gap;

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleAction = (onClick?: () => void) => {
    onClick?.();
    setOpen(false);
    triggerRef.current?.focus();
  };

  const spring: Transition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 520, damping: 22, mass: 0.7 };

  return (
    <div className={join('gooey-menu', className)} style={{ '--gooey-accent': accent } as CSSProperties}>
      <svg className="gooey-menu__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id={`gooey-${filterId}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="gooey-menu__field"
        style={{ filter: reduceMotion ? 'none' : `url(#gooey-${filterId})` }}
      >
        <AnimatePresence>
          {open &&
            actions.map(({ icon: Icon, label, onClick }, index) => {
              const distance = step * (index + 1);
              return (
                <motion.button
                  key={label}
                  type="button"
                  className="gooey-menu__action"
                  aria-label={label}
                  onClick={() => handleAction(onClick)}
                  initial={{ x: 0, y: 0, scale: reduceMotion ? 1 : 0.4, opacity: reduceMotion ? 1 : 0 }}
                  animate={{ x: vector.x * distance, y: vector.y * distance, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: reduceMotion ? 1 : 0.4, opacity: reduceMotion ? 1 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : { ...spring, delay: index * 0.04 }}
                >
                  {Icon && <Icon size={18} strokeWidth={2.25} aria-hidden="true" />}
                </motion.button>
              );
            })}
        </AnimatePresence>

        <button
          ref={triggerRef}
          type="button"
          className={join('gooey-menu__trigger', open && 'is-open')}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(value => !value)}
        >
          <motion.span
            className="gooey-menu__trigger-icon"
            animate={{ rotate: open ? 135 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 18 }}
          >
            <Plus size={24} strokeWidth={2.5} aria-hidden="true" />
          </motion.span>
        </button>
      </div>
    </div>
  );
}
