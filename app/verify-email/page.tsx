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
  Alert,
  Box
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
              <Title order={2} ta="center" c="dark">
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
      </Box>
    );
  }

  if (!email) {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Center>
          <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Stack gap="md" align="center">
              <Box 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: '#f44336', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <IconAlertCircle size="2rem" color="white" />
              </Box>
              <Title order={2} ta="center" c="dark">Invalid Request</Title>
              <Text ta="center" c="dimmed">
                Email not found. Please try registering again.
              </Text>
              <Button 
                onClick={() => router.push('/sign-up')} 
                fullWidth
                size="md"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Go to Registration
              </Button>
            </Stack>
          </Card>
        </Center>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Center>
        <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <Stack gap="md">
            {/* Logo */}
            <Box ta="center" mb="md">
              <Box 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: '#667eea', 
                  borderRadius: '50%', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <Text size="xl" fw="bold" c="white">N</Text>
              </Box>
              <Title order={2} ta="center" c="dark">
                {type === 'registration' ? 'Verify Your Email' : 'Enter Verification Code'}
              </Title>
              <Text ta="center" c="dimmed" size="sm">
                {type === 'registration' 
                  ? 'We sent a 6-digit verification code to your email address. Please enter it below to complete your registration.'
                  : 'We sent a 6-digit verification code to your email address. Please enter it below to reset your password.'
                }
              </Text>
            </Box>

            <Alert icon={<IconAlertCircle size="1rem" />} color="blue">
              <Text size="sm">
                <strong>Email:</strong> {email}
              </Text>
            </Alert>

            <form onSubmit={handleSubmit(handleVerifyCode)}>
              <Stack gap="md">
                <TextInput
                  label="Verification Code *"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  {...register('code')}
                  error={formState.errors.code?.message}
                  required
                  size="md"
                />
                
                <Button 
                  type="submit" 
                  loading={isLoading} 
                  fullWidth
                  size="md"
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  {type === 'registration' ? 'Verify Email' : 'Verify Code'}
                </Button>
              </Stack>
            </form>

            <Text ta="center" size="sm" c="dimmed" mt="sm">
              Didn&apos;t receive the code?{' '}
              <Button 
                variant="subtle" 
                size="sm" 
                onClick={handleResendCode}
                disabled={isLoading}
                c="blue"
              >
                Resend Code
              </Button>
            </Text>

            <Text ta="center" size="sm">
              <Button 
                variant="subtle" 
                size="sm" 
                onClick={() => router.push('/sign-in')}
                c="blue"
              >
                Back to Sign In
              </Button>
            </Text>
          </Stack>
        </Card>
      </Center>
    </Box>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Center>
          <Card padding="xl" radius="md" withBorder style={{ maxWidth: 400, width: '100%', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <Stack gap="md" align="center">
              <Box 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  backgroundColor: '#667eea', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <Text size="xl" fw="bold" c="white">N</Text>
              </Box>
              <Title order={2} ta="center" c="dark">Loading...</Title>
              <Text ta="center" c="dimmed">Please wait while we load the verification form.</Text>
            </Stack>
          </Card>
        </Center>
      </Box>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
