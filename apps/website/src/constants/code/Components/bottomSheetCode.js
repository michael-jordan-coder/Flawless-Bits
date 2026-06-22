import code from '@content/Components/BottomSheet/BottomSheet.jsx?raw';
import css from '@content/Components/BottomSheet/BottomSheet.css?raw';
import tailwind from '@tailwind/Components/BottomSheet/BottomSheet.jsx?raw';
import tsCode from '@ts-default/Components/BottomSheet/BottomSheet.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/BottomSheet/BottomSheet.tsx?raw';

export const bottomSheet = {
  dependencies: 'motion, lucide-react',
  usage: `import BottomSheet from './BottomSheet';

<BottomSheet
  title="Quick actions"
  snapPoints={[0.5, 0.92]}
  height={460}
  backdrop
>
  <ul>
    <li>Share link</li>
    <li>Add to favorites</li>
    <li>Duplicate</li>
  </ul>
</BottomSheet>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
