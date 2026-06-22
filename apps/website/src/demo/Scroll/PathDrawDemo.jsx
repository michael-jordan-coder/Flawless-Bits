import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import PathDraw from '../../content/Scroll/PathDraw/PathDraw';
import { pathDraw } from '../../constants/code/Scroll/pathDrawCode';

const DEFAULT_PROPS = {
  shape: 'wave',
  color: '#5227FF',
  strokeWidth: 3,
  showDot: true
};

const SHAPE_OPTIONS = [
  { value: 'wave', label: 'Wave' },
  { value: 'spiral', label: 'Spiral' },
  { value: 'route', label: 'Route' }
];

const COLOR_OPTIONS = [
  { value: '#5227FF', label: 'Violet' },
  { value: '#0EA5E9', label: 'Sky' },
  { value: '#10B981', label: 'Emerald' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' }
];

const PathDrawDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'shape', type: "'wave' | 'spiral' | 'route'", default: "'wave'", description: 'Built-in path preset to draw.' },
      { name: 'd', type: 'string', default: 'undefined', description: 'Custom SVG path on the 0 0 100 100 viewBox; overrides shape.' },
      { name: 'color', type: 'string', default: "'#5227FF'", description: 'Stroke and dot color (hex).' },
      { name: 'strokeWidth', type: 'number', default: '3', description: 'Path stroke width in viewBox units.' },
      { name: 'showDot', type: 'boolean', default: 'true', description: 'Show the marker that rides the drawn frontier.' },
      { name: 'dotRadius', type: 'number', default: '4', description: 'Radius of the riding dot in viewBox units.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={pathDraw}
      componentName="PathDraw"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <PathDraw key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Shape"
              options={SHAPE_OPTIONS}
              value={props.shape}
              onChange={val => set('shape', val)}
            />
            <PreviewSelect
              title="Color"
              options={COLOR_OPTIONS}
              value={props.color}
              onChange={val => set('color', val)}
            />
            <PreviewSlider
              title="Stroke width"
              min={1}
              max={8}
              value={props.strokeWidth}
              onChange={val => set('strokeWidth', val)}
            />
            <PreviewSwitch title="Show dot" isChecked={props.showDot} onChange={val => set('showDot', val)} />
          </>
        );
      }}
    />
  );
};

export default PathDrawDemo;
