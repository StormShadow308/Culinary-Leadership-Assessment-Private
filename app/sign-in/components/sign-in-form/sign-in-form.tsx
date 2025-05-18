'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { redirect } from 'next/navigation';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';

import { IconAlertCircle } from '@tabler/icons-react';

import { authClient } from '~/lib/auth-client';

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

  const { register, handleSubmit, formState } = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
  });

  const handleSignIn = async (values: SignInPayload) => {
    setSignInError(null); // Reset error state on new submission

    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      fetchOptions: {
        onSuccess() {
          redirect('/admin');
        },
        onError(context) {
          setSignInError(context.error.code);
        },
      },
    });
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
          Sign in
        </Button>
      </Stack>
    </form>
  );
}
