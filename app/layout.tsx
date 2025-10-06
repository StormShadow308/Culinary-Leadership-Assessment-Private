import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import '@mantine/core/styles.css';

import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';

import AppProviders from '~/providers/app-providers';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Culinary Leadership Assessment',
  description:
    'Transform your culinary leadership skills with our comprehensive assessment platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
