import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import DotGrid from '../../content/Backgrounds/DotGrid/DotGrid';
import { dotGrid } from '../../constants/code/Backgrounds/dotGridCode';

const DEFAULT_PROPS = {
  gap: 32,
  dotSize: 2,
  proximity: 120,
  shockStrength: 6
};

const DotGridDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'dotColor', type: 'string', default: "'#2a2a2e'", description: 'Resting dot color.' },
      {
        name: 'activeColor',
        type: 'string',
        default: "'#fafafa'",
        description: 'Color a dot reaches at full cursor proximity.'
      },
      { name: 'gap', type: 'number', default: '32', description: 'Pixel spacing between dots.' },
      { name: 'dotSize', type: 'number', default: '2', description: 'Resting dot radius in pixels.' },
      { name: 'proximity', type: 'number', default: '120', description: 'Cursor influence radius in pixels.' },
      { name: 'shockRadius', type: 'number', default: '220', description: 'Click ripple radius in pixels.' },
      {
        name: 'shockStrength',
        type: 'number',
        default: '6',
        description: 'Displacement strength of the click ripple.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={dotGrid}
      componentName="DotGrid"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <DotGrid key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Gap"
              min={16}
              max={64}
              value={props.gap}
              valueUnit="px"
              onChange={val => set('gap', val)}
            />
            <PreviewSlider
              title="Dot size"
              min={1}
              max={6}
              value={props.dotSize}
              valueUnit="px"
              onChange={val => set('dotSize', val)}
            />
            <PreviewSlider
              title="Proximity"
              min={40}
              max={240}
              value={props.proximity}
              valueUnit="px"
              onChange={val => set('proximity', val)}
            />
            <PreviewSlider
              title="Shock strength"
              min={0}
              max={14}
              value={props.shockStrength}
              onChange={val => set('shockStrength', val)}
            />
          </>
        );
      }}
    />
  );
};

export default DotGridDemo;
