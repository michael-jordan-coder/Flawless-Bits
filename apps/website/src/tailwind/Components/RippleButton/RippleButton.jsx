import { useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

// A flat-filled pill button that emits a Material-style ripple from the exact
// pointer-down coordinates, expanding and fading as it goes. Multiple clicks
// stack concurrent ripples, each removed when its animation ends. Keyboard
// activation (Enter/Space) fires a ripple from the button center. With reduced
// motion, the expanding circle is skipped in favor of a brief background flash.
export default function RippleButton({
  children = 'Click me',
  color = '#6366f1',
  rippleColor = 'rgba(255, 255, 255, 0.45)',
  duration = 600,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const idRef = useRef(0);
  const [ripples, setRipples] = useState([]);
  const [flash, setFlash] = useState(false);

  // A ripple's diameter must cover the whole button from the press point, so we
  // size it to twice the distance to the farthest corner.
  const spawnRipple = (clientX, clientY) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const farthestX = Math.max(x, rect.width - x);
    const farthestY = Math.max(y, rect.height - y);
    const size = Math.hypot(farthestX, farthestY) * 2;
    const id = idRef.current++;
    setRipples(current => [...current, { id, x, y, size }]);
  };

  const triggerFlash = () => {
    setFlash(true);
    window.setTimeout(() => setFlash(false), 200);
  };

  const handlePointerDown = event => {
    if (disabled) return;
    if (prefersReduced) {
      triggerFlash();
      return;
    }
    spawnRipple(event.clientX, event.clientY);
  };

  const handleKeyDown = event => {
    if (disabled) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.repeat) return;
    if (prefersReduced) {
      triggerFlash();
      return;
    }
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    spawnRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const removeRipple = id => {
    setRipples(current => current.filter(ripple => ripple.id !== id));
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={join(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full border-none px-7 py-[0.85rem] text-base font-semibold leading-none text-white outline-none transition-transform duration-[120ms] ease-out [isolation:isolate] [-webkit-tap-highlight-color:transparent] [box-shadow:0_10px_30px_-12px_rgba(0,0,0,0.6)] focus-visible:[box-shadow:0_10px_30px_-12px_rgba(0,0,0,0.6),0_0_0_3px_rgba(255,255,255,0.85)] disabled:cursor-not-allowed disabled:opacity-50 motion-safe:active:[&:not(:disabled)]:scale-[0.97]',
        className
      )}
      style={{ background: color }}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      {...rest}
    >
      <span className="relative z-[1]">{children}</span>
      {flash && (
        <motion.span
          className="pointer-events-none absolute inset-0 z-0 bg-white/20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}
      <span className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full will-change-[transform,opacity]"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                backgroundColor: rippleColor
              }}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration / 1000, ease: 'easeOut' }}
              onAnimationComplete={() => removeRipple(ripple.id)}
            />
          ))}
        </AnimatePresence>
      </span>
    </button>
  );
}
