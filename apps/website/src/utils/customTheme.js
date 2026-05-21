import { createSystem, defaultConfig } from '@chakra-ui/react';

export const toastStyles = {
  style: {
    fontSize: '12px',
    borderRadius: '0.75rem',
    border: '1px solid var(--border-primary)',
    color: '#fff',
    backgroundColor: 'var(--bg-body)',
    textAlign: 'center'
  }
};

export const customTheme = createSystem(defaultConfig, {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  }
});
