import { Card, Group, SimpleGrid, Stack, Text, Title, Badge, Button } from '@mantine/core';
import { IconUsers, IconBuilding, IconChartBar, IconTrendingUp, IconDownload, IconPlus } from '@tabler/icons-react';
import { db } from '~/db';
import { user, organization, cohorts, participants, attempts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { count, avg, eq, sql } from 'drizzle-orm';
import Link from 'next/link';
import { AnalysisDashboard } from '~/components/analysis-dashboard';

export default async function AdminOverview() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  // Get comprehensive statistics
  const [userCount] = await db.select({ count: count() }).from(user);
  const [orgCount] = await db.select({ count: count() }).from(organization);
  const [cohortCount] = await db.select({ count: count() }).from(cohorts);
  const [participantCount] = await db.select({ count: count() }).from(participants);
  const [attemptCount] = await db.select({ count: count() }).from(attempts);
  
  // Get average scores
  const [avgScoreResult] = await db.select({
    avgScore: avg(sql<number>`(attempts.report_data->>'overallPercentage')::float`),
  }).from(attempts).where(eq(attempts.status, 'completed'));

  const averageScore = avgScoreResult?.avgScore || 0;

  const stats = [
    {
      title: 'Total Organizations',
      value: orgCount.count,
      icon: IconBuilding,
      color: 'blue',
      href: '/admin/organizations',
      description: 'Active organizations'
    },
    {
      title: 'Total Cohorts',
      value: cohortCount.count,
      icon: IconChartBar,
      color: 'green',
      href: '/admin/cohorts',
      description: 'Program cohorts'
    },
    {
      title: 'Total Participants',
      value: participantCount.count,
      icon: IconUsers,
      color: 'orange',
      href: '/admin/participants',
      description: 'Registered participants'
    },
    {
      title: 'Completed Assessments',
      value: attemptCount.count,
      icon: IconTrendingUp,
      color: 'teal',
      href: '/admin/attempts',
      description: 'Successful completions'
    }
  ];

  return (
    <AnalysisDashboard
      totalStudents={participantCount.count}
      completedStudents={attemptCount.count}
      notCompletedStudents={participantCount.count - attemptCount.count}
      title="Admin Program Overview"
    >
      {/* Header */}
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Program Performance Dashboard</Title>
          <Text size="sm" c="dimmed">
            Comprehensive tracking of culinary leadership programs across all organizations
          </Text>
        </div>
        <Group gap="sm">
          <Button
            leftSection={<IconPlus size={16} />}
            component={Link}
            href="/admin/organizations"
            variant="light"
          >
            Add Organization
          </Button>
          <Button
            leftSection={<IconDownload size={16} />}
            variant="filled"
          >
            Export Report
          </Button>
        </Group>
      </Group>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {stats.map((stat) => (
          <Card key={stat.title} padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  {stat.title}
                </Text>
                <Text fw={700} size="xl" mt="xs">
                  {stat.value}
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {stat.description}
                </Text>
              </div>
              <stat.icon size="2.5rem" stroke={1.5} color={`var(--mantine-color-${stat.color}-6)`} />
            </Group>
            <Button
              component={Link}
              href={stat.href}
              variant="light"
              size="xs"
              fullWidth
              mt="md"
            >
              View Details
            </Button>
          </Card>
        ))}
      </SimpleGrid>

      {/* Performance Overview */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" align="center" mb="md">
          <Title order={3}>Performance Overview</Title>
          <Badge size="lg" color="blue" variant="light">
            Real-time Data
          </Badge>
        </Group>
        
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <div>
            <Text size="sm" c="dimmed" mb="xs">Overall Completion Rate</Text>
            <Text size="xl" fw={700} c="green">
              {participantCount.count > 0 
                ? ((attemptCount.count / participantCount.count) * 100).toFixed(1)
                : 0}%
            </Text>
            <Text size="sm" c="dimmed">
              {attemptCount.count} of {participantCount.count} participants
            </Text>
          </div>
          
          <div>
            <Text size="sm" c="dimmed" mb="xs">Average Score</Text>
            <Text size="xl" fw={700} c="blue">
              {Number(averageScore).toFixed(1)}%
            </Text>
            <Text size="sm" c="dimmed">
              Across all completed assessments
            </Text>
          </div>
          
          <div>
            <Text size="sm" c="dimmed" mb="xs">Active Programs</Text>
            <Text size="xl" fw={700} c="orange">
              {cohortCount.count}
            </Text>
            <Text size="sm" c="dimmed">
              Currently running cohorts
            </Text>
          </div>
        </SimpleGrid>
      </Card>

    </AnalysisDashboard>
  );
}
