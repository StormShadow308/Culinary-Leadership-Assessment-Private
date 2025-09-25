'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  Stack, 
  TextInput, 
  Title, 
  Text,
  Card,
  Center
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = async (values: ForgotPasswordPayload) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Forgot password API error:', result);
        throw new Error(result.error || result.details || 'Failed to send reset email');
      }

      setIsSuccess(true);
      notifications.show({
        title: 'Success',
        message: 'A verification code has been sent to your email',
        color: 'green',
        icon: <IconCheck size="1rem" />,
      });

      // Redirect to verification page
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}&type=password_reset`);
      }, 2000);

    } catch (error) {
      console.error('Forgot password error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send reset email',
        color: 'red',
        icon: <IconAlertCircle size="1rem" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Center h="100vh">
        <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%' }}>
          <Stack gap="md" align="center">
            <IconCheck size="3rem" color="green" />
            <Title order={2} ta="center">Check Your Email</Title>
            <Text ta="center" c="dimmed">
            We&apos;ve sent password reset instructions to your email address. 
            Please check your inbox and follow the link to reset your password.
            </Text>
            <Button component={Link} href="/sign-in" fullWidth>
              Back to Sign In
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
          <Title order={2} ta="center">Forgot Password</Title>
          <Text ta="center" c="dimmed">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </Text>

          <form onSubmit={handleSubmit(handleForgotPassword)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="Enter your email address"
                type="email"
                {...register('email')}
                error={formState.errors.email?.message}
                required
              />
              
              <Button 
                type="submit" 
                loading={isLoading} 
                fullWidth
              >
                Send Reset Instructions
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm">
            Remember your password?{' '}
            <Link href="/sign-in" style={{ color: 'var(--mantine-color-blue-6)' }}>
              Sign in
            </Link>
          </Text>
        </Stack>
      </Card>
    </Center>
  );
}