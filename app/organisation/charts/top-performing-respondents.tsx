'use client';

import { Badge, Card, Group, Table, Text } from '@mantine/core';

interface Respondent {
  id: string;
  name: string;
  cohortName: string | null;
  score: number;
  totalPossible: number;
}

interface TopPerformingRespondentsProps {
  respondents: Array<Respondent>;
  limit?: number;
}

export function TopPerformingRespondents({
  respondents,
  limit = 5,
}: TopPerformingRespondentsProps) {
  // Show only the top N respondents
  const topRespondents = respondents.slice(0, limit);

  return (
    <Card padding="lg" radius="md" withBorder>
      <Group justify="space-between" align="center" mb="md">
        <Text fw={500} size="lg">
          Top Performing Respondents
        </Text>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Respondent Name</Table.Th>
            <Table.Th>Cohort</Table.Th>
            <Table.Th>Score</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {topRespondents.map(respondent => (
            <Table.Tr key={respondent.id}>
              <Table.Td>{respondent.name || 'Anonymous'}</Table.Td>
              <Table.Td>
                {respondent.cohortName ? (
                  <Badge color="blue" variant="light">
                    {respondent.cohortName}
                  </Badge>
                ) : (
                  <Text c="dimmed" size="sm">
                    No cohort
                  </Text>
                )}
              </Table.Td>
              <Table.Td>
                {respondent.score}/{respondent.totalPossible}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Text size="sm" c="dimmed" ta="center" mt="sm">
        Top {limit} respondents based on pre-assessment scores
      </Text>
    </Card>
  );
}
