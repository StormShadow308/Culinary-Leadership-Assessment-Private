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

  // Wrap with both providers so both useGlobalOrg (admin) and useOrgUser (org users)
  // are always safe to call within organisation routes.
  return (
    <GlobalOrgProvider>
      <OrgUserProvider>
        {children}
      </OrgUserProvider>
    </GlobalOrgProvider>
  );
}
