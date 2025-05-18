import { notFound, redirect } from 'next/navigation';

import { Box, Center, Container, Flex, Text, Title } from '@mantine/core';

import { db } from '~/db';
import { assessments, attempts, participants } from '~/db/schema';

import { eq } from 'drizzle-orm';

import { Instructions } from './components/instructions';
import { NewAssessmentForm } from './components/new-assessment-form';

async function getChefLeadershipAssessment() {
  const assessment = await db
    .select()
    .from(assessments)
    .where(eq(assessments.title, 'Chef Leadership Assessment'))
    .limit(1)
    .execute();

  if (!assessment.length) {
    notFound();
  }

  return assessment[0];
}

async function getParticipantInfo(attemptId?: string) {
  if (!attemptId) return null;

  const participant = await db
    .select({
      participant: participants,
      attempt: attempts,
    })
    .from(attempts)
    .innerJoin(participants, eq(attempts.participantId, participants.id))
    .where(eq(attempts.id, String(attemptId)))
    .execute();

  // If lastQuestionSeen from `attempt` is larger than 1, redirect to the attempt page
  if (participant[0]?.attempt?.lastQuestionSeen > 1) {
    redirect(`/attempt/${participant[0]?.attempt?.id}`);
  }

  return participant[0];
}

export default async function CulinaryLeadershipAssessment({
  searchParams,
}: {
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const assessment = await getChefLeadershipAssessment();

  const params = await searchParams;

  const attemptId = params.attemptId;

  const participant = await getParticipantInfo(attemptId);

  const participantName = participant?.participant.fullName;
  const participantEmail = participant?.participant.email;

  return (
    <Container h="100%" size={480}>
      <Center h="100%">
        <Flex direction="column" gap="md">
          <Box>
            <Title order={3} fw={600}>
              {assessment.title}
            </Title>
            <Text c="dimmed" size="md">
              {assessment.description || 'Evaluate your leadership skills in culinary environments'}
            </Text>
          </Box>
          {/* Instructions */}
          <Instructions />
          {/* New Assessment Form */}
          <NewAssessmentForm
            assessmentId={assessment.id}
            participantName={participantName}
            participantEmail={participantEmail}
          />
        </Flex>
      </Center>
    </Container>
  );
}
