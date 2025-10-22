import { Card, Group, Stack, Title } from '@mantine/core';
import { getCurrentUser } from '~/lib/user-sync';
import { getUserMembership } from '~/lib/optimized-queries';
import { AnswersDataTable } from './components/answers-data-table';

// Force dynamic rendering for pages that use cookies
export const dynamic = 'force-dynamic';

export default async function OrganisationAnswers() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <div>Unauthorized</div>;
  }

  // Check if user is admin or has organization membership
  const isAdmin = currentUser.role === 'admin';
  let userMembership = null;

  if (isAdmin) {
    // Admin users have access to all organizations
    // We'll handle organization selection in the component
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

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2}>Answer Management</Title>
      </Group>

      <Card withBorder padding="lg" radius="md">
        <AnswersDataTable />
      </Card>
    </Stack>
  );
}
