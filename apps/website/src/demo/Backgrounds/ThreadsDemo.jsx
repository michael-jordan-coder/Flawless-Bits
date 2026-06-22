import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Threads from '../../content/Backgrounds/Threads/Threads';
import { threads } from '../../constants/code/Backgrounds/threadsCode';

const DEFAULT_PROPS = {
  count: 18,
  amplitude: 18,
  speed: 1,
  lineWidth: 1.5
};

const ThreadsDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '18', description: 'Number of vertical threads.' },
      { name: 'amplitude', type: 'number', default: '18', description: 'Peak horizontal sway in pixels.' },
      { name: 'speed', type: 'number', default: '1', description: 'Sway speed multiplier.' },
      { name: 'lineWidth', type: 'number', default: '1.5', description: 'Stroke width of each thread.' },
      { name: 'color', type: 'string', default: "'#5227FF'", description: 'Thread color.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill behind the threads.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the threads.'
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
      codeObject={threads}
      componentName="Threads"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Threads key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Threads
          </span>
        </Threads>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Count" min={4} max={40} step={1} value={props.count} onChange={v => set('count', v)} />
            <PreviewSlider title="Amplitude" min={2} max={48} step={1} value={props.amplitude} valueUnit="px" onChange={v => set('amplitude', v)} />
            <PreviewSlider title="Speed" min={0} max={3} step={0.1} value={props.speed} onChange={v => set('speed', v)} />
            <PreviewSlider title="Line width" min={0.5} max={4} step={0.5} value={props.lineWidth} valueUnit="px" onChange={v => set('lineWidth', v)} />
          </>
        );
      }}
    />
  );
};

export default ThreadsDemo;
