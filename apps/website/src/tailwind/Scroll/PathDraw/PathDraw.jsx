import { useRef } from 'react';
import { motion, useScroll, useMotionTemplate, useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Built-in path shapes, each authored on the same 0 0 100 100 viewBox so stroke
// width and the riding dot read consistently whichever preset is chosen.
const SHAPES = {
  wave: 'M 4 50 C 20 12, 36 88, 52 50 S 84 12, 96 50',
  spiral: 'M 76 26 C 50 8, 22 32, 26 54 S 50 78, 62 64 S 60 40, 48 42 S 44 56, 50 54',
  route: 'M 10 88 L 10 58 Q 10 46 22 46 L 52 46 Q 64 46 64 34 L 64 12'
};

// The riding marker. It rides the drawn frontier via a CSS motion path: the same
// `d` is used as the offset path and the shared scroll progress drives
// offsetDistance, so the dot sits exactly at the stroke head as it draws.
function PathHeadDot({ d, progress, color, dotRadius, reduce }) {
  const offsetDistance = useMotionTemplate`${progress}`;
  return (
    <motion.circle
      r={dotRadius}
      fill={color}
      style={{
        offsetPath: `path('${d}')`,
        offsetRotate: '0deg',
        offsetDistance: reduce ? '100%' : offsetDistance
      }}
    />
  );
}

// An SVG path that draws itself as you scroll. The component owns an internal
// scroll container: a tall inner track supplies the scroll distance while a
// sticky stage pins the SVG, so the effect works anywhere without a page-level
// scroll rig. motion animates `pathLength` directly from the container's scroll
// progress; a marker rides the drawn frontier via a CSS motion path. Reduced-motion
// users get the fully drawn path with the dot parked at the end.
export default function PathDraw({
  shape = 'wave',
  d,
  color = '#5227FF',
  strokeWidth = 3,
  showDot = true,
  dotRadius = 4,
  height = 460,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });
  const path = d ?? SHAPES[shape] ?? SHAPES.wave;

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative mx-auto w-full max-w-[560px] overflow-x-hidden overflow-y-auto rounded-[18px] outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5227FF]',
        className
      )}
      style={{ height, ...rest.style }}
      tabIndex={0}
    >
      <div className="relative h-[280%] w-full">
        <div
          className="sticky top-0 box-border flex items-center justify-center overflow-hidden p-8"
          style={{ height }}
        >
          <svg
            className="block h-full max-h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Path that draws itself on scroll"
          >
            <path
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d={path}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength: reduce ? 1 : scrollYProgress }}
            />
            {showDot && (
              <PathHeadDot d={path} progress={scrollYProgress} color={color} dotRadius={dotRadius} reduce={reduce} />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
