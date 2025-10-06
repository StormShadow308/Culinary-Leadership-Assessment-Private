import { Card, Group, Stack, Title } from '@mantine/core';
import { getCurrentUser } from '~/lib/user-sync';
import { getUserMembership } from '~/lib/optimized-queries';
import { AnswersDataTable } from './components/answers-data-table';

export default async function OrganisationAnswers() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <div>Unauthorized</div>;
  }

  // Check if user has organization membership
  const userMembership = await getUserMembership(currentUser.id);

  if (!userMembership) {
    return (
      <Stack>
        <div>You don't have access to any organization. Please contact your administrator.</div>
      </Stack>
    );
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
