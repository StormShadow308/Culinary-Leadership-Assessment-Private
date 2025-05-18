'use client';

import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { useAction } from 'next-safe-action/hooks';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Group, Stack, TextInput } from '@mantine/core';

import { newAssessmentAction } from './new-assessment.action';
import { type NewAssessmentForm, newAssessmentSchema } from './new-assessment.schema';

type NewAssessmentFormProps = {
  assessmentId: string;
  participantName?: string;
  participantEmail?: string;
};

export function NewAssessmentForm(props: NewAssessmentFormProps) {
  const { assessmentId, participantEmail, participantName } = props;

  const router = useRouter();
  const { executeAsync, result, isExecuting } = useAction(newAssessmentAction);

  const { register, handleSubmit, formState, setError, getValues } = useForm<NewAssessmentForm>({
    resolver: zodResolver(newAssessmentSchema),
    defaultValues: { fullName: participantName, email: participantEmail, assessmentId },
  });

  const onSubmit = async (data: NewAssessmentForm) => {
    const forceContinue = participantEmail && participantName ? true : false;

    const response = await executeAsync({ ...data, assessmentId, forceContinue });

    if (response.data?.error === 'duplicate_email') {
      setError('email', {
        type: 'manual',
        message:
          'Participant with this email already exists. Do you want to continue or start over?',
      });
    } else if (response.data?.success) {
      // Redirect to first question or dashboard
      router.push(`/attempt/${response.data.attemptId}`);
    }
  };

  const handleStartOver = async () => {
    const formData = getValues();

    // Create a new attempt or reset the existing one
    const response = await executeAsync({
      ...formData,
      forceContinue: true, // We need to bypass the duplicate email check
      resetProgress: true, // Flag to indicate we want to reset progress
      assessmentId,
    });

    if (response.data?.success) {
      router.push(`/attempt/${response.data.attemptId}`);
    }
  };

  const handleContinue = async () => {
    const formData = getValues();
    const response = await executeAsync({ ...formData, forceContinue: true, assessmentId });

    if (response.data?.success) {
      router.push(`/attempt/${response.data.attemptId}`);
    }
  };

  const hasDuplicateEmail = result.data?.error === 'duplicate_email';

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          disabled={participantName !== undefined}
          error={formState.errors.fullName?.message}
          {...register('fullName')}
        />
        <TextInput
          label="Email"
          placeholder="john.doe@example.com"
          type="email"
          disabled={participantEmail !== undefined}
          error={formState.errors.email?.message}
          {...register('email')}
        />
        {!hasDuplicateEmail ? (
          <Button mt="sm" type="submit" fullWidth loading={isExecuting}>
            Start Assessment
          </Button>
        ) : (
          <Group mt="sm" grow>
            <Button variant="outline" color="red" onClick={handleStartOver} disabled={isExecuting}>
              Start Over
            </Button>
            <Button onClick={handleContinue} loading={isExecuting}>
              Continue
            </Button>
          </Group>
        )}
      </Stack>
    </form>
  );
}
