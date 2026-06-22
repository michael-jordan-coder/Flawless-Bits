import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import RippleButton from '../../content/Components/RippleButton/RippleButton';
import { rippleButton } from '../../constants/code/Components/rippleButtonCode';

const DEFAULT_PROPS = {
  color: '#6366f1',
  rippleColor: 'rgba(255, 255, 255, 0.45)',
  duration: 600,
  disabled: false
};

const COLORS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#22c55e', label: 'Green' },
  { value: '#0f172a', label: 'Slate' }
];

const RIPPLE_COLORS = [
  { value: 'rgba(255, 255, 255, 0.45)', label: 'White' },
  { value: 'rgba(255, 255, 255, 0.8)', label: 'Bright white' },
  { value: 'rgba(0, 0, 0, 0.25)', label: 'Dark' }
];

const RippleButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: "'Click me'", description: 'Button label.' },
      { name: 'color', type: 'string', default: "'#6366f1'", description: 'Button background color.' },
      {
        name: 'rippleColor',
        type: 'string',
        default: "'rgba(255, 255, 255, 0.45)'",
        description: 'Ripple fill, hex or rgba.'
      },
      { name: 'duration', type: 'number', default: '600', description: 'Ripple expand/fade duration, in ms.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button and its ripples.' },
      {
        name: 'onClick',
        type: '(e: MouseEvent) => void',
        default: 'undefined',
        description: 'Fires when the button is pressed.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the button.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={rippleButton}
      componentName="RippleButton"
      preview={({ props, key }) => (
        <RippleButton key={key} {...props}>
          Click me
        </RippleButton>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect title="Color" options={COLORS} value={props.color} onChange={v => set('color', v)} />
            <PreviewSelect
              title="Ripple color"
              options={RIPPLE_COLORS}
              value={props.rippleColor}
              onChange={v => set('rippleColor', v)}
            />
            <PreviewSlider
              title="Duration"
              min={200}
              max={1200}
              step={50}
              value={props.duration}
              valueUnit="ms"
              onChange={v => set('duration', v)}
            />
            <PreviewSwitch title="Disabled" isChecked={props.disabled} onChange={v => set('disabled', v)} />
          </>
        );
      }}
    />
  );
};

export default RippleButtonDemo;
