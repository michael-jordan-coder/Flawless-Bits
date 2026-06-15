import { useId, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './OtpInput.css';

const DEFAULT_ACCENT = '#6366f1';

export interface OtpInputProps {
  length?: number;
  accentColor?: string;
  mask?: boolean;
  onComplete?: (code: string) => void;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export default function OtpInput({
  length = 6,
  accentColor = DEFAULT_ACCENT,
  mask = false,
  onComplete,
  className = ''
}: OtpInputProps) {
  const ringId = useId();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [values, setValues] = useState<string[]>(() => Array.from({ length }, () => ''));
  const [focusIndex, setFocusIndex] = useState(-1);
  const complete = values.every(Boolean);

  const focusCell = (i: number) => inputs.current[i]?.focus();

  const commit = (next: string[]) => {
    setValues(next);
    if (next.every(Boolean)) onComplete?.(next.join(''));
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const next = [...values];
    if (!raw) {
      next[i] = '';
      commit(next);
      return;
    }
    next[i] = raw[raw.length - 1];
    commit(next);
    if (i < length - 1) focusCell(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const next = [...values];
      if (values[i]) {
        next[i] = '';
        commit(next);
      } else if (i > 0) {
        next[i - 1] = '';
        commit(next);
        focusCell(i - 1);
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focusCell(i - 1);
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      focusCell(i + 1);
    }
  };

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocusIndex(-1);
  };

  return (
    <div className={join('otp-input', className)} onBlur={handleContainerBlur}>
      {values.map((value, i) => {
        const isFocused = focusIndex === i;
        const borderColor = complete || isFocused ? accentColor : undefined;
        return (
          <div className="otp-input__cell" key={i}>
            <input
              ref={el => {
                inputs.current[i] = el;
              }}
              className="otp-input__field"
              style={borderColor ? { borderColor } : undefined}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={value}
              aria-label={`Digit ${i + 1}`}
              onChange={e => handleChange(i, e)}
              onKeyDown={e => handleKeyDown(i, e)}
              onFocus={() => setFocusIndex(i)}
            />
            {isFocused && (
              <motion.span
                layoutId={`${ringId}-ring`}
                aria-hidden
                className="otp-input__ring"
                style={{ borderColor: accentColor }}
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            {value ? (
              <motion.span
                key={value}
                className="otp-input__glyph"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 18 }}
              >
                {mask ? '•' : value}
              </motion.span>
            ) : (
              isFocused && (
                <span className="otp-input__glyph">
                  <motion.span
                    className="otp-input__caret"
                    style={{ backgroundColor: accentColor }}
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </span>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
