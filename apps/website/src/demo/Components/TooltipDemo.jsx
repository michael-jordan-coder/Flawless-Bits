import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import Tooltip from '../../content/Components/Tooltip/Tooltip';
import { tooltip } from '../../constants/code/Components/tooltipCode';

const DEFAULT_PROPS = {
  label: 'Created with magic ✨',
  triggerLabel: 'Hover me',
  placement: 'top',
  delay: 0,
  accentColor: '#5865f2'
};

const PLACEMENT_OPTIONS = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' }
];

const ACCENT_OPTIONS = [
  { label: 'Discord Blurple', value: '#5865f2' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Slate', value: '#1f2937' }
];

const TooltipDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'label', type: 'string', default: "'Tooltip text'", description: 'Text shown inside the tooltip bubble.' },
      { name: 'triggerLabel', type: 'string', default: "'Hover me'", description: 'Label of the default trigger button (ignored if children are passed).' },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left'",
        default: "'top'",
        description: 'Side of the trigger the tooltip appears on.'
      },
      { name: 'delay', type: 'number', default: '0', description: 'Delay before the tooltip opens, in ms.' },
      { name: 'accentColor', type: 'string', default: '#5865f2', description: 'Background color of the bubble and arrow.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Custom trigger element; replaces the default button.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={tooltip}
      componentName="Tooltip"
      flexProps={{ minH: '220px' }}
      preview={({ props, key }) => <Tooltip key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Placement"
              name="tooltip-placement"
              value={props.placement}
              options={PLACEMENT_OPTIONS}
              onChange={v => set('placement', v)}
            />
            <PreviewSelect
              title="Accent color"
              name="tooltip-accent"
              value={props.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSlider title="Delay" min={0} max={800} step={50} value={props.delay} valueUnit="ms" onChange={v => set('delay', v)} />
          </>
        );
      }}
    />
  );
};

export default TooltipDemo;
