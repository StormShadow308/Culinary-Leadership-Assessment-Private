'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Select, 
  Group, 
  Text, 
  Badge,
  ActionIcon,
  Tooltip,
  Card,
  Stack,
  Button
} from '@mantine/core';
import { IconBuilding, IconRefresh, IconExternalLink } from '@tabler/icons-react';
import { useGlobalOrg } from './global-org-context';

interface AdminOrgSelectorProps {
  currentOrgId?: string;
  showNavigationButtons?: boolean;
}

export function AdminOrgSelector({ currentOrgId, showNavigationButtons = true }: AdminOrgSelectorProps) {
  const { 
    selectedOrgId, 
    setSelectedOrgId, 
    organizations, 
    loading, 
    refreshOrganizations,
    isInitialized
  } = useGlobalOrg();
  
  const router = useRouter();

  // Update selected organization when currentOrgId changes
  useEffect(() => {
    if (currentOrgId && currentOrgId !== selectedOrgId) {
      setSelectedOrgId(currentOrgId);
    }
  }, [currentOrgId, selectedOrgId, setSelectedOrgId]);

  const handleOrganizationChange = (orgId: string | null) => {
    if (!orgId) return;
    
    setSelectedOrgId(orgId);
    
    // Get current path and update with new orgId
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('orgId', orgId);
    
    // Use router.replace to update URL and then refresh to reload server component
    router.replace(newUrl.pathname + newUrl.search);
    // Force refresh to reload server component with new orgId
    setTimeout(() => {
      router.refresh();
    }, 100);
  };

  const handleRefresh = () => {
    refreshOrganizations();
  };

  const navigateToOrgPage = (path: string) => {
    if (!selectedOrgId) return;
    const newUrl = new URL(window.location.href);
    newUrl.pathname = path;
    newUrl.searchParams.set('orgId', selectedOrgId);
    router.push(newUrl.pathname + newUrl.search);
    // Force refresh to reload server component with new orgId
    setTimeout(() => {
      router.refresh();
    }, 100);
  };

  const selectedOrg = organizations.find(org => org.id === selectedOrgId);

  // Show loading state until context is initialized
  if (!isInitialized) {
    return (
      <Card withBorder p="md" mb="md">
        <Stack gap="sm">
          <Group justify="space-between" align="center">
            <Group gap="sm" align="center">
              <IconBuilding size={20} />
              <Text size="lg" fw={600}>Organization Selector</Text>
            </Group>
          </Group>
          <Text size="sm" c="dimmed">Loading organizations...</Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder p="md" mb="md">
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Group gap="sm" align="center">
            <IconBuilding size={20} />
            <Text size="lg" fw={600}>Organization Selector</Text>
          </Group>
          <Tooltip label="Refresh organizations">
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={handleRefresh}
              loading={loading}
            >
              <IconRefresh size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
        
        <Group gap="sm" align="center">
          <Text size="sm" fw={500}>Select Organization:</Text>
          <Select
            placeholder="Choose an organization to view"
            value={selectedOrgId}
            onChange={handleOrganizationChange}
            data={organizations.map(org => ({
              value: org.id,
              label: org.name,
            }))}
            searchable
            clearable={false}
            size="sm"
            style={{ minWidth: 250 }}
            disabled={loading}
          />
          {selectedOrg && (
            <Badge size="sm" variant="light" color="blue">
              {selectedOrg.participantCount || 0} participants
            </Badge>
          )}
        </Group>
        
        {selectedOrgId && showNavigationButtons && (
          <Group gap="sm" mt="xs">
            <Button
              size="xs"
              variant="light"
              leftSection={<IconExternalLink size={14} />}
              onClick={() => navigateToOrgPage('/organisation')}
            >
              View Dashboard
            </Button>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconExternalLink size={14} />}
              onClick={() => navigateToOrgPage('/organisation/respondents')}
            >
              View Respondents
            </Button>
          </Group>
        )}
        
        {!selectedOrgId && (
          <Text size="sm" c="dimmed">
            Please select an organization to view its data and participants.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
