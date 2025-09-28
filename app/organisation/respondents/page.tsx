
import { Group, Paper, Stack, TextInput, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import { db } from '~/db';
import { attempts, cohorts, participants, organization, member } from '~/db/schema';

import { getCurrentUser } from '~/lib/user-sync';
import { getUserMembership } from '~/lib/optimized-queries';

import { and, eq, inArray, or } from 'drizzle-orm';

import { InviteStudent } from './components/invite-student';
import StudentsTable, { type ReportData } from './components/students-table';
import { SearchableStudentsTable } from './components/searchable-students-table';
import { AdminOrgSelector } from '../components/admin-org-selector';

function assertReportData(data: unknown): ReportData | null {
  if (!data || typeof data !== 'object') return null;
  return data as ReportData;
}

type StudentsProps = {
  searchParams: Promise<{ orgId?: string }>;
};

export default async function Students(props: StudentsProps) {
  const { orgId } = await props.searchParams;
  
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
          <div>You don't have access to any organization. Please contact your administrator.</div>
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
  
  // If no valid orgId provided or found, handle based on user type
  if (!currentOrgId) {
    if (isAdmin) {
      // Admin users must explicitly select an organization
      return (
        <Stack>
          <Alert icon={<IconAlertCircle size={16} />} title="Organization Selection Required" color="blue">
            Please select an organization to view its data. Use the organization selector in the navigation.
          </Alert>
        </Stack>
      );
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



  // First get all participants with basic info - only from user's organization
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
    .where(eq(participants.organizationId, currentOrgId));


  // Early return if no participants to avoid unnecessary queries
  if (participantsDataWithAssessments.length === 0) {
    // Get list of all cohort names for the dropdown - only from user's organization
    const cohortsData = await db
      .select({ name: cohorts.name })
      .from(cohorts)
      .where(eq(cohorts.organizationId, currentOrgId));

    // Remove duplicates from cohort names to prevent React key conflicts
    let cohortNames = [...new Set(cohortsData.map(cohort => cohort.name))];

    return (
      <Stack h="100%" gap="md">
        <Group justify="space-between">
          <Title order={2}>Students</Title>
          <Group>
            <InviteStudent currentCohorts={cohortNames} organizationId={currentOrgId} isAdmin={isAdmin} />
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


  // Get list of all cohort names for the dropdown - only from user's organization
  const cohortsData = await db
    .select({ name: cohorts.name })
    .from(cohorts)
    .where(eq(cohorts.organizationId, currentOrgId));

  // Remove duplicates from cohort names to prevent React key conflicts
  let cohortNames = [...new Set(cohortsData.map(cohort => cohort.name))];


  return (
    <Stack h="100%" gap="md">
      {/* Admin Organization Selector */}
      {isAdmin && <AdminOrgSelector currentOrgId={currentOrgId} />}
      
      <Group justify="space-between">
        <Title order={2}>Respondents</Title>
        <Group>
          <InviteStudent currentCohorts={cohortNames} organizationId={currentOrgId} isAdmin={isAdmin} />
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
