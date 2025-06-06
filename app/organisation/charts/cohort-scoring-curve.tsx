'use client';

import { useMemo } from 'react';

import { Paper, Text } from '@mantine/core';

import { AreaChart, BarChart } from '@mantine/charts';

interface CohortScoringCurveProps {
  attempts: Array<{
    totalScore: number;
    totalPossible: number;
  }>;
}

export function CohortScoringCurve({ attempts }: CohortScoringCurveProps) {
  // Generate the distribution data
  const distributionData = useMemo(() => {
    // Initialize array for all possible scores (0-40)
    const scoreDistribution = Array.from({ length: 41 }, (_, i) => ({
      score: i,
      percentage: 0,
    }));

    if (attempts.length > 0) {
      // Count occurrences of each score
      const scoreCount: Record<number, number> = {};

      attempts.forEach(attempt => {
        const score = Math.round(attempt.totalScore); // Round to nearest integer
        scoreCount[score] = (scoreCount[score] || 0) + 1;
      });

      // Calculate percentage for each score
      for (let score = 0; score <= 40; score++) {
        const count = scoreCount[score] || 0;
        scoreDistribution[score].percentage = (count / attempts.length) * 100;
      }
    }

    return scoreDistribution;
  }, [attempts]);

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={500} size="lg" mb="xl">
        Cohort Scoring Curve
      </Text>
      <BarChart
        h={300}
        data={distributionData}
        dataKey="score"
        series={[{ name: 'percentage', color: 'blue.6' }]}
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 50 }}
        withTooltip
        yAxisProps={{ tickFormatter: (value: number) => `${value}%` }}
        xAxisProps={{
          type: 'number',
          domain: [0, 40],
          tickCount: 9, // Show fewer ticks for readability
          tickFormatter: (value: number) => `${value}`,
        }}
        valueFormatter={value => `${value.toFixed(1)}%`}
        gridAxis="xy"
      />
      <Text size="sm" c="dimmed" ta="center" mt="sm">
        Distribution of scores across the assessment range (0-40)
      </Text>
    </Paper>
  );
}
