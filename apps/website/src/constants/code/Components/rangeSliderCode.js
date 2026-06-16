import code from '@content/Components/RangeSlider/RangeSlider.jsx?raw';
import css from '@content/Components/RangeSlider/RangeSlider.css?raw';
import tailwind from '@tailwind/Components/RangeSlider/RangeSlider.jsx?raw';
import tsCode from '@ts-default/Components/RangeSlider/RangeSlider.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/RangeSlider/RangeSlider.tsx?raw';

export const rangeSlider = {
  dependencies: 'motion',
  usage: `import RangeSlider from './RangeSlider';

<RangeSlider
  label="Price range"
  valuePrefix="$"
  min={0}
  max={500}
  step={5}
  defaultMin={120}
  defaultMax={340}
  onChange={({ min, max }) => console.log(min, max)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
