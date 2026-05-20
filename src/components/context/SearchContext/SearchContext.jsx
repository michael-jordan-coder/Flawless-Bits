/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useState } from 'react';

export const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleSearch = useCallback(() => setSearchOpen(prev => !prev), []);

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch, toggleSearch, isSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
}
