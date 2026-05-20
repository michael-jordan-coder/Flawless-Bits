'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { customTheme } from '../../utils/customTheme';

export function Provider({ children }) {
  return (
    <ChakraProvider value={customTheme}>
      <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="dark" forcedTheme="dark">
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
