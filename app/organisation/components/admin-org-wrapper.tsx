'use client';

import { useGlobalOrg } from './global-org-context';
import { AdminOrgSelector } from './admin-org-selector';
import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface AdminOrgWrapperProps {
  children: React.ReactNode;
  currentOrgId?: string;
  showNavigationButtons?: boolean;
}

export function AdminOrgWrapper({ 
  children, 
  currentOrgId, 
  showNavigationButtons = true 
}: AdminOrgWrapperProps) {
  const { isInitialized, selectedOrgId, organizations } = useGlobalOrg();

  // Show loading state until context is initialized
  if (!isInitialized) {
    return (
      <Stack>
        <AdminOrgSelector 
          currentOrgId={currentOrgId} 
          showNavigationButtons={showNavigationButtons} 
        />
        <Alert icon={<IconAlertCircle size={16} />} title="Loading..." color="blue">
          Initializing organization context...
        </Alert>
      </Stack>
    );
  }

  // If no organization is selected and we have organizations available, show selector
  if (!selectedOrgId && organizations.length > 0) {
    return (
      <Stack>
        <AdminOrgSelector 
          currentOrgId={currentOrgId} 
          showNavigationButtons={showNavigationButtons} 
        />
        <Alert icon={<IconAlertCircle size={16} />} title="Organization Selection Required" color="blue">
          Please select an organization from the dropdown above to view its data.
        </Alert>
      </Stack>
    );
  }

  // If no organizations are available, show error
  if (organizations.length === 0) {
    return (
      <Stack>
        <AdminOrgSelector 
          currentOrgId={currentOrgId} 
          showNavigationButtons={showNavigationButtons} 
        />
        <Alert icon={<IconAlertCircle size={16} />} title="No Organizations Available" color="red">
          No organizations found. Please contact your administrator.
        </Alert>
      </Stack>
    );
  }

  // Context is initialized and organization is selected, render children
  return (
    <Stack>
      <AdminOrgSelector 
        currentOrgId={currentOrgId} 
        showNavigationButtons={showNavigationButtons} 
      />
      {children}
    </Stack>
  );
}
