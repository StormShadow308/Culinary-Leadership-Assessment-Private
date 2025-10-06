'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TextInput,
  Select,
  Group,
  Text,
  Badge,
  ActionIcon,
  Tooltip,
  Stack,
  Button,
  Modal,
  Grid,
  Divider,
  Card,
  Switch,
  ScrollArea
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconSettings,
  IconColumnInsertRight,
  IconChevronLeft,
  IconChevronRight,
  IconX
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useAnswerContext } from '~/app/contexts/answer-context';

export function AnswersDataTable() {
  const {
    questions,
    columns,
    loading,
    updateAnswer,
    toggleColumn,
    reorderColumns,
    enabledColumns,
    filteredQuestions
  } = useAnswerContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [columnModalOpened, { open: openColumnModal, close: closeColumnModal }] = useDisclosure(false);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return filteredQuestions(searchTerm);
  }, [filteredQuestions, searchTerm]);

  // Handle column toggle
  const handleColumnToggle = (columnId: string) => {
    toggleColumn(columnId);
  };

  // Handle column reorder
  const handleColumnReorder = (fromIndex: number, toIndex: number) => {
    reorderColumns(fromIndex, toIndex);
  };

  // Handle column delete (disable)
  const handleColumnDelete = (columnId: string) => {
    if (columnId === 'culinaryA') {
      return; // Prevent deletion of the first column
    }
    toggleColumn(columnId);
  };

  // Handle add column
  const handleAddColumn = () => {
    const nextColumn = columns.find(col => !col.enabled);
    if (nextColumn) {
      toggleColumn(nextColumn.id);
    }
  };

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
        <Group gap="sm">
          <Button
            leftSection={<IconSettings size={16} />}
            variant="light"
            size="sm"
            onClick={openColumnModal}
          >
            Manage Columns
          </Button>
          <Button
            leftSection={<IconColumnInsertRight size={16} />}
            variant="light"
            size="sm"
            onClick={handleAddColumn}
            disabled={enabledColumns.length >= 26}
          >
            Add Column
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
                    {column.id === 'culinaryA' ? (
                      // Culinary A is read-only (populated from screenshot)
                      <Text size="xs" fw={500}>
                        {row[column.id as keyof typeof row] || '-'}
                      </Text>
                    ) : (
                      // Other columns are editable with Select dropdowns
                      <Select
                        size="xs"
                        value={row[column.id as keyof typeof row] as string || ''}
                        onChange={(value) => {
                          updateAnswer(row.id, column.id, value || '');
                        }}
                        data={['', 'A', 'B', 'C', 'D', 'E']}
                        placeholder="-"
                        style={{ width: '40px' }}
                        styles={{
                          input: {
                            fontSize: '10px',
                            padding: '2px 4px',
                            minHeight: '20px',
                            height: '20px',
                            textAlign: 'center'
                          }
                        }}
                        classNames={{ option: 'custom-select-option' }}
                      />
                    )}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        </ScrollArea>
      </Card>

      {/* Column Management Modal */}
      <Modal
        opened={columnModalOpened}
        onClose={closeColumnModal}
        title="Manage Answer Columns"
        size="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Enable or disable answer columns, reorder them, or hide them from the table. Hidden columns can be re-enabled later.
          </Text>
          
          {columns.map((column, index) => (
            <Card key={column.id} withBorder padding="sm">
              <Group justify="space-between" align="center">
                <Group gap="md">
                  <Text fw={500}>{column.name}</Text>
                  <Badge size="sm" variant="light" color="blue">
                    Order: {column.order}
                  </Badge>
                  {column.id === 'culinaryA' && (
                    <Badge size="sm" variant="light" color="green">
                      Default
                    </Badge>
                  )}
                </Group>
                <Group gap="sm">
                  <Switch
                    checked={column.enabled}
                    onChange={() => handleColumnToggle(column.id)}
                    label="Enabled"
                  />
                  {index > 0 && (
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() => handleColumnReorder(index, index - 1)}
                    >
                      <IconChevronLeft size={14} />
                    </ActionIcon>
                  )}
                  {index < columns.length - 1 && (
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() => handleColumnReorder(index, index + 1)}
                    >
                      <IconChevronRight size={14} />
                    </ActionIcon>
                  )}
                  {column.id !== 'culinaryA' && (
                    <Tooltip label="Hide Column from Table">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => handleColumnDelete(column.id)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Group>
            </Card>
          ))}

          <Group justify="flex-end" gap="sm">
            <Button variant="light" onClick={closeColumnModal}>
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}