import { useRef, type HTMLAttributes, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './ParallaxScroll.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface ParallaxScrollProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  bgSpeed?: number;
  blobColor?: string;
  height?: number;
  className?: string;
}

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

// A self-contained scroll panel with a parallax backdrop: a decorative blob
// layer is countered against the scroll so it travels slower than the
// foreground, reading as depth. Driven by the container's scroll position via
// motion's useTransform. Inspired by the parallax scroll sections catalogued on
// designspells. Pass your own children, or a sample sequence renders by default.
export default function ParallaxScroll({
  children,
  bgSpeed = 0.4,
  blobColor = '#5227FF',
  height = 460,
  className = '',
  ...rest
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll({ container: ref });
  const bgY = useTransform(scrollY, v => v * (1 - bgSpeed));

  const content =
    children != null
      ? children
      : SAMPLE.map((s, i) => (
          <article className="parallax-card" key={i}>
            <h3 className="parallax-title">{s.title}</h3>
            <p className="parallax-text">{s.body}</p>
          </article>
        ));

  return (
    <div {...rest} ref={ref} className={join('parallax-scroll', className)} style={{ height, ...rest.style }}>
      <motion.div className="parallax-bg" style={{ y: reduce ? 0 : bgY }} aria-hidden="true">
        {BLOBS.map((b, i) => (
          <span
            className="parallax-blob"
            key={i}
            style={{ top: b.top, left: b.left, width: b.size, height: b.size, background: blobColor }}
          />
        ))}
      </motion.div>
      <div className="parallax-content">{content}</div>
    </div>
  );
}
