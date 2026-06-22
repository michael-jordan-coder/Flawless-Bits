import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './HorizontalScroll.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface HorizontalScrollItem {
  title: string;
  subtitle?: string;
  accent: string;
}

export interface HorizontalScrollProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items?: HorizontalScrollItem[];
  cardWidth?: number;
  gap?: number;
  height?: number;
  className?: string;
}

const DEFAULT_ITEMS: HorizontalScrollItem[] = [
  { title: 'Discover', subtitle: 'Find the thread worth pulling.', accent: '#5227FF' },
  { title: 'Shape', subtitle: 'Turn the spark into a plan.', accent: '#0EA5E9' },
  { title: 'Make', subtitle: 'Build it small, build it real.', accent: '#10B981' },
  { title: 'Polish', subtitle: 'Sand the edges until it glides.', accent: '#F59E0B' },
  { title: 'Launch', subtitle: 'Put it in front of real people.', accent: '#EF4444' },
  { title: 'Learn', subtitle: 'Watch, listen, and iterate.', accent: '#A855F7' }
];

// A self-contained section that converts vertical scroll into horizontal
// movement: a sticky viewport holds a card track that pans left as you scroll
// the panel, driven by the container's scroll progress. The spacer below sets
// the scroll distance so 1px of vertical scroll maps to 1px of pan. Inspired by
// the vertical-to-horizontal scroll galleries catalogued on designspells.
// Reduced-motion users get a normal horizontally-scrollable row instead.
export default function HorizontalScroll({
  items = DEFAULT_ITEMS,
  cardWidth = 280,
  gap = 20,
  height = 420,
  className = '',
  ...rest
}: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const [maxX, setMaxX] = useState(0);
  const { scrollYProgress } = useScroll({ container: ref });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  useEffect(() => {
    const container = ref.current;
    const track = trackRef.current;
    if (!container || !track) return undefined;
    const measure = () => setMaxX(Math.max(0, track.scrollWidth - container.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(track);
    return () => ro.disconnect();
  }, [items, cardWidth, gap]);

  const cards = items.map((item, i) => (
    <div
      className="hscroll-card"
      key={i}
      style={{ width: cardWidth, '--hscroll-accent': item.accent } as CSSProperties}
    >
      <span className="hscroll-index">{String(i + 1).padStart(2, '0')}</span>
      <div className="hscroll-card-body">
        <h3 className="hscroll-title">{item.title}</h3>
        {item.subtitle != null && <p className="hscroll-subtitle">{item.subtitle}</p>}
      </div>
    </div>
  ));

  return (
    <div
      {...rest}
      ref={ref}
      className={join('hscroll', reduce && 'hscroll--reduced', className)}
      style={{ height, ...rest.style }}
    >
      <div className="hscroll-sizer" style={{ height: reduce ? height : height + maxX }}>
        <div className="hscroll-sticky" style={{ height }}>
          <motion.div ref={trackRef} className="hscroll-track" style={{ x: reduce ? 0 : x, gap }}>
            {cards}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
