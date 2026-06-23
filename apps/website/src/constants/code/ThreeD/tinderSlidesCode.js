import code from '@content/ThreeD/TinderSlides/TinderSlides.jsx?raw';
import css from '@content/ThreeD/TinderSlides/TinderSlides.css?raw';
import tailwind from '@tailwind/ThreeD/TinderSlides/TinderSlides.jsx?raw';
import tsCode from '@ts-default/ThreeD/TinderSlides/TinderSlides.tsx?raw';
import tsTailwind from '@ts-tailwind/ThreeD/TinderSlides/TinderSlides.tsx?raw';

export const tinderSlides = {
  dependencies: '',
  usage: `import TinderSlides from './TinderSlides';

const items = [
  { id: 1, image: '/cards/aurora.jpg', title: 'Aurora Drift', meta: 'Drama · 6 episodes' },
  { id: 2, image: '/cards/longshore.jpg', title: 'Longshore', meta: 'Documentary' },
  // ...
];

<TinderSlides items={items} height={520} accentColor="#ff4d2e" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
