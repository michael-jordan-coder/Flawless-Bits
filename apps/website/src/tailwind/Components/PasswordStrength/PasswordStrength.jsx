import { useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff, Check } from 'lucide-react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const SEGMENTS = 4;
const LEVELS = [
  { label: 'Weak', color: '#f43f5e' },
  { label: 'Fair', color: '#f59e0b' },
  { label: 'Good', color: '#eab308' },
  { label: 'Strong', color: '#22c55e' }
];

// Build the active criteria list from the enabled rules, then score the password
// by how many criteria pass — length earns a bonus segment once it clears the bar.
const buildCriteria = (value, { minLength, requireUppercase, requireNumber, requireSymbol }) => {
  const criteria = [{ key: 'length', label: `At least ${minLength} characters`, met: value.length >= minLength }];
  if (requireUppercase) criteria.push({ key: 'capital', label: 'Includes a capital letter', met: /[A-Z]/.test(value) });
  if (requireNumber) criteria.push({ key: 'number', label: 'Includes a number', met: /\d/.test(value) });
  if (requireSymbol) criteria.push({ key: 'symbol', label: 'Includes a symbol', met: /[^A-Za-z0-9]/.test(value) });
  return criteria;
};

export default function PasswordStrength({
  minLength = 8,
  requireUppercase = true,
  requireNumber = true,
  requireSymbol = true,
  placeholder = 'Enter a password',
  onChange,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const meterId = useId();
  const statusId = `${meterId}-status`;
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const criteria = useMemo(
    () => buildCriteria(value, { minLength, requireUppercase, requireNumber, requireSymbol }),
    [value, minLength, requireUppercase, requireNumber, requireSymbol]
  );

  const passed = criteria.filter(c => c.met).length;
  const total = criteria.length;
  // Score: fraction of criteria met, capped to the segment count. Empty fields read 0.
  const score = value.length === 0 ? 0 : Math.max(1, Math.round((passed / total) * SEGMENTS));
  const level = score === 0 ? null : LEVELS[score - 1];

  const update = next => {
    setValue(next);
    const c = buildCriteria(next, { minLength, requireUppercase, requireNumber, requireSymbol });
    const p = c.filter(x => x.met).length;
    const s = next.length === 0 ? 0 : Math.max(1, Math.round((p / c.length) * SEGMENTS));
    onChange?.(next, s);
  };

  const barTransition = prefersReduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' };
  const rowSpring = prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 24 };

  return (
    <div className={join('flex w-full max-w-[22rem] flex-col gap-[0.9rem] text-white', className)} {...rest}>
      <div className="relative w-full">
        <input
          className="box-border w-full rounded-xl border-[1.5px] border-white/[0.14] bg-white/5 py-[0.7rem] pl-[0.9rem] pr-[2.6rem] font-[inherit] text-[0.95rem] text-white outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-white/40 focus-visible:border-white/40 focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.1)]"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          aria-label="Password"
          aria-describedby={statusId}
          placeholder={placeholder}
          value={value}
          onChange={e => update(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-[0.55rem] top-1/2 grid h-[1.9rem] w-[1.9rem] -translate-y-1/2 cursor-pointer place-items-center rounded-lg border-none bg-none p-0 text-white/60 outline-none hover:text-white focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0.45)]"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onMouseDown={e => e.preventDefault()}
          onClick={() => setShowPassword(s => !s)}
        >
          {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-[0.4rem]">
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const active = i < score;
            return (
              <div className="relative h-[0.4rem] flex-1 overflow-hidden rounded-full bg-white/[0.08]" key={i}>
                <motion.div
                  className="absolute inset-0 origin-left rounded-full will-change-transform"
                  initial={false}
                  animate={{ scaleX: active ? 1 : 0, backgroundColor: level ? level.color : '#f43f5e' }}
                  transition={barTransition}
                />
              </div>
            );
          })}
        </div>
        <span
          id={statusId}
          className="min-w-[3.2rem] flex-none text-right text-[0.8rem] font-medium"
          aria-live="polite"
          style={{ color: level ? level.color : 'rgba(255, 255, 255, 0.45)' }}
        >
          {level ? level.label : 'Empty'}
        </span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-[0.5rem] p-0">
        {criteria.map(c => (
          <li
            className={join(
              'flex items-center gap-[0.55rem] text-[0.85rem] transition-colors duration-200 ease-out',
              c.met ? 'text-white/85' : 'text-white/50'
            )}
            key={c.key}
          >
            <motion.span
              className="grid h-[1.1rem] w-[1.1rem] flex-none place-items-center rounded-full text-[#22c55e] will-change-transform"
              aria-hidden="true"
              animate={prefersReduced ? {} : { scale: c.met ? [1, 1.25, 1] : 1 }}
              transition={rowSpring}
            >
              {c.met ? <Check size={14} strokeWidth={2.4} /> : <span className="h-[0.35rem] w-[0.35rem] rounded-full bg-white/30" />}
            </motion.span>
            <span
              className={join(
                'transition-[text-decoration-color,opacity] duration-200 ease-out',
                c.met && '[text-decoration:line-through] [text-decoration-color:rgba(255,255,255,0.4)]'
              )}
            >
              {c.label}
            </span>
            <span className="absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap [margin:-1px]">
              {c.met ? ' — met' : ' — not met'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
