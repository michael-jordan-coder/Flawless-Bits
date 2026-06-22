import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus, Share2, Heart, Bookmark, Link } from 'lucide-react';

const DEFAULT_ACCENT = '#3ecf8e';
const ACTION_SIZE = 44;

const DEFAULT_ACTIONS = [
  { icon: Share2, label: 'Share' },
  { icon: Heart, label: 'Favorite' },
  { icon: Bookmark, label: 'Save' },
  { icon: Link, label: 'Copy link' }
];

// Unit vector pointing away from the trigger for each fan direction.
const DIRECTION_VECTOR = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const join = (...classes) => classes.filter(Boolean).join(' ');

export default function GooeyMenu({
  actions = DEFAULT_ACTIONS,
  direction = 'up',
  gap = 12,
  accent = DEFAULT_ACCENT,
  className = ''
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const filterId = useId().replace(/:/g, '');
  const vector = DIRECTION_VECTOR[direction] ?? DIRECTION_VECTOR.up;
  const step = ACTION_SIZE + gap;

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleAction = onClick => {
    onClick?.();
    setOpen(false);
    triggerRef.current?.focus();
  };

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 520, damping: 22, mass: 0.7 };

  const circleClass =
    'inline-flex items-center justify-center rounded-full border-0 p-0 text-[#0a0a0a] cursor-pointer ' +
    'focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_#000,0_0_0_4px_var(--gooey-accent)]';

  return (
    <div className={join('relative inline-flex', className)} style={{ '--gooey-accent': accent }}>
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true" focusable="false">
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
        className="relative flex h-14 w-14 items-center justify-center"
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
                  className={join(circleClass, 'absolute left-1/2 top-1/2 z-[1] -ml-[22px] -mt-[22px] h-11 w-11')}
                  style={{ background: 'var(--gooey-accent)' }}
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
          className={join(circleClass, 'relative z-[2] h-14 w-14')}
          style={{ background: 'var(--gooey-accent)' }}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(value => !value)}
        >
          <motion.span
            className="inline-flex items-center justify-center"
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
