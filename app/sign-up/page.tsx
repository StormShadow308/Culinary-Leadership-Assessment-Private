import Link from 'next/link';

import { Anchor, Center, Stack, Text, Title, Box } from '@mantine/core';

import { SignUpForm } from './components/sign-up-form';

export default function SignUpPage() {
  return (
    <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Center>
        <Stack maw="100%" w={400} p="xl" style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          {/* Logo */}
          <Box ta="center" mb="md">
            <Box 
              style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#667eea', 
                borderRadius: '50%', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <Text size="xl" fw="bold" c="white">N</Text>
            </Box>
            <Title order={2} c="dark">Sign up</Title>
            <Text c="dimmed" size="sm">Welcome! Create an account to get started.</Text>
          </Box>
          
          <SignUpForm />
          
          <Text size="sm" ta="center" mt="md">
            Already have an account?{' '}
            <Anchor component={Link} href="/sign-in" c="blue">
              Click here to sign in
            </Anchor>
          </Text>
        </Stack>
      </Center>
    </Box>
  );
}
