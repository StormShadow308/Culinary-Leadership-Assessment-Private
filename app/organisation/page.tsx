import { headers } from 'next/headers';

import { Card, Group, SimpleGrid, Stack, Text } from '@mantine/core';

import { IconChartBar, IconCheckbox, IconUsers } from '@tabler/icons-react';

import { db } from '~/db';
import { attempts, cohorts, participants } from '~/db/schema';

import { auth } from '~/lib/auth';

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

export default async function Organisation() {
  const organizations = await auth.api.listOrganizations({ headers: await headers() });
  const currentOrgId = organizations[0]?.id;

  // Fetch total respondents count (all participants)
  const [respondentsResult] = await db
    .select({ count: count() })
    .from(participants)
    .where(eq(participants.organizationId, currentOrgId));

  const totalRespondents = respondentsResult?.count || 0;

  // Get participant IDs for this organization to use in filtering
  const orgParticipants = await db
    .select({ id: participants.id })
    .from(participants)
    .where(eq(participants.organizationId, currentOrgId));

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

  // Extract total scores from attempt data
  const attemptScores = attemptData
    .map(attempt => ({
      totalScore: attempt.reportData?.totalScore || 0,
      totalPossible: attempt.reportData?.totalPossible || 40, // Default to 40 if missing
    }))
    .filter(score => score.totalScore !== null);

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
          {/* Full width proficiency levels table */}
          <ProficiencyLevelsTable
            proficiencyData={proficiencyDistribution}
            totalRespondents={completedAttempts}
          />
        </>
      )}
    </Stack>
  );
}
