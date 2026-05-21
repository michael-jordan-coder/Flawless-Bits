import { useContext } from 'react';
import ComponentPropsContext from '../components/context/ComponentPropsContext';

export function useComponentPropsContext() {
  return useContext(ComponentPropsContext);
}

export default useComponentPropsContext;
