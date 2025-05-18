'use client';

import { Badge, Card, Progress, Table, Text } from '@mantine/core';

interface ProficiencyLevel {
  range: string;
  label: string;
  lowerBound: number;
  upperBound: number;
  count: number;
  percentage: number;
  color: string;
}

interface ProficiencyLevelsTableProps {
  proficiencyData: Array<ProficiencyLevel>;
  totalRespondents: number;
}

export function ProficiencyLevelsTable(props: ProficiencyLevelsTableProps) {
  const { proficiencyData, totalRespondents } = props;

  return (
    <Card padding="lg" radius="md" withBorder>
      <Text fw={500} size="lg" mb="md">
        Overall Proficiency Levels
      </Text>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Score Range</Table.Th>
            <Table.Th>Proficiency Level</Table.Th>
            <Table.Th>Respondents</Table.Th>
            <Table.Th>Percentage</Table.Th>
            <Table.Th>Distribution</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {proficiencyData.map(level => (
            <Table.Tr key={level.label}>
              <Table.Td style={{ whiteSpace: 'nowrap' }}>{level.range}</Table.Td>
              <Table.Td>
                <Badge color={level.color} size="md">
                  {level.label}
                </Badge>
              </Table.Td>
              <Table.Td>
                {level.count} {level.count === 1 ? 'respondent' : 'respondents'}
              </Table.Td>
              <Table.Td>{level.percentage.toFixed(1)}%</Table.Td>
              <Table.Td style={{ width: '30%' }}>
                <Progress
                  value={level.percentage}
                  color={level.color}
                  size="xl"
                  radius="xl"
                  striped={level.count > 0}
                  animated={level.count > 0}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Th colSpan={2}>Total</Table.Th>
            <Table.Th>{totalRespondents} respondents</Table.Th>
            <Table.Th>100%</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>

      <Text size="sm" c="dimmed" ta="center" mt="sm">
        Distribution of respondents across different proficiency levels based on assessment scores
      </Text>
    </Card>
  );
}
