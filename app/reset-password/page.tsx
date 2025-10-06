'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Button, 
  Stack, 
  PasswordInput, 
  Title, 
  Text,
  Card,
  Center,
  Alert,
  Box
} from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

const resetPasswordSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z
    .string({ required_error: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, formState } = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Redirect to forgot password if no email
      router.push('/forgot-password');
    }
  }, [searchParams, router]);

  const handleResetPassword = async (values: ResetPasswordPayload) => {
    if (!email) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          password: values.password,
          email: email 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }

      setIsSuccess(true);
      notifications.show({
        title: 'Success',
        message: 'Your password has been updated successfully',
        color: 'green',
        icon: <IconCheck size="1rem" />,
      });

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);

    } catch (error) {
      console.error('Reset password error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to reset password',
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
            <Title order={2} ta="center">Password Updated</Title>
            <Text ta="center" c="dimmed">
              Your password has been updated successfully. You will be redirected to the sign-in page.
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
            <Title order={2} ta="center">Invalid Reset Link</Title>
            <Text ta="center" c="dimmed">
              This password reset link is invalid or has expired. Please request a new one.
            </Text>
            <Button onClick={() => router.push('/forgot-password')} fullWidth>
              Request New Reset Link
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
          <Title order={2} ta="center">Reset Password</Title>
          <Text ta="center" c="dimmed">
            Enter your new password below.
          </Text>
          
          <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
            <Text size="sm">
              <strong>Email:</strong> {email}
            </Text>
          </Alert>

          <form onSubmit={handleSubmit(handleResetPassword)}>
            <Stack gap="md">
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                {...register('password')}
                error={formState.errors.password?.message}
                required
              />
              
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your new password"
                {...register('confirmPassword')}
                error={formState.errors.confirmPassword?.message}
                required
              />
              
              <Button 
                type="submit" 
                loading={isLoading} 
                fullWidth
              >
                Update Password
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Center>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Center h="100vh">
        <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%' }}>
          <Stack gap="md" align="center">
            <Title order={2} ta="center">Loading...</Title>
            <Text ta="center" c="dimmed">Please wait while we load the reset form.</Text>
          </Stack>
        </Card>
      </Center>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
