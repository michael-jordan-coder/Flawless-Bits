/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState } from 'react';

export const OptionsContext = createContext(null);

export function OptionsProvider({ children }) {
  const [languagePreset, setLanguagePreset] = useState('JS');
  const [stylePreset, setStylePreset] = useState('CSS');

  useEffect(() => {
    const storedLang = localStorage.getItem('preferredLanguage');
    const storedStyle = localStorage.getItem('preferredStyle');
    if (storedLang === 'JS' || storedLang === 'TS') setLanguagePreset(storedLang);
    if (storedStyle === 'CSS' || storedStyle === 'TW') setStylePreset(storedStyle);
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredLanguage', languagePreset);
  }, [languagePreset]);

  useEffect(() => {
    localStorage.setItem('preferredStyle', stylePreset);
  }, [stylePreset]);

  const toggleLanguage = useCallback(() => {
    setLanguagePreset(prev => (prev === 'JS' ? 'TS' : 'JS'));
  }, []);
  const toggleStyle = useCallback(() => {
    setStylePreset(prev => (prev === 'CSS' ? 'TW' : 'CSS'));
  }, []);

  return (
    <OptionsContext.Provider
      value={{
        languagePreset,
        setLanguagePreset,
        stylePreset,
        setStylePreset,
        toggleLanguage,
        toggleStyle
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
}
