import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import OtpInput from '../../content/Components/OtpInput/OtpInput';
import { otpInput } from '../../constants/code/Components/otpInputCode';

const DEFAULT_PROPS = {
  length: 6,
  accentColor: '#6366f1',
  mask: false
};

const ACCENT_OPTIONS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Amber', value: '#f59e0b' }
];

const OtpInputDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'length', type: 'number', default: '6', description: 'Number of digit cells.' },
      { name: 'accentColor', type: 'string', default: '#6366f1', description: 'Focus ring, caret, and completed-border color.' },
      { name: 'mask', type: 'boolean', default: 'false', description: 'Render dots instead of the typed digits.' },
      { name: 'onComplete', type: '(code: string) => void', default: '—', description: 'Called with the full code once every cell is filled.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={otpInput}
      componentName="OtpInput"
      preview={({ props, key }) => <OtpInput key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Length" min={4} max={8} value={props.length} onChange={v => set('length', v)} />
            <PreviewSelect
              title="Accent color"
              name="otp-accent"
              value={props.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSwitch title="Mask digits" isChecked={props.mask} onChange={v => set('mask', v)} />
          </>
        );
      }}
    />
  );
};

export default OtpInputDemo;
