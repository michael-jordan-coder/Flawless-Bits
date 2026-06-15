import { motion } from 'motion/react';
import './RainbowButton.css';

// Conic rainbow whose start angle is driven by the animated --rb-angle variable.
const RAINBOW =
  'conic-gradient(from var(--rb-angle, 0deg), #ff0080, #ff8c00, #ffe600, #00ff8c, #00b3ff, #8c00ff, #ff0080)';

const join = (...classes) => classes.filter(Boolean).join(' ');

export default function RainbowButton({
  children = 'Get started',
  speed = 3000,
  blur = 14,
  borderWidth = 2,
  radius = 14,
  className = '',
  ...rest
}) {
  const spin = { animate: { '--rb-angle': '360deg' }, transition: { duration: Math.max(0, speed) / 1000, ease: 'linear', repeat: Infinity } };

  return (
    <button type="button" className={join('rainbow-button', className)} style={{ borderRadius: radius }} {...rest}>
      <motion.span
        aria-hidden
        className="rainbow-button__layer rainbow-button__glow"
        style={{ background: RAINBOW, filter: `blur(${blur}px)`, borderRadius: radius }}
        {...spin}
      />
      <motion.span
        aria-hidden
        className="rainbow-button__layer rainbow-button__ring"
        style={{ background: RAINBOW, borderRadius: radius }}
        {...spin}
      />
      <span className="rainbow-button__face" style={{ inset: borderWidth, borderRadius: Math.max(0, radius - borderWidth) }} />
      <span className="rainbow-button__label">{children}</span>
    </button>
  );
}
