'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '~/lib/supabase-client';
import { Center, Loader, Stack, Text, Title } from '@mantine/core';
// Removed client-side email import - emails are sent server-side

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          // User is authenticated, redirect based on role (middleware will handle this)
          router.push('/organisation');
        } else {
          setError('No session found');
          setLoading(false);
        }
      } catch {
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Confirming your email...</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Title order={2} c="red">Authentication Error</Title>
          <Text c="dimmed">{error}</Text>
          <button 
            onClick={() => router.push('/sign-in')}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#228be6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Sign In
          </button>
        </Stack>
      </Center>
    );
  }

  return null;
}
