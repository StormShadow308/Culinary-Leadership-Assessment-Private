import { Group, Skeleton, Stack } from '@mantine/core';

export function UserInfoSkeleton() {
  return (
    <Group gap={7}>
      <Stack visibleFrom="sm" align="end" ta="end" gap={5}>
        <Skeleton height={12} width={100} />
        <Skeleton height={12} width={75} />
      </Stack>
      <Skeleton height={36} circle />
    </Group>
  );
}
