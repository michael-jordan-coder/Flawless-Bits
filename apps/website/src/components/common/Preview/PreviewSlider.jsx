import { useCallback, useEffect, useRef, useState } from 'react';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const stepDecimals = step => {
  const s = step.toString();
  const dot = s.indexOf('.');
  return dot === -1 ? 0 : s.length - dot - 1;
};
const roundToStep = (val, step, min) => {
  const raw = Math.round((val - min) / step) * step + min;
  const decimals = Math.max(stepDecimals(step), stepDecimals(min));
  return Number(raw.toFixed(decimals));
};

const PreviewSlider = ({
  title = '',
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  valueUnit = '',
  isDisabled = false,
  displayValue,
  onChange
}) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const range = max - min;
  const percentage = range > 0 ? ((value - min) / range) * 100 : 0;

  const computeValue = useCallback(
    clientX => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      const raw = min + ratio * range;
      return clamp(roundToStep(raw, step, min), min, max);
    },
    [min, max, step, range, value]
  );

  const handlePointerDown = useCallback(
    e => {
      if (isDisabled) return;
      e.preventDefault();
      trackRef.current?.setPointerCapture(e.pointerId);
      setIsDragging(true);
      onChange?.(computeValue(e.clientX));
    },
    [computeValue, onChange, isDisabled]
  );

  const handlePointerMove = useCallback(
    e => {
      if (!isDragging) return;
      onChange?.(computeValue(e.clientX));
    },
    [isDragging, computeValue, onChange]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return undefined;
    return () => setIsDragging(false);
  }, [isDragging]);

  const handleKeyDown = useCallback(
    e => {
      if (isDisabled) return;
      let next;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          next = value + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          next = value - step;
          break;
        case 'Home':
          next = min;
          break;
        case 'End':
          next = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      onChange?.(clamp(roundToStep(next, step, min), min, max));
    },
    [value, step, min, max, onChange, isDisabled]
  );

  const decimals = stepDecimals(step);
  const formattedValue = displayValue ? displayValue(value) : `${Number(value.toFixed(decimals))}${valueUnit}`;

  return (
    <div className="scrubber">
      <div
        className="scrubber-track"
        ref={trackRef}
        role="slider"
        aria-label={title}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <div className="scrubber-fill" style={{ width: `${percentage}%` }} />
        <span className="scrubber-label">{title}</span>
        <span className="scrubber-value">{formattedValue}</span>
      </div>
    </div>
  );
};

export default PreviewSlider;
