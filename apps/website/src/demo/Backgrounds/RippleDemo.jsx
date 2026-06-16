import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import Ripple from '../../content/Backgrounds/Ripple/Ripple';
import { ripple } from '../../constants/code/Backgrounds/rippleCode';

const DEFAULT_PROPS = {};

const RippleDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'className', type: 'string', default: '', description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={ripple}
      componentName="Ripple"
      preview={({ props, key }) => <Ripple key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default RippleDemo;
