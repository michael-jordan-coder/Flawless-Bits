import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ThinkingDot from '../../content/Components/ThinkingDot/ThinkingDot';
import { thinkingDot } from '../../constants/code/Components/thinkingDotCode';

const DEFAULT_PROPS = {
  text: 'Thinking',
  size: 'md',
  dotColor: '#a1a1aa',
  textColor: '#a1a1aa',
};

const SIZE_OPTIONS = [
  { value: 'sm', label: 'sm' },
  { value: 'md', label: 'md' },
  { value: 'lg', label: 'lg' },
];

const TEXT_OPTIONS = [
  { value: 'Thinking', label: 'Thinking' },
  { value: 'Analyzing', label: 'Analyzing' },
  { value: 'Searching', label: 'Searching' },
  { value: 'Preparing answer', label: 'Preparing answer' },
];

const ACCENTS = [
  { value: '#a1a1aa', label: 'Zinc' },
  { value: '#5227ff', label: 'Violet' },
  { value: '#3ecf8e', label: 'Emerald' },
  { value: '#38bdf8', label: 'Sky' },
  { value: '#f43f5e', label: 'Rose' },
];

const ThinkingDotDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'text', type: 'string', default: "'Thinking'", description: 'Label shown next to the dot.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Font-size preset.' },
      { name: 'dotColor', type: 'string', default: "'#a1a1aa'", description: 'Color of the pulsing dot.' },
      { name: 'textColor', type: 'string', default: "'#a1a1aa'", description: 'Color of the label text.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class applied to the root element.' },
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={thinkingDot}
      componentName="ThinkingDot"
      preview={({ props, key }) => <ThinkingDot key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => (
        <>
          <PreviewSelect
            title="Text"
            options={TEXT_OPTIONS}
            value={props.text}
            onChange={v => updateProp('text', v)}
          />
          <PreviewSelect
            title="Size"
            options={SIZE_OPTIONS}
            value={props.size}
            onChange={v => updateProp('size', v)}
          />
          <PreviewSelect
            title="Accent"
            options={ACCENTS}
            value={props.dotColor}
            onChange={v => { updateProp('dotColor', v); updateProp('textColor', v); forceRerender(); }}
          />
        </>
      )}
    />
  );
};

export default ThinkingDotDemo;
