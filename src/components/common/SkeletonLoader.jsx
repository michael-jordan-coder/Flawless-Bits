import { Box, Flex } from '@chakra-ui/react';
import { colors } from '../../constants/colors';

const Bar = ({ h = '24px', mb = 4, maxW, mt, ...rest }) => (
  <Box
    height={h}
    bg={colors.bgCard}
    borderRadius="20px"
    mb={mb}
    mt={mt}
    className="skeleton-pulse"
    maxWidth={maxW}
    {...rest}
  />
);

const TabBar = ({ w }) => (
  <Box borderRadius="10px" maxWidth={w} flex="1" height="100%" bg={colors.bgCard} className="skeleton-pulse" />
);

export const SkeletonLoader = () => (
  <Box className="skeleton-loader">
    <Flex height="36px" borderRadius="md" mb={6} gap={2} maxWidth="220px">
      <TabBar w="92px" />
      <TabBar w="92px" />
    </Flex>
    <Box className="skeleton-content">
      <Bar h="400px" mb={3} />
      <Bar maxW="200px" />
      <Bar maxW="300px" />
      <Bar maxW="230px" mb={12} />
    </Box>
  </Box>
);

export const GetStartedLoader = () => (
  <Box className="skeleton-loader">
    <Box className="skeleton-content">
      <Bar mt={6} maxW="600px" h="32px" />
      <Bar maxW="500px" />
      <Bar maxW="550px" mb={12} />
      <Bar maxW="500px" />
      <Bar maxW="400px" />
      <Bar h="60px" maxW="600px" />
      <Bar maxW="450px" />
    </Box>
  </Box>
);
