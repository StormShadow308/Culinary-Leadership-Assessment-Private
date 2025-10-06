'use client';

import { useState, useRef } from 'react';
import { Stack, Card, Group, Text, Title, Button, LoadingOverlay } from '@mantine/core';
import { IconPrinter, IconDownload } from '@tabler/icons-react';
import { AnalysisFilters, type AnalysisFilter } from './analysis-filters';
import { generateDashboardPDF } from '~/lib/pdf-generator';

interface AnalysisDashboardProps {
  children: React.ReactNode;
  totalStudents: number;
  completedStudents: number;
  notCompletedStudents: number;
  title?: string;
  selectedFilter?: AnalysisFilter;
  onFilterChange?: (filter: AnalysisFilter) => void;
}

export function AnalysisDashboard({
  children,
  totalStudents,
  completedStudents,
  notCompletedStudents,
  title = "Analysis Dashboard",
  selectedFilter: externalSelectedFilter,
  onFilterChange
}: AnalysisDashboardProps) {
  const [internalSelectedFilter, setInternalSelectedFilter] = useState<AnalysisFilter>('all');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Use external filter if provided, otherwise use internal state
  const selectedFilter = externalSelectedFilter ?? internalSelectedFilter;

  const handleFilterChange = (filter: AnalysisFilter) => {
    if (externalSelectedFilter === undefined) {
      setInternalSelectedFilter(filter);
    }
    onFilterChange?.(filter);
  };

  const handlePrintPDF = async () => {
    if (!dashboardRef.current) return;

    setIsGeneratingPDF(true);
    try {
      await generateDashboardPDF('analysis-dashboard-content', {
        filename: `culinary-assessment-${selectedFilter}-${new Date().toISOString().split('T')[0]}.pdf`,
        title: `${title} - ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Students`,
        includeCharts: true
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      // You could add a notification here
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Stack gap="md" ref={dashboardRef}>
      {/* Analysis Filters */}
      <Card withBorder padding="lg" radius="md">
        <AnalysisFilters
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          onPrintPDF={handlePrintPDF}
          totalStudents={totalStudents}
          completedStudents={completedStudents}
          notCompletedStudents={notCompletedStudents}
          loading={isGeneratingPDF}
        />
      </Card>

      {/* Dashboard Content */}
      <div id="analysis-dashboard-content">
        <LoadingOverlay visible={isGeneratingPDF} zIndex={1000} />
        {children}
      </div>

      {/* Additional Actions */}
      <Card withBorder padding="md" radius="md">
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            Current filter: <Text component="span" fw={500} c="blue">
              {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1).replace('_', ' ')} Students
            </Text>
          </Text>
          
          <Group gap="sm">
            <Button
              leftSection={<IconDownload size={14} />}
              variant="light"
              size="sm"
              onClick={() => {
                // Additional download functionality can be added here
                console.log('Download additional data');
              }}
            >
              Export Data
            </Button>
            
            <Button
              leftSection={<IconPrinter size={14} />}
              variant="filled"
              size="sm"
              onClick={handlePrintPDF}
              loading={isGeneratingPDF}
            >
              Print Report
            </Button>
          </Group>
        </Group>
      </Card>
    </Stack>
  );
}
