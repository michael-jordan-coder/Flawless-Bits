import { useContext } from 'react';
import { TransitionContext } from '../components/context/TransitionContext/TransitionContext';

export const useTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used within a TransitionProvider');
  return ctx;
};
