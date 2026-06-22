import { useEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import './FocusCarousel.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface FocusCarouselItem {
  id?: string | number;
  image: string;
  title?: string;
  subtitle?: string;
}

// A native scroll-snap swipe carousel with a "camera rack focus" feel. The card
// snapped to the centre sits razor-sharp and fully saturated while its neighbours
// blur, desaturate and dim in proportion to their distance from the viewport
// centre — like the depth of field racking past them. The distortion is
// scroll-linked: a single rAF-throttled handler reads each card's offset from the
// scroller's mid-line on every scroll/resize and writes the filter straight to
// the DOM, so it tracks finger, trackpad and scrollbar exactly. Reduced motion
// drops the scroll-linked filter — cards stay sharp and it degrades to a plain
// peek carousel.
export interface FocusCarouselProps extends HTMLAttributes<HTMLDivElement> {
  items?: FocusCarouselItem[];
  cardWidth?: number;
  gap?: number;
  height?: number;
  blurAmount?: number;
  dimAmount?: number;
  className?: string;
}

export default function FocusCarousel({
  items = [],
  cardWidth = 76,
  gap = 16,
  height = 360,
  blurAmount = 6,
  dimAmount = 0.45,
  className = '',
  ...rest
}: FocusCarouselProps) {
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
        frame.style.filter = `blur(${(n * blurAmount).toFixed(2)}px) saturate(${(1 - n * 0.4).toFixed(3)})`;
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
  }, [reduce, items.length, blurAmount, dimAmount, cardWidth, gap]);

  const peek = Math.max(0, (100 - cardWidth) / 2);
  const style = {
    '--focus-carousel-gap': `${gap}px`,
    '--focus-carousel-card': `${cardWidth}%`,
    '--focus-carousel-peek': `${peek}%`,
    '--focus-carousel-height': `${height}px`,
    ...rest.style
  } as CSSProperties;

  return (
    <div {...rest} className={join('focus-carousel', className)} style={style}>
      <div ref={scrollerRef} className="focus-carousel-scroller">
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            ref={el => {
              slotRefs.current[i] = el;
            }}
            className="focus-carousel-slot"
          >
            <div
              ref={el => {
                frameRefs.current[i] = el;
              }}
              className="focus-carousel-frame"
            >
              <img
                className="focus-carousel-image"
                src={item.image}
                alt={item.title ?? ''}
                draggable={false}
                loading="lazy"
              />
              <div className="focus-carousel-scrim" aria-hidden="true" />
              {(item.title || item.subtitle) && (
                <div className="focus-carousel-caption">
                  {item.title && <span className="focus-carousel-title">{item.title}</span>}
                  {item.subtitle && <span className="focus-carousel-subtitle">{item.subtitle}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
