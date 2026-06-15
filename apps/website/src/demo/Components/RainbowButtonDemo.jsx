import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import RainbowButton from '../../content/Components/RainbowButton/RainbowButton';
import { rainbowButton } from '../../constants/code/Components/rainbowButtonCode';

const DEFAULT_PROPS = {
  label: 'Get started',
  speed: 3000,
  blur: 14,
  borderWidth: 2,
  radius: 14
};

const RainbowButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: "'Get started'", description: 'Button label content.' },
      { name: 'speed', type: 'number', default: '3000', description: 'Time for one full rotation of the rainbow, in ms.' },
      { name: 'blur', type: 'number', default: '14', description: 'Blur radius of the glow halo, in px.' },
      { name: 'borderWidth', type: 'number', default: '2', description: 'Thickness of the visible rainbow border, in px.' },
      { name: 'radius', type: 'number', default: '14', description: 'Corner radius of the button, in px.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={rainbowButton}
      componentName="RainbowButton"
      demoOnlyProps={['label']}
      preview={({ props, key }) => {
        const { label, ...rest } = props;
        return (
          <RainbowButton key={key} {...rest}>
            {label}
          </RainbowButton>
        );
      }}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Speed" min={800} max={6000} step={100} value={props.speed} valueUnit="ms" onChange={v => set('speed', v)} />
            <PreviewSlider title="Glow blur" min={0} max={32} value={props.blur} valueUnit="px" onChange={v => set('blur', v)} />
            <PreviewSlider title="Border width" min={1} max={6} value={props.borderWidth} valueUnit="px" onChange={v => set('borderWidth', v)} />
            <PreviewSlider title="Radius" min={0} max={32} value={props.radius} valueUnit="px" onChange={v => set('radius', v)} />
          </>
        );
      }}
    />
  );
};

export default RainbowButtonDemo;
