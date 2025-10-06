'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, Button, PasswordInput, Select, Stack, TextInput, Text } from '@mantine/core';
import Link from 'next/link';

import { IconAlertCircle } from '@tabler/icons-react';


export const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is a required field' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is a required field' }).min(1, {
    message: 'Password is a required field',
  }),
});

type SignInPayload = z.infer<typeof signInSchema>;

// Error mapping object to handle different error codes
const ERROR_MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD: {
    title: 'Invalid Credentials',
    message: 'The email or password you entered is incorrect. Please try again.',
  },
  DEFAULT: {
    title: 'Sign-in Error',
    message: 'An error occurred during sign-in. Please try again later.',
  },
};

export function SignInForm() {
  const [signInError, setSignInError] = useState<string | null>(null);
  const [role, setRole] = useState<'student' | 'organization'>('organization');
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
  });

  const handleSignIn = async (values: SignInPayload) => {
    setSignInError(null); // Reset error state on new submission

    try {
      // Use the new login API that checks both Supabase and database
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Login error:', result.error);
        
        // Check if user needs email verification
        if (result.requiresVerification && result.email) {
          // Redirect to verification page
          router.push(`/verify-email?email=${encodeURIComponent(result.email)}&type=registration`);
          return;
        }
        
        setSignInError('INVALID_EMAIL_OR_PASSWORD');
        return;
      }

      if (result.success && result.user) {
        // Redirect based on user role and selected role
        const userRole = result.user.role;
        
        if (userRole === 'admin') {
          router.push('/admin');
        } else if (role === 'student' || userRole === 'student') {
          router.push('/assessment');
        } else {
          router.push('/organisation');
        }
      } else {
        setSignInError('DEFAULT');
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      setSignInError('DEFAULT');
    }
  };

  // Get the appropriate error message object based on the error code
  const errorDetails = signInError
    ? ERROR_MESSAGES[signInError as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.DEFAULT
    : null;

  return (
    <form onSubmit={handleSubmit(handleSignIn)}>
      <Stack gap="md">
        {errorDetails && (
          <Alert icon={<IconAlertCircle size="1rem" />} title={errorDetails.title} color="red">
            {errorDetails.message}
          </Alert>
        )}
        <TextInput
          label="Email *"
          placeholder="Your email"
          autoComplete="email"
          {...register('email')}
          error={formState.errors.email?.message}
          required
          size="md"
        />
        <PasswordInput
          label="Password *"
          placeholder="Your password"
          {...register('password')}
          error={formState.errors.password?.message}
          required
          size="md"
        />
        <Select
          label="Continue as *"
          data={[
            { value: 'student', label: 'Student' },
            { value: 'organization', label: 'Organization' },
          ]}
          value={role}
          onChange={value => setRole((value as 'student' | 'organization') ?? 'organization')}
          required
          size="md"
        />
        <Button 
          mt="md" 
          type="submit" 
          loading={formState.isSubmitting} 
          fullWidth
          size="md"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          Sign in
        </Button>
        
        <Text ta="center" size="sm" mt="sm">
          <Link href="/forgot-password" style={{ color: 'var(--mantine-color-blue-6)' }}>
            Forgot your password?
          </Link>
        </Text>
            </Stack>
          </form>
        );
      }
