'use client';

import { useEffect, useRef, useState } from 'react';

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

import { useDisclosure, useHotkeys, useMediaQuery } from '@mantine/hooks';

// Logo will be loaded from public directory

import { UserMenu } from './user-menu';
import { SmartLogo } from './smart-logo';

const THEME_HOT_KEY = 'mod+J';

export type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

interface AppShellProps {
  children: React.ReactNode;
  links?: Array<NavLink>;
  headerContent?: React.ReactNode;
}

export function AppShell({ children, links = [], headerContent }: AppShellProps) {
  const [opened, { toggle, close }] = useDisclosure();
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { setColorScheme, colorScheme } = useMantineColorScheme();

  const pathname = usePathname();

  // Responsive breakpoints with hydration safety
  const isMobile = useMediaQuery('(max-width: 1023px)');

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

  // Hydration effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile navigation on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Click outside handler for mobile navigation
  useEffect(() => {
    if (!mounted) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && opened && overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mounted, isMobile, opened, close]);

  // Debug mobile navigation
  useEffect(() => {
    if (mounted) {
      console.log('Mobile navigation debug:', { 
        isMobile, 
        opened, 
        linksCount: links.length,
        burgerVisible: isMobile,
        navbarElement: document.querySelector('.mantine-AppShell-navbar')
      });
    }
  }, [mounted, isMobile, opened, links.length]);

  // Additional debug for navbar state
  useEffect(() => {
    if (mounted && isMobile) {
      const navbar = document.querySelector('.mantine-AppShell-navbar');
      if (navbar) {
        console.log('Navbar element found:', {
          className: navbar.className,
          style: navbar.getAttribute('style'),
          dataAttributes: Array.from(navbar.attributes).filter(attr => attr.name.startsWith('data-'))
        });
      }
    }
  }, [mounted, isMobile, opened]);

  return (
    <MantineAppShell
      header={{ height: { base: 60, sm: 70 } }}
      navbar={{
        width: { base: 280, sm: 300 },
        breakpoint: 'lg',
        collapsed: { mobile: !opened, desktop: false },
      }}
      padding="md"
      layout="default"
      withBorder={false}
    >
      {/* Mobile Navigation Overlay */}
      {mounted && isMobile && opened && (
        <div 
          ref={overlayRef}
          className="mobile-nav-overlay" 
          data-opened={opened}
          onClick={close}
        />
      )}

      {/* Responsive Header */}
      <MantineAppShell.Header
        style={{ 
          height: 'auto',
          minHeight: 'var(--header-height-mobile)',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--spacing-sm)',
        }}
        bg="paper"
      >
        <Group gap="sm" style={{ flex: '1', minWidth: 0, maxWidth: '100%' }}>
          <Burger 
            opened={opened} 
            onClick={() => {
              console.log('Burger clicked! Current state:', { opened, isMobile });
              toggle();
            }} 
            hiddenFrom="lg" 
            size="sm"
            aria-label="Toggle navigation"
            style={{ flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <SmartLogo />
          </div>
        </Group>
        <Group gap="md" style={{ flexShrink: 0 }}>
          {headerContent}
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
                    <Box 
                      style={{ 
                        color: active ? 'var(--mantine-primary-color-light-color)' : 'inherit',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {link.icon}
                    </Box>
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
