import { Box } from '@mantine/core';

export default function AttemptLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box bg="background" h="100%" component="main">
      {children}
    </Box>
  );
}
