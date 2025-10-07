'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Group, 
  Stack, 
  Text, 
  Badge, 
  Progress, 
  Alert, 
  Button, 
  Table, 
  Center, 
  Loader,
  Grid,
  Divider,
  ScrollArea
} from '@mantine/core';
import { 
  IconUsers, 
  IconActivity, 
  IconShield, 
  IconAlertTriangle, 
  IconRefresh,
  IconClock,
  IconDatabase,
  IconCloud
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface SystemStats {
  activeUsers: number;
  maxUsers: number;
  utilizationPercent: number;
  rateLimitStats: {
    totalEntries: number;
    activeUsers: number;
    blockedUsers: number;
  };
  sessionStats: {
    activeSessions: number;
    totalUsers: number;
    cacheSize: number;
  };
}

interface UserActivity {
  userId: string;
  email: string;
  role: string;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

export function MonitoringDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/monitoring/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch monitoring data',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch monitoring data',
        color: 'red',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUserActivity = async () => {
    try {
      const response = await fetch('/api/admin/monitoring/activity');
      const data = await response.json();
      
      if (data.success) {
        setUserActivity(data.data);
      }
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUserActivity();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchUserActivity();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getUtilizationColor = (percent: number) => {
    if (percent < 50) return 'green';
    if (percent < 80) return 'yellow';
    return 'red';
  };

  const getUtilizationStatus = (percent: number) => {
    if (percent < 50) return 'Healthy';
    if (percent < 80) return 'Moderate';
    return 'High Load';
  };

  if (loading) {
    return (
      <Center h={200}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading monitoring data...</Text>
        </Stack>
      </Center>
    );
  }

  if (!stats) {
    return (
      <Alert icon={<IconAlertTriangle size={16} />} title="Error" color="red">
        Failed to load monitoring data. Please try again.
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      {/* System Overview */}
      <Grid>
        <Grid.Col span={6}>
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Active Users</Text>
              <IconUsers size={20} />
            </Group>
            <Text size="xl" fw={700}>{stats.activeUsers}</Text>
            <Text size="sm" c="dimmed">of {stats.maxUsers} maximum</Text>
            <Progress 
              value={stats.utilizationPercent} 
              color={getUtilizationColor(stats.utilizationPercent)}
              size="sm" 
              mt="sm" 
            />
            <Text size="xs" c="dimmed" mt="xs">
              {getUtilizationStatus(stats.utilizationPercent)} ({stats.utilizationPercent}%)
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Rate Limiting</Text>
              <IconShield size={20} />
            </Group>
            <Text size="xl" fw={700}>{stats.rateLimitStats.activeUsers}</Text>
            <Text size="sm" c="dimmed">
              {stats.rateLimitStats.blockedUsers} blocked
            </Text>
            <Badge 
              color={stats.rateLimitStats.blockedUsers > 0 ? 'red' : 'green'} 
              variant="light" 
              size="sm" 
              mt="xs"
            >
              {stats.rateLimitStats.blockedUsers > 0 ? 'Blocking Active' : 'Normal'}
            </Badge>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Session Statistics */}
      <Grid>
        <Grid.Col span={4}>
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Active Sessions</Text>
              <IconActivity size={20} />
            </Group>
            <Text size="xl" fw={700}>{stats.sessionStats.activeSessions}</Text>
            <Text size="sm" c="dimmed">Currently active</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Total Users</Text>
              <IconDatabase size={20} />
            </Group>
            <Text size="xl" fw={700}>{stats.sessionStats.totalUsers}</Text>
            <Text size="sm" c="dimmed">In database</Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Cache Size</Text>
              <IconCloud size={20} />
            </Group>
            <Text size="xl" fw={700}>{stats.sessionStats.cacheSize}</Text>
            <Text size="sm" c="dimmed">Cached sessions</Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* System Status */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" align="center" mb="md">
          <Text fw={500}>System Status</Text>
          <Button
            variant="outline"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchStats}
            loading={refreshing}
            size="sm"
          >
            Refresh
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={6}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">User Capacity</Text>
                <Badge 
                  color={stats.utilizationPercent < 80 ? 'green' : 'red'}
                  variant="light"
                >
                  {stats.utilizationPercent < 80 ? 'Healthy' : 'High Load'}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Rate Limiting</Text>
                <Badge 
                  color={stats.rateLimitStats.blockedUsers === 0 ? 'green' : 'yellow'}
                  variant="light"
                >
                  {stats.rateLimitStats.blockedUsers === 0 ? 'Normal' : 'Active'}
                </Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Session Management</Text>
                <Badge color="green" variant="light">Active</Badge>
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={6}>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Data Isolation</Text>
                <Badge color="green" variant="light">Enabled</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Security Headers</Text>
                <Badge color="green" variant="light">Active</Badge>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Audit Logging</Text>
                <Badge color="green" variant="light">Enabled</Badge>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      {/* User Activity Table */}
      <Card withBorder padding={0} radius="md">
        <Group justify="space-between" p="md" pb={0}>
          <Text fw={500}>Recent User Activity</Text>
          <Text size="sm" c="dimmed">
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </Group>
        
        <Divider />
        
        <ScrollArea>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Last Activity</Table.Th>
                <Table.Th>IP Address</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {userActivity.map((user) => (
                <Table.Tr key={user.sessionId}>
                  <Table.Td>
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>{user.email}</Text>
                      <Text size="xs" c="dimmed">{user.userId}</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Badge 
                      color={
                        user.role === 'admin' ? 'red' : 
                        user.role === 'organization' ? 'blue' : 'green'
                      }
                      variant="light"
                      size="sm"
                    >
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{user.lastActivity}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{user.ipAddress}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light" size="sm">
                      Active
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Alerts */}
      {stats.utilizationPercent > 80 && (
        <Alert icon={<IconAlertTriangle size={16} />} title="High User Load" color="yellow">
          System is experiencing high user load ({stats.utilizationPercent}% capacity). 
          Consider scaling resources or implementing additional rate limiting.
        </Alert>
      )}

      {stats.rateLimitStats.blockedUsers > 10 && (
        <Alert icon={<IconShield size={16} />} title="High Rate Limiting Activity" color="orange">
          {stats.rateLimitStats.blockedUsers} users are currently being rate limited. 
          This may indicate potential abuse or high legitimate usage.
        </Alert>
      )}
    </Stack>
  );
}
