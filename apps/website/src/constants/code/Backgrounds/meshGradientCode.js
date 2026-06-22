import code from '@content/Backgrounds/MeshGradient/MeshGradient.jsx?raw';
import css from '@content/Backgrounds/MeshGradient/MeshGradient.css?raw';
import tailwind from '@tailwind/Backgrounds/MeshGradient/MeshGradient.jsx?raw';
import tsCode from '@ts-default/Backgrounds/MeshGradient/MeshGradient.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/MeshGradient/MeshGradient.tsx?raw';

export const meshGradient = {
  dependencies: 'motion',
  usage: `import MeshGradient from './MeshGradient';

<div style={{ width: '100%', height: 400 }}>
  <MeshGradient
    colors={['#7c3aed', '#2563eb', '#06b6d4', '#ec4899', '#f59e0b']}
    speed={1}
    blur={40}
  />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
