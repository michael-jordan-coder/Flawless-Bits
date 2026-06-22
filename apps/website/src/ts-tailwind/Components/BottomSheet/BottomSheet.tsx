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
  <ul className="m-0 flex list-none flex-col gap-[0.15rem] p-0">
    {['Share link', 'Add to favorites', 'Duplicate', 'Move to folder', 'Archive'].map(item => (
      <li
        key={item}
        className="rounded-[10px] px-3 py-[0.7rem] text-[0.9rem] text-[#d4d4d8] transition-colors duration-[120ms] ease-out hover:bg-white/5"
      >
        {item}
      </li>
    ))}
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
    <div
      className={join(
        'relative w-full overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#131318] text-[#f4f4f5] [font-family:inherit]',
        className
      )}
      style={{ height }}
      {...rest}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          ref={triggerRef}
          type="button"
          className="inline-flex cursor-pointer items-center gap-2 rounded-[12px] border border-white/[0.12] bg-[#1f1f27] px-[1.1rem] py-[0.7rem] text-[0.9rem] font-semibold tracking-[-0.01em] text-[#f4f4f5] transition-colors duration-[120ms] ease-out hover:border-white/20 hover:bg-[#26262f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366f1] [font-family:inherit]"
          onClick={() => setOpen(true)}
        >
          <ChevronUp size={16} strokeWidth={2} aria-hidden="true" />
          {triggerLabel}
        </button>
      </div>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {open && (
          <>
            {backdrop && (
              <motion.div
                className="absolute inset-0 z-[1] cursor-pointer bg-[rgba(8,8,11,0.62)]"
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
              className="absolute inset-x-0 bottom-0 z-[2] flex flex-col rounded-t-[18px] bg-[#1a1a21] shadow-[0_-16px_40px_rgba(0,0,0,0.45)] outline-none [touch-action:none] [will-change:transform]"
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
                className="flex w-full cursor-grab items-center justify-center border-none bg-transparent pb-[0.4rem] pt-[0.7rem] active:cursor-grabbing focus-visible:rounded-[12px] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#6366f1]"
                aria-label="Drag handle. Use arrow up and down to change height, escape to close."
                onKeyDown={handleHandleKeyDown}
              >
                <span className="h-[5px] w-[38px] rounded-full bg-white/[0.22]" aria-hidden="true" />
              </button>

              <header className="px-5 pb-[0.6rem] pt-[0.2rem]">
                <h2 id={labelId} className="m-0 text-[1.05rem] font-semibold leading-[1.15] tracking-[-0.02em]">
                  {title}
                </h2>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-[0.4rem]">{children ?? DEFAULT_CONTENT}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
