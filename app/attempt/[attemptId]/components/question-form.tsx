'use client';

import { useEffect, useState } from 'react';

import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';

import { Box, Button, Grid, Group, Radio, Stack, Title } from '@mantine/core';

import { previousQuestionAction, saveResponseAction } from './question-form.action';
import type { NextQuestionForm, PreviousQuestionForm } from './question-form.schema';

type Option = {
  id: string;
  questionId: number;
  text: string;
};

type Question = {
  id: number;
  text: string;
  assessmentId: string;
  orderNumber: number;
};

type Response = {
  id: string;
  attemptId: string;
  questionId: number;
  bestOptionId: string | null;
  worstOptionId: string | null;
};

type QuestionFormProps = {
  attemptId: string;
  question: Question;
  questionOptions: Array<Option>;
  existingResponse: Response | undefined;
  isPreviousDisabled: boolean;
};

export function QuestionForm(props: QuestionFormProps) {
  const { attemptId, question, questionOptions, existingResponse, isPreviousDisabled } = props;
  const router = useRouter();

  // Set up actions
  const { executeAsync: executeNext, isExecuting: isNextExecuting } = useAction(saveResponseAction);
  const { executeAsync: executePrevious, isExecuting: isPreviousExecuting } =
    useAction(previousQuestionAction);

  // Initialize state with null values
  const [bestOptionId, setBestOptionId] = useState<string | null>(null);
  const [worstOptionId, setWorstOptionId] = useState<string | null>(null);

  // Update state when existingResponse changes (including on initial render)
  useEffect(() => {
    if (existingResponse) {
      setBestOptionId(existingResponse.bestOptionId);
      setWorstOptionId(existingResponse.worstOptionId);
    } else {
      // Reset selections when no existing response
      setBestOptionId(null);
      setWorstOptionId(null);
    }
  }, [existingResponse, question.id]); // Depend on question.id to reset when question changes

  const handleNext = async () => {
    if (!bestOptionId || !worstOptionId) return;

    const formData: NextQuestionForm = {
      attemptId,
      questionId: question.id,
      bestOptionId,
      worstOptionId,
    };

    const result = await executeNext(formData);

    if (result.data?.completed) {
      router.push(`/attempt/${attemptId}/results`);
    } else if (result.data?.success) {
      router.refresh(); // Refresh the page to show the next question
    }
  };

  const handlePrevious = async () => {
    if (isPreviousDisabled) return;

    const formData: PreviousQuestionForm = {
      attemptId,
      currentQuestionOrder: question.orderNumber,
    };

    const result = await executePrevious(formData);

    if (result.data?.success) {
      router.refresh(); // Refresh the page to show the previous question
    }
  };

  const isNextDisabled = !bestOptionId || !worstOptionId || isNextExecuting;
  const isButtonDisabled = isPreviousDisabled || isPreviousExecuting;

  return (
    <Box>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={3} size="lg" mb="md">
            Select the BEST option:
          </Title>
          <Radio.Group value={bestOptionId || ''} onChange={setBestOptionId}>
            <Stack>
              {questionOptions.map(option => (
                <Radio
                  style={{ userSelect: 'none' }}
                  key={`best-${option.id}`}
                  value={option.id}
                  label={<Box style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{`${option.id}. ${option.text}`}</Box>}
                />
              ))}
            </Stack>
          </Radio.Group>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={3} size="lg" mb="md">
            Select the WORST option:
          </Title>
          <Radio.Group value={worstOptionId || ''} onChange={setWorstOptionId}>
            <Stack>
              {questionOptions.map(option => (
                <Radio
                  style={{ userSelect: 'none' }}
                  key={`worst-${option.id}`}
                  value={option.id}
                  label={<Box style={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>{`${option.id}. ${option.text}`}</Box>}
                />
              ))}
            </Stack>
          </Radio.Group>
        </Grid.Col>
      </Grid>

      <Group justify="space-between" mt="xl" wrap="wrap">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isButtonDisabled}
          loading={isPreviousExecuting}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={isNextDisabled} loading={isNextExecuting}>
          Next
        </Button>
      </Group>
    </Box>
  );
}
