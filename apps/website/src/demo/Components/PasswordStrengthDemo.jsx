import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import PasswordStrength from '../../content/Components/PasswordStrength/PasswordStrength';
import { passwordStrength } from '../../constants/code/Components/passwordStrengthCode';

const DEFAULT_PROPS = {
  minLength: 8,
  requireUppercase: true,
  requireNumber: true,
  requireSymbol: true,
  placeholder: 'Enter a password'
};

const PasswordStrengthDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'minLength', type: 'number', default: '8', description: 'Minimum length the password must reach.' },
      {
        name: 'requireUppercase',
        type: 'boolean',
        default: 'true',
        description: 'Require a capital letter as a criterion.'
      },
      { name: 'requireNumber', type: 'boolean', default: 'true', description: 'Require a number as a criterion.' },
      { name: 'requireSymbol', type: 'boolean', default: 'true', description: 'Require a symbol as a criterion.' },
      { name: 'placeholder', type: 'string', default: "'Enter a password'", description: 'Placeholder text for the input.' },
      {
        name: 'onChange',
        type: '(value: string, score: number) => void',
        default: 'undefined',
        description: 'Fires on every keystroke with the value and a 0–4 strength score.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={passwordStrength}
      componentName="PasswordStrength"
      preview={({ props, key }) => <PasswordStrength key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Minimum length"
              min={4}
              max={16}
              value={props.minLength}
              valueUnit=" chars"
              onChange={v => set('minLength', v)}
            />
            <PreviewSwitch
              title="Require capital"
              isChecked={props.requireUppercase}
              onChange={v => set('requireUppercase', v)}
            />
            <PreviewSwitch title="Require number" isChecked={props.requireNumber} onChange={v => set('requireNumber', v)} />
            <PreviewSwitch title="Require symbol" isChecked={props.requireSymbol} onChange={v => set('requireSymbol', v)} />
          </>
        );
      }}
    />
  );
};

export default PasswordStrengthDemo;
