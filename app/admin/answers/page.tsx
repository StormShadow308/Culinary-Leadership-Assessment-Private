import { Card, Group, Stack, Title } from '@mantine/core';
import { getCurrentUser } from '~/lib/user-sync';
import { AnswersDataTable } from './components/answers-data-table';

// Force dynamic rendering for pages that use cookies
export const dynamic = 'force-dynamic';

export default async function AdminAnswers() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="mobile-page-container">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2}>Answer Management</Title>
        </Group>

        <Card withBorder padding="lg" radius="md">
          <AnswersDataTable />
        </Card>
      </Stack>
    </div>
  );
}
