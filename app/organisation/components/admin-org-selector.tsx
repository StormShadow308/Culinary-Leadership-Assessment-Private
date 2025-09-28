'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Select, 
  Group, 
  Text, 
  Badge,
  ActionIcon,
  Tooltip,
  Card,
  Stack
} from '@mantine/core';
import { IconBuilding, IconRefresh } from '@tabler/icons-react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  participantCount?: number;
}

interface AdminOrgSelectorProps {
  currentOrgId?: string;
}

export function AdminOrgSelector({ currentOrgId }: AdminOrgSelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(currentOrgId || null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch organizations
  const fetchOrganizations = async () => {
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
    fetchOrganizations();
  }, []);

  // Update selected organization when currentOrgId changes
  useEffect(() => {
    if (currentOrgId) {
      setSelectedOrgId(currentOrgId);
    }
  }, [currentOrgId]);

  const handleOrganizationChange = (orgId: string | null) => {
    if (!orgId) return;
    
    setSelectedOrgId(orgId);
    
    // Get current path and update with new orgId
    const currentPath = window.location.pathname;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('orgId', orgId);
    
    // Navigate to the same page with new orgId
    router.push(newUrl.pathname + newUrl.search);
  };

  const handleRefresh = () => {
    fetchOrganizations();
  };

  const selectedOrg = organizations.find(org => org.id === selectedOrgId);

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
        
        {!selectedOrgId && (
          <Text size="sm" c="dimmed">
            Please select an organization to view its data and participants.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
