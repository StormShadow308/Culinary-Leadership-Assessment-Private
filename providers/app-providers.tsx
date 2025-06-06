'use client';

import { MantineProvider } from '@mantine/core';

import { theme } from '~/theme';

import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import ColorSchemeProvider from './color-scheme-provider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />

      <ColorSchemeProvider>{children}</ColorSchemeProvider>
    </MantineProvider>
  );
}
