import { Paper, Stack, Title } from '@mantine/core';

import { db } from '~/db';
import { assessments, questions } from '~/db/schema';

import { eq } from 'drizzle-orm';

import { QuestionsTable } from './components/questions-table';

export default async function QAAdminPage() {
  // Fetch questions with their assessment title
  const questionsData = await db
    .select({
      id: questions.id,
      text: questions.text,
      category: questions.category,
      orderNumber: questions.orderNumber,
      assessmentId: questions.assessmentId,
      assessmentTitle: assessments.title,
    })
    .from(questions)
    .leftJoin(assessments, eq(questions.assessmentId, assessments.id))
    .orderBy(questions.orderNumber);

  return (
    <Stack h="100%" gap="md">
      <Title order={2}>Questions & Answers</Title>
      <Paper h="100%" withBorder>
        <QuestionsTable data={questionsData} />
      </Paper>
    </Stack>
  );
}
