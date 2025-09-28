
import { Card, Group, SimpleGrid, Stack, Text, Button, Alert, Title } from '@mantine/core';

import { IconChartBar, IconCheckbox, IconUsers, IconBuilding, IconAlertCircle } from '@tabler/icons-react';

import { db } from '~/db';
import { attempts, cohorts, participants, organization, member } from '~/db/schema';

import { getCurrentUser } from '~/lib/user-sync';
import { getUserMembership } from '~/lib/optimized-queries';

import CohortFilter from '~/app/organisation/components/cohort-filter';
import CreateOrganizationModal from '~/app/organisation/components/create-organization-modal';

import { and, avg, count, desc, eq, inArray, sql } from 'drizzle-orm';

import { CohortScoringCurve } from './charts/cohort-scoring-curve';
import { ProficiencyLevelsChart } from './charts/proficiency-levels-chart';
import { ProficiencyLevelsTable } from './charts/proficiency-levels-table';
import { SkillSetScoreChart } from './charts/skill-set-score-chart';
import { TopPerformingRespondents } from './charts/top-performing-respondents';

// Define report data types
interface CategoryResult {
  score: number;
  total: number;
  category: string;
  percentage: number;
}

interface ReportData {
  totalScore: number;
  totalPossible: number;
  categoryResults: CategoryResult[];
  overallPercentage: number;
}

// Define query result types
interface CategoryScoreResult {
  reportData: ReportData;
}

interface CategoryScoreData {
  scores: number[];
  total: number;
}

// Define proficiency levels based on the CSV data
const PROFICIENCY_LEVELS = [
  {
    range: '(36 - 40)',
    label: 'Exceptional Proficiency',
    lowerBound: 36,
    upperBound: 40,
    color: 'green',
  },
  {
    range: '(30 - 35)',
    label: 'High Proficiency',
    lowerBound: 30,
    upperBound: 35,
    color: 'teal',
  },
  {
    range: '(20 - 29)',
    label: 'Moderate Proficiency',
    lowerBound: 20,
    upperBound: 29,
    color: 'blue',
  },
  {
    range: '(10 - 19)',
    label: 'Developing Proficiency',
    lowerBound: 10,
    upperBound: 19,
    color: 'orange',
  },
  {
    range: '(0 - 9)',
    label: 'Needs Development',
    lowerBound: 0,
    upperBound: 9,
    color: 'red',
  },
];

type OrganisationSearchParams = {
  cohort?: string;
  orgId?: string;
};

type OrganisationProps = {
  searchParams: Promise<OrganisationSearchParams>;
};

