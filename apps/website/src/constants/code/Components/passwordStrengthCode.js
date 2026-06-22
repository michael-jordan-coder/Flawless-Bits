import code from '@content/Components/PasswordStrength/PasswordStrength.jsx?raw';
import css from '@content/Components/PasswordStrength/PasswordStrength.css?raw';
import tailwind from '@tailwind/Components/PasswordStrength/PasswordStrength.jsx?raw';
import tsCode from '@ts-default/Components/PasswordStrength/PasswordStrength.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/PasswordStrength/PasswordStrength.tsx?raw';

export const passwordStrength = {
  dependencies: 'motion lucide-react',
  usage: `import PasswordStrength from './PasswordStrength';

<PasswordStrength
  minLength={10}
  requireSymbol
  onChange={(value, score) => setStrength(score)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
