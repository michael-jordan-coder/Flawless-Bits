import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import SpeedDial from '../../content/Components/SpeedDial/SpeedDial';
import { speedDial } from '../../constants/code/Components/speedDialCode';

const DEFAULT_PROPS = {};

const SpeedDialDemo = () => {
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
      codeObject={speedDial}
      componentName="SpeedDial"
      preview={({ props, key }) => <SpeedDial key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default SpeedDialDemo;
