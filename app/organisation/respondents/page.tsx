
import { Group, Paper, Stack, TextInput, Title } from '@mantine/core';

import { db } from '~/db';
import { attempts, cohorts, participants, organization } from '~/db/schema';

import { getCurrentUser } from '~/lib/user-sync';

import { and, eq, inArray, or } from 'drizzle-orm';

import { InviteStudent } from './components/invite-student';
import StudentsTable, { type ReportData } from './components/students-table';
import { SearchableStudentsTable } from './components/searchable-students-table';

function assertReportData(data: unknown): ReportData | null {
  if (!data || typeof data !== 'object') return null;
  return data as ReportData;
}

type StudentsProps = {
  searchParams: Promise<{ orgId?: string }>;
};

export default async function Students(props: StudentsProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return <div>Unauthorized</div>;
  }

  // Get the organization ID from URL parameter or default to first organization
  let currentOrgId: string | undefined;
  
  // Check if we have orgId in search params (this would come from the organization dashboard)
  const { orgId } = await props.searchParams;
  
  if (orgId) {
    // Verify the organization exists
    const targetOrg = await db.select().from(organization).where(eq(organization.id, orgId)).limit(1);
    if (targetOrg.length > 0) {
      currentOrgId = orgId;
    }
  }
  
  // If no valid orgId provided or found, get the first organization
  if (!currentOrgId) {
    const organizations = await db.select().from(organization);
    currentOrgId = organizations[0]?.id;
  }

  // For admin users, show all participants from all organizations
  const isAdmin = currentUser.role === 'admin';

  // Debug logging
  console.log('Current user:', currentUser);
  console.log('Organization ID:', currentOrgId);

  // First get all participants with basic info
  const participantsDataWithAssessments = await db
    .select({
      id: participants.id,
      email: participants.email,
      fullName: participants.fullName,
      createdAt: participants.createdAt,
      lastActiveAt: participants.lastActiveAt,
      cohortId: participants.cohortId,
      cohortName: cohorts.name,
      stayOut: participants.stayOut,
      organizationId: participants.organizationId,
    })
    .from(participants)
    .leftJoin(cohorts, eq(participants.cohortId, cohorts.id))
    .where(
      isAdmin 
        ? undefined // Admin users see all participants
        : currentOrgId 
          ? or(
              eq(participants.organizationId, currentOrgId),
              eq(participants.organizationId, 'org_default_students')
            )
          : eq(participants.organizationId, 'org_default_students')
    );

  // Debug logging
  console.log('Participants data:', participantsDataWithAssessments);

  // Early return if no participants to avoid unnecessary queries
  if (participantsDataWithAssessments.length === 0) {
    // Get list of all cohort names for the dropdown
    const cohortsData = await db
      .select({ name: cohorts.name })
      .from(cohorts)
      .where(
        currentOrgId 
          ? or(
              eq(cohorts.organizationId, currentOrgId),
              eq(cohorts.organizationId, 'org_default_students')
            )
          : eq(cohorts.organizationId, 'org_default_students')
      );

    const cohortNames = cohortsData.map(cohort => cohort.name);

    return (
      <Stack h="100%" gap="md">
        <Group justify="space-between">
          <Title order={2}>Students</Title>
          <Group>
            <InviteStudent currentCohorts={cohortNames} organizationId={currentOrgId} />
          </Group>
        </Group>
        <Paper h="100%" withBorder>
          <SearchableStudentsTable data={[]} />
        </Paper>
      </Stack>
    );
  }

  // Get pre-assessment data
  const preAssessments = await db
    .select({
      participantId: attempts.participantId,
      status: attempts.status,
      reportData: attempts.reportData,
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.type, 'pre_assessment'),
        inArray(
          attempts.participantId,
          participantsDataWithAssessments.map(p => p.id)
        )
      )
    );

  // Get post-assessment data
  const postAssessments = await db
    .select({
      participantId: attempts.participantId,
      status: attempts.status,
      reportData: attempts.reportData,
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.type, 'post_assessment'),
        inArray(
          attempts.participantId,
          participantsDataWithAssessments.map(p => p.id)
        )
      )
    );

  // Debug logging for assessments
  console.log('Pre-assessments:', preAssessments);
  console.log('Post-assessments:', postAssessments);

  // Combine all data
  const participantsData = participantsDataWithAssessments.map(participant => {
    const preAssessment = preAssessments.find(a => a.participantId === participant.id);
    const postAssessment = postAssessments.find(a => a.participantId === participant.id);

    return {
      ...participant,
      preAssessmentStatus: preAssessment?.status || null,
      preAssessmentData: assertReportData(preAssessment?.reportData),
      postAssessmentStatus: postAssessment?.status || null,
      postAssessmentData: assertReportData(postAssessment?.reportData),
    };
  });

  console.log('Final participants data:', participantsData);

  // Get list of all cohort names for the dropdown
  const cohortsData = await db
    .select({ name: cohorts.name })
    .from(cohorts)
    .where(
      isAdmin 
        ? undefined // Admin users see all cohorts
        : currentOrgId 
          ? or(
              eq(cohorts.organizationId, currentOrgId),
              eq(cohorts.organizationId, 'org_default_students')
            )
          : eq(cohorts.organizationId, 'org_default_students')
    );

  const cohortNames = cohortsData.map(cohort => cohort.name);

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>Respondents</Title>
        <Group>
          <InviteStudent currentCohorts={cohortNames} organizationId={currentOrgId} />
        </Group>
      </Group>
      <Paper
        style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}
        withBorder
      >
        <div style={{ overflow: 'auto', flex: 1, borderRadius: 6 }}>
          <SearchableStudentsTable data={participantsData} />
        </div>
      </Paper>
    </Stack>
  );
}
