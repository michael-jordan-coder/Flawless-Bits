import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import GooeyMenu from '../../content/Components/GooeyMenu/GooeyMenu';
import { gooeyMenu } from '../../constants/code/Components/gooeyMenuCode';

const DEFAULT_PROPS = {
  direction: 'up',
  gap: 12,
  accent: '#3ecf8e'
};

const DIRECTION_OPTIONS = [
  { label: 'Up', value: 'up' },
  { label: 'Down', value: 'down' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' }
];

const ACCENT_OPTIONS = [
  { label: 'Supabase green', value: '#3ecf8e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Amber', value: '#f59e0b' }
];

const GooeyMenuDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'actions',
        type: '{ icon, label, onClick? }[]',
        default: 'Share / Favorite / Save / Copy link',
        description: 'Fan of action buttons. Each takes a lucide icon, an accessible label, and an optional handler.'
      },
      {
        name: 'direction',
        type: "'up' | 'down' | 'left' | 'right'",
        default: "'up'",
        description: 'Direction the actions spring out from the trigger.'
      },
      { name: 'gap', type: 'number', default: '12', description: 'Pixels of spacing between each action button.' },
      { name: 'accent', type: 'string', default: '#3ecf8e', description: 'Fill color of the trigger and action buttons.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={gooeyMenu}
      componentName="GooeyMenu"
      preview={({ props, key }) => <GooeyMenu key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Direction"
              name="gooeymenu-direction"
              value={props.direction}
              options={DIRECTION_OPTIONS}
              onChange={v => set('direction', v)}
            />
            <PreviewSlider title="Gap" min={4} max={32} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
            <PreviewSelect
              title="Accent color"
              name="gooeymenu-accent"
              value={props.accent}
              options={ACCENT_OPTIONS}
              onChange={v => set('accent', v)}
            />
          </>
        );
      }}
    />
  );
};

export default GooeyMenuDemo;
