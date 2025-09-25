import { Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconUsers, IconBuilding, IconChartBar, IconQuestionMark } from '@tabler/icons-react';
import { db } from '~/db';
import { user, organization, cohorts, participants, attempts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { count } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@mantine/core';

export default async function Admin() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  // Get statistics
  const [userCount] = await db.select({ count: count() }).from(user);
  const [orgCount] = await db.select({ count: count() }).from(organization);
  const [cohortCount] = await db.select({ count: count() }).from(cohorts);
  const [participantCount] = await db.select({ count: count() }).from(participants);
  const [attemptCount] = await db.select({ count: count() }).from(attempts);

  const stats = [
    {
      title: 'Total Users',
      value: userCount.count,
      icon: IconUsers,
      color: 'blue',
      href: '/admin/users'
    },
    {
      title: 'Organizations',
      value: orgCount.count,
      icon: IconBuilding,
      color: 'green',
      href: '/admin/organizations'
    },
    {
      title: 'Cohorts',
      value: cohortCount.count,
      icon: IconChartBar,
      color: 'orange',
      href: '/admin/cohorts'
    },
    {
      title: 'Participants',
      value: participantCount.count,
      icon: IconUsers,
      color: 'purple',
      href: '/admin/participants'
    },
    {
      title: 'Assessment Attempts',
      value: attemptCount.count,
      icon: IconQuestionMark,
      color: 'teal',
      href: '/admin/attempts'
    }
  ];

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>Admin Dashboard</Title>
        <Text size="sm" c="dimmed">
          Welcome back, {currentUser.name}
        </Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {stats.map((stat) => (
          <Card key={stat.title} padding="md" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  {stat.title}
                </Text>
                <Text fw={700} size="xl">
                  {stat.value}
                </Text>
              </div>
              <stat.icon size="2rem" stroke={1.5} />
            </Group>
            <Group mt="md">
              <Button
                component={Link}
                href={stat.href}
                variant="light"
                size="xs"
                fullWidth
              >
                View Details
              </Button>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Card padding="md" radius="md" withBorder h="100%">
          <Title order={3} mb="md">Quick Actions</Title>
          <Stack gap="sm">
            <Button component={Link} href="/admin/users" variant="light" fullWidth>
              Manage Users
            </Button>
            <Button component={Link} href="/admin/organizations" variant="light" fullWidth>
              Manage Organizations
            </Button>
            <Button component={Link} href="/admin/qa" variant="light" fullWidth>
              Manage Questions
            </Button>
          </Stack>
        </Card>
        
        <Card padding="md" radius="md" withBorder h="100%">
          <Title order={3} mb="md">System Status</Title>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text>Database</Text>
              <Text c="green" fw={500}>Connected</Text>
            </Group>
            <Group justify="space-between">
              <Text>Authentication</Text>
              <Text c="green" fw={500}>Active</Text>
            </Group>
            <Group justify="space-between">
              <Text>API Status</Text>
              <Text c="green" fw={500}>Healthy</Text>
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
