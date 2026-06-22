import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ArcCarousel from '../../content/Scroll/ArcCarousel/ArcCarousel';
import { arcCarousel } from '../../constants/code/Scroll/arcCarouselCode';

const SAMPLE_ITEMS = [
  { id: 'c1', image: 'https://picsum.photos/seed/arccarousel-aurora/640/800', title: 'Northern Light', subtitle: 'Aurora field study' },
  { id: 'c2', image: 'https://picsum.photos/seed/arccarousel-longshore/640/800', title: 'Longshore', subtitle: 'Coastal series' },
  { id: 'c3', image: 'https://picsum.photos/seed/arccarousel-halflit/640/800', title: 'Half-Lit Rooms', subtitle: 'Interiors' },
  { id: 'c4', image: 'https://picsum.photos/seed/arccarousel-embers/640/800', title: 'Embers', subtitle: 'Night studies' },
  { id: 'c5', image: 'https://picsum.photos/seed/arccarousel-cobalt/640/800', title: 'Cobalt Sea', subtitle: 'Long exposure' },
  { id: 'c6', image: 'https://picsum.photos/seed/arccarousel-silvercut/640/800', title: 'Silver Cut', subtitle: 'Monochrome' },
  { id: 'c7', image: 'https://picsum.photos/seed/arccarousel-parallax/640/800', title: 'Parallax', subtitle: 'City at dusk' }
];

const DEFAULT_PROPS = {
  cardWidth: 76,
  gap: 16,
  height: 380,
  dip: 56,
  rotateAmount: 9,
  dimAmount: 0.3
};

const ArcCarouselDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'CarouselItem[]',
        default: '[]',
        description: 'Cards to lay along the track. Each item needs `image`; `id`, `title` and `subtitle` are optional.'
      },
      { name: 'cardWidth', type: 'number', default: '76', description: 'Width of each card as a percentage of the scroller, which sets the side peek.' },
      { name: 'gap', type: 'number', default: '16', description: 'Gap between cards, in pixels.' },
      { name: 'height', type: 'number', default: '380', description: 'Height of the scroll track, in pixels.' },
      { name: 'dip', type: 'number', default: '56', description: 'How far a fully off-centre card sinks, in pixels.' },
      { name: 'rotateAmount', type: 'number', default: '9', description: 'Fan rotation in degrees applied to a fully off-centre card.' },
      { name: 'dimAmount', type: 'number', default: '0.3', description: 'How much a fully off-centre card dims (opacity 1 → 1 − dimAmount).' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={arcCarousel}
      componentName="ArcCarousel"
      flexProps={{ padding: 0 }}
      preview={({ props, key }) => <ArcCarousel key={key} {...props} items={SAMPLE_ITEMS} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Card width"
              min={60}
              max={90}
              value={props.cardWidth}
              valueUnit="%"
              onChange={v => set('cardWidth', v)}
            />
            <PreviewSlider title="Gap" min={0} max={48} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
            <PreviewSlider title="Dip" min={0} max={96} value={props.dip} valueUnit="px" onChange={v => set('dip', v)} />
            <PreviewSlider
              title="Fan rotate"
              min={0}
              max={16}
              step={1}
              value={props.rotateAmount}
              valueUnit="°"
              onChange={v => set('rotateAmount', v)}
            />
            <PreviewSlider
              title="Dim"
              min={0}
              max={0.8}
              step={0.05}
              value={props.dimAmount}
              onChange={v => set('dimAmount', v)}
            />
            <PreviewSlider
              title="Height"
              min={300}
              max={460}
              step={10}
              value={props.height}
              valueUnit="px"
              onChange={v => set('height', v)}
            />
          </>
        );
      }}
    />
  );
};

export default ArcCarouselDemo;
