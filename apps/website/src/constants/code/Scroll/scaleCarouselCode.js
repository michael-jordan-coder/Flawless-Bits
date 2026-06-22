import code from '@content/Scroll/ScaleCarousel/ScaleCarousel.jsx?raw';
import css from '@content/Scroll/ScaleCarousel/ScaleCarousel.css?raw';
import tailwind from '@tailwind/Scroll/ScaleCarousel/ScaleCarousel.jsx?raw';
import tsCode from '@ts-default/Scroll/ScaleCarousel/ScaleCarousel.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScaleCarousel/ScaleCarousel.tsx?raw';

export const scaleCarousel = {
  dependencies: 'motion',
  usage: `import ScaleCarousel from './ScaleCarousel';

const items = [
  { id: 'a', image: '/posters/a.jpg', title: 'Northern Light', subtitle: 'Aurora field study' },
  { id: 'b', image: '/posters/b.jpg', title: 'Longshore', subtitle: 'Coastal series' },
  { id: 'c', image: '/posters/c.jpg', title: 'Half-Lit Rooms', subtitle: 'Interiors' }
];

<ScaleCarousel items={items} cardWidth={76} scaleAmount={0.16} dimAmount={0.4} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
