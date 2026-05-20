import { createContext, useMemo } from 'react';

const ComponentPropsContext = createContext({
  props: {},
  defaultProps: {},
  hasChanges: false,
  resetProps: () => {},
  demoOnlyProps: [],
  computedProps: {}
});

export function ComponentPropsProvider({
  children,
  props,
  defaultProps,
  resetProps,
  hasChanges,
  demoOnlyProps = [],
  computedProps = {}
}) {
  const value = useMemo(
    () => ({ props, defaultProps, hasChanges, resetProps, demoOnlyProps, computedProps }),
    [props, defaultProps, hasChanges, resetProps, demoOnlyProps, computedProps]
  );

  return <ComponentPropsContext.Provider value={value}>{children}</ComponentPropsContext.Provider>;
}

export default ComponentPropsContext;
