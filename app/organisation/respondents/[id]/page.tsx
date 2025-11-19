import Link from 'next/link';

import {
  Anchor,
  Badge,
  Card,
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { db } from '~/db';
import { attempts, cohorts, participants } from '~/db/schema';

import { and, eq } from 'drizzle-orm';

import { PrintPdfButton } from './components/print-pdf';
import { StatusSelect } from './components/status-select';

// Types based on your existing code
interface CategoryResult {
  category: string;
  score: number;
  total: number;
  percentage: number;
}

interface ReportData {
  totalScore: number;
  totalPossible: number;
  categoryResults: Array<CategoryResult>;
  overallPercentage: number;
}

// Grading thresholds based on your csv data
const categoryGradingScales = {
  individual: [
    { min: 7, max: 8, grade: 'Exceptional Proficiency' },
    { min: 5, max: 6, grade: 'High Proficiency' },
    { min: 3, max: 4, grade: 'Moderate Proficiency' },
    { min: 1, max: 2, grade: 'Developing Proficiency' },
    { min: 0, max: 1, grade: 'Needs Development' },
  ],
  overall: [
    { min: 36, max: 40, grade: 'Exceptional Proficiency' },
    { min: 30, max: 35, grade: 'High Proficiency' },
    { min: 20, max: 29, grade: 'Moderate Proficiency' },
    { min: 10, max: 19, grade: 'Developing Proficiency' },
    { min: 0, max: 9, grade: 'Needs Development' },
  ],
};

// Description mappings based on your csv data
const gradeDescriptions = {
  'Resilience and Adaptability': {
    'Exceptional Proficiency':
      'Shows advanced adaptability and resilience under pressure. Eﬀective in managing unexpected challenges.',
    'High Proficiency':
      'Demonstrates good resilience with eﬀective approaches to managing stress and adaptability. Minor improvements needed.',
    'Moderate Proficiency':
      'Adequate resilience but shows diﬃculty handling more significant challenges or high-pressure situations.',
    'Developing Proficiency':
      'Struggles with resilience. Requires assistance to manage stress and adapt eﬀectively.',
    'Needs Development': 'Lacks resilience and adaptability. Fails to cope under pressure.',
  },
  'Team Dynamics & Collaboration': {
    'Exceptional Proficiency':
      'Demonstrates excellent teamwork skills and an ability to eﬀectively resolve conflicts.',
    'High Proficiency':
      'Usually eﬀective in collaborating and supporting the team, with minor gaps in team facilitation.',
    'Moderate Proficiency':
      'Shows basic understanding of team collaboration but lacks eﬀectiveness in diﬃcult group situations.',
    'Developing Proficiency':
      'Limited contribution to team collaboration. Often struggles to eﬀectively work within the group.',
    'Needs Development':
      'Lacks basic teamwork and collaborative skills. Does not support the team.',
  },
  'Decision-Making & Problem-Solving': {
    'Exceptional Proficiency': 'Makes eﬀective, strategic decisions in diﬃcult situations.',
    'High Proficiency':
      'Shows generally good decision-making abilities, capable of solving most challenges.',
    'Moderate Proficiency':
      'Displays an adequate understanding of decision-making but lacks strategic eﬀectiveness under pressure.',
    'Developing Proficiency':
      'Struggles to make eﬀective decisions. Needs significant guidance in problem-solving.',
    'Needs Development': 'Does not demonstrate eﬀective problem-solving or decision-making skills.',
  },
  'Self-Awareness & Emotional Intelligence': {
    'Exceptional Proficiency':
      'Displays excellent self-awareness and regulation of emotions, even under stress.',
    'High Proficiency':
      'Understands emotional responses and usually manages emotions well. Minor room for improvement.',
    'Moderate Proficiency':
      'Shows basic emotional understanding but occasionally fails to regulate emotions eﬀectively.',
    'Developing Proficiency':
      'Limited self-awareness. Struggles to regulate emotions in stressful contexts.',
    'Needs Development':
      'Lacks awareness of emotions and their impact. Needs substantial improvement.',
  },
  'Communication & Active Listening': {
    'Exceptional Proficiency':
      'Communicates clearly and eﬀectively, with active listening and empathy consistently demonstrated.',
    'High Proficiency':
      'Generally communicates well and listens eﬀectively but has minor gaps in engagement.',
    'Moderate Proficiency':
      'Adequate communication skills but inconsistencies in listening or conveying messages.',
    'Developing Proficiency':
      'Struggles to communicate clearly or listen actively. Requires coaching to improve.',
    'Needs Development':
      'Lacks basic communication and listening skills. Needs extensive development.',
  },
  Overall: {
    'Exceptional Proficiency': 'Demonstrates advanced leadership skills across all categories.',
    'High Proficiency':
      'Reflects strong leadership performance across key areas with only minor areas needing improvement.',
    'Moderate Proficiency':
      'Shows an acceptable grasp of leadership principles with room for further development.',
    'Developing Proficiency':
      'Indicates significant gaps in understanding and leadership skills that need development.',
    'Needs Development': 'Lacks foundational leadership skills; requires extensive support.',
  },
};

// Helper to determine grade based on score
function getGrade(score: number, type: 'individual' | 'overall'): string {
  const scale = categoryGradingScales[type];
  for (const { min, max, grade } of scale) {
    if (score >= min && score <= max) {
      return grade;
    }
  }
  return 'Not Available';
}

// Helper to get color based on grade
function getGradeColor(grade: string): string {
  switch (grade) {
    case 'Exceptional Proficiency':
      return 'green';
    case 'High Proficiency':
      return 'teal';
    case 'Moderate Proficiency':
      return 'blue';
    case 'Developing Proficiency':
      return 'orange';
    case 'Needs Development':
      return 'red';
    default:
      return 'gray';
  }
}

export default async function StudentReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Server-side data fetching
  const [participant] = await db
    .select({
      id: participants.id,
      email: participants.email,
      fullName: participants.fullName,
      createdAt: participants.createdAt,
      lastActiveAt: participants.lastActiveAt,
      cohortId: participants.cohortId,
      cohortName: cohorts.name,
      stayOut: participants.stayOut,
    })
    .from(participants)
    .leftJoin(cohorts, eq(participants.cohortId, cohorts.id))
    .where(eq(participants.id, id));

  if (!participant) {
    return <Text>Student not found</Text>;
  }

  // Get pre-assessment data
  const [preAssessment] = await db
    .select({
      status: attempts.status,
      reportData: attempts.reportData,
    })
    .from(attempts)
    .where(and(eq(attempts.participantId, id), eq(attempts.type, 'pre_assessment')));
  // Get post-assessment data (final/full results if available)
  const [postAssessment] = await db
    .select({
      status: attempts.status,
      reportData: attempts.reportData,
    })
    .from(attempts)
    .where(and(eq(attempts.participantId, id), eq(attempts.type, 'post_assessment')));

  // Prefer post-assessment report data (full result) when available, otherwise fall back to pre-assessment
  const reportData = (postAssessment?.reportData || preAssessment?.reportData) as
    | ReportData
    | undefined;

  // If no report data is available
  if (!reportData) {
    return (
      <Stack>
        <Group justify="space-between">
          <Anchor component={Link} href="/organisation/respondents">
            &larr; Back to Students
          </Anchor>
          <PrintPdfButton studentId={id} />
        </Group>

        <Card withBorder>
          <Title order={3} mb="md">
            Student Information
          </Title>
          <Grid>
            <GridCol span={6}>
              <Text size="sm" c="dimmed">
                Name
              </Text>
              <Text fw={500}>{participant.fullName || 'Not provided'}</Text>
              <Text size="sm" c="dimmed" mt="md">
                Cohort
              </Text>
              <Text fw={500}>{participant.cohortName || 'No cohort'}</Text>
            </GridCol>

            <GridCol span={6}>
              <Text size="sm" c="dimmed">
                Email
              </Text>
              <Text fw={500}>{participant.email || 'Not provided'}</Text>

              <Text size="sm" c="dimmed" mt="md">
                Status
              </Text>
              <StatusSelect studentId={id} initialStatus={participant.stayOut as 'Stay' | 'Out'} />
            </GridCol>
          </Grid>
        </Card>
        <Card withBorder>
          <Title order={2} mb="md">
            Assessment Data
          </Title>
          <Text>No assessment data available for this student.</Text>
        </Card>
      </Stack>
    );
  }

  const overallGrade = getGrade(reportData.totalScore, 'overall');

  return (
    <Stack>
      <Group justify="space-between">
        <Anchor component={Link} href="/organisation/respondents">
          &larr; Back to Students
        </Anchor>
        <PrintPdfButton studentId={id} />
      </Group>

      <Card withBorder>
        <Title order={2} mb="md">
          Student Information
        </Title>
        <Grid>
          <GridCol span={6}>
            <Text size="sm" c="dimmed">
              Name
            </Text>
            <Text fw={500}>{participant.fullName || 'Not provided'}</Text>

            <Text size="sm" c="dimmed" mt="md">
              Cohort
            </Text>
            <Text fw={500}>{participant.cohortName || 'No cohort'}</Text>
          </GridCol>

          <GridCol span={6}>
            <Text size="sm" c="dimmed">
              Email
            </Text>
            <Anchor component="a" href={`mailto:${participant.email}`}>
              {participant.email || 'Not provided'}
            </Anchor>

            <Text size="sm" c="dimmed" mt="md">
              Status
            </Text>
            <StatusSelect studentId={id} initialStatus={participant.stayOut as 'Stay' | 'Out'} />
          </GridCol>
        </Grid>
      </Card>

      <Card withBorder>
        <Title order={2} mb="md">
          Summary
        </Title>
        <Paper withBorder>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#14162b', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Overall Score</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>
                  {reportData.totalScore} out of {reportData.totalPossible}
                </th>
                <th style={{ padding: '12px', textAlign: 'right' }}>{overallGrade}</th>
              </tr>
            </thead>
            <tbody>
              {reportData.categoryResults.map(category => (
                <tr
                  key={category.category}
                  style={{ backgroundColor: category.score === 0 ? '#fff9c4' : undefined }}
                >
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {category.category}
                  </td>
                  <td
                    style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}
                  >
                    {category.score} out of {category.total}
                  </td>
                  <td
                    style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right' }}
                  >
                    {getGrade(category.score, 'individual')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      </Card>

      <Card withBorder>
        <Title order={2} mb="md">
          Details
        </Title>
        <Title order={3} mb="sm">
          {participant.fullName}: {reportData.totalScore} out of {reportData.totalPossible} -{' '}
          {overallGrade}
        </Title>
        <Text mb="xl">
          {
            gradeDescriptions['Overall'][
              overallGrade as keyof (typeof gradeDescriptions)['Overall']
            ]
          }
        </Text>

        <Stack>
          {reportData.categoryResults.map(category => {
            const grade = getGrade(category.score, 'individual');
            const description =
              gradeDescriptions[category.category as keyof typeof gradeDescriptions]?.[
                grade as keyof (typeof gradeDescriptions)['Overall']
              ] || '';

            return (
              <div key={category.category}>
                <Group justify="space-between" mb="xs">
                  <Title order={4}>{category.category}</Title>
                  <Badge color={getGradeColor(grade)}>
                    {category.score} out of {category.total} - {grade}
                  </Badge>
                </Group>
                <Text>{description}</Text>
                <Divider my="md" />
              </div>
            );
          })}
        </Stack>
      </Card>
    </Stack>
  );
}
