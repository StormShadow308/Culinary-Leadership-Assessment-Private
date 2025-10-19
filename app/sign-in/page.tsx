import Link from 'next/link';

import { Anchor, Center, Stack, Text, Title, Box } from '@mantine/core';

import { SignInForm } from './components/sign-in-form';

export default function SignInPage() {
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
        <Stack maw="100%" w={350} align="center">
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
      </Box>
    </Center>
  );
}
