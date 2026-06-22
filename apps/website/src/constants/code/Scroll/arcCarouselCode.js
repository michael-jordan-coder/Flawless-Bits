import code from '@content/Scroll/ArcCarousel/ArcCarousel.jsx?raw';
import css from '@content/Scroll/ArcCarousel/ArcCarousel.css?raw';
import tailwind from '@tailwind/Scroll/ArcCarousel/ArcCarousel.jsx?raw';
import tsCode from '@ts-default/Scroll/ArcCarousel/ArcCarousel.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ArcCarousel/ArcCarousel.tsx?raw';

export const arcCarousel = {
  dependencies: 'motion',
  usage: `import ArcCarousel from './ArcCarousel';

const items = [
  { id: 'a', image: '/posters/a.jpg', title: 'Northern Light', subtitle: 'Aurora field study' },
  { id: 'b', image: '/posters/b.jpg', title: 'Longshore', subtitle: 'Coastal series' },
  { id: 'c', image: '/posters/c.jpg', title: 'Half-Lit Rooms', subtitle: 'Interiors' }
];

<ArcCarousel items={items} dip={56} rotateAmount={9} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
