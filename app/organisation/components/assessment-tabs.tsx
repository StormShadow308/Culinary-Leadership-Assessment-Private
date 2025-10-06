'use client';

import { useState } from 'react';
import { Tabs, Card, Group, SimpleGrid, Stack, Text, Title, Badge } from '@mantine/core';
import { IconChartBar, IconCheckbox, IconUsers, IconTrendingUp } from '@tabler/icons-react';
import { ProficiencyLevelsChart } from '../charts/proficiency-levels-chart';
import { ProficiencyLevelsTable } from '../charts/proficiency-levels-table';
import { SkillSetScoreChart } from '../charts/skill-set-score-chart';
import { CohortScoringCurve } from '../charts/cohort-scoring-curve';
import { TopPerformingRespondents } from '../charts/top-performing-respondents';

interface AssessmentTabsProps {
  // Pre-assessment data
  averageScore: number;
  completionRate: number;
  completedAttempts: number;
  totalAttempts: number;
  proficiencyDistribution: any[];
  attemptScores: any[];
  categoryData: any[];
  topRespondents: any[];
  
  // Post-assessment data
  averagePostScore: number;
  postCompletionRate: number;
  completedPostAttempts: number;
  totalPostAttempts: number;
  postProficiencyDistribution: any[];
  postAttemptScores: any[];
  postCategoryData: any[];
  topPostRespondents: any[];
}

