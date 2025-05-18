'use client';

import { useRouter } from 'next/navigation';

import { Badge, Table, Text } from '@mantine/core';

interface Props {
  student: {
    id: string;
    fullName: string | null;
    email: string;
    cohortName: string | null;
    stayOut: string;
    preAssessmentStatus: string | null;
    preAssessmentScores: {
      resilienceAdaptability: number | null;
      teamDynamics: number | null;
      decisionMaking: number | null;
      selfAwareness: number | null;
      communication: number | null;
      overall: number | null;
    };
    postAssessmentScores: {
      resilienceAdaptability: number | null;
      teamDynamics: number | null;
      decisionMaking: number | null;
      selfAwareness: number | null;
      communication: number | null;
      overall: number | null;
    };
  };
}

export default function StudentRow({ student }: Props) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/organisation/respondents/${student.id}`);
  };

  return (
    <Table.Tr onClick={handleRowClick} style={{ cursor: 'pointer' }}>
      <Table.Td style={{ minWidth: '150px' }}>{student.fullName || 'Not provided'}</Table.Td>
      <Table.Td style={{ minWidth: '200px' }}>{student.email}</Table.Td>
      <Table.Td style={{ minWidth: '120px' }}>
        {student.cohortName ? (
          <Badge color="blue" fullWidth>
            {student.cohortName}
          </Badge>
        ) : (
          <Text c="dimmed" size="sm">
            No cohort
          </Text>
        )}
      </Table.Td>
      <Table.Td style={{ minWidth: '100px' }}>
        <Badge color={student.stayOut === 'Stay' ? 'green' : 'red'} fullWidth>
          {student.stayOut}
        </Badge>
      </Table.Td>
      <Table.Td style={{ minWidth: '120px' }}>
        {!student.preAssessmentStatus ? (
          <Text c="dimmed" size="sm">
            No attempt
          </Text>
        ) : student.preAssessmentStatus === 'completed' ? (
          <Badge color="green" fullWidth>
            Completed
          </Badge>
        ) : (
          <Badge color="yellow" fullWidth>
            In progress
          </Badge>
        )}
      </Table.Td>

      {/* Pre-Assessment Scores */}
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-yellow-2)', textAlign: 'center' }}>
        {student.preAssessmentScores.resilienceAdaptability ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-yellow-2)', textAlign: 'center' }}>
        {student.preAssessmentScores.teamDynamics ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-yellow-2)', textAlign: 'center' }}>
        {student.preAssessmentScores.decisionMaking ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-yellow-2)', textAlign: 'center' }}>
        {student.preAssessmentScores.selfAwareness ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-yellow-2)', textAlign: 'center' }}>
        {student.preAssessmentScores.communication ?? '-'}
      </Table.Td>
      <Table.Td
        style={{
          backgroundColor: 'var(--mantine-color-yellow-2)',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {student.preAssessmentScores.overall ?? '-'}
      </Table.Td>

      {/* Post-Assessment Scores */}
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-blue-2)', textAlign: 'center' }}>
        {student.postAssessmentScores.resilienceAdaptability ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-blue-2)', textAlign: 'center' }}>
        {student.postAssessmentScores.teamDynamics ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-blue-2)', textAlign: 'center' }}>
        {student.postAssessmentScores.decisionMaking ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-blue-2)', textAlign: 'center' }}>
        {student.postAssessmentScores.selfAwareness ?? '-'}
      </Table.Td>
      <Table.Td style={{ backgroundColor: 'var(--mantine-color-blue-2)', textAlign: 'center' }}>
        {student.postAssessmentScores.communication ?? '-'}
      </Table.Td>
      <Table.Td
        style={{
          backgroundColor: 'var(--mantine-color-blue-2)',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {student.postAssessmentScores.overall ?? '-'}
      </Table.Td>
    </Table.Tr>
  );
}
