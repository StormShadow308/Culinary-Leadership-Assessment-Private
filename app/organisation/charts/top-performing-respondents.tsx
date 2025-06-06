'use client';

import Link from 'next/link';

import { Anchor, Badge, Card, Group, ScrollArea, Table, Text } from '@mantine/core';

interface Respondent {
  id: string;
  name: string;
  cohortName: string | null;
  score: number;
  totalPossible: number;
}

interface TopPerformingRespondentsProps {
  respondents: Array<Respondent>;
}

export function TopPerformingRespondents({ respondents }: TopPerformingRespondentsProps) {
  return (
    <Card padding="lg" radius="md" withBorder>
      <Group justify="space-between" align="center" mb="md">
        <Text fw={500} size="lg">
          Top Performing Respondents
        </Text>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Respondent Name</Table.Th>
            <Table.Th>Cohort</Table.Th>
            <Table.Th>Score</Table.Th>
          </Table.Tr>
        </Table.Thead>
      </Table>

      <ScrollArea h={200} style={{ flexGrow: 1 }}>
        <Table highlightOnHover>
          <Table.Tbody>
            {respondents.map(respondent => (
              <Table.Tr key={respondent.id}>
                <Table.Td>
                  <Anchor
                    variant="text"
                    component={Link}
                    href={`/organisation/respondents/${respondent.id}`}
                  >
                    {respondent.name || 'Anonymous'}
                  </Anchor>
                </Table.Td>
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
      </ScrollArea>
    </Card>
  );
}