export function AssessmentTabs({
  // Pre-assessment data
  averageScore,
  completionRate,
  completedAttempts,
  totalAttempts,
  proficiencyDistribution,
  attemptScores,
  categoryData,
  topRespondents,
  // Post-assessment data
  averagePostScore,
  postCompletionRate,
  completedPostAttempts,
  totalPostAttempts,
  postProficiencyDistribution,
  postAttemptScores,
  postCategoryData,
  topPostRespondents,
}: AssessmentTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('pre');

  const PreAssessmentStats = () => (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Text fw={500} size="lg">Average Score</Text>
          <IconChartBar size={24} />
        </Group>
        <Group align="flex-end" mt="md">
          <Text size="xl" fw={700}>
            {Number(averageScore).toFixed(1)}%
          </Text>
        </Group>
        <Text size="sm" c="dimmed" mt="sm">
          Pre-assessment average score
        </Text>
      </Card>

      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Text fw={500} size="lg">Completion Rate</Text>
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

      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Text fw={500} size="lg">Completed</Text>
          <IconUsers size={24} />
        </Group>
        <Text size="xl" fw={700} mt="md">
          {completedAttempts}
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Pre-assessment completions
        </Text>
      </Card>
    </SimpleGrid>
  );

  const PostAssessmentStats = () => (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Text fw={500} size="lg">Average Score</Text>
          <IconChartBar size={24} />
        </Group>
        <Group align="flex-end" mt="md">
          <Text size="xl" fw={700}>
            {Number(averagePostScore).toFixed(1)}%
          </Text>
        </Group>
        <Text size="sm" c="dimmed" mt="sm">
          Post-assessment average score
        </Text>
      </Card>

      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Text fw={500} size="lg">Completion Rate</Text>
          <IconCheckbox size={24} />
        </Group>
        <Group align="flex-end" mt="md">
          <Text size="xl" fw={700}>
            {postCompletionRate.toFixed(1)}%
          </Text>
          <Text size="sm" c="dimmed">
            ({completedPostAttempts}/{totalPostAttempts})
          </Text>
        </Group>
        <Text size="sm" c="dimmed" mt="sm">
          Post-assessments completed vs. started
        </Text>
      </Card>

      <Card padding="lg" radius="md" withBorder>
        <Group justify="space-between" align="center">
          <Text fw={500} size="lg">Completed</Text>
          <IconUsers size={24} />
        </Group>
        <Text size="xl" fw={700} mt="md">
          {completedPostAttempts}
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          Post-assessment completions
        </Text>
      </Card>
    </SimpleGrid>
  );

  const ComparisonStats = () => {
    const scoreImprovement = averagePostScore - averageScore;
    const completionImprovement = postCompletionRate - completionRate;
    
    return (
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Text fw={500} size="lg">Score Improvement</Text>
            <IconTrendingUp size={24} />
          </Group>
          <Group align="flex-end" mt="md">
            <Text size="xl" fw={700} c={scoreImprovement >= 0 ? 'green' : 'red'}>
              {scoreImprovement >= 0 ? '+' : ''}{scoreImprovement.toFixed(1)}%
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mt="sm">
            Post vs Pre-assessment
          </Text>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Text fw={500} size="lg">Completion Improvement</Text>
            <IconCheckbox size={24} />
          </Group>
          <Group align="flex-end" mt="md">
            <Text size="xl" fw={700} c={completionImprovement >= 0 ? 'green' : 'red'}>
              {completionImprovement >= 0 ? '+' : ''}{completionImprovement.toFixed(1)}%
            </Text>
          </Group>
          <Text size="sm" c="dimmed" mt="sm">
            Post vs Pre-assessment
          </Text>
        </Card>

        <Card padding="lg" radius="md" withBorder>
          <Group justify="space-between" align="center">
            <Text fw={500} size="lg">Total Assessments</Text>
            <IconUsers size={24} />
          </Group>
          <Text size="xl" fw={700} mt="md">
            {completedAttempts + completedPostAttempts}
          </Text>
          <Text size="sm" c="dimmed" mt="sm">
            Combined completions
          </Text>
        </Card>
      </SimpleGrid>
    );
  };

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="pre">Pre-Assessment</Tabs.Tab>
        <Tabs.Tab value="post">Post-Assessment</Tabs.Tab>
        <Tabs.Tab value="comparison">Comparison</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="pre" pt="md">
        <Stack gap="md">
          <PreAssessmentStats />
          
          {completedAttempts > 0 && (
            <>
              <ProficiencyLevelsTable
                proficiencyData={proficiencyDistribution}
                totalRespondents={completedAttempts}
              />
              
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <ProficiencyLevelsChart attempts={attemptScores} />
                <SkillSetScoreChart skillSetData={categoryData} />
              </SimpleGrid>
              
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <CohortScoringCurve attempts={attemptScores} />
                <TopPerformingRespondents respondents={topRespondents} />
              </SimpleGrid>
            </>
          )}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="post" pt="md">
        <Stack gap="md">
          <PostAssessmentStats />
          
          {completedPostAttempts > 0 && (
            <>
              <ProficiencyLevelsTable
                proficiencyData={postProficiencyDistribution}
                totalRespondents={completedPostAttempts}
              />
              
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <ProficiencyLevelsChart attempts={postAttemptScores} />
                <SkillSetScoreChart skillSetData={postCategoryData} />
              </SimpleGrid>
              
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <CohortScoringCurve attempts={postAttemptScores} />
                <TopPerformingRespondents respondents={topPostRespondents} />
              </SimpleGrid>
            </>
          )}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="comparison" pt="md">
        <Stack gap="md">
          <ComparisonStats />
          
          {(completedAttempts > 0 || completedPostAttempts > 0) && (
            <>
              <Card withBorder padding="lg" radius="md">
                <Title order={3} mb="md">Proficiency Level Comparison</Title>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <div>
                    <Text fw={500} mb="sm">Pre-Assessment</Text>
                    <ProficiencyLevelsTable
                      proficiencyData={proficiencyDistribution}
                      totalRespondents={completedAttempts}
                    />
                  </div>
                  <div>
                    <Text fw={500} mb="sm">Post-Assessment</Text>
                    <ProficiencyLevelsTable
                      proficiencyData={postProficiencyDistribution}
                      totalRespondents={completedPostAttempts}
                    />
                  </div>
                </SimpleGrid>
              </Card>
            </>
          )}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
}
