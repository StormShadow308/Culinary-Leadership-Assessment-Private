'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, Button, PasswordInput, Select, Stack, TextInput } from '@mantine/core';

import { IconAlertCircle } from '@tabler/icons-react';


export const signUpSchema = z.object({
  name: z
    .string({ required_error: 'Name is a required field' })
    .min(1, { message: 'Name is a required field' }),
  email: z
    .string({ required_error: 'Email is a required field' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is a required field' }).min(1, {
    message: 'Password is a required field',
  }),
});

type SignUpPayload = z.infer<typeof signUpSchema>;

// Error mapping object to handle different error codes
const ERROR_MESSAGES = {
  USER_ALREADY_EXISTS: {
    title: 'Account Already Exists',
    message: 'An account with this email already exists. Please sign in instead.',
  },
  INVALID_EMAIL: {
    title: 'Invalid Email',
    message: 'Please enter a valid email address.',
  },
  PASSWORD_TOO_SHORT: {
    title: 'Password Too Short',
    message: 'Your password must be at least 8 characters long.',
  },
  EMAIL_CONFIRMATION_ERROR: {
    title: 'Email Confirmation Error',
    message: 'Unable to send confirmation email. Please try again or contact support.',
  },
  EMAIL_CONFIRMATION_REQUIRED: {
    title: 'Check Your Email',
    message: 'We sent you a confirmation link. Please check your email and click the link to complete your registration.',
  },
  DEFAULT: {
    title: 'Sign-up Error',
    message: 'An error occurred during sign-up. Please try again later.',
  },
};

export function SignUpForm() {
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [role, setRole] = useState<'student' | 'organization'>('organization');
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (values: SignUpPayload) => {
    setSignUpError(null); // Reset error state on new submission

    try {
      // Use the new registration API that handles both Supabase and database
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          name: values.name,
          role: role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Registration error:', result.error);
        
        if (result.error.includes('already exists') || result.error.includes('User already exists')) {
          setSignUpError('USER_ALREADY_EXISTS');
        } else if (result.error.includes('Invalid email')) {
          setSignUpError('INVALID_EMAIL');
        } else if (result.error.includes('Password should be at least')) {
          setSignUpError('PASSWORD_TOO_SHORT');
        } else if (result.error.includes('Error sending confirmation email')) {
          setSignUpError('EMAIL_CONFIRMATION_ERROR');
        } else {
          setSignUpError('DEFAULT');
        }
        return;
      }

             if (result.success && result.user) {
               // Check if email verification is required
               if (result.requiresVerification) {
                 // Redirect to verification page
                 router.push(`/verify-email?email=${encodeURIComponent(values.email)}&type=registration`);
               } else if (result.user.emailConfirmed) {
                 // Email already confirmed, redirect immediately
                 if (role === 'student') {
                   router.push('/assessment');
                 } else {
                   router.push('/organisation/new');
                 }
               } else {
                 // Email confirmation required, show success message
                 setSignUpError('EMAIL_CONFIRMATION_REQUIRED');
               }
             }
    } catch (error) {
      console.error('Sign up exception:', error);
      setSignUpError('DEFAULT');
    }
  };

  // Get the appropriate error message object based on the error code
  const errorDetails = signUpError
    ? ERROR_MESSAGES[signUpError as keyof typeof ERROR_MESSAGES] || ERROR_MESSAGES.DEFAULT
    : null;

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
      <Stack gap="md">
        {errorDetails && (
          <Alert icon={<IconAlertCircle size="1rem" />} title={errorDetails.title} color="red">
            {errorDetails.message}
          </Alert>
        )}
        <TextInput
          label="Name"
          placeholder="Your name"
          autoComplete="name"
          {...register('name')}
          error={formState.errors.name?.message}
          required
        />
        <TextInput
          label="Email"
          placeholder="Your email"
          autoComplete="email"
          {...register('email')}
          error={formState.errors.email?.message}
          required
        />
        <PasswordInput
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          {...register('password')}
          error={formState.errors.password?.message}
          required
        />
        <Select
          label="Continue as"
          data={[
            { value: 'student', label: 'Student' },
            { value: 'organization', label: 'Organization' },
          ]}
          value={role}
          onChange={value => setRole((value as 'student' | 'organization') ?? 'organization')}
          required
        />
        <Button mt="md" type="submit" loading={formState.isSubmitting} fullWidth>
          Sign up
        </Button>
      </Stack>
    </form>
  );
}
