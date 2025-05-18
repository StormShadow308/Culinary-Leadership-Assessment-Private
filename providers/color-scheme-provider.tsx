import { useMantineColorScheme } from '@mantine/core';

import { useHotkeys } from '@mantine/hooks';

const THEME_HOT_KEY = 'mod+J';

export default function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const changeTheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  // Listen for theme change hotkey
  useHotkeys([[THEME_HOT_KEY, changeTheme]]);

  return <>{children}</>;
}
