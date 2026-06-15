import { motion, useReducedMotion } from 'motion/react';
import './NumberTicker.css';

const join = (...classes) => classes.filter(Boolean).join(' ');
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const formatValue = (value, decimals, group) => {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: group
  });
};

// One vertical reel of 0–9 that slides to show a single digit.
function Reel({ digit, duration, delay, prefersReduced }) {
  return (
    <span className="number-ticker-reel">
      <motion.span
        className="number-ticker-strip"
        animate={{ y: `-${digit * 10}%` }}
        transition={prefersReduced ? { duration: 0 } : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {DIGITS.map(n => (
          <span key={n} className="number-ticker-cell">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

// A number whose digits roll on vertical reels whenever the value changes, like
// a mechanical odometer. Inspired by the rolling number transitions in the
// Family app documented on designspells.com.
export default function NumberTicker({
  value = 0,
  decimals = 0,
  group = true,
  prefix = '',
  suffix = '',
  duration = 0.9,
  color = '#fafafa',
  fontSize = 64,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const formatted = formatValue(value, decimals, group);
  const chars = formatted.split('');

  return (
    <div
      className={join('number-ticker-root', className)}
      style={{ color, fontSize }}
      role="text"
      aria-label={`${prefix}${formatted}${suffix}`}
      {...rest}
    >
      {prefix && <span className="number-ticker-affix">{prefix}</span>}
      {chars.map((char, i) => {
        // Key by position from the right so trailing digits keep their identity
        // as the number grows, and the rightmost reels lead the roll.
        const posFromRight = chars.length - 1 - i;
        if (/\d/.test(char)) {
          return (
            <Reel
              key={posFromRight}
              digit={Number(char)}
              duration={duration}
              delay={posFromRight * 0.05}
              prefersReduced={prefersReduced}
            />
          );
        }
        return (
          <span key={posFromRight} className="number-ticker-sep">
            {char}
          </span>
        );
      })}
      {suffix && <span className="number-ticker-affix">{suffix}</span>}
    </div>
  );
}
