'use client';

import { useEffect, useState } from 'react';
import { auth } from './auth-client';

export function useSupabaseSession() {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    auth.getSession().then(({ user }) => {
      setSession(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setSession((session as { user?: unknown })?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    data: session ? { user: session } : null,
    isPending: loading,
  };
}
