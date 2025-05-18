import { Flex, Paper, Text } from '@mantine/core';

import { BarChart } from '@mantine/charts';

type SkillSetData = {
  skillSet: string; // renamed from category
  averageScore: number;
  totalPossible: number;
};

interface SkillSetScoreChartProps {
  skillSetData: Array<SkillSetData>; // renamed from categoryData
}

export function SkillSetScoreChart({ skillSetData }: SkillSetScoreChartProps) {
  // Prepare data in the format expected by BarChart
  const chartData = skillSetData.map(item => ({
    skillSet: item.skillSet,
    'Average Score': Number(item.averageScore.toFixed(1)),
  }));

  const chartSeries = [{ name: 'Average Score' }];

  return (
    <Paper h="100%" p="md" radius="md" withBorder>
      <Text fw={500} size="lg" mb="xl">
        Average Score per Skill Set
      </Text>
      <Flex direction="column" gap="md" justify="center" h="100%">
        <BarChart
          h={300}
          data={chartData}
          dataKey="skillSet"
          series={chartSeries}
          withLegend
          legendProps={{ verticalAlign: 'bottom', height: 50 }}
          withTooltip
          gridAxis="y"
          yAxisProps={{ domain: [0, 8] }}
        />
        <Text size="sm" c="dimmed" ta="center" mt="sm">
          Comparison of average scores across assessment skill sets
        </Text>
      </Flex>
    </Paper>
  );
}
