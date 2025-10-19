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
  Center,
  Box
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
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Center>
          <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Stack gap="md" align="center">
              <Box 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: '#4caf50', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <IconCheck size="2rem" color="white" />
              </Box>
              <Title order={2} ta="center" c="dark">Check Your Email</Title>
              <Text ta="center" c="dimmed">
              We&apos;ve sent password reset instructions to your email address. 
              Please check your inbox and follow the link to reset your password.
              </Text>
              <Button 
                component={Link} 
                href="/sign-in" 
                fullWidth
                size="md"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Back to Sign In
              </Button>
            </Stack>
          </Card>
        </Center>
      </Box>
    );
  }

  return (
    <Center h="100vh" style={{ minHeight: '100vh' }}>
      <Box
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Stack gap="md" align="center">
          <Title order={2} ta="center">Forgot Password</Title>
          <Text c="dimmed" ta="center">
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </Text>

          <form onSubmit={handleSubmit(handleForgotPassword)}>
            <Stack gap="md">
              <TextInput
                label="Email *"
                placeholder="Enter your email address"
                type="email"
                {...register('email')}
                error={formState.errors.email?.message}
                required
                size="md"
              />
              
              <Button 
                type="submit" 
                loading={isLoading} 
                fullWidth
                size="md"
              >
                Send Reset Instructions
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm" mt="md">
            Remember your password?{' '}
            <Link href="/sign-in" style={{ color: 'var(--mantine-color-blue-6)' }}>
              Sign in
            </Link>
          </Text>
        </Stack>
      </Box>
    </Center>
  );
}