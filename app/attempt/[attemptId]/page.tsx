import React from 'react';

import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';

import {
  Box,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Progress,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { db } from '~/db';
import { attempts, cohorts, options, participants, questions, responses } from '~/db/schema';

import { and, count, eq } from 'drizzle-orm';

import { QuestionForm } from './components/question-form';

async function getQuestionData(attemptId: string) {
  // Get the attempt
  const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).execute();

  if (!attempt) notFound();

  const participant = await db
    .select({
      participant: participants,
      attempt: attempts,
    })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(eq(attempts.id, attemptId))
    .execute();

  // If attempt is completed, redirect to results
  if (attempt.status === 'completed') {
    redirect(`/attempt/${attemptId}/results`);
  }

  // Get the current question based on lastQuestionSeen
  const [question] = await db
    .select()
    .from(questions)
    .where(and(eq(questions.orderNumber, attempt.lastQuestionSeen)))
    .execute();

  if (!question) notFound();

  // Get the options for this question
  const questionOptions = await db
    .select()
    .from(options)
    .where(eq(options.questionId, question.id))
    .execute();

  // Get the total number of questions for this assessment
  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(questions)
    .where(eq(questions.assessmentId, attempt.assessmentId))
    .execute();

  const totalQuestions = Number(totalCount) || 20; // Fallback to 20 if count fails

  // Check if there's an existing response
  const [existingResponse] = await db
    .select()
    .from(responses)
    .where(and(eq(responses.attemptId, attemptId), eq(responses.questionId, question.id)))
    .execute();

  return {
    attempt,
    participant,
    question,
    questionOptions,
    totalQuestions,
    existingResponse,
  };
}

export default async function AttemptQuestionPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const { question, questionOptions, totalQuestions, existingResponse, participant } =
    await getQuestionData(attemptId);
  const [cohort] = await db
    .select({ name: cohorts.name })
    .from(cohorts)
    .where(eq(cohorts.id, participant[0]?.participant.cohortId))
    .execute();

  const progress = (question.orderNumber / totalQuestions) * 100;
  const isPreviousDisabled = question.orderNumber === 1;

  console.log('Participant:', participant[0]?.participant);

  return (
    <Container h="100%" py="lg" px="md" size="lg">
      <Center h="100%">
        <Flex direction="column" gap="md" w="100%">
          <Card padding="lg" radius="md" withBorder maw={1100} mx="auto" shadow="sm">
            <Group>
              <img
                src="/whatsapp-logo.jpeg"
                alt="Company Logo"
                width={140}
                height={60}
                style={{ objectFit: 'contain' }}
              />
              <Space m="auto" />
              <Stack gap="0" align="end">
                <Text size="md">{participant[0]?.participant.fullName}</Text>
                <Text size="sm" c="dimmed">
                  {cohort?.name ?? ''}
                </Text>
              </Stack>
            </Group>
            {/* Progress section */}
            <Box my="lg">
              <Flex justify="space-between" align="center" mb="xs">
                <Text size="sm" fw={500}>
                  Question {question.orderNumber} of {totalQuestions}
                </Text>
                <Text size="sm" fw={500}>
                  {Math.round(progress)}%
                </Text>
              </Flex>
              <Progress value={progress} />
            </Box>
            {/* Question section */}
            <Stack gap="xs" mb="md">
              <Title order={3}>Question {question.orderNumber}</Title>
              <Text mt="xs" c="dimmed" style={{ userSelect: 'none' }}>
                {question.text}
              </Text>
            </Stack>
            <QuestionForm
              attemptId={attemptId}
              question={question}
              questionOptions={questionOptions}
              existingResponse={existingResponse}
              isPreviousDisabled={isPreviousDisabled}
            />
          </Card>
        </Flex>
      </Center>
    </Container>
  );
}
