import { Card, Group, SimpleGrid, Stack, Text, Title, Badge } from '@mantine/core';
import { IconUsers, IconBuilding, IconChartBar, IconQuestionMark, IconTrendingUp, IconClock, IconCheck } from '@tabler/icons-react';
import { db } from '~/db';
import { user, organization, cohorts, participants, attempts } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { count, eq, and, inArray } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@mantine/core';
import { LastUpdatedIndicator } from '~/components/last-updated-indicator';

type AdminSearchParams = {
  orgId?: string;
};

type AdminProps = {
  searchParams: Promise<AdminSearchParams>;
};

export default async function Admin(props: AdminProps) {
  const { orgId } = await props.searchParams;
  const currentUser = await getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  // Get comprehensive real-time statistics
  const [userCount] = await db.select({ count: count() }).from(user);
  const [orgCount] = await db.select({ count: count() }).from(organization);
  const [cohortCount] = await db.select({ count: count() }).from(cohorts);
  const [participantCount] = await db.select({ count: count() }).from(participants);
  const [attemptCount] = await db.select({ count: count() }).from(attempts);

  // If an organization is selected, get organization-specific data
  let orgSpecificData = null;
  let isOrgSpecificView = false;
  
  if (orgId) {
    isOrgSpecificView = true;
    
    // Get organization-specific participant count
    const [orgParticipantCount] = await db.select({ count: count() })
      .from(participants)
      .where(eq(participants.organizationId, orgId));

    // Get organization-specific cohort count
    const [orgCohortCount] = await db.select({ count: count() })
      .from(cohorts)
      .where(eq(cohorts.organizationId, orgId));

    // Get organization-specific attempt count
    const orgParticipants = await db.select({ id: participants.id })
      .from(participants)
      .where(eq(participants.organizationId, orgId));
    
    const participantIds = orgParticipants.map(p => p.id);
    
    let orgAttemptCount = { count: 0 };
    if (participantIds.length > 0) {
      [orgAttemptCount] = await db.select({ count: count() })
        .from(attempts)
        .where(and(
          eq(attempts.status, 'completed'),
          inArray(attempts.participantId, participantIds)
        ));
    }

    orgSpecificData = {
      participantCount: orgParticipantCount.count,
      cohortCount: orgCohortCount.count,
      attemptCount: orgAttemptCount.count
    };
  }
  

  const stats = [
    {
      title: 'Total Users',
      value: userCount.count,
      icon: IconUsers,
      color: 'blue',
      href: '/admin/users',
      description: 'Registered users',
      trend: '+12% this month'
    },
    {
      title: 'Organizations',
      value: orgCount.count,
      icon: IconBuilding,
      color: 'green',
      href: '/admin/organizations',
      description: 'Active organizations',
      trend: '+2 new this week'
    },
    {
      title: 'Cohorts',
      value: isOrgSpecificView ? orgSpecificData?.cohortCount : cohortCount.count,
      icon: IconChartBar,
      color: 'orange',
      href: '/admin/cohorts',
      description: isOrgSpecificView ? 'Organization cohorts' : 'Program cohorts',
      trend: isOrgSpecificView ? 'Organization specific' : '3 active programs'
    },
    {
      title: 'Participants',
      value: isOrgSpecificView ? orgSpecificData?.participantCount : participantCount.count,
      icon: IconUsers,
      color: 'purple',
      href: '/admin/participants',
      description: isOrgSpecificView ? 'Organization participants' : 'Total participants',
      trend: isOrgSpecificView ? 'Organization specific' : 'All registered users'
    },
    {
      title: 'Assessment Attempts',
      value: isOrgSpecificView ? orgSpecificData?.attemptCount : attemptCount.count,
      icon: IconQuestionMark,
      color: 'teal',
      href: '/admin/attempts',
      description: isOrgSpecificView ? 'Organization attempts' : 'Total attempts',
      trend: isOrgSpecificView ? 'Organization specific' : 'All assessment attempts'
    }
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2}>
          Admin Dashboard
          {isOrgSpecificView ? (
            <Text component="span" size="sm" c="blue" ml="sm">
              (Organization View)
            </Text>
          ) : (
            <Text component="span" size="sm" c="dimmed" ml="sm">
              (System Overview)
            </Text>
          )}
        </Title>
        <Group gap="sm" align="center">
          <LastUpdatedIndicator />
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {stats.map((stat) => (
          <Card key={stat.title} padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <div style={{ flex: 1 }}>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  {stat.title}
                </Text>
                <Text fw={700} size="xl" mt="xs">
                  {stat.value}
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  {stat.description}
                </Text>
                <Badge 
                  size="sm" 
                  variant="light" 
                  color={stat.color} 
                  mt="xs"
                >
                  {stat.trend}
                </Badge>
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

    </Stack>
  );
}
