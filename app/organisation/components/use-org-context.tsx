'use client';

import { useGlobalOrg } from './global-org-context';
import { useOrgUser } from './org-user-context';

// Unified hook that works with both admin and organization user contexts
export function useOrgContext() {
  try {
    // Try admin context first
    return useGlobalOrg();
  } catch {
    try {
      // Fall back to organization user context
      return useOrgUser();
    } catch {
      // If neither context is available, return a default
      return {
        selectedOrgId: null,
        setSelectedOrgId: () => {},
        organizations: [],
        setOrganizations: () => {},
        loading: false,
        setLoading: () => {},
        refreshOrganizations: async () => {},
        isInitialized: true,
      };
    }
  }
}
