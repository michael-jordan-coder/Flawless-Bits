import code from '@content/Components/RippleButton/RippleButton.jsx?raw';
import css from '@content/Components/RippleButton/RippleButton.css?raw';
import tailwind from '@tailwind/Components/RippleButton/RippleButton.jsx?raw';
import tsCode from '@ts-default/Components/RippleButton/RippleButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/RippleButton/RippleButton.tsx?raw';

export const rippleButton = {
  dependencies: 'motion',
  usage: `import RippleButton from './RippleButton';

<RippleButton color="#6366f1" rippleColor="rgba(255, 255, 255, 0.45)" duration={600}>
  Click me
</RippleButton>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
