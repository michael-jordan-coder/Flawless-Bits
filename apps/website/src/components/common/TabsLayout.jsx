import React from 'react';
import { Box, Flex, Icon, Tabs } from '@chakra-ui/react';
import { FiCode, FiEye } from 'react-icons/fi';
import { RotateCcw } from 'lucide-react';
import { colors } from '../../constants/colors';
import { useComponentPropsContext } from '../../hooks/useComponentPropsContext';

const TAB_STYLE_PROPS = {
  flex: '0 0 auto',
  border: `1px solid ${colors.borderSecondary}`,
  borderRadius: '10px',
  fontSize: '14px',
  h: 10,
  px: 4,
  color: '#ffffff',
  justifyContent: 'center',
  _hover: { bg: colors.bgHover },
  _selected: { bg: colors.bgElevated, color: colors.accent }
};

const TabsLayout = ({ children, className }) => {
  const { hasChanges, resetProps } = useComponentPropsContext();

  const contentMap = { PreviewTab: null, CodeTab: null };
  React.Children.forEach(children, child => {
    if (!child) return;
    if (child.type === PreviewTab) contentMap.PreviewTab = child;
    if (child.type === CodeTab) contentMap.CodeTab = child;
  });

  return (
    <Tabs.Root w="100%" variant="plain" lazyMount defaultValue="preview" className={className}>
      <Tabs.List w="100%">
        <Flex gap={2} justifyContent="space-between" alignItems="center" w="100%" wrap="nowrap">
          <Flex gap={2} wrap="nowrap" minW="0">
            <Tabs.Trigger value="preview" {...TAB_STYLE_PROPS}>
              <Icon as={FiEye} /> Preview
            </Tabs.Trigger>
            <Tabs.Trigger value="code" {...TAB_STYLE_PROPS}>
              <Icon as={FiCode} /> Code
            </Tabs.Trigger>
          </Flex>
          {hasChanges && (
            <Box
              as="button"
              aria-label="Reset to defaults"
              onClick={resetProps}
              display="flex"
              cursor="pointer"
              alignItems="center"
              justifyContent="center"
              gap={2}
              {...TAB_STYLE_PROPS}
            >
              <RotateCcw size={16} color="#fff" /> Reset
            </Box>
          )}
        </Flex>
      </Tabs.List>

      <Tabs.Content pt={4} value="preview">
        {contentMap.PreviewTab}
      </Tabs.Content>
      <Tabs.Content pt={4} value="code">
        {contentMap.CodeTab}
      </Tabs.Content>
    </Tabs.Root>
  );
};

export const PreviewTab = ({ children }) => <>{children}</>;
export const CodeTab = ({ children }) => <>{children}</>;

export { TabsLayout };
