import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import Tabs from '../../content/Components/Tabs/Tabs';
import { tabs } from '../../constants/code/Components/tabsCode';

const DEFAULT_PROPS = {};

const TabsDemo = () => {
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
      codeObject={tabs}
      componentName="Tabs"
      preview={({ props, key }) => <Tabs key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default TabsDemo;
