import { useEffect, useRef, type HTMLAttributes, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import './ScaleCarousel.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface ScaleCarouselItem {
  id?: string | number;
  image: string;
  title?: string;
  subtitle?: string;
}

// A native scroll-snap swipe carousel with a "coverflow scale" feel. The card
// snapped to the centre sits at full scale and full opacity while its neighbours
// shrink and dim in proportion to their distance from the viewport centre. The
// distortion is scroll-linked: a single rAF-throttled handler reads each card's
// offset from the scroller's mid-line on every scroll/resize and writes the
// transform straight to the DOM, so it tracks finger, trackpad and scrollbar
// exactly. Reduced motion drops the scroll-linked transform — cards stay
// full-scale and it degrades to a plain peek carousel.
export interface ScaleCarouselProps extends HTMLAttributes<HTMLDivElement> {
  items?: ScaleCarouselItem[];
  cardWidth?: number;
  gap?: number;
  height?: number;
  scaleAmount?: number;
  dimAmount?: number;
  className?: string;
}

export default function ScaleCarousel({
  items = [],
  cardWidth = 76,
  gap = 16,
  height = 360,
  scaleAmount = 0.16,
  dimAmount = 0.4,
  className = '',
  ...rest
}: ScaleCarouselProps) {
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
        frame.style.transform = `scale(${(1 - n * scaleAmount).toFixed(4)})`;
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
  }, [reduce, items.length, scaleAmount, dimAmount, cardWidth, gap]);

  const peek = Math.max(0, (100 - cardWidth) / 2);
  const style = {
    '--scale-carousel-gap': `${gap}px`,
    '--scale-carousel-card': `${cardWidth}%`,
    '--scale-carousel-peek': `${peek}%`,
    '--scale-carousel-height': `${height}px`,
    ...rest.style
  } as CSSProperties;

  return (
    <div {...rest} className={join('scale-carousel', className)} style={style}>
      <div ref={scrollerRef} className="scale-carousel-scroller">
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            ref={el => {
              slotRefs.current[i] = el;
            }}
            className="scale-carousel-slot"
          >
            <div
              ref={el => {
                frameRefs.current[i] = el;
              }}
              className="scale-carousel-frame"
            >
              <img
                className="scale-carousel-image"
                src={item.image}
                alt={item.title ?? ''}
                draggable={false}
                loading="lazy"
              />
              <div className="scale-carousel-scrim" aria-hidden="true" />
              {(item.title || item.subtitle) && (
                <div className="scale-carousel-caption">
                  {item.title && <span className="scale-carousel-title">{item.title}</span>}
                  {item.subtitle && <span className="scale-carousel-subtitle">{item.subtitle}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
