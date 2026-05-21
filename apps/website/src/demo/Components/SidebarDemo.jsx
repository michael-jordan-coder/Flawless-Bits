import { useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import Customize from '../../components/common/Preview/Customize';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import CodeExample from '../../components/code/CodeExample';
import RefreshButton from '../../components/common/Preview/RefreshButton';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import useForceRerender from '../../hooks/useForceRerender';
import useComponentProps from '../../hooks/useComponentProps';
import { ComponentPropsProvider } from '../../components/context/ComponentPropsContext';

import Sidebar from '../../content/Components/Sidebar/Sidebar';
import { sidebar } from '../../constants/code/Components/sidebarCode';

const DEFAULT_PROPS = {
  defaultCollapsed: false,
  defaultWidth: 240,
  minWidth: 200,
  maxWidth: 380,
  brand: 'Acme'
};

const SidebarDemo = () => {
  const [key, forceRerender] = useForceRerender();
  const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
  const { defaultCollapsed, defaultWidth, minWidth, maxWidth, brand } = props;

  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'SidebarItem[]',
        default: '[Home, Inbox, Projects, Calendar, Team, Settings]',
        description: 'Nav items. Each item has `id`, `label`, `icon` (Lucide component), and optional `badge`.'
      },
      {
        name: 'brand',
        type: 'string',
        default: "'Acme'",
        description: 'Brand label rendered in the header. The first character is used as the brand mark glyph.'
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        default: 'false',
        description: 'Whether the sidebar starts in the icon-only collapsed state.'
      },
      {
        name: 'defaultWidth',
        type: 'number',
        default: '240',
        description: 'Initial width in pixels when expanded.'
      },
      {
        name: 'minWidth',
        type: 'number',
        default: '200',
        description: 'Minimum width allowed during resize.'
      },
      {
        name: 'maxWidth',
        type: 'number',
        default: '380',
        description: 'Maximum width allowed during resize.'
      },
      {
        name: 'activeId',
        type: 'string',
        default: '—',
        description: 'Controlled active item id. When omitted the sidebar manages its own selection state.'
      },
      {
        name: 'onItemClick',
        type: '(id: string) => void',
        default: '—',
        description: 'Fires when a nav item is clicked.'
      },
      {
        name: 'onCollapsedChange',
        type: '(collapsed: boolean) => void',
        default: '—',
        description: 'Fires when the collapse button is toggled.'
      },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Additional classes merged onto the root element.'
      }
    ],
    []
  );

  return (
    <ComponentPropsProvider
      props={props}
      defaultProps={DEFAULT_PROPS}
      resetProps={resetProps}
      hasChanges={hasChanges}
    >
      <TabsLayout>
        <PreviewTab>
          <Flex
            overflow="hidden"
            justifyContent="flex-start"
            alignItems="stretch"
            minH="520px"
            position="relative"
            className="demo-container"
          >
            <Sidebar
              key={key}
              brand={brand}
              defaultCollapsed={defaultCollapsed}
              defaultWidth={defaultWidth}
              minWidth={minWidth}
              maxWidth={maxWidth}
            />
            <RefreshButton onClick={forceRerender} />
          </Flex>

          <Customize>
            <PreviewSwitch
              title="Start collapsed"
              isChecked={defaultCollapsed}
              onChange={checked => {
                updateProp('defaultCollapsed', checked);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Default width"
              min={minWidth}
              max={maxWidth}
              step={10}
              value={defaultWidth}
              valueUnit="px"
              onChange={val => {
                updateProp('defaultWidth', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Min width"
              min={160}
              max={260}
              step={10}
              value={minWidth}
              valueUnit="px"
              onChange={val => {
                updateProp('minWidth', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Max width"
              min={280}
              max={480}
              step={10}
              value={maxWidth}
              valueUnit="px"
              onChange={val => {
                updateProp('maxWidth', val);
                forceRerender();
              }}
            />
          </Customize>

          <PropTable data={propData} />
          <Dependencies dependencyList={['lucide-react', 'tailwind-merge']} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={sidebar} componentName="Sidebar" />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default SidebarDemo;
