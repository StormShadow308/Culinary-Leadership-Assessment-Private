import Link from 'next/link';

import { Anchor, Center, Stack, Text, Title } from '@mantine/core';

import { SignUpForm } from './components/sign-up-form';

export default function SignUpPage() {
  return (
    <Center h="100%">
      <Stack maw="100%" w={350}>
        <Title order={2}>Sign up</Title>
        <Text c="dimmed">Welcome! Create an account to get started.</Text>
        <SignUpForm />
        <Text size="sm" ta="center">
          Already have an account?{' '}
          <Anchor component={Link} href="/sign-in">
            Click here to sign in
          </Anchor>
        </Text>
      </Stack>
    </Center>
  );
}
