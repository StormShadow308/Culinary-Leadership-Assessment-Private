'use client';

import { useEffect } from 'react';

// NextImage import removed - using regular img tags
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Anchor,
  Box,
  Burger,
  Flex,
  Group,
  AppShell as MantineAppShell,
  Title,
  useMantineColorScheme,
} from '@mantine/core';

import { useDisclosure, useHotkeys } from '@mantine/hooks';

// Logo will be loaded from public directory

import { UserMenu } from './user-menu';

const THEME_HOT_KEY = 'mod+J';

export type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

interface AppShellProps {
  children: React.ReactNode;
  links?: Array<NavLink>;
}

export function AppShell({ children, links = [] }: AppShellProps) {
  const [opened, { toggle, close }] = useDisclosure();

  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const pathname = usePathname();

  const changeTheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  const isLinkActive = (href: string) => {
    // Special case for home page
    if (href === '/') return pathname === href;

    // Special case for root section routes (like /designer, /admin, /client)
    if (href.split('/').length === 2 && href !== '/') {
      return pathname === href || pathname === `${href}/`;
    }

    // For sub-routes, ensure it's an exact match or a true sub-path
    if (pathname.startsWith(href)) {
      // This ensures that `/designer` doesn't match for `/designer/settings`
      // by checking if the next character after href is a slash or nothing
      const nextChar = pathname.charAt(href.length);
      return nextChar === '' || nextChar === '/';
    }

    return false;
  };

  // Listen for theme change hotkey
  useHotkeys([[THEME_HOT_KEY, changeTheme]]);

  // Close mobile navigation on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'lg',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* Desktop header */}
      <MantineAppShell.Header
        display="flex"
        style={{ flexDirection: 'column', height: 60 }}
        bg="paper"
      >
        <Group justify="space-between" h="100%" px="md">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="lg" size="sm" />
            <Anchor underline="never" c="var(--mantine-color-text)" component={Link} href="/">
              <Group gap="xs">
                <img src="/logo.png" alt="TLA Logo" width={26} height={26} style={{ objectFit: 'contain' }} />
                <Title mr={16} order={3} fw={600} style={{ cursor: 'pointer' }}>
                  Culinary Assessment
                </Title>
              </Group>
            </Anchor>
          </Group>
          <UserMenu />
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="md">
        <Flex direction="column" gap="md">
          {links.map(link => {
            const active = isLinkActive(link.href);
            return (
              <Anchor
                key={link.href}
                underline="never"
                component={Link}
                prefetch={true}
                href={link.href}
                bg={active ? 'var(--mantine-primary-color-light)' : 'transparent'}
                c={
                  active ? 'var(--mantine-primary-color-light-color)' : 'var(--mantine-color-text)'
                }
                p="xs"
                style={{ borderRadius: 'var(--mantine-radius-sm)' }}
              >
                <Group gap="md">
                  {link.icon && (
                    <Flex c={active ? 'var(--mantine-primary-color-light-color)' : 'inherit'}>
                      {link.icon}
                    </Flex>
                  )}
                  <Box>{link.label}</Box>
                </Group>
              </Anchor>
            );
          })}
        </Flex>
      </MantineAppShell.Navbar>
      {/* Page content */}
      <MantineAppShell.Main display="flex" bg="background">
        <Box w="100%">{children}</Box>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
