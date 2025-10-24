'use client';

import { Card, Group, Stack, Text, Title } from '@mantine/core';
import { AssessmentTabs } from './assessment-tabs';

interface FilteredOrganizationDashboardProps {
  // Pre-assessment data
  totalRespondents: number;
  averageScore: number;
  completionRate: number;
  completedAttempts: number;
  totalAttempts: number;
  
  // Pre-assessment chart data
  proficiencyDistribution: any[];
  attemptScores: any[];
  categoryData: any[];
  topRespondents: any[];
  
  // Post-assessment data
  averagePostScore: number;
  postCompletionRate: number;
  completedPostAttempts: number;
  totalPostAttempts: number;
  
  // Post-assessment chart data
  postProficiencyDistribution: any[];
  postAttemptScores: any[];
  postCategoryData: any[];
  topPostRespondents: any[];
  
  // Organization info
  currentOrgData: any;
  userMembership: any;
  isAdmin: boolean;
  currentOrgId: string;
  orgCohorts: any[];
  selectedCohort?: string;
}

export function FilteredOrganizationDashboard({
  // Pre-assessment data
  totalRespondents,
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
  // Common data
  currentOrgData,
  userMembership,
  isAdmin,
  currentOrgId,
  orgCohorts,
  selectedCohort
}: FilteredOrganizationDashboardProps) {

  return (
    <div className="mobile-page-container">
      <Stack gap="md">
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
        </Group>
      </Card>


      {/* Assessment Analysis Tabs */}
      <AssessmentTabs
        // Pre-assessment data
        averageScore={averageScore}
        completionRate={completionRate}
        completedAttempts={completedAttempts}
        totalAttempts={totalAttempts}
        proficiencyDistribution={proficiencyDistribution}
        attemptScores={attemptScores}
        categoryData={categoryData}
        topRespondents={topRespondents}
        // Post-assessment data
        averagePostScore={averagePostScore}
        postCompletionRate={postCompletionRate}
        completedPostAttempts={completedPostAttempts}
        totalPostAttempts={totalPostAttempts}
        postProficiencyDistribution={postProficiencyDistribution}
        postAttemptScores={postAttemptScores}
        postCategoryData={postCategoryData}
        topPostRespondents={topPostRespondents}
      />
      </Stack>
    </div>
  );
}
