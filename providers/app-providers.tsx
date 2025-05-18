'use client';

import { MantineProvider } from '@mantine/core';

import { theme } from '~/theme';

import ColorSchemeProvider from './color-scheme-provider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </MantineProvider>
  );
}
