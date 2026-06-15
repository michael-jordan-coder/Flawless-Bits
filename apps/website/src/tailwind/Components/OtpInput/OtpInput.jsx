import { useId, useRef, useState } from 'react';
import { motion } from 'motion/react';

const DEFAULT_ACCENT = '#6366f1';

const join = (...classes) => classes.filter(Boolean).join(' ');

export default function OtpInput({
  length = 6,
  accentColor = DEFAULT_ACCENT,
  mask = false,
  onComplete,
  className = ''
}) {
  const ringId = useId();
  const inputs = useRef([]);
  const [values, setValues] = useState(() => Array.from({ length }, () => ''));
  const [focusIndex, setFocusIndex] = useState(-1);
  const complete = values.every(Boolean);

  const focusCell = i => inputs.current[i]?.focus();

  const commit = next => {
    setValues(next);
    if (next.every(Boolean)) onComplete?.(next.join(''));
  };

  const handleChange = (i, e) => {
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

  const handleKeyDown = (i, e) => {
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

  const handleContainerBlur = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocusIndex(-1);
  };

  return (
    <div className={join('inline-flex gap-2', className)} onBlur={handleContainerBlur}>
      {values.map((value, i) => {
        const isFocused = focusIndex === i;
        const borderColor = complete || isFocused ? accentColor : undefined;
        return (
          <div className="relative h-[3.25rem] w-11" key={i}>
            <input
              ref={el => (inputs.current[i] = el)}
              className="absolute inset-0 h-full w-full rounded-xl border border-white/15 bg-white/[0.03] text-center font-sans text-xl font-semibold text-transparent caret-transparent outline-none transition-colors duration-200"
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
                className="pointer-events-none absolute -inset-0.5 rounded-[0.85rem] border-2"
                style={{ borderColor: accentColor }}
                transition={{ type: 'spring', stiffness: 500, damping: 36 }}
              />
            )}
            {value ? (
              <motion.span
                key={value}
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-xl font-semibold text-white"
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 520, damping: 18 }}
              >
                {mask ? '•' : value}
              </motion.span>
            ) : (
              isFocused && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <motion.span
                    className="h-[1.4rem] w-0.5 rounded-[1px]"
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
