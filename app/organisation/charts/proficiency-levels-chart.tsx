import { useMemo } from 'react';

import { Badge, Flex, Paper, Text } from '@mantine/core';

import { PieChart } from '@mantine/charts';

// Types for grade boundaries and data
type GradeBoundary = {
  lowerBound: number;
  upperBound: number;
  grade: string;
  color: string;
};

type AttemptData = {
  totalScore: number;
  totalPossible: number;
};

interface ProficiencyLevelsChartProps {
  attempts: Array<AttemptData>;
}

// Constants for grade boundaries based on CSV data
const GRADE_BOUNDARIES: GradeBoundary[] = [
  { lowerBound: 36, upperBound: 40, grade: 'Exceptional Proficiency', color: 'green.6' },
  { lowerBound: 30, upperBound: 35, grade: 'High Proficiency', color: 'teal.6' },
  { lowerBound: 20, upperBound: 29, grade: 'Moderate Proficiency', color: 'blue.6' },
  { lowerBound: 10, upperBound: 19, grade: 'Developing Proficiency', color: 'orange.6' },
  { lowerBound: 0, upperBound: 9, grade: 'Needs Development', color: 'red.6' },
];

// Function to classify a score into its appropriate grade
const classifyScore = (score: number): string => {
  for (const boundary of GRADE_BOUNDARIES) {
    if (score >= boundary.lowerBound && score <= boundary.upperBound) {
      return boundary.grade;
    }
  }
  return 'Unclassified';
};

export function ProficiencyLevelsChart({ attempts }: ProficiencyLevelsChartProps) {
  // Calculate grade distribution
  const gradeDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};

    // Initialize counts for all grades to zero
    GRADE_BOUNDARIES.forEach(boundary => {
      distribution[boundary.grade] = 0;
    });

    // Count occurrences of each grade
    attempts.forEach(attempt => {
      const grade = classifyScore(attempt.totalScore);
      distribution[grade] = (distribution[grade] || 0) + 1;
    });

    // Convert to array format for PieChart
    return GRADE_BOUNDARIES.map(boundary => ({
      name: boundary.grade,
      value: distribution[boundary.grade],
      color: boundary.color,
    })).filter(item => item.value > 0); // Only include grades that have at least one student
  }, [attempts]);

  const Legend = () => (
    <Flex gap="md" wrap="wrap" justify="center" mt="md">
      {gradeDistribution.map(item => (
        <Badge bg={item.color} key={item.name}>
          {item.name}
        </Badge>
      ))}
    </Flex>
  );

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={500} size="lg" mb="xl">
        Proficiency Levels
      </Text>
      <PieChart
        w="100%"
        size={250}
        data={gradeDistribution}
        withLabels
        labelsType="percent"
        labelsPosition="outside"
        withTooltip
        tooltipDataSource="segment"
      />
      <Legend />
      <Text size="sm" c="dimmed" ta="center" mt="sm">
        Distribution of respondents across proficiency levels
      </Text>
    </Paper>
  );
}
