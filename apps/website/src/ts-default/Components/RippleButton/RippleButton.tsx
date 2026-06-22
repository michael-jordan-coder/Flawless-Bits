import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type CSSProperties
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import './RippleButton.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

// A flat-filled pill button that emits a Material-style ripple from the exact
// pointer-down coordinates, expanding and fading as it goes. Multiple clicks
// stack concurrent ripples, each removed when its animation ends. Keyboard
// activation (Enter/Space) fires a ripple from the button center. With reduced
// motion, the expanding circle is skipped in favor of a brief background flash.
export interface RippleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  children?: ReactNode;
  color?: string;
  rippleColor?: string;
  duration?: number;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function RippleButton({
  children = 'Click me',
  color = '#6366f1',
  rippleColor = 'rgba(255, 255, 255, 0.45)',
  duration = 600,
  disabled = false,
  onClick,
  className = '',
  ...rest
}: RippleButtonProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const idRef = useRef(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [flash, setFlash] = useState(false);

  // A ripple's diameter must cover the whole button from the press point, so we
  // size it to twice the distance to the farthest corner.
  const spawnRipple = (clientX: number, clientY: number) => {
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

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (prefersReduced) {
      triggerFlash();
      return;
    }
    spawnRipple(event.clientX, event.clientY);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
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

  const removeRipple = (id: number) => {
    setRipples(current => current.filter(ripple => ripple.id !== id));
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={join('ripple-button', flash && 'is-flashing', className)}
      style={{ '--ripple-button-bg': color } as CSSProperties}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      {...rest}
    >
      <span className="ripple-button__label">{children}</span>
      <span className="ripple-button__ripples" aria-hidden="true">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              className="ripple-button__ripple"
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
