import code from '@content/Scroll/TiltCarousel/TiltCarousel.jsx?raw';
import css from '@content/Scroll/TiltCarousel/TiltCarousel.css?raw';
import tailwind from '@tailwind/Scroll/TiltCarousel/TiltCarousel.jsx?raw';
import tsCode from '@ts-default/Scroll/TiltCarousel/TiltCarousel.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/TiltCarousel/TiltCarousel.tsx?raw';

export const tiltCarousel = {
  dependencies: 'motion',
  usage: `import TiltCarousel from './TiltCarousel';

const items = [
  { id: 'a', image: '/posters/a.jpg', title: 'Northern Light', subtitle: 'Aurora field study' },
  { id: 'b', image: '/posters/b.jpg', title: 'Longshore', subtitle: 'Coastal series' },
  { id: 'c', image: '/posters/c.jpg', title: 'Half-Lit Rooms', subtitle: 'Interiors' }
];

<TiltCarousel items={items} tiltAmount={38} scaleAmount={0.1} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
