import { motion, useReducedMotion } from 'motion/react';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const formatValue = (value: number, decimals: number, group: boolean) => {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: group
  });
};

interface ReelProps {
  digit: number;
  duration: number;
  delay: number;
  prefersReduced: boolean | null;
}

// One vertical reel of 0–9 that slides to show a single digit.
function Reel({ digit, duration, delay, prefersReduced }: ReelProps) {
  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-top">
      <motion.span
        className="flex flex-col will-change-transform"
        animate={{ y: `-${digit * 10}%` }}
        transition={prefersReduced ? { duration: 0 } : { duration, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {DIGITS.map(n => (
          <span key={n} className="flex h-[1em] w-[1ch] items-center justify-center">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export interface NumberTickerProps {
  value?: number;
  decimals?: number;
  group?: boolean;
  prefix?: string;
  suffix?: string;
  duration?: number;
  color?: string;
  fontSize?: number;
  className?: string;
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
}: NumberTickerProps) {
  const prefersReduced = useReducedMotion();
  const formatted = formatValue(value, decimals, group);
  const chars = formatted.split('');

  return (
    <div
      className={join(
        'inline-flex select-none items-center font-bold leading-none tracking-[-0.02em] [font-variant-numeric:tabular-nums]',
        className
      )}
      style={{ color, fontSize }}
      role="text"
      aria-label={`${prefix}${formatted}${suffix}`}
      {...rest}
    >
      {prefix && <span className="inline-flex h-[1em] items-center whitespace-pre opacity-85">{prefix}</span>}
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
          <span key={posFromRight} className="inline-flex h-[1em] items-center justify-center px-[0.02em]">
            {char}
          </span>
        );
      })}
      {suffix && <span className="inline-flex h-[1em] items-center whitespace-pre opacity-85">{suffix}</span>}
    </div>
  );
}
