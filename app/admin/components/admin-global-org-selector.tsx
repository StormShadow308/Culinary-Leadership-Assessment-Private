'use client';

import { useRouter } from 'next/navigation';
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

  const handleOrganizationChange = (orgId: string | null) => {
    if (!orgId) return;
    
    setSelectedOrgId(orgId);
    
    // Update URL with orgId but don't navigate away from admin dashboard
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('orgId', orgId);
    router.replace(newUrl.pathname + newUrl.search);
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

  return (
    <Group gap="sm" align="center">
      <IconBuilding size={16} />
      <Text size="sm" fw={500}>Organization:</Text>
      <Select
        placeholder="Select organization"
        value={selectedOrgId}
        onChange={handleOrganizationChange}
        data={organizations.map(org => ({
          value: org.id,
          label: org.name,
        }))}
        searchable
        clearable={false}
        size="sm"
        style={{ minWidth: 200 }}
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
