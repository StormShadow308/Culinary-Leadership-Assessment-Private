import { notFound, redirect } from 'next/navigation';

import { Box, Card, Center, Container, Flex, Text, Title } from '@mantine/core';

import { IconCircleCheck } from '@tabler/icons-react';

import { db } from '~/db';
import { attempts } from '~/db/schema';

import { eq } from 'drizzle-orm';

async function getAttemptStatus(attemptId: string) {
  // Get the attempt
  const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId)).execute();

  // Attempt not found
  if (!attempt) return null;

  return attempt;
}

export default async function AssessmentResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  // Get attempt status
  const attempt = await getAttemptStatus(attemptId);

  // Handle not found
  if (!attempt) notFound();

  // Redirect if attempt is not completed
  if (attempt.status !== 'completed') {
    // Redirect to the current question
    redirect(`/attempt/${attemptId}`);
  }

  return (
    <Container h="100%" py="lg" px="md">
      <Center h="100%">
        <Card padding="lg" radius="md" withBorder mx="auto" maw={800}>
          <Flex direction="column" align="center" gap="xs" p="md" ta="center">
            <Center mb="md">
              <IconCircleCheck size={64} stroke={1.5} color="var(--mantine-color-green-6)" />
            </Center>
            <Title order={2} fw={600}>
              Assessment Complete!
            </Title>
            <Text size="lg" c="dimmed" mt="xs">
              Thank you for completing the Culinary Leadership Assessment
            </Text>
          </Flex>
          <Box p="md">
            <Text ta="center">
              Your responses have been recorded. Our system will analyze your answers and generate a
              comprehensive leadership profile. Your results will be available in your dashboard
              within 24 hours. You will receive an email notification when your report is ready.
            </Text>
          </Box>
        </Card>
      </Center>
    </Container>
  );
}
