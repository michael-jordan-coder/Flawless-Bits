import code from '@content/Backgrounds/Plasma/Plasma.jsx?raw';
import css from '@content/Backgrounds/Plasma/Plasma.css?raw';
import tailwind from '@tailwind/Backgrounds/Plasma/Plasma.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Plasma/Plasma.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Plasma/Plasma.tsx?raw';

export const plasma = {
  dependencies: 'motion',
  usage: `import Plasma from './Plasma';

<div style={{ position: 'relative', height: 420 }}>
  <Plasma color="#5227FF" speed={1} scale={3}>
    <h1>Plasma</h1>
  </Plasma>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
