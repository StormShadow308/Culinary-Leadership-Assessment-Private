'use client';

import { ReactNode, useEffect, useState } from 'react';
import { GlobalOrgProvider } from './global-org-context';
import { OrgUserProvider } from './org-user-context';

interface SmartOrgProviderProps {
  children: ReactNode;
}

export function SmartOrgProvider({ children }: SmartOrgProviderProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const user = await response.json();
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserRole();
  }, []);

  // Show loading while checking user role
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Use admin context for admin users, org user context for others
  if (userRole === 'admin') {
    return (
      <GlobalOrgProvider>
        {children}
      </GlobalOrgProvider>
    );
  } else {
    return (
      <OrgUserProvider>
        {children}
      </OrgUserProvider>
    );
  }
}
