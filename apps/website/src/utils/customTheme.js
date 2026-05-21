import { createSystem, defaultConfig } from '@chakra-ui/react';

export const toastStyles = {
  style: {
    fontSize: '12px',
    borderRadius: '0.75rem',
    border: '1px solid #2F293A',
    color: '#fff',
    backgroundColor: '#120F17',
    textAlign: 'center'
  }
};

export const customTheme = createSystem(defaultConfig, {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  }
});
