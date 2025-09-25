'use client';

import { useState, useMemo } from 'react';
import { TextInput, Group, Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import StudentsTable, { type ReportData } from './students-table';

interface CategoryResult {
  category: string;
  score: number;
  total: number;
  percentage: number;
}

export interface ReportData {
  totalScore: number;
  totalPossible: number;
  categoryResults: Array<CategoryResult>;
  overallPercentage: number;
  [key: string]: unknown;
}

type Student = {
  id: string;
  email: string;
  fullName: string | null;
  lastActiveAt: string;
  createdAt: string;
  cohortId: string | null;
  cohortName: string | null;
  stayOut: string;
  preAssessmentStatus: string | null;
  preAssessmentData: ReportData | null;
  postAssessmentStatus: string | null;
  postAssessmentData: ReportData | null;
};

interface SearchableStudentsTableProps {
  data: Array<Student>;
}

export function SearchableStudentsTable({ data }: SearchableStudentsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return data.filter(student => {
      // Search in name (case-insensitive)
      const nameMatch = student.fullName?.toLowerCase().includes(query) || false;
      
      // Search in email (case-insensitive)
      const emailMatch = student.email.toLowerCase().includes(query);
      
      // Search in cohort name (case-insensitive)
      const cohortMatch = student.cohortName?.toLowerCase().includes(query) || false;
      
      return nameMatch || emailMatch || cohortMatch;
    });
  }, [data, searchQuery]);

  return (
    <Stack gap="md" h="100%">
      {/* Search Bar */}
      <Group justify="space-between" px="md" pt="md">
        <TextInput
          placeholder="Search by name, email, or cohort..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          leftSection={<IconSearch size="1rem" />}
          style={{ minWidth: '300px' }}
        />
        <Text size="sm" c="dimmed">
          {filteredStudents.length} of {data.length} students
        </Text>
      </Group>

      {/* Results */}
      {filteredStudents.length === 0 && searchQuery.trim() ? (
        <Stack align="center" justify="center" h="200px">
          <Text c="dimmed" size="lg">No students found</Text>
          <Text c="dimmed" size="sm">
            Try adjusting your search terms
          </Text>
        </Stack>
      ) : (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <StudentsTable data={filteredStudents} />
        </div>
      )}
    </Stack>
  );
}
