import type { MantineThemeOverride } from '@mantine/core';
import { colorsTuple, virtualColor } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colors: {
    backgroundLight: colorsTuple('#F8F9FA'),
    backgroundDark: colorsTuple('#3D3D3D'),
    paperLight: colorsTuple('#FFFFFF'),
    paperDark: colorsTuple('#2E2E2E'),
    background: virtualColor({
      name: 'background',
      light: 'backgroundLight',
      dark: 'backgroundDark',
    }),
    paper: virtualColor({ name: 'paper', light: 'paperLight', dark: 'paperDark' }),
  },
  primaryColor: 'orange',
  defaultRadius: 'md',
};
