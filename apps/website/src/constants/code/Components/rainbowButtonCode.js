import code from '@content/Components/RainbowButton/RainbowButton.jsx?raw';
import css from '@content/Components/RainbowButton/RainbowButton.css?raw';
import tailwind from '@tailwind/Components/RainbowButton/RainbowButton.jsx?raw';
import tsCode from '@ts-default/Components/RainbowButton/RainbowButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/RainbowButton/RainbowButton.tsx?raw';

export const rainbowButton = {
  dependencies: 'motion',
  usage: `import RainbowButton from './RainbowButton';

<RainbowButton speed={3000}>Get started</RainbowButton>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
