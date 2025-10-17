import { Card, Group, Stack, Title } from '@mantine/core';
import { getCurrentUser } from '~/lib/user-sync';
import { AllClientsDataTable } from './components/all-clients-data-table';

// Force dynamic rendering for pages that use cookies
export const dynamic = 'force-dynamic';

export default async function AllClientsData() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  return (
    <Stack 
      gap="md" 
      style={{ 
        backgroundColor: 'transparent',
        minHeight: '100vh'
      }}
    >
      <Group justify="space-between" align="center">
        <Title order={2}>All Client's Data</Title>
      </Group>

      <Card 
        withBorder 
        padding="lg" 
        radius="md"
      >
        <AllClientsDataTable />
      </Card>
    </Stack>
  );
}
