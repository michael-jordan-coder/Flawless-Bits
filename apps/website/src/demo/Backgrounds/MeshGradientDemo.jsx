import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import MeshGradient from '../../content/Backgrounds/MeshGradient/MeshGradient';
import { meshGradient } from '../../constants/code/Backgrounds/meshGradientCode';

const PALETTES = {
  Aurora: ['#7c3aed', '#2563eb', '#06b6d4', '#ec4899', '#f59e0b'],
  Sunset: ['#f97316', '#ef4444', '#db2777', '#7c3aed'],
  Ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#3b82f6'],
  Citrus: ['#facc15', '#84cc16', '#22c55e', '#f59e0b']
};

const PALETTE_OPTIONS = [
  { value: 'Aurora', label: 'Aurora' },
  { value: 'Sunset', label: 'Sunset' },
  { value: 'Ocean', label: 'Ocean' },
  { value: 'Citrus', label: 'Citrus' }
];

const DEFAULT_PROPS = {
  palette: 'Aurora',
  speed: 1,
  blur: 40
};

const MeshGradientDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'colors',
        type: 'string[]',
        default: "['#7c3aed', '#2563eb', '#06b6d4', '#ec4899', '#f59e0b']",
        description: 'Hex colors, one soft radial blob per stop.'
      },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill color.' },
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed multiplier.' },
      {
        name: 'blobCount',
        type: 'number',
        default: '0',
        description: 'Number of blobs; 0 derives it from colors.length.'
      },
      { name: 'blur', type: 'number', default: '40', description: 'Soft blur applied to the mesh in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Optional content centered above the mesh.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={meshGradient}
      componentName="MeshGradient"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      demoOnlyProps={['palette']}
      preview={({ props, key }) => (
        <MeshGradient key={key} colors={PALETTES[props.palette]} speed={props.speed} blur={props.blur} />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Palette"
              options={PALETTE_OPTIONS}
              value={props.palette}
              onChange={val => set('palette', val)}
            />
            <PreviewSlider
              title="Speed"
              min={0.2}
              max={3}
              step={0.1}
              value={props.speed}
              onChange={val => set('speed', val)}
            />
            <PreviewSlider
              title="Blur"
              min={0}
              max={80}
              value={props.blur}
              valueUnit="px"
              onChange={val => set('blur', val)}
            />
          </>
        );
      }}
    />
  );
};

export default MeshGradientDemo;
