import { MantineColorScheme, MenuItem, MenuLabel, useMantineColorScheme } from '@mantine/core';

import { IconDeviceImac, IconMoon, IconSun } from '@tabler/icons-react';

function getMenuItemStyle(colorScheme: MantineColorScheme, currentColorScheme: MantineColorScheme) {
  const isActive = colorScheme === currentColorScheme;
  return {
    background: isActive
      ? colorScheme === 'dark' || colorScheme === 'auto'
        ? 'var(--mantine-color-dark-4)'
        : 'var(--mantine-color-gray-2)'
      : undefined,
    color: isActive
      ? colorScheme === 'dark' || colorScheme === 'auto'
        ? 'var(--mantine-color-white)'
        : 'var(--mantine-color-dark-6)'
      : undefined,
  };
}
export function ThemeSelect() {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const handleThemeSelect = (theme: MantineColorScheme) => {
    setColorScheme(theme);
  };

  return (
    <>
      <MenuLabel>Theme</MenuLabel>
      <MenuItem
        style={getMenuItemStyle('light', colorScheme)}
        onClick={() => handleThemeSelect('light')}
        leftSection={<IconSun width={16} />}
      >
        Light
      </MenuItem>
      <MenuItem
        style={getMenuItemStyle('dark', colorScheme)}
        onClick={() => handleThemeSelect('dark')}
        leftSection={<IconMoon width={16} />}
      >
        Dark
      </MenuItem>
      <MenuItem
        style={getMenuItemStyle('auto', colorScheme)}
        onClick={() => handleThemeSelect('auto')}
        leftSection={<IconDeviceImac width={16} />}
      >
        System
      </MenuItem>
    </>
  );
}
