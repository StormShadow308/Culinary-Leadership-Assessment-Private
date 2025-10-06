'use client';

import { Group, Select, Button, Badge, Stack, Text } from '@mantine/core';
import { IconFilter, IconPrinter, IconDownload } from '@tabler/icons-react';

export type AnalysisFilter = 'all' | 'completed' | 'not_completed';

interface AnalysisFiltersProps {
  selectedFilter: AnalysisFilter;
  onFilterChange: (filter: AnalysisFilter) => void;
  onPrintPDF: () => void;
  totalStudents: number;
  completedStudents: number;
  notCompletedStudents: number;
  loading?: boolean;
}

export function AnalysisFilters({
  selectedFilter,
  onFilterChange,
  onPrintPDF,
  totalStudents,
  completedStudents,
  notCompletedStudents,
  loading = false
}: AnalysisFiltersProps) {
  const filterOptions = [
    { value: 'all', label: 'All Students', count: totalStudents },
    { value: 'completed', label: 'Completed', count: completedStudents },
    { value: 'not_completed', label: 'Not Completed', count: notCompletedStudents },
  ];

  const getFilterColor = (filter: AnalysisFilter) => {
    switch (filter) {
      case 'completed': return 'green';
      case 'not_completed': return 'red';
      default: return 'blue';
    }
  };

  const getFilterIcon = (filter: AnalysisFilter) => {
    switch (filter) {
      case 'completed': return '✓';
      case 'not_completed': return '✗';
      default: return '👥';
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Group gap="md" align="center">
          <IconFilter size={20} />
          <Text size="lg" fw={600}>Analysis Filters</Text>
        </Group>
        
        <Button
          leftSection={<IconPrinter size={16} />}
          onClick={onPrintPDF}
          loading={loading}
          variant="filled"
          color="blue"
        >
          Print PDF Report
        </Button>
      </Group>

      <Group gap="md" align="center">
        <Text size="sm" fw={500}>Filter by Status:</Text>
        
        <Select
          value={selectedFilter}
          onChange={(value) => onFilterChange(value as AnalysisFilter)}
          data={filterOptions.map(option => ({
            value: option.value,
            label: `${option.label} (${option.count})`
          }))}
          size="sm"
          style={{ minWidth: 200 }}
        />

        <Group gap="xs">
          {filterOptions.map(option => (
            <Badge
              key={option.value}
              color={getFilterColor(option.value as AnalysisFilter)}
              variant={selectedFilter === option.value ? 'filled' : 'light'}
              size="lg"
              style={{ cursor: 'pointer' }}
              onClick={() => onFilterChange(option.value as AnalysisFilter)}
            >
              {getFilterIcon(option.value as AnalysisFilter)} {option.label}: {option.count}
            </Badge>
          ))}
        </Group>
      </Group>
    </Stack>
  );
}
