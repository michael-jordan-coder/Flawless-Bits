import code from '@content/Scroll/HorizontalScroll/HorizontalScroll.jsx?raw';
import css from '@content/Scroll/HorizontalScroll/HorizontalScroll.css?raw';
import tailwind from '@tailwind/Scroll/HorizontalScroll/HorizontalScroll.jsx?raw';
import tsCode from '@ts-default/Scroll/HorizontalScroll/HorizontalScroll.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/HorizontalScroll/HorizontalScroll.tsx?raw';

export const horizontalScroll = {
  dependencies: 'motion',
  usage: `import HorizontalScroll from './HorizontalScroll';

const items = [
  { title: 'Discover', subtitle: 'Find the thread worth pulling.', accent: '#5227FF' },
  { title: 'Make', subtitle: 'Build it small, build it real.', accent: '#10B981' },
  { title: 'Launch', subtitle: 'Put it in front of real people.', accent: '#EF4444' }
];

<HorizontalScroll items={items} cardWidth={280} gap={20} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
