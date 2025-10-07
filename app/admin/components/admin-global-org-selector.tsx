'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Select, 
  Group, 
  Text, 
  Badge,
  ActionIcon,
  Tooltip,
  Button
} from '@mantine/core';
import { IconBuilding, IconRefresh, IconExternalLink } from '@tabler/icons-react';
import { useGlobalOrg } from '~/app/organisation/components/global-org-context';

export function AdminGlobalOrgSelector() {
  const { 
    selectedOrgId, 
    setSelectedOrgId, 
    organizations, 
    loading, 
    refreshOrganizations,
    isInitialized
  } = useGlobalOrg();
  
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user role on mount
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
      }
    };
    checkUserRole();
  }, []);

  // Don't render if not admin
  if (userRole && userRole !== 'admin') {
    return null;
  }

  const handleOrganizationChange = (orgId: string | null) => {
    if (orgId === '') {
      // Clear organization selection - show system overview
      setSelectedOrgId(null);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('orgId');
      router.replace(newUrl.pathname + newUrl.search);
    } else if (orgId) {
      setSelectedOrgId(orgId);
      
      // Update URL with orgId but don't navigate away from admin dashboard
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('orgId', orgId);
      router.replace(newUrl.pathname + newUrl.search);
    }
  };

  const handleRefresh = () => {
    refreshOrganizations();
  };

  const navigateToOrgView = (path: string) => {
    if (!selectedOrgId) return;
    router.push(`${path}?orgId=${selectedOrgId}`);
  };

  const selectedOrg = organizations.find(org => org.id === selectedOrgId);

  // Show loading state until context is initialized
  if (!isInitialized) {
    return (
      <Group gap="sm" align="center">
        <IconBuilding size={16} />
        <Text size="sm" fw={500}>Organization:</Text>
        <Text size="sm" c="dimmed">Loading...</Text>
      </Group>
    );
  }

  // If no organizations are available, show admin-only message
  if (organizations.length === 0) {
    return (
      <Group gap="sm" align="center">
        <IconBuilding size={16} />
        <Text size="sm" fw={500}>Admin View:</Text>
        <Text size="sm" c="blue">System Overview</Text>
      </Group>
    );
  }

  return (
    <Group gap="sm" align="center">
      <IconBuilding size={16} />
      <Text size="sm" fw={500}>Organization:</Text>
      <Select
        placeholder="Select organization"
        value={selectedOrgId}
        onChange={handleOrganizationChange}
        data={[
          { value: '', label: 'System Overview (All Data)' },
          ...organizations.map(org => ({
            value: org.id,
            label: org.name,
          }))
        ]}
        searchable
        clearable={true}
        size="sm"
        style={{ minWidth: 250 }}
        disabled={loading}
      />
      {selectedOrg && (
        <Badge size="sm" variant="light" color="blue">
          {selectedOrg.participantCount || 0} participants
        </Badge>
      )}
      <Tooltip label="Refresh organizations">
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={handleRefresh}
          loading={loading}
        >
          <IconRefresh size={14} />
        </ActionIcon>
      </Tooltip>
      {selectedOrgId && (
        <>
          <Button
            size="xs"
            variant="light"
            leftSection={<IconExternalLink size={12} />}
            onClick={() => navigateToOrgView('/organisation')}
          >
            View Org
          </Button>
          <Button
            size="xs"
            variant="light"
            leftSection={<IconExternalLink size={12} />}
            onClick={() => navigateToOrgView('/organisation/respondents')}
          >
            View Respondents
          </Button>
        </>
      )}
    </Group>
  );
}
