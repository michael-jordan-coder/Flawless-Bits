import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import BottomSheet from '../../content/Components/BottomSheet/BottomSheet';
import { bottomSheet } from '../../constants/code/Components/bottomSheetCode';

const SNAP_PRESETS = {
  'half-full': [0.5, 0.92],
  'thirds': [0.35, 0.66, 0.92],
  'full': [0.92]
};

const SNAP_OPTIONS = [
  { label: 'Half + full', value: 'half-full' },
  { label: 'Thirds', value: 'thirds' },
  { label: 'Full only', value: 'full' }
];

const DEFAULT_PROPS = {
  title: 'Quick actions',
  height: 460,
  backdrop: true,
  snapPreset: 'half-full'
};

const BottomSheetDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'title',
        type: 'string',
        default: "'Quick actions'",
        description: 'Heading rendered at the top of the sheet and used as its accessible name.'
      },
      {
        name: 'snapPoints',
        type: 'number[]',
        default: '[0.5, 0.92]',
        description: 'Resting heights as fractions of the stage. Dragging snaps to the nearest point by position and velocity.'
      },
      {
        name: 'height',
        type: 'number',
        default: '460',
        description: 'Height in pixels of the contained stage that the sheet and scrim live inside.'
      },
      {
        name: 'backdrop',
        type: 'boolean',
        default: 'true',
        description: 'Whether a clickable scrim fades in behind the sheet to dismiss it.'
      },
      {
        name: 'triggerLabel',
        type: 'string',
        default: "'Open sheet'",
        description: 'Label of the button that opens the sheet.'
      },
      {
        name: 'children',
        type: 'ReactNode',
        default: '—',
        description: 'Sheet body content. Falls back to a sample action list when omitted.'
      },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Additional classes merged onto the stage element.'
      }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={bottomSheet}
      componentName="BottomSheet"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => {
        const { snapPreset, ...rest } = props;
        return <BottomSheet key={key} {...rest} snapPoints={SNAP_PRESETS[snapPreset]} />;
      }}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Snap points"
              name="bottom-sheet-snap"
              value={props.snapPreset}
              options={SNAP_OPTIONS}
              onChange={v => set('snapPreset', v)}
            />
            <PreviewSlider
              title="Stage height"
              min={320}
              max={600}
              step={20}
              value={props.height}
              valueUnit="px"
              onChange={v => set('height', v)}
            />
            <PreviewSwitch title="Backdrop" isChecked={props.backdrop} onChange={v => set('backdrop', v)} />
          </>
        );
      }}
    />
  );
};

export default BottomSheetDemo;
