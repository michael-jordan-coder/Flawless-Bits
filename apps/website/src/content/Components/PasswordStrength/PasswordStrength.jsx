import { useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff, Check } from 'lucide-react';
import './PasswordStrength.css';

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
    <div className={join('password-strength', className)} {...rest}>
      <div className="password-strength__field">
        <input
          className="password-strength__input"
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
          className="password-strength__toggle"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onMouseDown={e => e.preventDefault()}
          onClick={() => setShowPassword(s => !s)}
        >
          {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
        </button>
      </div>

      <div className="password-strength__meter">
        <div className="password-strength__segments">
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const active = i < score;
            return (
              <div className="password-strength__segment" key={i}>
                <motion.div
                  className="password-strength__segment-fill"
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
          className="password-strength__label"
          aria-live="polite"
          style={{ color: level ? level.color : 'rgba(255, 255, 255, 0.45)' }}
        >
          {level ? level.label : 'Empty'}
        </span>
      </div>

      <ul className="password-strength__criteria">
        {criteria.map(c => (
          <li className={join('password-strength__criterion', c.met && 'password-strength__criterion--met')} key={c.key}>
            <motion.span
              className="password-strength__marker"
              aria-hidden="true"
              animate={prefersReduced ? {} : { scale: c.met ? [1, 1.25, 1] : 1 }}
              transition={rowSpring}
            >
              {c.met ? <Check size={14} strokeWidth={2.4} /> : <span className="password-strength__dot" />}
            </motion.span>
            <span className="password-strength__criterion-label">{c.label}</span>
            <span className="password-strength__sr">{c.met ? ' — met' : ' — not met'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
