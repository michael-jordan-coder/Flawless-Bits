import { useContext } from 'react';
import { OptionsContext } from './OptionsContext';

export function useOptions() {
  const ctx = useContext(OptionsContext);
  if (!ctx) throw new Error('useOptions must be used within OptionsProvider');
  return ctx;
}
