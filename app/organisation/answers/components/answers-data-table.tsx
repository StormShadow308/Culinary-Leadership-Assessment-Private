'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TextInput,
  Group,
  Text,
  Badge,
  Stack,
  Button,
  Card,
  ScrollArea
} from '@mantine/core';
import {
  IconSearch,
  IconFilter
} from '@tabler/icons-react';
import { useAnswerContext } from '~/app/contexts/answer-context';

export function AnswersDataTable() {
  const {
    questions,
    loading,
    enabledColumns,
    filteredQuestions
  } = useAnswerContext();

  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return filteredQuestions(searchTerm);
  }, [filteredQuestions, searchTerm]);

  if (loading) {
    return (
      <Stack align="center" py="xl">
        <Text>Loading answer data...</Text>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      {/* Search and Filter Controls */}
      <Group justify="space-between" wrap="wrap">
        <Group gap="md" wrap="wrap">
          <TextInput
            placeholder="Search questions or best/worst..."
            leftSection={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 300 }}
          />
          <Button
            leftSection={<IconFilter size={16} />}
            variant="light"
            size="sm"
          >
            Filters
          </Button>
        </Group>
      </Group>

      {/* Data Table Container */}
      <Card withBorder padding={0} radius="md">
        <ScrollArea 
          type="scroll" 
          scrollbarSize={8} 
          offsetScrollbars={false}
          style={{ 
            maxHeight: '70vh',
            width: '100%'
          }}
          scrollHideDelay={1000}
          classNames={{
            scrollbar: 'custom-scrollbar',
            thumb: 'custom-scrollbar-thumb',
            track: 'custom-scrollbar-track',
            viewport: 'custom-scrollbar-viewport',
          }}
        >
        <Table striped highlightOnHover style={{ minWidth: '800px' }}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '100px', minWidth: '100px' }}>
                <Text fw={700} size="sm">Question</Text>
              </Table.Th>
              <Table.Th style={{ width: '120px', minWidth: '120px' }}>
                <Text fw={700} size="sm">Best/Worst</Text>
              </Table.Th>
              {enabledColumns.map((column) => (
                <Table.Th key={column.id} style={{ width: '60px', minWidth: '60px', textAlign: 'center' }}>
                  <Text fw={700} size="sm">{column.name}</Text>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.map((row) => (
              <Table.Tr key={row.id}>
                <Table.Td style={{ width: '100px', minWidth: '100px' }}>
                  <Text size="sm" fw={500}>{row.question}</Text>
                </Table.Td>
                <Table.Td style={{ width: '120px', minWidth: '120px' }}>
                  <Badge 
                    variant="light" 
                    color={row.bestWorst === 'Best' ? 'green' : 'red'}
                    size="sm"
                  >
                    {row.bestWorst}
                  </Badge>
                </Table.Td>
                {enabledColumns.map((column) => (
                  <Table.Td key={column.id} style={{ width: '60px', minWidth: '60px', textAlign: 'center' }}>
                    <Text size="xs" fw={500}>
                      {row[column.id as keyof typeof row] || '-'}
                    </Text>
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        </ScrollArea>
      </Card>
    </Stack>
  );
}