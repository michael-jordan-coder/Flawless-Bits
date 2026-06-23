import { useEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface ArcCarouselItem {
  id?: string | number;
  image: string;
  title?: string;
  subtitle?: string;
}

// A native scroll-snap swipe carousel with an "arc / fanned hand" feel. The card
// snapped to the centre peaks at full height and full opacity while its neighbours
// sink and fan-rotate outward in proportion to their distance from the viewport
// centre, so the row splays along a concave arc. The distortion is scroll-linked:
// a single rAF-throttled handler reads each card's offset from the scroller's
// mid-line on every scroll/resize and writes the transform straight to the DOM, so
// it tracks finger, trackpad and scrollbar exactly. Reduced motion drops the
// scroll-linked transform — cards stay level and it degrades to a plain peek carousel.
export interface ArcCarouselProps extends HTMLAttributes<HTMLDivElement> {
  items?: ArcCarouselItem[];
  cardWidth?: number;
  gap?: number;
  height?: number;
  dip?: number;
  rotateAmount?: number;
  dimAmount?: number;
  className?: string;
}

export default function ArcCarousel({
  items = [],
  cardWidth = 76,
  gap = 16,
  height = 380,
  dip = 56,
  rotateAmount = 9,
  dimAmount = 0.3,
  className = '',
  ...rest
}: ArcCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = !!useReducedMotion();

  slotRefs.current = slotRefs.current.slice(0, items.length);
  frameRefs.current = frameRefs.current.slice(0, items.length);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || reduce) return undefined;
    let raf = 0;
    const update = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      for (let i = 0; i < slotRefs.current.length; i++) {
        const slot = slotRefs.current[i];
        const frame = frameRefs.current[i];
        if (!slot || !frame) continue;
        const slotMid = slot.offsetLeft + slot.offsetWidth / 2;
        const n = Math.min(Math.abs(slotMid - mid) / slot.offsetWidth, 1);
        const dir = slotMid < mid ? -1 : 1;
        frame.style.transform = `translateY(${(n * dip).toFixed(2)}px) rotate(${(dir * n * rotateAmount).toFixed(3)}deg)`;
        frame.style.opacity = (1 - n * dimAmount).toFixed(4);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduce, items.length, dip, rotateAmount, dimAmount, cardWidth, gap]);

  const peek = Math.max(0, (100 - cardWidth) / 2);
  const style = {
    '--arc-carousel-gap': `${gap}px`,
    '--arc-carousel-card': `${cardWidth}%`,
    '--arc-carousel-peek': `${peek}%`,
    '--arc-carousel-height': `${height}px`,
    ...rest.style
  } as CSSProperties;

  return (
    <div {...rest} className={join('relative mx-auto w-full max-w-[760px]', className)} style={style}>
      <div
        ref={scrollerRef}
        className="box-border flex h-[var(--arc-carousel-height)] items-start gap-[var(--arc-carousel-gap)] overflow-x-auto overflow-y-hidden px-[var(--arc-carousel-peek)] pt-5 pb-[76px] [-ms-overflow-style:none] [overscroll-behavior-x:contain] [scroll-behavior:smooth] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:[scroll-behavior:auto]"
      >
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            ref={el => {
              slotRefs.current[i] = el;
            }}
            className="flex h-full shrink-0 basis-[var(--arc-carousel-card)] items-center [scroll-snap-align:center]"
          >
            <div
              ref={el => {
                frameRefs.current[i] = el;
              }}
              className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#141417] [box-shadow:0_22px_48px_-24px_rgba(0,0,0,0.7)] [transform-origin:center_bottom] [will-change:transform,opacity] motion-reduce:!opacity-100 motion-reduce:!transform-none"
            >
              <img
                className="block h-full w-full select-none object-cover [-webkit-user-drag:none]"
                src={item.image}
                alt={item.title ?? ''}
                draggable={false}
                loading="lazy"
              />
              <div
                className="pointer-events-none absolute inset-0 [background:linear-gradient(to_top,rgba(7,7,9,0.78)_0%,rgba(7,7,9,0.12)_42%,transparent_70%)]"
                aria-hidden="true"
              />
              {(item.title || item.subtitle) && (
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-[22px] py-5 text-[#fafafa]">
                  {item.title && (
                    <span className="text-[18px] font-semibold leading-[1.2] tracking-[-0.01em]">{item.title}</span>
                  )}
                  {item.subtitle && <span className="text-[13px] text-[#fafafa]/[0.72]">{item.subtitle}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
