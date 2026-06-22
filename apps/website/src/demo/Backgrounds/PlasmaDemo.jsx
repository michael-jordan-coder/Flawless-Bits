import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Plasma from '../../content/Backgrounds/Plasma/Plasma';
import { plasma } from '../../constants/code/Backgrounds/plasmaCode';

const DEFAULT_PROPS = {
  speed: 1,
  scale: 3,
  intensity: 1
};

const PlasmaDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'speed', type: 'number', default: '1', description: 'Flow speed multiplier.' },
      { name: 'scale', type: 'number', default: '3', description: 'Wave frequency; higher means tighter bands.' },
      { name: 'intensity', type: 'number', default: '1', description: 'Brightness multiplier of the field.' },
      { name: 'color', type: 'string', default: "'#5227FF'", description: 'Plasma hue at full brightness.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill at zero brightness.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the plasma.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={plasma}
      componentName="Plasma"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Plasma key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Plasma
          </span>
        </Plasma>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Speed" min={0} max={3} step={0.1} value={props.speed} onChange={v => set('speed', v)} />
            <PreviewSlider title="Scale" min={1} max={6} step={0.5} value={props.scale} onChange={v => set('scale', v)} />
            <PreviewSlider title="Intensity" min={0.4} max={1.6} step={0.1} value={props.intensity} onChange={v => set('intensity', v)} />
          </>
        );
      }}
    />
  );
};

export default PlasmaDemo;
