import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

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
      className="flex flex-shrink-0 flex-col justify-between rounded-2xl px-[26px] py-6 text-white"
      key={i}
      style={{ width: cardWidth, minHeight: 220, background: item.accent }}
    >
      <span className="text-[13px] font-semibold tabular-nums tracking-tight opacity-[0.78]">
        {String(i + 1).padStart(2, '0')}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-2xl font-semibold leading-[1.12] tracking-[-0.02em]">{item.title}</h3>
        {item.subtitle != null && <p className="m-0 text-sm leading-relaxed text-white/80">{item.subtitle}</p>}
      </div>
    </div>
  ));

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative w-full overflow-y-auto overflow-x-hidden rounded-[18px] bg-[#08080c] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <div className="relative w-full" style={{ height: reduce ? height : height + maxX }}>
        <div
          className={join(
            'sticky top-0 flex w-full items-center overflow-hidden',
            reduce && '!relative overflow-x-auto'
          )}
          style={{ height }}
        >
          <motion.div
            ref={trackRef}
            className="flex w-max items-stretch px-6 [will-change:transform]"
            style={{ x: reduce ? 0 : x, gap }}
          >
            {cards}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
