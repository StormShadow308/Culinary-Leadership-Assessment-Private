'use client';

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  slug: string;
  participantCount?: number;
}

interface OrgUserContextType {
  selectedOrgId: string | null;
  setSelectedOrgId: (orgId: string | null) => void;
  organizations: Organization[];
  setOrganizations: (orgs: Organization[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  refreshOrganizations: () => Promise<void>;
  isInitialized: boolean;
}

const OrgUserContext = createContext<OrgUserContextType | undefined>(undefined);

interface OrgUserProviderProps {
  children: ReactNode;
}

function OrgUserProviderInner({ children }: OrgUserProviderProps) {
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

  // Fetch user's organization (for organization users)
  const refreshOrganizations = async () => {
    setLoading(true);
    try {
      // Get user's organization membership
      const response = await fetch('/api/organization/my-organization', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.organization) {
          setOrganizations([data.organization]);
          // Auto-select the user's organization if no orgId in URL
          if (!selectedOrgId) {
            setSelectedOrgId(data.organization.id);
          }
        } else {
          setOrganizations([]);
        }
      } else {
        console.error('Failed to fetch user organization:', response.status);
        setOrganizations([]);
      }
    } catch (error) {
      console.error('Error fetching user organization:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load user's organization on mount
  useEffect(() => {
    refreshOrganizations();
  }, []);

  return (
    <OrgUserContext.Provider
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
    </OrgUserContext.Provider>
  );
}

export function OrgUserProvider({ children }: OrgUserProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrgUserProviderInner>{children}</OrgUserProviderInner>
    </Suspense>
  );
}

export function useOrgUser() {
  const context = useContext(OrgUserContext);
  if (context === undefined) {
    throw new Error('useOrgUser must be used within an OrgUserProvider');
  }
  return context;
}
