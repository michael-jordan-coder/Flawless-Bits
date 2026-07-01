import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ThinkingSteps from '../../content/Components/ThinkingSteps/ThinkingSteps';
import { thinkingSteps } from '../../constants/code/Components/thinkingStepsCode';

const DEFAULT_PROPS = {
  steps: ['Breaking down the problem', 'Reviewing context', 'Preparing the answer'],
  interval: 1800,
  dotColor: '#a1a1aa',
  textColor: '#a1a1aa',
  stepColor: '#71717a',
};

const ACCENTS = [
  { value: '#a1a1aa', label: 'Zinc' },
  { value: '#5227ff', label: 'Violet' },
  { value: '#3ecf8e', label: 'Emerald' },
  { value: '#38bdf8', label: 'Sky' },
  { value: '#f43f5e', label: 'Rose' },
];

const ThinkingStepsDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'steps', type: 'string[]', default: "['Breaking down the problem', ...]", description: 'Activity labels revealed one-by-one below the heading.' },
      { name: 'interval', type: 'number', default: '1800', description: 'Milliseconds between each step appearing.' },
      { name: 'dotColor', type: 'string', default: "'#a1a1aa'", description: 'Color of the header pulsing dot.' },
      { name: 'textColor', type: 'string', default: "'#a1a1aa'", description: 'Color of the "Thinking" label.' },
      { name: 'stepColor', type: 'string', default: "'#71717a'", description: 'Color of the step labels.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class applied to the root element.' },
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={thinkingSteps}
      componentName="ThinkingSteps"
      preview={({ props, key }) => <ThinkingSteps key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => { updateProp(name, val); forceRerender(); };
        return (
          <>
            <PreviewSelect
              title="Accent"
              options={ACCENTS}
              value={props.dotColor}
              onChange={v => { updateProp('dotColor', v); updateProp('textColor', v); forceRerender(); }}
            />
            <PreviewSlider
              title="Interval"
              min={600}
              max={3600}
              step={200}
              value={props.interval}
              valueUnit="ms"
              onChange={v => set('interval', v)}
            />
          </>
        );
      }}
    />
  );
};

export default ThinkingStepsDemo;
