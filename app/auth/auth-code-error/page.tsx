import { Center, Stack, Title, Text, Button } from '@mantine/core';
import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <Center h="100vh">
      <Stack align="center" gap="md" maw={400}>
        <Title order={2} c="red">Authentication Error</Title>
        <Text ta="center" c="dimmed">
          There was an error processing your authentication. This could be due to:
        </Text>
        <Stack gap="xs" align="start">
          <Text size="sm">• Invalid or expired authentication code</Text>
          <Text size="sm">• Network connectivity issues</Text>
          <Text size="sm">• Server configuration problems</Text>
        </Stack>
        <Button component={Link} href="/sign-in" mt="md">
          Try Again
        </Button>
      </Stack>
    </Center>
  );
}
