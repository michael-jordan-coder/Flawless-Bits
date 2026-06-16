import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import TagInput from '../../content/Components/TagInput/TagInput';
import { tagInput } from '../../constants/code/Components/tagInputCode';

const DEFAULT_PROPS = {};

const TagInputDemo = () => {
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
      codeObject={tagInput}
      componentName="TagInput"
      preview={({ props, key }) => <TagInput key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default TagInputDemo;
