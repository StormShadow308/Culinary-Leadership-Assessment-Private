import { Avatar, Group, MenuTarget, Stack, Text, UnstyledButton } from '@mantine/core';

import { authClient } from '~/lib/auth-client';

import { UserInfoSkeleton } from './user-info-skeleton';

export function UserInfo() {
  const { data, isPending } = authClient.useSession();

  if (!data && isPending) return <UserInfoSkeleton />;

  const { user } = data ?? {};

  return (
    <MenuTarget>
      <UnstyledButton>
        <Group gap={7}>
          <Stack visibleFrom="sm" align="end" ta="end" gap={2}>
            <Text size="sm" lh={1}>
              {user?.name}
            </Text>
            <Text size="xs" lh={1} c="dimmed">
              {user?.email}
            </Text>
          </Stack>
          <Avatar alt={user?.name} size={40} radius="xl" src={user?.image} />
        </Group>
      </UnstyledButton>
    </MenuTarget>
  );
}