export default async function Organisation(props: OrganisationProps) {
  const { cohort: selectedCohort, orgId } = await props.searchParams;

  // Get current user
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Unauthorized</div>;
  }

  // Check if user is admin or has organization membership
  const isAdmin = currentUser.role === 'admin';
  let userMembership = null;

  if (isAdmin) {
    // Admin users have access to all organizations
    // For admin, we'll handle orgId from URL parameter
  } else {
    // Regular users need organization membership
    userMembership = await getUserMembership(currentUser.id);
    
    if (!userMembership) {
      return (
        <Stack>
          <Alert icon={<IconAlertCircle size={16} />} title="Access Denied" color="red">
            You don't have access to any organization. Please contact your administrator.
          </Alert>
          <CreateOrganizationModal />
        </Stack>
      );
    }
  }
  
  // Get the organization ID from URL parameter or user's membership
  let currentOrgId: string | undefined;
  
  if (orgId) {
    // Verify the organization exists
    const targetOrg = await db
      .select()
      .from(organization)
      .where(eq(organization.id, orgId))
      .limit(1);
    
    if (targetOrg.length > 0) {
      // Check if this is the independent students organization
      const isIndependentStudentsOrg = orgId === 'org_default_students' || targetOrg[0].slug === 'default-students';
      
      if (isIndependentStudentsOrg) {
        // Independent students organization is only accessible by admin
        if (isAdmin) {
          currentOrgId = orgId;
        } else {
          return (
            <Stack>
              <Alert icon={<IconAlertCircle size={16} />} title="Access Denied" color="red">
                Independent students data is only accessible via admin dashboard.
              </Alert>
            </Stack>
          );
        }
      } else if (isAdmin) {
        // Admin users have access to all regular organizations
        currentOrgId = orgId;
      } else {
        // Regular users can only access their own organization
        if (userMembership && userMembership.organizationId === orgId) {
          currentOrgId = orgId;
        } else {
          return (
            <Stack>
              <Alert icon={<IconAlertCircle size={16} />} title="Access Denied" color="red">
                You don't have access to this organization. You can only view your own organization's data.
              </Alert>
            </Stack>
          );
        }
      }
    }
  }
  
  // If no valid orgId provided or found, use user's organization
  if (!currentOrgId) {
    if (isAdmin) {
      // For admin, get the first organization if no specific orgId
      const firstOrg = await db
        .select()
        .from(organization)
        .limit(1);
      currentOrgId = firstOrg[0]?.id;
    } else {
      // Regular users use their membership organization
      currentOrgId = userMembership.organizationId;
    }
  }

  // Final validation - ensure we have a valid organization ID
  if (!currentOrgId) {
    return (
      <Stack>
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          No valid organization found. Please contact your administrator.
        </Alert>
      </Stack>
    );
  }

  // Fetch current organization data
  const currentOrg = await db
    .select()
    .from(organization)
    .where(eq(organization.id, currentOrgId))
    .limit(1);

  const currentOrgData = currentOrg[0];

  const orgCohorts = await db
    .select({ name: cohorts.name, id: cohorts.id })
    .from(cohorts)
    .where(eq(cohorts.organizationId, currentOrgId));

  // Fetch total respondents count (all participants from current org and default students org)
  const [respondentsResult] = await db
    .select({ count: count() })
    .from(participants)
    .where(
      and(
        eq(participants.organizationId, currentOrgId),
        selectedCohort ? eq(participants.cohortId, selectedCohort) : void 0
      )
    );

  const totalRespondents = respondentsResult?.count || 0;

  // Get participant IDs for this organization to use in filtering (including default students)
  const orgParticipants = await db
    .select({ id: participants.id })
    .from(participants)
    .where(
      and(
        eq(participants.organizationId, currentOrgId),
        selectedCohort ? eq(participants.cohortId, selectedCohort) : void 0
      )
    );

  const participantIds = orgParticipants.map(p => p.id);

  

  // If no participants, return early with empty data
  if (participantIds.length === 0) {
    return (
      <Stack>
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Card padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="center">
              <Text fw={500} size="lg">
                Total Respondents
              </Text>
              <IconUsers size={24} />
            </Group>
            <Text size="xl" fw={700} mt="md">
              0
            </Text>
            <Text size="sm" c="dimmed" mt="sm">
              Total participants across all cohorts
            </Text>
          </Card>
          <Card padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="center">
              <Text fw={500} size="lg">
                Average Score
              </Text>
              <IconChartBar size={24} />
            </Group>
            <Group align="flex-end" mt="md">
              <Text size="xl" fw={700}>
                0.0%
              </Text>
            </Group>
            <Text size="sm" c="dimmed" mt="sm">
              Average pre-assessment score
            </Text>
          </Card>
          <Card padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="center">
              <Text fw={500} size="lg">
                Completion Rate
              </Text>
              <IconCheckbox size={24} />
            </Group>
            <Group align="flex-end" mt="md">
              <Text size="xl" fw={700}>
                0.0%
              </Text>
              <Text size="sm" c="dimmed">
                (0/0)
              </Text>
            </Group>
            <Text size="sm" c="dimmed" mt="sm">
              Pre-assessments completed vs. started
            </Text>
          </Card>
        </SimpleGrid>
        <Text ta="center" c="dimmed" mt="xl">
          No data available for this organization yet.
        </Text>
      </Stack>
    );
  }

  // Fetch average overall score from completed attempts for this organization
  const [avgScoreResult] = await db
    .select({
      avgScore: avg(sql<number>`(attempts.report_data->>'overallPercentage')::float`),
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.status, 'completed'),
        eq(attempts.type, 'pre_assessment'),
        inArray(attempts.participantId, participantIds)
      )
    );

  const averageScore = avgScoreResult?.avgScore || 0;

  // Fetch completion rate (completed attempts / total attempts) for this organization
  const [totalAttemptsResult] = await db
    .select({ count: count() })
    .from(attempts)
    .where(
      and(eq(attempts.type, 'pre_assessment'), inArray(attempts.participantId, participantIds))
    );

  const [completedAttemptsResult] = await db
    .select({ count: count() })
    .from(attempts)
    .where(
      and(
        eq(attempts.status, 'completed'),
        eq(attempts.type, 'pre_assessment'),
        inArray(attempts.participantId, participantIds)
      )
    );

  const totalAttempts = totalAttemptsResult?.count || 0;
  const completedAttempts = completedAttemptsResult?.count || 0;
  const completionRate = totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;

  // Fetch category scores data for LineChart for this organization
  const categoryScores = await db
    .select({
      reportData: sql<ReportData>`attempts.report_data`,
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.status, 'completed'),
        eq(attempts.type, 'pre_assessment'),
        inArray(attempts.participantId, participantIds)
      )
    );

  // Process the category data
  const categoryMap = new Map<string, CategoryScoreData>();

  // First, collect all category scores from all reports
  categoryScores.forEach((result: CategoryScoreResult) => {
    const reportData = result.reportData;
    if (reportData && reportData.categoryResults) {
      reportData.categoryResults.forEach((catResult: CategoryResult) => {
        const existingData = categoryMap.get(catResult.category) || {
          scores: [],
          total: catResult.total,
        };
        existingData.scores.push(catResult.score);
        categoryMap.set(catResult.category, existingData);
      });
    }
  });

  // Then calculate the average score for each category
  const categoryData = Array.from(categoryMap.entries()).map(
    ([category, data]: [string, CategoryScoreData]) => {
      const scores = data.scores;
      const averageScore =
        scores.length > 0
          ? scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
          : 0;

      return {
        skillSet: category,
        averageScore,
        totalPossible: data.total,
      };
    }
  );

  // Fetch attempt data for proficiency levels and PieChart for this organization
  const attemptData = await db
    .select({
      reportData: sql<ReportData>`attempts.report_data`,
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.status, 'completed'),
        eq(attempts.type, 'pre_assessment'),
        inArray(attempts.participantId, participantIds)
      )
    );

  // Debug logging for attempt data
  console.log('Attempt data:', attemptData);
  console.log('Category scores:', categoryScores);

  // Extract total scores from attempt data
  const attemptScores = attemptData
    .map(attempt => ({
      totalScore: attempt.reportData?.totalScore || 0,
      totalPossible: attempt.reportData?.totalPossible || 40, // Default to 40 if missing
    }))
    .filter(score => score.totalScore !== null);

  console.log('Attempt scores:', attemptScores);

  // Calculate proficiency levels distribution
  const proficiencyDistribution = PROFICIENCY_LEVELS.map(level => {
    const respondentsInLevel = attemptScores.filter(
      score => score.totalScore >= level.lowerBound && score.totalScore <= level.upperBound
    ).length;

    const percentage = completedAttempts > 0 ? (respondentsInLevel / completedAttempts) * 100 : 0;

    return {
      ...level,
      count: respondentsInLevel,
      percentage,
    };
  });

  // Fetch top 5 performing respondents
  const topRespondentsData = await db
    .select({
      id: participants.id,
      name: participants.fullName,
      cohortId: participants.cohortId,
      attemptId: attempts.id,
      reportData: sql<ReportData>`attempts.report_data`,
    })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(
      and(
        eq(participants.organizationId, currentOrgId),
        selectedCohort ? eq(participants.cohortId, selectedCohort) : void 0,
        eq(attempts.status, 'completed'),
        eq(attempts.type, 'pre_assessment')
      )
    )
    .orderBy(desc(sql`(attempts.report_data->>'totalScore')::int`))
    .limit(5);

  // Get cohort names for each respondent
  const cohortIds = topRespondentsData
    .map(respondent => respondent.cohortId)
    .filter(Boolean) as string[];

  let cohortNameMap: Record<string, string> = {};

  if (cohortIds.length > 0) {
    const cohortData = await db
      .select({
        id: cohorts.id,
        name: cohorts.name,
      })
      .from(cohorts)
      .where(inArray(cohorts.id, cohortIds));

    cohortNameMap = cohortData.reduce(
      (acc, cohort) => {
        acc[cohort.id] = cohort.name;
        return acc;
      },
      {} as Record<string, string>
    );
  }

  // Format top respondents data for the component
  const topRespondents = topRespondentsData.map(respondent => ({
    id: respondent.id,
    name: respondent.name || 'Anonymous',
    cohortName: respondent.cohortId ? cohortNameMap[respondent.cohortId] || null : null,
    score: respondent.reportData?.totalScore || 0,
    totalPossible: respondent.reportData?.totalPossible || 40,
  }));

  // Parse organization description from metadata
  let organizationDescription = null;
  try {
    if (currentOrgData?.metadata) {
      const metadata = typeof currentOrgData.metadata === 'string' 
        ? JSON.parse(currentOrgData.metadata) 
        : currentOrgData.metadata;
      organizationDescription = metadata.description || null;
    }
  } catch (error) {
    console.warn('Failed to parse organization metadata:', error);
  }

  return (
    <Stack>
      {/* Organization Header */}
      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title order={2}>
              {isAdmin && currentOrgId === 'org_default_students' 
                ? 'Independent Students (N/A Organization)' 
                : isAdmin 
                  ? `Admin Dashboard - ${currentOrgData?.name || 'Organization'}`
                  : currentOrgData?.name || userMembership?.organizationName}
            </Title>
            {organizationDescription && (
              <Text size="sm" c="dimmed">
                {organizationDescription}
              </Text>
            )}
            <Text size="xs" c="dimmed">
              {isAdmin ? (
                <>
                  Role: Admin • Organization ID: {currentOrgId}
                  <Text component="span" c="blue" fw={500}> • Admin Access</Text>
                </>
              ) : (
                <>
                  Role: {userMembership?.role} • Organization ID: {userMembership?.organizationId}
                </>
              )}
            </Text>
          </Stack>
          <Group>
            <CohortFilter cohorts={orgCohorts} selected={selectedCohort} />
          </Group>
        </Group>
      </Card>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Text fw={500} size="lg">
              Total Respondents
            </Text>
            <IconUsers size={24} />
          </Group>
          <Text size="xl" fw={700} mt="md">
            {totalRespondents}
          </Text>
          <Text size="sm" c="dimmed" mt="sm">
            Total participants across all cohorts
          </Text>
        </Card>
        {/* Average Score Card */}
        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Text fw={500} size="lg">
              Average Score
            </Text>
            <IconChartBar size={24} />
          </Group>
          <Group align="flex-end" mt="md">
            <Text size="xl" fw={700}>
              {Number(averageScore).toFixed(1)}%
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mt="sm">
            Average pre-assessment score
          </Text>
        </Card>
        {/* Completion Rate Card */}
        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Text fw={500} size="lg">
              Completion Rate
            </Text>
            <IconCheckbox size={24} />
          </Group>
          <Group align="flex-end" mt="md">
            <Text size="xl" fw={700}>
              {completionRate.toFixed(1)}%
            </Text>
            <Text size="sm" c="dimmed">
              ({completedAttempts}/{totalAttempts})
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mt="sm">
            Pre-assessments completed vs. started
          </Text>
        </Card>
      </SimpleGrid>
      {completedAttempts > 0 && (
        <>
          {/* Full width proficiency levels table */}
          <ProficiencyLevelsTable
            proficiencyData={proficiencyDistribution}
            totalRespondents={completedAttempts}
          />
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {/* Proficiency Levels Chart */}
            <ProficiencyLevelsChart attempts={attemptScores} />
            {/* Skill Set Score Chart */}
            <SkillSetScoreChart skillSetData={categoryData} />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <CohortScoringCurve attempts={attemptScores} />
            {/* Top Performing Respondents */}
            <TopPerformingRespondents respondents={topRespondents} />
          </SimpleGrid>
        </>
      )}
    </Stack>
  );
}
