import code from '@content/Scroll/ParallaxScroll/ParallaxScroll.jsx?raw';
import css from '@content/Scroll/ParallaxScroll/ParallaxScroll.css?raw';
import tailwind from '@tailwind/Scroll/ParallaxScroll/ParallaxScroll.jsx?raw';
import tsCode from '@ts-default/Scroll/ParallaxScroll/ParallaxScroll.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ParallaxScroll/ParallaxScroll.tsx?raw';

export const parallaxScroll = {
  dependencies: 'motion',
  usage: `import ParallaxScroll from './ParallaxScroll';

<ParallaxScroll bgSpeed={0.4} blobColor="#5227FF">
  <section>Your content over a parallax backdrop…</section>
</ParallaxScroll>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
