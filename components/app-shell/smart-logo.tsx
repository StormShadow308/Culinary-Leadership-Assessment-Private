'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Group, Title, Anchor } from '@mantine/core';
import { useOrgContext } from '~/app/organisation/components/use-org-context';

interface SmartLogoProps {
  className?: string;
}

export function SmartLogo({ className }: SmartLogoProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedOrgId } = useOrgContext();

  const handleLogoClick = () => {
    // Only navigate if we're not already on the appropriate dashboard
    if (pathname.startsWith('/admin')) {
      // Admin users - only navigate if not already on admin dashboard
      if (pathname !== '/admin') {
        router.push('/admin');
      }
    } else if (pathname.startsWith('/organisation')) {
      // Organization users - go to their organization dashboard
      if (selectedOrgId) {
        router.push(`/organisation?orgId=${selectedOrgId}`);
      } else {
        router.push('/organisation');
      }
    } else if (pathname.startsWith('/assessment') || pathname.startsWith('/attempt')) {
      // Students - stay on current assessment/attempt page or go to assessment
      if (pathname.startsWith('/assessment')) {
        // If already on assessment, stay there
        return;
      } else if (pathname.startsWith('/attempt')) {
        // If on attempt page, stay there
        return;
      } else {
        // Otherwise go to assessment page
        router.push('/assessment');
      }
    } else if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
      // Auth pages - go to home
      router.push('/');
    } else {
      // Default fallback - go to home
      router.push('/');
    }
  };

  return (
    <Anchor 
      underline="never" 
      c="var(--mantine-color-text)" 
      onClick={handleLogoClick}
      style={{ cursor: 'pointer' }}
      className={className}
    >
      <Group gap="xs">
        <img src="/logo.png" alt="TLA Logo" width={26} height={26} style={{ objectFit: 'contain' }} />
        <Title mr={16} order={3} fw={600} style={{ cursor: 'pointer' }}>
          Culinary Assessment
        </Title>
      </Group>
    </Anchor>
  );
}
