import code from '@content/Components/FillButton/FillButton.jsx?raw';
import css from '@content/Components/FillButton/FillButton.css?raw';
import tailwind from '@tailwind/Components/FillButton/FillButton.jsx?raw';
import tsCode from '@ts-default/Components/FillButton/FillButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/FillButton/FillButton.tsx?raw';

export const fillButton = {
  dependencies: 'gsap @gsap/react motion tailwind-merge',
  usage: `import FillButton from './FillButton';

<FillButton size="md" fillColor="#5227FF">
  Get started
</FillButton>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
