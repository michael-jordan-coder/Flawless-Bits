import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import FlipCard from '../../content/Components/FlipCard/FlipCard';
import { flipCard } from '../../constants/code/Components/flipCardCode';

const DEFAULT_PROPS = {};

const FlipCardDemo = () => {
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
      codeObject={flipCard}
      componentName="FlipCard"
      preview={({ props, key }) => <FlipCard key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default FlipCardDemo;
