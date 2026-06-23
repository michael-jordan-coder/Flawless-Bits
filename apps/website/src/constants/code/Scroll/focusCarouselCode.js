import code from '@content/Scroll/FocusCarousel/FocusCarousel.jsx?raw';
import css from '@content/Scroll/FocusCarousel/FocusCarousel.css?raw';
import tailwind from '@tailwind/Scroll/FocusCarousel/FocusCarousel.jsx?raw';
import tsCode from '@ts-default/Scroll/FocusCarousel/FocusCarousel.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/FocusCarousel/FocusCarousel.tsx?raw';

export const focusCarousel = {
  dependencies: 'motion',
  usage: `import FocusCarousel from './FocusCarousel';

const items = [
  { id: 'a', image: '/posters/a.jpg', title: 'Northern Light', subtitle: 'Aurora field study' },
  { id: 'b', image: '/posters/b.jpg', title: 'Longshore', subtitle: 'Coastal series' },
  { id: 'c', image: '/posters/c.jpg', title: 'Half-Lit Rooms', subtitle: 'Interiors' }
];

<FocusCarousel items={items} blurAmount={6} dimAmount={0.45} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
