import code from '@content/Components/GooeyMenu/GooeyMenu.jsx?raw';
import css from '@content/Components/GooeyMenu/GooeyMenu.css?raw';
import tailwind from '@tailwind/Components/GooeyMenu/GooeyMenu.jsx?raw';
import tsCode from '@ts-default/Components/GooeyMenu/GooeyMenu.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/GooeyMenu/GooeyMenu.tsx?raw';

export const gooeyMenu = {
  dependencies: 'motion, lucide-react',
  usage: `import GooeyMenu from './GooeyMenu';
import { Share2, Heart, Bookmark, Link } from 'lucide-react';

const actions = [
  { icon: Share2, label: 'Share', onClick: () => share() },
  { icon: Heart, label: 'Favorite', onClick: () => favorite() },
  { icon: Bookmark, label: 'Save', onClick: () => save() },
  { icon: Link, label: 'Copy link', onClick: () => copyLink() }
];

<GooeyMenu actions={actions} direction="up" gap={12} accent="#3ecf8e" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
