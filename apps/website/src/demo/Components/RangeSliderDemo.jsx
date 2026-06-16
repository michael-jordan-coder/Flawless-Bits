import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import RangeSlider from '../../content/Components/RangeSlider/RangeSlider';
import { rangeSlider } from '../../constants/code/Components/rangeSliderCode';

const DEFAULT_PROPS = {
  defaultMin: 120,
  defaultMax: 340,
  min: 0,
  max: 500,
  step: 5,
  minGap: 20,
  width: 340,
  accentColor: '#6366f1',
  trackColor: 'rgba(255, 255, 255, 0.12)',
  label: 'Price range',
  valuePrefix: '$',
  valueSuffix: '',
  showValue: true,
  showTooltip: true
};

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#38bdf8', label: 'Sky' }
];

const RangeSliderDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'defaultMin', type: 'number', default: '30', description: 'Initial value of the lower handle.' },
      { name: 'defaultMax', type: 'number', default: '70', description: 'Initial value of the upper handle.' },
      { name: 'min', type: 'number', default: '0', description: 'Lowest selectable value on the scale.' },
      { name: 'max', type: 'number', default: '100', description: 'Highest selectable value on the scale.' },
      { name: 'step', type: 'number', default: '1', description: 'Increment each handle snaps to.' },
      {
        name: 'minGap',
        type: 'number',
        default: '1',
        description: 'Minimum distance kept between the two handles.'
      },
      { name: 'width', type: 'number', default: '320', description: 'Width of the track, in px.' },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Fill, handle, tooltip, and value color.' },
      {
        name: 'trackColor',
        type: 'string',
        default: "'rgba(255,255,255,0.12)'",
        description: 'Color of the unfilled track.'
      },
      { name: 'label', type: 'string', default: "'Price range'", description: 'Caption shown above the track.' },
      { name: 'valuePrefix', type: 'string', default: "'$'", description: 'String shown before each value.' },
      { name: 'valueSuffix', type: 'string', default: "''", description: 'Unit appended after each value.' },
      { name: 'showValue', type: 'boolean', default: 'true', description: 'Toggle the live min–max readout.' },
      {
        name: 'showTooltip',
        type: 'boolean',
        default: 'true',
        description: 'Show a value tooltip over the active handle.'
      },
      {
        name: 'onChange',
        type: '(range: { min: number; max: number }) => void',
        default: 'undefined',
        description: 'Fires whenever either handle moves.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={rangeSlider}
      componentName="RangeSlider"
      preview={({ props, key }) => <RangeSlider key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Width"
              min={240}
              max={440}
              value={props.width}
              valueUnit="px"
              onChange={v => set('width', v)}
            />
            <PreviewSlider title="Max" min={100} max={1000} step={50} value={props.max} onChange={v => set('max', v)} />
            <PreviewSlider title="Step" min={1} max={25} value={props.step} onChange={v => set('step', v)} />
            <PreviewSlider title="Min gap" min={0} max={100} step={5} value={props.minGap} onChange={v => set('minGap', v)} />
            <PreviewSelect
              title="Accent"
              options={ACCENTS}
              value={props.accentColor}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSwitch title="Show value" isChecked={props.showValue} onChange={v => set('showValue', v)} />
            <PreviewSwitch title="Show tooltip" isChecked={props.showTooltip} onChange={v => set('showTooltip', v)} />
          </>
        );
      }}
    />
  );
};

export default RangeSliderDemo;
