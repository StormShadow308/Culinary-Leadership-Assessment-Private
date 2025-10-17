import { Card, Group, Stack, Title, Text, Button, Alert, Badge, Table, ActionIcon, Tooltip, Loader, Center } from '@mantine/core';
import { IconRefresh, IconCheck, IconX, IconAlertTriangle, IconDatabase, IconCloud, IconSync } from '@tabler/icons-react';
import { getCurrentUser } from '~/lib/user-sync';
import { SyncDashboard } from './components/sync-dashboard';

// Force dynamic rendering for pages that use cookies
export const dynamic = 'force-dynamic';

export default async function AdminSync() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2}>Data Synchronization</Title>
        <Text size="sm" c="dimmed">
          Keep Supabase and local database in sync
        </Text>
      </Group>

      <SyncDashboard />
    </Stack>
  );
}
