'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';

import { IconAlertCircle } from '@tabler/icons-react';

import { authClient } from '~/lib/auth-client';

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
  DEFAULT: {
    title: 'Sign-up Error',
    message: 'An error occurred during sign-up. Please try again later.',
  },
};

export function SignUpForm() {
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
  });

  const handleSignUp = async (values: SignUpPayload) => {
    setSignUpError(null); // Reset error state on new submission

    await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess() {
          redirect('/admin');
        },
        onError(context) {
          setSignUpError(context.error.code);
        },
      },
    });
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
          {...register('password')}
          error={formState.errors.password?.message}
          required
        />
        <Button mt="md" type="submit" loading={formState.isSubmitting} fullWidth>
          Sign up
        </Button>
      </Stack>
    </form>
  );
}
