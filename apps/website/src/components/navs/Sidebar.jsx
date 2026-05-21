import { Fragment, memo, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Text, VStack } from '@chakra-ui/react';

import { CATEGORIES, NEW, UPDATED } from '../../constants/Categories';
import { componentMap } from '../../constants/Components';
import { useTransition } from '../../hooks/useTransition';
import { slug } from '../../utils/utils';

const Category = memo(({ category, location, handleNavigation, isTransitioning, isFirstCategory }) => {
  const items = useMemo(
    () =>
      category.subcategories.map(sub => {
        const path = `/${slug(category.name)}/${slug(sub)}`;
        return {
          sub,
          path,
          isActive: location.pathname === path,
          isNew: NEW.includes(sub),
          isUpdated: UPDATED.includes(sub)
        };
      }),
    [category.name, category.subcategories, location.pathname]
  );

  if (items.length === 0) {
    return (
      <Box>
        <Text className="category-name" mb={2} mt={isFirstCategory ? 0 : 4}>
          {category.name}
        </Text>
        <Text fontSize="13px" color="#6b6b75" pl={4}>
          No items yet
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text className="category-name" mb={2} mt={isFirstCategory ? 0 : 4}>
        {category.name}
      </Text>
      <Stack spacing={0.5} pl={4} borderLeft="1px solid var(--border-primary)" position="relative">
        {items.map(({ sub, path, isActive, isNew, isUpdated }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-item ${isActive ? 'active-sidebar-item' : ''} ${isTransitioning ? 'transitioning' : ''}`}
            onClick={e => {
              e.preventDefault();
              handleNavigation(path, sub);
            }}
          >
            {sub}
            {isNew && <span className="new-tag">New</span>}
            {isUpdated && <span className="updated-tag">Updated</span>}
          </Link>
        ))}
      </Stack>
    </Box>
  );
});

Category.displayName = 'Category';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTransition, isTransitioning } = useTransition();

  const handleNavigation = async (path, subcategory) => {
    if (isTransitioning || location.pathname === path) return;
    await startTransition(slug(subcategory), componentMap, () => {
      navigate(path);
      window.scrollTo(0, 0);
    });
  };

  return (
    <Box as="nav" className="sidebar">
      <VStack align="stretch" spacing={4}>
        {CATEGORIES.map((cat, i) => (
          <Fragment key={cat.name}>
            <Category
              category={cat}
              location={location}
              handleNavigation={handleNavigation}
              isTransitioning={isTransitioning}
              isFirstCategory={i === 0}
            />
          </Fragment>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
