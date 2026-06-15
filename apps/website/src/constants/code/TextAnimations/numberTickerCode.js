import code from '@content/TextAnimations/NumberTicker/NumberTicker.jsx?raw';
import css from '@content/TextAnimations/NumberTicker/NumberTicker.css?raw';
import tailwind from '@tailwind/TextAnimations/NumberTicker/NumberTicker.jsx?raw';
import tsCode from '@ts-default/TextAnimations/NumberTicker/NumberTicker.tsx?raw';
import tsTailwind from '@ts-tailwind/TextAnimations/NumberTicker/NumberTicker.tsx?raw';

export const numberTicker = {
  dependencies: 'motion',
  usage: `import { useEffect, useState } from 'react';
import NumberTicker from './NumberTicker';

function Stat() {
  const [value, setValue] = useState(0);
  useEffect(() => setValue(124750), []);
  return <NumberTicker value={value} prefix="$" group />;
}`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
