import Link from 'next/link';

import { Anchor, Center, Stack, Text, Title, Box, Image } from '@mantine/core';

import { SignInForm } from './components/sign-in-form';

export default function SignInPage() {
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
            <Title order={2} c="dark">Sign in</Title>
            <Text c="dimmed" size="sm">Welcome back! Sign in to your account to continue.</Text>
          </Box>
          
          <SignInForm />
          
          <Text size="sm" ta="center" mt="md">
            Don&apos;t have an account?{' '}
            <Anchor component={Link} href="/sign-up" c="blue">
              Click here to sign up
            </Anchor>
          </Text>
        </Stack>
      </Center>
    </Box>
  );
}
