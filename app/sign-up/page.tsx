import Link from 'next/link';

import { Anchor, Center, Stack, Text, Title, Box } from '@mantine/core';

import { SignUpForm } from './components/sign-up-form';

export default function SignUpPage() {
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
      </Box>
    </Center>
  );
}
