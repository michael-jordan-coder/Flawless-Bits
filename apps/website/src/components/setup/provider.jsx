'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { customTheme } from '../../utils/customTheme';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function Provider({ children }) {
  const tree = (
    <ChakraProvider value={customTheme}>
      <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="dark" forcedTheme="dark">
        {children}
      </ThemeProvider>
    </ChakraProvider>
  );

  if (!googleClientId) return tree;

  return <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider>;
}
