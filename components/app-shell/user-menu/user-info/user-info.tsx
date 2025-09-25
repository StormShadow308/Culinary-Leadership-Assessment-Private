import { Avatar, Group, MenuTarget, Stack, Text, UnstyledButton } from '@mantine/core';

import { useSupabaseSession } from '~/lib/use-supabase-session';

import { UserInfoSkeleton } from './user-info-skeleton';

export function UserInfo() {
  const { data, isPending } = useSupabaseSession();

  if (!data && isPending) return <UserInfoSkeleton />;

  const { user } = data ?? {};

  return (
    <MenuTarget>
      <UnstyledButton>
        <Group gap={7}>
          <Stack visibleFrom="sm" align="end" ta="end" gap={2}>
            <Text size="sm" lh={1}>
              {(user as { name?: string })?.name || 'User'}
            </Text>
            <Text size="xs" lh={1} c="dimmed">
              {(user as { email?: string })?.email || 'user@example.com'}
            </Text>
          </Stack>
          <Avatar alt={(user as { name?: string })?.name} size={40} radius="xl" src={(user as { image?: string })?.image} />
        </Group>
      </UnstyledButton>
    </MenuTarget>
  );
}
