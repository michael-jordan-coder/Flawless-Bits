import code from '@content/Components/Tooltip/Tooltip.jsx?raw';
import css from '@content/Components/Tooltip/Tooltip.css?raw';
import tailwind from '@tailwind/Components/Tooltip/Tooltip.jsx?raw';
import tsCode from '@ts-default/Components/Tooltip/Tooltip.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Tooltip/Tooltip.tsx?raw';

export const tooltip = {
  dependencies: 'motion',
  usage: `import Tooltip from './Tooltip';

<Tooltip label="Created with magic" placement="top">
  <button>Hover me</button>
</Tooltip>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
