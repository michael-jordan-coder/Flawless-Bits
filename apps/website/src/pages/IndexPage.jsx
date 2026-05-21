import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { componentMetadata } from '../constants/Information';
import { slug } from '../utils/utils';
import BackToTopButton from '../components/common/BackToTopButton';
import { colors } from '../constants/colors';

const IndexPage = () => {
  const entries = Object.entries(componentMetadata);

  return (
    <Box>
      <h2 className="sub-category">Index</h2>
      {entries.length === 0 ? (
        <Text color={colors.textMuted} fontSize="14px">
          No components yet. Add one with{' '}
          <code style={{ background: colors.bgElevated, padding: '2px 6px', borderRadius: 4 }}>
            npm run new:component -- Components &lt;Name&gt;
          </code>
          .
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
          {entries.map(([key, meta]) => {
            const to = `/${slug(meta.category)}/${slug(meta.name)}`;
            return (
              <Link key={key} to={to}>
                <Box
                  p={4}
                  bg={colors.bgCard}
                  border={`1px solid ${colors.borderPrimary}`}
                  borderRadius="12px"
                  transition="background 0.2s ease"
                  _hover={{ bg: colors.bgHover }}
                >
                  <Text color="#fff" fontWeight={600} fontSize="15px">
                    {meta.name}
                  </Text>
                  <Text color={colors.textMuted} fontSize="13px" mt={1}>
                    {meta.description}
                  </Text>
                </Box>
              </Link>
            );
          })}
        </SimpleGrid>
      )}
      <BackToTopButton />
    </Box>
  );
};

export default IndexPage;
