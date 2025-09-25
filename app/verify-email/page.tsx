'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  Stack, 
  TextInput, 
  Title, 
  Text,
  Card,
  Center,
  Alert
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const verifyEmailSchema = z.object({
  code: z
    .string({ required_error: 'Verification code is required' })
    .length(6, { message: 'Verification code must be 6 digits' })
    .regex(/^\d{6}$/, { message: 'Verification code must contain only numbers' }),
});

type VerifyEmailPayload = z.infer<typeof verifyEmailSchema>;

function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'registration';

  const { register, handleSubmit, formState } = useForm<VerifyEmailPayload>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const handleVerifyCode = async (values: VerifyEmailPayload) => {
    if (!email) {
      notifications.show({
        title: 'Error',
        message: 'Email not found. Please try registering again.',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-passcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          code: values.code,
          type: type
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify code');
      }

      // If this is a registration verification, we need to mark the user as verified in both systems
      if (type === 'registration') {
        try {
          const verifyResponse = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
          });

          if (!verifyResponse.ok) {
            console.error('Failed to mark email as verified');
            throw new Error('Failed to verify email');
          }
        } catch (verifyError) {
          console.error('Error marking email as verified:', verifyError);
          throw verifyError;
        }
      }

      setIsSuccess(true);
      notifications.show({
        title: 'Success',
        message: type === 'registration' 
          ? 'Email verified successfully! You can now sign in.'
          : 'Code verified successfully! You can now reset your password.',
        color: 'green',
        icon: <IconCheck size="1rem" />,
      });

      // Redirect based on type
      setTimeout(() => {
        if (type === 'registration') {
          router.push('/sign-in');
        } else {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }
      }, 2000);

    } catch (error) {
      console.error('Verification error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to verify code',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    try {
      const response = await fetch('/api/auth/resend-passcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email,
          type: type
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to resend code');
      }

      notifications.show({
        title: 'Code Sent',
        message: 'A new verification code has been sent to your email.',
        color: 'green',
        icon: <IconCheck size="1rem" />,
      });

    } catch (error) {
      console.error('Resend error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to resend code',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />,
      });
    }
  };

  if (isSuccess) {
    return (
      <Center h="100vh">
        <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%' }}>
          <Stack gap="md" align="center">
            <IconCheck size="3rem" color="green" />
            <Title order={2} ta="center">
              {type === 'registration' ? 'Email Verified!' : 'Code Verified!'}
            </Title>
            <Text ta="center" c="dimmed">
              {type === 'registration' 
                ? 'Your email has been verified successfully. You will be redirected to the sign-in page.'
                : 'Your code has been verified. You will be redirected to reset your password.'
              }
            </Text>
          </Stack>
        </Card>
      </Center>
    );
  }

  if (!email) {
    return (
      <Center h="100vh">
        <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%' }}>
          <Stack gap="md" align="center">
            <IconAlertCircle size="3rem" color="red" />
            <Title order={2} ta="center">Invalid Request</Title>
            <Text ta="center" c="dimmed">
              Email not found. Please try registering again.
            </Text>
            <Button onClick={() => router.push('/sign-up')} fullWidth>
              Go to Registration
            </Button>
          </Stack>
        </Card>
      </Center>
    );
  }

  return (
    <Center h="100vh">
      <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%' }}>
        <Stack gap="md">
          <Title order={2} ta="center">
            {type === 'registration' ? 'Verify Your Email' : 'Enter Verification Code'}
          </Title>
          <Text ta="center" c="dimmed">
            {type === 'registration' 
              ? 'We sent a 6-digit verification code to your email address. Please enter it below to complete your registration.'
              : 'We sent a 6-digit verification code to your email address. Please enter it below to reset your password.'
            }
          </Text>

          <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
            <Text size="sm">
              <strong>Email:</strong> {email}
            </Text>
          </Alert>

          <form onSubmit={handleSubmit(handleVerifyCode)}>
            <Stack gap="md">
              <TextInput
                label="Verification Code"
                placeholder="Enter 6-digit code"
                maxLength={6}
                {...register('code')}
                error={formState.errors.code?.message}
                required
              />
              
              <Button 
                type="submit" 
                loading={isLoading} 
                fullWidth
              >
                {type === 'registration' ? 'Verify Email' : 'Verify Code'}
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm" c="dimmed">
            Didn&apos;t receive the code?{' '}
            <Button 
              variant="subtle" 
              size="sm" 
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Resend Code
            </Button>
          </Text>

          <Text ta="center" size="sm">
            <Button 
              variant="subtle" 
              size="sm" 
              onClick={() => router.push('/sign-in')}
            >
              Back to Sign In
            </Button>
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Center h="100vh">
        <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%' }}>
          <Stack gap="md" align="center">
            <Title order={2} ta="center">Loading...</Title>
            <Text ta="center" c="dimmed">Please wait while we load the verification form.</Text>
          </Stack>
        </Card>
      </Center>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
