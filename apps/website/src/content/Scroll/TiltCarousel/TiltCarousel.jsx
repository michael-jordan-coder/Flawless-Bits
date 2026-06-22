import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './TiltCarousel.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// A native scroll-snap swipe carousel with a "coverflow tilt" feel. The card
// snapped to the centre faces you flat at full scale while its neighbours angle
// back in perspective and shrink in proportion to their distance from the
// viewport centre — left cards rotate so their right edge comes forward, right
// cards mirror it. The distortion is scroll-linked: a single rAF-throttled
// handler reads each card's offset from the scroller's mid-line on every
// scroll/resize and writes the transform straight to the DOM, so it tracks
// finger, trackpad and scrollbar exactly. Reduced motion drops the scroll-linked
// transform — cards stay flat and it degrades to a plain peek carousel.
export default function TiltCarousel({
  items = [],
  cardWidth = 74,
  gap = 18,
  height = 360,
  tiltAmount = 38,
  scaleAmount = 0.1,
  dimAmount = 0.35,
  className = '',
  ...rest
}) {
  const scrollerRef = useRef(null);
  const slotRefs = useRef([]);
  const frameRefs = useRef([]);
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
        frame.style.transform = `perspective(1100px) rotateY(${(-dir * n * tiltAmount).toFixed(3)}deg) scale(${(1 - n * scaleAmount).toFixed(4)})`;
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
  }, [reduce, items.length, tiltAmount, scaleAmount, dimAmount, cardWidth, gap]);

  const peek = Math.max(0, (100 - cardWidth) / 2);
  const style = {
    '--tilt-carousel-gap': `${gap}px`,
    '--tilt-carousel-card': `${cardWidth}%`,
    '--tilt-carousel-peek': `${peek}%`,
    '--tilt-carousel-height': `${height}px`,
    ...rest.style
  };

  return (
    <div {...rest} className={join('tilt-carousel', className)} style={style}>
      <div ref={scrollerRef} className="tilt-carousel-scroller">
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            ref={el => {
              slotRefs.current[i] = el;
            }}
            className="tilt-carousel-slot"
          >
            <div
              ref={el => {
                frameRefs.current[i] = el;
              }}
              className="tilt-carousel-frame"
            >
              <img
                className="tilt-carousel-image"
                src={item.image}
                alt={item.title ?? ''}
                draggable={false}
                loading="lazy"
              />
              <div className="tilt-carousel-scrim" aria-hidden="true" />
              {(item.title || item.subtitle) && (
                <div className="tilt-carousel-caption">
                  {item.title && <span className="tilt-carousel-title">{item.title}</span>}
                  {item.subtitle && <span className="tilt-carousel-subtitle">{item.subtitle}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
