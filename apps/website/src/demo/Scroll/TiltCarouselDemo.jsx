import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import TiltCarousel from '../../content/Scroll/TiltCarousel/TiltCarousel';
import { tiltCarousel } from '../../constants/code/Scroll/tiltCarouselCode';

const SAMPLE_ITEMS = [
  { id: 'c1', image: 'https://picsum.photos/seed/tiltcarousel-aurora/640/800', title: 'Northern Light', subtitle: 'Aurora field study' },
  { id: 'c2', image: 'https://picsum.photos/seed/tiltcarousel-longshore/640/800', title: 'Longshore', subtitle: 'Coastal series' },
  { id: 'c3', image: 'https://picsum.photos/seed/tiltcarousel-halflit/640/800', title: 'Half-Lit Rooms', subtitle: 'Interiors' },
  { id: 'c4', image: 'https://picsum.photos/seed/tiltcarousel-embers/640/800', title: 'Embers', subtitle: 'Night studies' },
  { id: 'c5', image: 'https://picsum.photos/seed/tiltcarousel-cobalt/640/800', title: 'Cobalt Sea', subtitle: 'Long exposure' },
  { id: 'c6', image: 'https://picsum.photos/seed/tiltcarousel-silvercut/640/800', title: 'Silver Cut', subtitle: 'Monochrome' },
  { id: 'c7', image: 'https://picsum.photos/seed/tiltcarousel-parallax/640/800', title: 'Parallax', subtitle: 'City at dusk' }
];

const DEFAULT_PROPS = {
  cardWidth: 74,
  gap: 18,
  height: 360,
  tiltAmount: 38,
  scaleAmount: 0.1,
  dimAmount: 0.35
};

const TiltCarouselDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'CarouselItem[]',
        default: '[]',
        description: 'Cards to lay along the track. Each item needs `image`; `id`, `title` and `subtitle` are optional.'
      },
      { name: 'cardWidth', type: 'number', default: '74', description: 'Width of each card as a percentage of the scroller, which sets the side peek.' },
      { name: 'gap', type: 'number', default: '18', description: 'Gap between cards, in pixels.' },
      { name: 'height', type: 'number', default: '360', description: 'Height of the scroll track, in pixels.' },
      { name: 'tiltAmount', type: 'number', default: '38', description: 'Maximum rotateY in degrees applied to a fully off-centre card.' },
      { name: 'scaleAmount', type: 'number', default: '0.1', description: 'How much a fully off-centre card shrinks (1 → 1 − scaleAmount).' },
      { name: 'dimAmount', type: 'number', default: '0.35', description: 'How much a fully off-centre card dims (opacity 1 → 1 − dimAmount).' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={tiltCarousel}
      componentName="TiltCarousel"
      flexProps={{ padding: 0 }}
      preview={({ props, key }) => <TiltCarousel key={key} {...props} items={SAMPLE_ITEMS} />}
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
              max={88}
              value={props.cardWidth}
              valueUnit="%"
              onChange={v => set('cardWidth', v)}
            />
            <PreviewSlider title="Gap" min={0} max={48} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
            <PreviewSlider
              title="Tilt"
              min={0}
              max={60}
              step={1}
              value={props.tiltAmount}
              valueUnit="°"
              onChange={v => set('tiltAmount', v)}
            />
            <PreviewSlider
              title="Scale falloff"
              min={0}
              max={0.3}
              step={0.01}
              value={props.scaleAmount}
              onChange={v => set('scaleAmount', v)}
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
              min={260}
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

export default TiltCarouselDemo;
