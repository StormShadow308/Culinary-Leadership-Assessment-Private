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

  // Fetch organizations
  const refreshOrganizations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
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

export function useGlobalOrg() {
  const context = useContext(GlobalOrgContext);
  if (context === undefined) {
    throw new Error('useGlobalOrg must be used within a GlobalOrgProvider');
  }
  return context;
}
