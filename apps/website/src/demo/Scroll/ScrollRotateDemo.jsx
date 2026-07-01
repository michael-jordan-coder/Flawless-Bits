import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ScrollRotate from '../../content/Scroll/ScrollRotate/ScrollRotate';
import { scrollRotate } from '../../constants/code/Scroll/scrollRotateCode';

const DEFAULT_PROPS = {
  turns: 0.5,
  segments: 24,
  accent: '#3ecf8e'
};

const ACCENTS = [
  { value: '#3ecf8e', label: 'Emerald' },
  { value: '#5227ff', label: 'Violet' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#38bdf8', label: 'Sky' }
];

const ScrollRotateDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      { name: 'turns', type: 'number', default: '0.5', description: 'Full turns the ring makes across the scroll.' },
      { name: 'segments', type: 'number', default: '24', description: 'Number of radial ticks in the ring.' },
      { name: 'accent', type: 'string', default: "'#3ecf8e'", description: 'Stroke color of the ring ticks.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollRotate}
      componentName="ScrollRotate"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollRotate key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Turns"
              min={0.25}
              max={2}
              step={0.25}
              value={props.turns}
              onChange={val => set('turns', val)}
            />
            <PreviewSlider
              title="Segments"
              min={8}
              max={48}
              step={4}
              value={props.segments}
              onChange={val => set('segments', val)}
            />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accent} onChange={val => set('accent', val)} />
          </>
        );
      }}
    />
  );
};

export default ScrollRotateDemo;
