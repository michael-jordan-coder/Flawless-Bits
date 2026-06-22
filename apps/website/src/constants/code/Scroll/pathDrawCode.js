import code from '@content/Scroll/PathDraw/PathDraw.jsx?raw';
import css from '@content/Scroll/PathDraw/PathDraw.css?raw';
import tailwind from '@tailwind/Scroll/PathDraw/PathDraw.jsx?raw';
import tsCode from '@ts-default/Scroll/PathDraw/PathDraw.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/PathDraw/PathDraw.tsx?raw';

export const pathDraw = {
  dependencies: 'motion',
  usage: `import PathDraw from './PathDraw';

// Drop it anywhere — it owns its own scroll container.
<PathDraw shape="wave" color="#5227FF" strokeWidth={3} height={460} />

// Or supply a custom path on the 0 0 100 100 viewBox:
<PathDraw d="M 4 50 C 40 0, 60 100, 96 50" showDot={false} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
