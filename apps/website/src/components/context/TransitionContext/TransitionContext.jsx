import { createContext, useCallback, useRef, useState } from 'react';

const TransitionContext = createContext(null);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState('idle');
  const preloadedComponents = useRef(new Map());

  const preloadComponent = useCallback(async (subcategory, componentMap) => {
    if (!subcategory || preloadedComponents.current.has(subcategory)) {
      return preloadedComponents.current.get(subcategory);
    }

    const loader = componentMap[subcategory];
    if (!loader) return null;

    const component = await loader();
    preloadedComponents.current.set(subcategory, component);
    return component;
  }, []);

  const startTransition = useCallback(
    async (targetSubcategory, componentMap, onNavigate) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTransitionPhase('fade-out');

      const preloadPromise = preloadComponent(targetSubcategory, componentMap);
      await delay(150);
      setTransitionPhase('loading');

      const MAX_PRELOAD_WAIT = 400;
      await Promise.race([preloadPromise, delay(MAX_PRELOAD_WAIT)]);

      onNavigate();

      setTransitionPhase('fade-in');
      await delay(150);
      setTransitionPhase('idle');
      setIsTransitioning(false);
    },
    [isTransitioning, preloadComponent]
  );

  const clearPreloadedComponents = useCallback(() => preloadedComponents.current.clear(), []);
  const getPreloadedComponent = useCallback(subcategory => preloadedComponents.current.get(subcategory), []);

  const value = {
    isTransitioning,
    transitionPhase,
    startTransition,
    preloadComponent,
    clearPreloadedComponents,
    getPreloadedComponent
  };

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
};

export { TransitionContext };
