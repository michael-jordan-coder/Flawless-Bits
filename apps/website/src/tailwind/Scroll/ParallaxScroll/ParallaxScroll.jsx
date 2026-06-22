import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const BLOBS = [
  { top: '6%', left: '12%', size: 180 },
  { top: '38%', left: '64%', size: 240 },
  { top: '72%', left: '22%', size: 200 },
  { top: '104%', left: '70%', size: 220 },
  { top: '140%', left: '30%', size: 190 }
];

const SAMPLE = [
  { title: 'Layers of depth', body: 'The backdrop drifts slower than the cards, so the panel gains a sense of space as you scroll.' },
  { title: 'Quiet motion', body: 'Parallax should be felt, not noticed — a gentle lag is enough to read as depth.' },
  { title: 'Content stays first', body: 'The foreground scrolls at full speed and keeps its weight; the background only supports it.' },
  { title: 'Tuneable distance', body: 'Lower the background speed to push it further back, raise it to flatten the effect.' }
];

export default function ParallaxScroll({
  children,
  bgSpeed = 0.4,
  blobColor = '#5227FF',
  height = 460,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll({ container: ref });
  const bgY = useTransform(scrollY, v => v * (1 - bgSpeed));

  const content =
    children != null
      ? children
      : SAMPLE.map((s, i) => (
          <article
            className="flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-[#131318]/[0.72] px-[26px] py-6 backdrop-blur-[6px]"
            key={i}
          >
            <h3 className="m-0 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#fafafa]">{s.title}</h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[#fafafa]/[0.66]">{s.body}</p>
          </article>
        ));

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative mx-auto w-full max-w-[560px] overflow-y-auto overflow-x-hidden rounded-[18px] bg-[#08080c] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <motion.div
        className="pointer-events-none absolute left-0 top-0 h-full w-full [will-change:transform]"
        style={{ y: reduce ? 0 : bgY }}
        aria-hidden="true"
      >
        {BLOBS.map((b, i) => (
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.32] blur-[48px]"
            key={i}
            style={{ top: b.top, left: b.left, width: b.size, height: b.size, background: blobColor }}
          />
        ))}
      </motion.div>
      <div className="relative z-[1] flex flex-col gap-[18px] px-[26px] pb-9 pt-[26px]">{content}</div>
    </div>
  );
}
