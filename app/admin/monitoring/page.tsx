import { Card, Group, Stack, Title, Text, Badge, Progress, Alert, Button, Table, Center, Loader } from '@mantine/core';
import { IconUsers, IconActivity, IconShield, IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { getCurrentUser } from '~/lib/user-sync';
import { MonitoringDashboard } from './components/monitoring-dashboard';

// Force dynamic rendering for pages that use cookies
export const dynamic = 'force-dynamic';

export default async function AdminMonitoring() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2}>System Monitoring</Title>
        <Text size="sm" c="dimmed">
          Monitor concurrent users and system performance
        </Text>
      </Group>

      <MonitoringDashboard />
    </Stack>
  );
}
