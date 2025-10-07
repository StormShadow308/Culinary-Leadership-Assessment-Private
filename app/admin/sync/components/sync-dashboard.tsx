'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Group, 
  Stack, 
  Text, 
  Button, 
  Alert, 
  Badge, 
  Table, 
  ActionIcon, 
  Tooltip, 
  Loader, 
  Center,
  Progress,
  Divider,
  ScrollArea
} from '@mantine/core';
import { 
  IconRefresh, 
  IconCheck, 
  IconX, 
  IconAlertTriangle, 
  IconDatabase, 
  IconCloud, 
  IconArrowsExchange,
  IconInfoCircle
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface UserSyncStatus {
  email: string;
  localExists: boolean;
  supabaseExists: boolean;
  inSync: boolean;
  localData?: any;
  supabaseData?: any;
  issues: string[];
}

interface SyncSummary {
  total: number;
  inSync: number;
  orphanedLocal: number;
  orphanedSupabase: number;
  inconsistent: number;
}

interface SyncResult {
  success: boolean;
  message: string;
  details: {
    localUsers: number;
    supabaseUsers: number;
    syncedUsers: number;
    orphanedLocal: string[];
    orphanedSupabase: string[];
    errors: string[];
  };
}

export function SyncDashboard() {
  const [syncStatus, setSyncStatus] = useState<UserSyncStatus[]>([]);
  const [summary, setSummary] = useState<SyncSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const fetchSyncStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sync?action=status');
      const data = await response.json();
      
      if (data.success) {
        setSyncStatus(data.data);
        setSummary(data.summary);
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch sync status',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error fetching sync status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch sync status',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const syncAllUsers = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-all' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: data.data.message,
          color: 'green',
        });
        setLastSync(new Date());
        await fetchSyncStatus();
      } else {
        notifications.show({
          title: 'Sync Failed',
          message: data.data?.message || 'Unknown error',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error syncing users:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to sync users',
        color: 'red',
      });
    } finally {
      setSyncing(false);
    }
  };

  const syncUser = async (email: string) => {
    try {
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync-user', email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: data.message,
          color: 'green',
        });
        await fetchSyncStatus();
      } else {
        notifications.show({
          title: 'Sync Failed',
          message: data.message,
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to sync user',
        color: 'red',
      });
    }
  };

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const getSyncStatusBadge = (status: UserSyncStatus) => {
    if (status.inSync) {
      return <Badge color="green" leftSection={<IconCheck size={12} />}>In Sync</Badge>;
    } else if (status.localExists && !status.supabaseExists) {
      return <Badge color="orange" leftSection={<IconDatabase size={12} />}>Local Only</Badge>;
    } else if (!status.localExists && status.supabaseExists) {
      return <Badge color="red" leftSection={<IconCloud size={12} />}>Supabase Only</Badge>;
    } else {
      return <Badge color="yellow" leftSection={<IconAlertTriangle size={12} />}>Inconsistent</Badge>;
    }
  };

  const getSyncProgress = () => {
    if (!summary) return 0;
    return summary.total > 0 ? (summary.inSync / summary.total) * 100 : 100;
  };

  if (loading) {
    return (
      <Center h={200}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading sync status...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {/* Summary Cards */}
      <Group grow>
        <Card withBorder padding="lg" radius="md">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Total Users</Text>
            <IconDatabase size={20} />
          </Group>
          <Text size="xl" fw={700}>{summary?.total || 0}</Text>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>In Sync</Text>
            <IconCheck size={20} color="green" />
          </Group>
          <Text size="xl" fw={700} c="green">{summary?.inSync || 0}</Text>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Issues</Text>
            <IconAlertTriangle size={20} color="orange" />
          </Group>
          <Text size="xl" fw={700} c="orange">
            {(summary?.orphanedLocal || 0) + (summary?.orphanedSupabase || 0) + (summary?.inconsistent || 0)}
          </Text>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Sync Progress</Text>
            <IconArrowsExchange size={20} />
          </Group>
          <Progress value={getSyncProgress()} size="sm" radius="md" />
        </Card>
      </Group>

      {/* Sync Actions */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Text fw={500}>Synchronization Actions</Text>
            <Text size="sm" c="dimmed">
              Keep your data synchronized between Supabase and local database
            </Text>
            {lastSync && (
              <Text size="xs" c="dimmed">
                Last sync: {lastSync.toLocaleString()}
              </Text>
            )}
          </Stack>
          <Group>
            <Button
              variant="outline"
              leftSection={<IconRefresh size={16} />}
              onClick={fetchSyncStatus}
              loading={loading}
            >
              Refresh Status
            </Button>
            <Button
              leftSection={<IconArrowsExchange size={16} />}
              onClick={syncAllUsers}
              loading={syncing}
              disabled={loading}
            >
              Sync All Users
            </Button>
          </Group>
        </Group>
      </Card>

      {/* Issues Alert */}
      {summary && (summary.orphanedLocal > 0 || summary.orphanedSupabase > 0 || summary.inconsistent > 0) && (
        <Alert
          icon={<IconInfoCircle size={16} />}
          title="Data Synchronization Issues Detected"
          color="yellow"
        >
          <Text size="sm">
            Found {summary.orphanedLocal} orphaned local users, {summary.orphanedSupabase} orphaned Supabase users, 
            and {summary.inconsistent} users with data inconsistencies. 
            Click "Sync All Users" to resolve these issues.
          </Text>
        </Alert>
      )}

      {/* Users Table */}
      <Card withBorder padding={0} radius="md">
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Email</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Local DB</Table.Th>
                <Table.Th>Supabase</Table.Th>
                <Table.Th>Issues</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {syncStatus.map((user) => (
                <Table.Tr key={user.email}>
                  <Table.Td>
                    <Text size="sm" fw={500}>{user.email}</Text>
                  </Table.Td>
                  <Table.Td>
                    {getSyncStatusBadge(user)}
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      color={user.localExists ? "green" : "red"}
                      variant="light"
                      size="sm"
                    >
                      {user.localExists ? "Yes" : "No"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      color={user.supabaseExists ? "green" : "red"}
                      variant="light"
                      size="sm"
                    >
                      {user.supabaseExists ? "Yes" : "No"}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {user.issues.length > 0 ? (
                      <Tooltip label={user.issues.join(', ')}>
                        <Badge color="red" variant="light" size="sm">
                          {user.issues.length} issue{user.issues.length > 1 ? 's' : ''}
                        </Badge>
                      </Tooltip>
                    ) : (
                      <Badge color="green" variant="light" size="sm">
                        None
                      </Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {!user.inSync && (
                      <Tooltip label="Sync this user">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => syncUser(user.email)}
                        >
                          <IconArrowsExchange size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>
    </Stack>
  );
}
