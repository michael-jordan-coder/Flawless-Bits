import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import HorizontalScroll from '../../content/Scroll/HorizontalScroll/HorizontalScroll';
import { horizontalScroll } from '../../constants/code/Scroll/horizontalScrollCode';

const DEFAULT_PROPS = {
  cardWidth: 280,
  gap: 20
};

const HorizontalScrollDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: '{ title, subtitle?, accent }[]',
        default: '6 built-in cards',
        description: 'Cards in the horizontal track. `accent` sets each card background.'
      },
      { name: 'cardWidth', type: 'number', default: '280', description: 'Width of each card in pixels.' },
      { name: 'gap', type: 'number', default: '20', description: 'Gap between cards in pixels.' },
      { name: 'height', type: 'number', default: '420', description: 'Height of the sticky viewport in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={horizontalScroll}
      componentName="HorizontalScroll"
      flexProps={{ minH: '480px', h: '480px', padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <HorizontalScroll key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Card width" min={200} max={400} step={10} value={props.cardWidth} valueUnit="px" onChange={v => set('cardWidth', v)} />
            <PreviewSlider title="Gap" min={0} max={48} step={2} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
          </>
        );
      }}
    />
  );
};

export default HorizontalScrollDemo;
