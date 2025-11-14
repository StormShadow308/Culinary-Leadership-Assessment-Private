'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  slug: string;
  participantCount?: number;
}

interface GlobalOrgContextType {
  selectedOrgId: string | null;
  setSelectedOrgId: (orgId: string | null) => void;
  organizations: Organization[];
  setOrganizations: (orgs: Organization[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  refreshOrganizations: () => Promise<void>;
  isInitialized: boolean;
}

const GlobalOrgContext = createContext<GlobalOrgContextType | undefined>(undefined);

interface GlobalOrgProviderProps {
  children: ReactNode;
}

function GlobalOrgProviderInner({ children }: GlobalOrgProviderProps) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const searchParams = useSearchParams();

  // Initialize selectedOrgId from URL params on mount
  useEffect(() => {
    const orgId = searchParams.get('orgId');
    if (orgId) {
      setSelectedOrgId(orgId);
    }
    setIsInitialized(true);
  }, [searchParams]);

  // Update selectedOrgId when URL changes
  useEffect(() => {
    if (!isInitialized) return;
    
    const orgId = searchParams.get('orgId');
    if (orgId && orgId !== selectedOrgId) {
      setSelectedOrgId(orgId);
    } else if (!orgId && selectedOrgId) {
      // If URL doesn't have orgId but context does, clear it
      setSelectedOrgId(null);
    }
  }, [searchParams, selectedOrgId, isInitialized]);

  // Fetch organizations for admin users, or the single organization for org users
  const refreshOrganizations = async () => {
    setLoading(true);
    try {
      // First check if user is admin
      const userResponse = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (!userResponse.ok) {
        setOrganizations([]);
        return;
      }
      
      const user = await userResponse.json();
      if (user.role !== 'admin') {
        // Organisation user: fetch their own organization context
        const orgResponse = await fetch('/api/organization/my-organization', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (orgResponse.ok) {
          const data = await orgResponse.json();
          if (data.organization) {
            setOrganizations([data.organization]);
            // Auto-bind selectedOrgId only if it isn't already set from URL
            if (!selectedOrgId) {
              setSelectedOrgId(data.organization.id);
            }
          } else {
            setOrganizations([]);
          }
        } else {
          console.error('Failed to fetch user organization:', orgResponse.status);
          setOrganizations([]);
        }

        return;
      }

      // Admin user: fetch all organizations
      const response = await fetch('/api/admin/organizations', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
      } else {
        console.error('Failed to fetch organizations:', response.status);
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load organizations on mount
  useEffect(() => {
    refreshOrganizations();
  }, []);

  return (
    <GlobalOrgContext.Provider
      value={{
        selectedOrgId,
        setSelectedOrgId,
        organizations,
        setOrganizations,
        loading,
        setLoading,
        refreshOrganizations,
        isInitialized,
      }}
    >
      {children}
    </GlobalOrgContext.Provider>
  );
}

export function GlobalOrgProvider({ children }: GlobalOrgProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GlobalOrgProviderInner>{children}</GlobalOrgProviderInner>
    </Suspense>
  );
}

export function useGlobalOrgOptional() {
  return useContext(GlobalOrgContext);
}

export function useGlobalOrg() {
  const context = useGlobalOrgOptional();
  if (context === undefined) {
    throw new Error('useGlobalOrg must be used within a GlobalOrgProvider');
  }
  return context;
}
