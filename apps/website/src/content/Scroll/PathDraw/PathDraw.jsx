import { useRef } from 'react';
import { motion, useScroll, useMotionTemplate, useReducedMotion } from 'motion/react';
import './PathDraw.css';

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
    <div {...rest} ref={ref} className={join('path-draw', className)} style={{ height, ...rest.style }} tabIndex={0}>
      <div className="path-draw-track">
        <div className="path-draw-stage" style={{ height }}>
          <svg
            className="path-draw-svg"
            viewBox="0 0 100 100"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Path that draws itself on scroll"
          >
            <path
              className="path-draw-rail"
              d={path}
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
