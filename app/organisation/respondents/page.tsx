import { headers } from 'next/headers';

import { Group, Paper, Stack, TextInput, Title } from '@mantine/core';

import { db } from '~/db';
import { attempts, cohorts, participants } from '~/db/schema';

import { auth } from '~/lib/auth';

import { and, eq, inArray, or } from 'drizzle-orm';

import { InviteStudent } from './components/invite-student';
import StudentsTable, { type ReportData } from './components/students-table';

function assertReportData(data: unknown): ReportData | null {
  if (!data || typeof data !== 'object') return null;
  return data as ReportData;
}

export default async function Students() {
  const sessionData = await auth.api.getSession({ headers: await headers() });
  const organizationId = sessionData?.session?.activeOrganizationId;

  // Debug logging
  console.log('Session data:', sessionData);
  console.log('Organization ID:', organizationId);

  // First get all participants with basic info (including default students)
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
    })
    .from(participants)
    .leftJoin(cohorts, eq(participants.cohortId, cohorts.id))
    .where(
      or(
        organizationId ? eq(participants.organizationId, organizationId) : undefined,
        eq(participants.organizationId, 'org_default_students')
      )
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
        or(
          organizationId ? eq(cohorts.organizationId, organizationId) : undefined,
          eq(cohorts.organizationId, 'org_default_students')
        )
      );

    const cohortNames = cohortsData.map(cohort => cohort.name);

    return (
      <Stack h="100%" gap="md">
        <Group justify="space-between">
          <Title order={2}>Students</Title>
          <Group>
            <InviteStudent currentCohorts={cohortNames} />
            <TextInput miw={300} placeholder="Search by name or email" />
          </Group>
        </Group>
        <Paper h="100%" withBorder>
          <StudentsTable data={[]} />
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
      or(
        organizationId ? eq(cohorts.organizationId, organizationId) : undefined,
        eq(cohorts.organizationId, 'org_default_students')
      )
    );

  const cohortNames = cohortsData.map(cohort => cohort.name);

  return (
    <Stack h="100%" gap="md">
      <Group justify="space-between">
        <Title order={2}>Respondents</Title>
        <Group>
          <InviteStudent currentCohorts={cohortNames} />
          <TextInput miw={300} placeholder="Search by name or email" />
        </Group>
      </Group>
      <Paper
        style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}
        withBorder
      >
        <div style={{ overflow: 'auto', flex: 1, borderRadius: 6 }}>
          <StudentsTable data={participantsData} />
        </div>
      </Paper>
    </Stack>
  );
}
