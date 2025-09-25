import Link from 'next/link';

import { Anchor, Center, Stack, Text, Title } from '@mantine/core';

import { SignInForm } from './components/sign-in-form';

export default function SignInPage() {
  return (
    <Center h="100%">
      <Stack maw="100%" w={350}>
        <Title order={2}>Sign in</Title>
        <Text c="dimmed">Welcome back! Sign in to your account to continue.</Text>
        <SignInForm />
        <Text size="sm" ta="center">
          Don&apos;t have an account?{' '}
          <Anchor component={Link} href="/sign-up">
            Click here to sign up
          </Anchor>
        </Text>
      </Stack>
    </Center>
  );
}
