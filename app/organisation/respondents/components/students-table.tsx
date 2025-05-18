import { Table, TableTbody, TableTh, TableThead, TableTr } from '@mantine/core';

import StudentRow from './student-row';

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

const categoryMappings: Record<string, string> = {
  resilienceAdaptability: 'Resilience and Adaptability',
  teamDynamics: 'Team Dynamics & Collaboration',
  decisionMaking: 'Decision-Making & Problem-Solving',
  selfAwareness: 'Self-Awareness & Emotional Intelligence',
  communication: 'Communication & Active Listening',
};

function getScoreFromReport(reportData: ReportData | null, categoryKey: string): number | null {
  if (!reportData || !reportData.categoryResults) return null;

  // Get the mapped category name
  const categoryName = categoryMappings[categoryKey];
  if (!categoryName) return null;

  // Find the exact category result
  const categoryResult = reportData.categoryResults.find(
    result => result.category === categoryName
  );

  return categoryResult ? categoryResult.score : null;
}

function getOverallScore(reportData: ReportData | null): number | null {
  if (!reportData) return null;

  // Use the overallPercentage directly if available
  if (typeof reportData.overallPercentage === 'number') {
    return reportData.overallPercentage;
  }

  // Fall back to calculating from category results if needed
  if (reportData.categoryResults && reportData.categoryResults.length > 0) {
    const total = reportData.categoryResults.reduce((sum, cat) => sum + cat.score, 0);
    const possible = reportData.categoryResults.reduce((sum, cat) => sum + cat.total, 0);
    return possible > 0 ? Math.round((total / possible) * 1000) / 10 : null;
  }

  return null;
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

interface StudentsTableProps {
  data: Array<Student>;
}

export default function StudentsTable({ data }: StudentsTableProps) {
  // Pre-process student data for the client component
  const processedStudents = data.map(student => ({
    id: student.id,
    fullName: student.fullName,
    email: student.email,
    cohortName: student.cohortName,
    stayOut: student.stayOut,
    preAssessmentStatus: student.preAssessmentStatus,
    preAssessmentScores: {
      resilienceAdaptability: getScoreFromReport(
        student.preAssessmentData,
        'resilienceAdaptability'
      ),
      teamDynamics: getScoreFromReport(student.preAssessmentData, 'teamDynamics'),
      decisionMaking: getScoreFromReport(student.preAssessmentData, 'decisionMaking'),
      selfAwareness: getScoreFromReport(student.preAssessmentData, 'selfAwareness'),
      communication: getScoreFromReport(student.preAssessmentData, 'communication'),
      overall: getOverallScore(student.preAssessmentData),
    },
    postAssessmentScores: {
      resilienceAdaptability: getScoreFromReport(
        student.postAssessmentData,
        'resilienceAdaptability'
      ),
      teamDynamics: getScoreFromReport(student.postAssessmentData, 'teamDynamics'),
      decisionMaking: getScoreFromReport(student.postAssessmentData, 'decisionMaking'),
      selfAwareness: getScoreFromReport(student.postAssessmentData, 'selfAwareness'),
      communication: getScoreFromReport(student.postAssessmentData, 'communication'),
      overall: getOverallScore(student.postAssessmentData),
    },
  }));

  return (
    <Table stickyHeader highlightOnHover style={{ minWidth: '1500px' }}>
      <TableThead>
        <TableTr>
          <TableTh style={{ minWidth: '150px' }}>Name</TableTh>
          <TableTh style={{ minWidth: '200px' }}>Email</TableTh>
          <TableTh style={{ minWidth: '120px' }}>Cohort</TableTh>
          <TableTh style={{ minWidth: '100px' }}>Status</TableTh>
          <TableTh style={{ minWidth: '120px' }}>Entries Answer</TableTh>
          <TableTh colSpan={6} style={{ backgroundColor: 'var(--mantine-color-yellow-3)' }}>
            Pre-Program
          </TableTh>
          <TableTh colSpan={6} style={{ backgroundColor: 'var(--mantine-color-blue-3)' }}>
            Post-Program
          </TableTh>
        </TableTr>
        <TableTr>
          <TableTh></TableTh>
          <TableTh></TableTh>
          <TableTh></TableTh>
          <TableTh></TableTh>
          <TableTh></TableTh>

          {/* Pre-Assessment Column Headers */}
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-yellow-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Resilience & Adaptability
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-yellow-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Team Dynamics
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-yellow-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Decision-Making
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-yellow-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Self-Awareness
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-yellow-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Communication
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-yellow-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Overall Score
          </TableTh>

          {/* Post-Assessment Column Headers */}
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-blue-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Resilience & Adaptability
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-blue-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Team Dynamics
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-blue-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Decision-Making
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-blue-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Self-Awareness
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-blue-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Communication
          </TableTh>
          <TableTh
            style={{
              backgroundColor: 'var(--mantine-color-blue-2)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
            }}
          >
            Overall Score
          </TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>
        {processedStudents.map(student => (
          <StudentRow key={student.id} student={student} />
        ))}
      </TableTbody>
    </Table>
  );
}
