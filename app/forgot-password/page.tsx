import Link from 'next/link';

import { Anchor, Button, Center, Stack, Text, TextInput, Title } from '@mantine/core';

export default function ForgotPasswordPage() {
  return (
    <Center h="100%">
      <Stack maw="100%" w={380}>
        <Title order={2}>Forgot your password?</Title>
        <Text c="dimmed">Enter your email address and we&apos;ll help you reset it.</Text>
        <Stack>
          <TextInput name="email" label="Email" placeholder="you@example.com" required />
          <Button type="button" fullWidth>Send reset link</Button>
        </Stack>
        <Text size="sm" ta="center">
          Remembered it?{' '}
          <Anchor component={Link} href="/sign-in">Back to sign in</Anchor>
        </Text>
      </Stack>
    </Center>
  );
}


