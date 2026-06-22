import code from '@content/Backgrounds/Threads/Threads.jsx?raw';
import css from '@content/Backgrounds/Threads/Threads.css?raw';
import tailwind from '@tailwind/Backgrounds/Threads/Threads.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Threads/Threads.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Threads/Threads.tsx?raw';

export const threads = {
  dependencies: 'motion',
  usage: `import Threads from './Threads';

<div style={{ position: 'relative', height: 420 }}>
  <Threads count={18} amplitude={18} speed={1} color="#5227FF">
    <h1>Threads</h1>
  </Threads>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
