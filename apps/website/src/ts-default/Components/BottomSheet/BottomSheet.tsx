import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo
} from 'motion/react';
import { ChevronUp } from 'lucide-react';
import './BottomSheet.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface SnapModel {
  fractions: number[];
  offsets: number[];
  sheetHeight: number;
}

// Distance (px) and velocity (px/s) past which a downward drag dismisses the sheet.
const DISMISS_DISTANCE = 90;
const DISMISS_VELOCITY = 700;

const DEFAULT_CONTENT = (
  <ul className="bottom-sheet-list">
    <li>Share link</li>
    <li>Add to favorites</li>
    <li>Duplicate</li>
    <li>Move to folder</li>
    <li>Archive</li>
  </ul>
);

// Sort snap points ascending and translate them into resting Y offsets, where a
// taller fraction sits higher (smaller offset). offsets[0] is the tallest rest.
function buildSnapModel(snapPoints: number[], stageHeight: number): SnapModel {
  const fractions = [...snapPoints].map(f => clamp(f, 0.1, 1)).sort((a, b) => b - a);
  const offsets = fractions.map(f => stageHeight * (1 - f));
  return { fractions, offsets, sheetHeight: stageHeight * fractions[0] };
}

// Nearest snap offset to `y`, biased by drag velocity so a flick overshoots toward
// the direction of travel before settling.
function resolveSnap(y: number, velocity: number, offsets: number[]): number {
  const projected = y + velocity * 0.12;
  let nearest = offsets[0];
  let best = Infinity;
  for (const offset of offsets) {
    const dist = Math.abs(projected - offset);
    if (dist < best) {
      best = dist;
      nearest = offset;
    }
  }
  return nearest;
}

export interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title?: string;
  snapPoints?: number[];
  height?: number;
  backdrop?: boolean;
  triggerLabel?: string;
  children?: ReactNode;
  className?: string;
}

export default function BottomSheet({
  title = 'Quick actions',
  snapPoints = [0.5, 0.92],
  height = 460,
  backdrop = true,
  triggerLabel = 'Open sheet',
  children,
  className = '',
  ...rest
}: BottomSheetProps) {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(height);
  const labelId = useId();

  const { offsets, sheetHeight } = useMemo(() => buildSnapModel(snapPoints, height), [snapPoints, height]);
  const [snapIndex, setSnapIndex] = useState(0);

  const spring = useMemo(
    () => (prefersReduced ? { duration: 0 } : ({ type: 'spring', stiffness: 420, damping: 40 } as const)),
    [prefersReduced]
  );

  const settle = useCallback(
    (target: number) => {
      animate(y, target, spring);
    },
    [y, spring]
  );

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  // Animate up to the lowest (default) snap point on open; reset position on unmount.
  useEffect(() => {
    if (!open) return;
    const target = offsets[offsets.length - 1];
    setSnapIndex(offsets.length - 1);
    y.set(prefersReduced ? target : height);
    if (!prefersReduced) settle(target);
    sheetRef.current?.focus();
  }, [open, offsets, height, prefersReduced, settle, y]);

  // Return focus to the trigger after the sheet leaves.
  const handleExitComplete = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const handleDragEnd = useCallback(
    (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      const pos = y.get();
      const velocity = info.velocity.y;
      const lowest = offsets[offsets.length - 1];
      if (pos - lowest > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) {
        close();
        return;
      }
      const target = resolveSnap(pos, velocity, offsets);
      setSnapIndex(offsets.indexOf(target));
      settle(target);
    },
    [y, offsets, close, settle]
  );

  const cycleSnap = useCallback(
    (direction: number) => {
      const next = clamp(snapIndex - direction, 0, offsets.length - 1);
      setSnapIndex(next);
      settle(offsets[next]);
    },
    [snapIndex, offsets, settle]
  );

  const handleSheetKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    },
    [close]
  );

  const handleHandleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        cycleSnap(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        cycleSnap(-1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        close();
      }
    },
    [cycleSnap, close]
  );

  return (
    <div className={join('bottom-sheet-stage', className)} style={{ height }} {...rest}>
      <div className="bottom-sheet-trigger-wrap">
        <button ref={triggerRef} type="button" className="bottom-sheet-trigger" onClick={() => setOpen(true)}>
          <ChevronUp size={16} strokeWidth={2} aria-hidden="true" />
          {triggerLabel}
        </button>
      </div>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {open && (
          <>
            {backdrop && (
              <motion.div
                className="bottom-sheet-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={prefersReduced ? { duration: 0 } : { duration: 0.2 }}
                onClick={close}
                aria-hidden="true"
              />
            )}

            <motion.div
              ref={sheetRef}
              className="bottom-sheet-panel"
              style={{ y, height: sheetHeight }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={labelId}
              tabIndex={-1}
              drag="y"
              dragConstraints={{ top: 0, bottom: height }}
              dragElastic={{ top: 0.04, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              initial={prefersReduced ? false : { y: height }}
              exit={prefersReduced ? { y: height, transition: { duration: 0 } } : { y: height }}
              transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 40 }}
              onKeyDown={handleSheetKeyDown}
            >
              <button
                type="button"
                className="bottom-sheet-handle"
                aria-label="Drag handle. Use arrow up and down to change height, escape to close."
                onKeyDown={handleHandleKeyDown}
              >
                <span className="bottom-sheet-handle-bar" aria-hidden="true" />
              </button>

              <header className="bottom-sheet-header">
                <h2 id={labelId} className="bottom-sheet-title">
                  {title}
                </h2>
              </header>

              <div className="bottom-sheet-body">{children ?? DEFAULT_CONTENT}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
