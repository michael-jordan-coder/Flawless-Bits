import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './RangeSlider.css';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const join = (...classes) => classes.filter(Boolean).join(' ');

const snapToStep = (value, min, step) => (step <= 0 ? value : min + Math.round((value - min) / step) * step);

const decimalsOf = step => {
  const s = String(step);
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
};

// Dual-handle range selector. Each thumb is an independent slider that can't
// cross the other (a minimum gap keeps them apart), the fill highlights the
// selected span, and a value tooltip springs up over whichever thumb you grab.
// Inspired by the draggable price-range filters documented on designspells.com.
export default function RangeSlider({
  defaultMin = 30,
  defaultMax = 70,
  min = 0,
  max = 100,
  step = 1,
  minGap = 1,
  width = 320,
  accentColor = '#6366f1',
  trackColor = 'rgba(255, 255, 255, 0.12)',
  label = 'Price range',
  valuePrefix = '$',
  valueSuffix = '',
  showValue = true,
  showTooltip = true,
  onChange,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const trackRef = useRef(null);
  const draggingRef = useRef(null);

  const [low, setLow] = useState(() => clamp(snapToStep(defaultMin, min, step), min, max - minGap));
  const [high, setHigh] = useState(() => clamp(snapToStep(defaultMax, min, step), low + minGap, max));
  const [active, setActive] = useState(null);
  const [focused, setFocused] = useState(null);

  const lowRef = useRef(low);
  const highRef = useRef(high);
  lowRef.current = low;
  highRef.current = high;

  const decimals = Math.max(decimalsOf(step), decimalsOf(min));
  const format = v => `${valuePrefix}${Number(v.toFixed(decimals))}${valueSuffix}`;
  const lowPct = ((low - min) / (max - min)) * 100;
  const highPct = ((high - min) / (max - min)) * 100;

  const commit = (thumb, raw) => {
    const snapped = snapToStep(raw, min, step);
    if (thumb === 'low') {
      const next = clamp(snapped, min, highRef.current - minGap);
      if (next !== lowRef.current) {
        setLow(next);
        onChange?.({ min: next, max: highRef.current });
      }
    } else {
      const next = clamp(snapped, lowRef.current + minGap, max);
      if (next !== highRef.current) {
        setHigh(next);
        onChange?.({ min: lowRef.current, max: next });
      }
    }
  };

  const valueFromClientX = clientX => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return min + ratio * (max - min);
  };

  const beginDrag = (thumb, e) => {
    draggingRef.current = thumb;
    setActive(thumb);
    trackRef.current.setPointerCapture?.(e.pointerId);
    commit(thumb, valueFromClientX(e.clientX));
  };

  const handleTrackPointerDown = e => {
    const raw = valueFromClientX(e.clientX);
    const thumb =
      raw <= low ? 'low' : raw >= high ? 'high' : Math.abs(raw - low) <= Math.abs(raw - high) ? 'low' : 'high';
    beginDrag(thumb, e);
  };

  const handleThumbPointerDown = thumb => e => {
    e.stopPropagation();
    beginDrag(thumb, e);
  };

  const handlePointerMove = e => {
    if (draggingRef.current) commit(draggingRef.current, valueFromClientX(e.clientX));
  };

  const endDrag = () => {
    draggingRef.current = null;
    setActive(null);
  };

  const handleThumbKeyDown = thumb => e => {
    const current = thumb === 'low' ? low : high;
    let next = current;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = current + step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = current - step;
    else if (e.key === 'PageUp') next = current + step * 10;
    else if (e.key === 'PageDown') next = current - step * 10;
    else if (e.key === 'Home') next = thumb === 'low' ? min : low + minGap;
    else if (e.key === 'End') next = thumb === 'low' ? high - minGap : max;
    else return;
    e.preventDefault();
    commit(thumb, next);
  };

  // Drop any in-flight drag if the component unmounts mid-gesture.
  useEffect(
    () => () => {
      draggingRef.current = null;
    },
    []
  );

  const renderThumb = thumb => {
    const value = thumb === 'low' ? low : high;
    const pct = thumb === 'low' ? lowPct : highPct;
    const isActive = active === thumb || focused === thumb;
    const tooltipVisible = showTooltip && isActive;
    return (
      <motion.div
        className="range-slider-handle"
        role="slider"
        tabIndex={0}
        aria-label={`${label || 'Range'} ${thumb === 'low' ? 'minimum' : 'maximum'}`}
        aria-valuemin={thumb === 'low' ? min : low + minGap}
        aria-valuemax={thumb === 'low' ? high - minGap : max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        onPointerDown={handleThumbPointerDown(thumb)}
        onKeyDown={handleThumbKeyDown(thumb)}
        onFocus={() => setFocused(thumb)}
        onBlur={() => setFocused(prev => (prev === thumb ? null : prev))}
        animate={{ scale: active === thumb ? 1.15 : 1 }}
        transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }}
        style={{ left: `${pct}%`, y: '-50%', borderColor: accentColor, zIndex: isActive ? 2 : 1 }}
      >
        <AnimatePresence>
          {tooltipVisible && (
            <motion.span
              className="range-slider-tooltip"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.9 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.9 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
              style={{ x: '-50%', background: accentColor }}
            >
              {format(value)}
              <span className="range-slider-tooltip-arrow" style={{ background: accentColor }} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className={join('range-slider-root', className)} style={{ width }} {...rest}>
      {(label || showValue) && (
        <div className="range-slider-header">
          {label && <span className="range-slider-label">{label}</span>}
          {showValue && (
            <span className="range-slider-value" style={{ color: accentColor }}>
              {format(low)} – {format(high)}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className="range-slider-track-area"
        style={{ width }}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <div className="range-slider-bar" style={{ background: trackColor }}>
          <div
            className="range-slider-fill"
            style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%`, background: accentColor }}
          />
        </div>

        {renderThumb('low')}
        {renderThumb('high')}
      </div>
    </div>
  );
}
